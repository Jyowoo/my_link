<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git 저장 시 문서 갱신

- 작업 중 매 수정마다 갱신할 필요는 없다. Git에 저장하는 모든 커밋 전에 실제 프로젝트 변경 사항을 확인하고 `docs/mylink-prd.md`에 해당 변경 내용을 반영한다.
- 변경된 요구사항, 구현 상태, 검증 결과와 미완료 항목을 구분해 기록하고 필요에 따라 버전·수정일을 갱신한다.
- 갱신한 PRD를 관련 변경 사항과 같은 커밋에 포함한다.
