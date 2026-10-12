import { spawn } from "node:child_process";
import path from "node:path";
import assert from "node:assert/strict";

const port = 9335;
const endpoint = `http://127.0.0.1:${port}`;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const browser = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${path.resolve(".next/link-dialog-browser")}`,
  "--window-size=1440,1000", "about:blank",
], { stdio: "ignore" });

let socket;
let browserSocket;
const failures = [];

async function main() {
  let targets;
  for (let i = 0; i < 100; i++) {
    try { targets = await (await fetch(`${endpoint}/json/list`)).json(); break; }
    catch { await delay(100); }
  }
  assert.ok(targets, "Chrome debugging endpoint is available");
  const target = targets.find((target) => target.type === "page");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      if (request) { pending.delete(message.id); if (message.error) request.reject(message.error); else request.resolve(message.result); }
    }
    if (message.method === "Runtime.exceptionThrown") failures.push(message.params.exceptionDetails.text);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const waitFor = async (expression, label) => {
    for (let i = 0; i < 150; i++) {
      if (await evaluate(expression)) return;
      await delay(100);
    }
    throw new Error(`Timed out: ${label}`);
  };
  const click = async (selector) => {
    await evaluate(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'center',behavior:'instant'})`);
    await delay(250);
    const point = await evaluate(`(() => { const el=document.querySelector(${JSON.stringify(selector)}); if(!el) throw new Error('Missing element'); el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
    await send("Input.dispatchMouseEvent", { type: "mousePressed", ...point, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...point, button: "left", clickCount: 1 });
  };
  const fill = async (selector, value) => {
    await click(selector);
    await send("Input.insertText", { text: value });
  };
  const count = () => evaluate(`document.querySelectorAll('section[aria-label="링크 목록"] li').length`);
  const openDialog = async () => {
    await click('[data-slot="dialog-trigger"]');
    await waitFor('!!document.querySelector("[role=dialog]")', "dialog opens");
    await delay(250);
  };
  const escape = async () => {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await waitFor('!document.querySelector("[role=dialog]")', "dialog closes");
  };
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Page.navigate", { url: "http://localhost:3000/links" });
  await waitFor('!!document.querySelector("[data-slot=dialog-trigger]")', "page loads");
  await waitFor('document.querySelector("section[aria-label] [role=alert]") === null && document.querySelector("section[aria-busy]")?.getAttribute("aria-busy") === "false"', "Firestore loaded");
  const initialCount = await count();

  await openDialog();
  await waitFor('document.activeElement?.id === "link-title"', "initial focus");
  await click('form button[type="submit"]');
  await waitFor('!!document.querySelector("#link-title-error") && !!document.querySelector("#link-url-error")', "required errors");
  assert.equal(await count(), initialCount);
  await fill("#link-title", "자동 검증 링크");
  await fill("#link-url", "javascript:alert(1)");
  await click('form button[type="submit"]');
  await waitFor('document.activeElement?.id === "link-url" && !!document.querySelector("#link-url-error")', "unsafe URL rejected");
  assert.equal(await count(), initialCount);
  await escape();
  await waitFor('document.activeElement?.matches("[data-slot=dialog-trigger]")', "focus returns to trigger");
  console.log("PASS: dialog opens, initial focus, required fields, unsafe URL rejection, Escape and focus restoration");

  await openDialog();
  assert.equal(await evaluate('document.querySelector("#link-title").value'), "");
  await fill("#link-title", "  자동 검증 링크  ");
  await fill("#link-url", "  https://example.com/automated-test  ");
  assert.equal(await evaluate('document.querySelector("#link-protocol").value'), "https://");
  assert.equal(await evaluate('document.querySelector("#link-url").value'), "example.com/automated-test");
  await fill("#link-description", "브라우저 클릭으로 추가한 설명");
  await fill("#link-action", "테스트 열기");
  await fill("#link-badge", "TEST");
  await click('form button[type="submit"]');
  await waitFor('!document.querySelector("[role=dialog]")', "successful addition closes dialog");
  await waitFor(`document.querySelectorAll('section[aria-label="링크 목록"] li').length === ${initialCount + 1}`, "saved link appears");
  const added = await evaluate(`(() => { const li=document.querySelector('section[aria-label="링크 목록"] li:last-child'); const a=li.querySelector('a'); return {title:li.querySelector('h3').textContent,text:li.textContent,url:a.getAttribute('href'),target:a.target,rel:a.rel}; })()`);
  assert.equal(added.title, "자동 검증 링크");
  assert.equal(added.url, "https://example.com/automated-test");
  assert.equal(added.target, "_blank");
  assert.equal(added.rel, "noopener noreferrer");
  for (const text of ["브라우저 클릭으로 추가한 설명", "테스트 열기", "TEST"]) assert.ok(added.text.includes(text));
  console.log("PASS: successful addition, trimmed fields, final list position, description/action/badge, safe external link");

  await click('nav a[href="/"][data-slot="button"]');
  await waitFor(`document.querySelectorAll('[aria-label="프로필 링크 목록"] li').length === ${initialCount + 1}`, "profile displays added link");
  const profileLink = await evaluate(`(() => { const a=document.querySelector('[aria-label="프로필 링크 목록"] li:last-child a'); return {url:a.getAttribute('href'),text:a.textContent,target:a.target,rel:a.rel}; })()`);
  assert.equal(profileLink.url, added.url);
  assert.ok(profileLink.text.includes(added.title));
  assert.equal(profileLink.target, "_blank");
  assert.equal(profileLink.rel, "noopener noreferrer");
  await click('a[href="/links"]');
  await waitFor(`document.querySelectorAll('section[aria-label="링크 목록"] li').length === ${initialCount + 1}`, "link list persists after navigation");
  console.log("PASS: profile shows added link; navigation preserves shared state and external link attributes");

  await openDialog();
  await fill("#link-title", "취소할 링크");
  await click('form button[type="button"]');
  await waitFor('!document.querySelector("[role=dialog]")', "cancel closes");
  assert.equal(await count(), initialCount + 1);
  await openDialog();
  assert.equal(await evaluate('document.querySelector("#link-title").value'), "");
  assert.equal(await evaluate('document.querySelector("#link-protocol").value'), "https://");
  await escape();
  await send("Page.reload");
  await waitFor(`document.querySelectorAll('section[aria-label="링크 목록"] li').length === ${initialCount + 1}`, "reload preserves saved link");
  await delay(500);
  assert.equal(await count(), initialCount + 1);
  console.log("PASS: cancellation, form reset, refresh preserves Firestore data");

  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await openDialog();
  assert.ok(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), "mobile has no horizontal overflow");
  await fill("#link-title", "모바일 링크");
  await fill("#link-url", "example.com/mobile");
  await click("#link-protocol");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowDown", code: "ArrowDown", windowsVirtualKeyCode: 40 });
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  assert.equal(await evaluate('document.querySelector("#link-protocol").value'), "http://");
  await click('form button[type="submit"]');
  await waitFor('!document.querySelector("[role=dialog]")', "mobile submit");
  await waitFor(`document.querySelectorAll('section[aria-label="링크 목록"] li').length === ${initialCount + 2}`, "mobile saved link appears");
  assert.equal(await evaluate(`document.querySelector('section[aria-label="링크 목록"] li:last-child a').getAttribute('href')`), "http://example.com/mobile");
  assert.ok(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'));
  assert.deepEqual(failures, []);
  console.log("PASS: mobile dialog addition, no horizontal overflow, no runtime exceptions");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  socket?.close();
  try {
    const version = await (await fetch(`${endpoint}/json/version`)).json();
    browserSocket = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { browserSocket.onopen = resolve; browserSocket.onerror = reject; });
    browserSocket.send(JSON.stringify({ id: 1, method: "Browser.close" }));
    await delay(200);
    browserSocket.close();
  } catch { browser.kill(); }
});
