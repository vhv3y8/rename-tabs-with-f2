### Format

```markdown
# File Description

## Descriptions Header

### Scenario Description

- GIVEN ... (AND ...)
- WHEN ... (AND ...)
- THEN ... (AND ...)

unit: `path/to/unit/test/file`

e2e: `path/to/e2e/test/file`
```

### List

- 열기
  - 스토리지에 있는 단축키를 눌러서 열 수 있다
  - 아이콘을 눌러서 열 수 있다
- 페이지
  - 입력이 제대로 처리된다
    - 다음, 이전, 처음으로
  - content script 안되는 탭들
    - 안되는 탭은 블러 표시된다?
    - 모든 탭이 안되는 경우
      - 에러가 나지 않는다
      - 모든 종류의 입력에 에러가 나지 않는다
      - 적용이나 닫기에 에러가 나지 않는다
  - 적용하기
    - ctrl+enter 누르면 바뀐 내용이 적용된다
    - 버튼 누르면 바뀐 내용이 적용된다
- 닫기
  - 탭을 닫을 시 이전 포커스된 탭으로 이동한다
    - 창이 하나일 때
    - 창이 여러개일 때
    - content script 안되는 탭이어도 제대로 이동한다
- 새로고침
  - 새로고침을 하면 확장 페이지가 포커스 된다
- 스토리지
  - 마이그레이션이 제대로 동작한다
  - 읽고 쓰기가 제대로 이루어진다
