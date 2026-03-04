- [ ] Key 컴포넌트
  - 모두 덮게 v
  - child bind:this, keydown v
  - 모든 키 컴포넌트 바꾸기 v
  - connectable만 있을 때 오버플로우 막기 v
  - 설명ui 안에서 클릭 시 색깔 변하기 x
- [ ] 리로드
  - 로직 작성 v
  - beforeunload들이 있을 때 처리 v
  - 페이지 새로고침 없이 연결 v
  - 만약에 every가 true 안돼도 제대로 돌아가게 v?
  - 상태 업데이트 이후 focus elements : idx들 업데이트
  - 완료 후 탭/엔터 누르면 두칸 이동 v
- 클릭으로 열거나 했으면 index 첫번째 탭으로. v
- 탭그룹일 때 연결 안되는 문제? : reproduce x
- 한국어 v
- hasChanged 아이콘 border bottom
- Reset : Ctrl + R (F5) x?
- cornflowerblue 버튼에 걸림 / 버튼 outline v
- 버튼 꾹 누르면 똑같이 트리거되게? v
- 안되는 탭에서 아이콘 클릭 -> 첫 번째 탭 선택되어야함, v
- 첫 번째 탭도 없으면? 그리고 탭 하나만 있는 경우? v
- ctrl enter 시 눌러지는 이펙트? x
- errors: v
  - status, focusTabInput, cannot establish connection, contentScriptAvailable,
- 카드 닫았는데 Shift + R 되는 문제 -> 돼야할듯?
- W, R 입력되는 문제 -> 영어 ok, KeyW KeyR X

---

리로드 시 원하는 흐름 :

- 리로드 트리거. 상태로 status를 체크 및 기록한다.
- status가 모두 complete 또는 시간 지나면, tabIdxToInfo에 덮어쓰기를 한다. (check)
- tabIdxToInfo에 덮어쓰는 타이밍을 조절한다. 그 순간 모든 UI에 반영된다.

탭 element들, 탭 idx의 초기화 및 수정 타이밍과 관리

- 탭 컴포넌트는 tabIdxToInfo로부터 #each로 그려지며, bind:this로 모든 탭 아이템을 $state로 저장한다.
- 탭 idx는 오직 화면에 그려진 UI만을 기준으로 한다? 이때, contentScriptAvailable = true여야만 불이 들어오며 그들만을 리스트로 따로 $derived로 담아야 함.
- 이때 element들을 담을건지 객체들을 담을건지? -> element가 맞는듯.

- 탭 idx initial: 초기 로직으로 last focus tab id 읽기, 조건부로 걔의 idx 또는 리스트의 0번 idx
- 탭 current idx: 초기화 시 intial에서 시작, 이후 수정. 그런데 리로드 업데이트 시 다시 수정되어야 한다? -> 컴포넌트 개수에 derived?
