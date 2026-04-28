## Rename Tabs with F2

[EN](./README.md) | 한국어

![](/promo/rename-tabs-screenshot-1.png)

탭 이름 재설정 페이지를 여는 F2 단축키를 추가하는 크롬 확장 프로그램입니다.

⌨️ 마우스를 쓰지 않고 탭 이름을 재설정하세요!

- 'F2'를 눌러 이름 재설정 페이지를 여세요.
- 'Tab' 또는 'Enter' / 'Shift+Tab' 또는 'Shift+Enter'로 탭 이름들 사이를 이동하세요.
- 'Ctrl+Enter'로 적용하면서 페이지를 닫을 수 있습니다.
- '탭 이름 저장 & 적용' 옵션을 통해 탭 이름을 자동으로 적용할 수 있습니다.
- 'Shift+R'로 재연결 가능한 탭들을 모두 새로고침할 수 있습니다.
- 'F5' 또는 'Ctrl+R'로 변경사항을 리셋할 수 있습니다. (브라우저 기본)
- 'Ctrl+W' 또는 'Ctrl+F4'로 적용하지 않고 페이지를 닫을 수 있습니다. (브라우저 기본)

📌 브라우저의 보안상 이유로, 'F2' 단축키와 이름 재설정은 몇몇 페이지(예: ⚠️ 크롬 웹 스토어 페이지 ⚠️, chrome:// 페이지, 새 탭 페이지 등)에서는 ⚠️불가능⚠️합니다.

### 빌드하는 방법

`pnpm`이 없다면 설치하세요 : [https://pnpm.io/installation](https://pnpm.io/installation)

```bash
pnpm install
pnpm build:zip
```

### 빌드한 `zip` 파일 적용하는 방법

1. `chrome://extensions/` 페이지로 가세요.
2. 우상단에 있는 `개발자 모드`를 켜세요.
3. `dist` 폴더나 `zip` 파일을 페이지에 드롭하거나 `압축해제된 확장 프로그램 로드`를 클릭해 선택하세요.
4. 변경하거나 새로 빌드한 후에는, 목록 카드에 있는 새로고침 버튼을 클릭하세요.

### 라이선스

`이미지들`

- [Default Favicon Globe Svg](https://www.svgrepo.com/svg/507722/globe-alt) by [scarlab](https://www.svgrepo.com/author/scarlab/) : [MIT License](https://www.svgrepo.com/page/licensing/#MIT)

`홍보 이미지`

- [Right Arrow Svg](https://www.svgrepo.com/svg/491324/arrow-small-right) by [thewolfkit](https://www.svgrepo.com/author/thewolfkit/) : [CC Attribution License](https://www.svgrepo.com/page/licensing/#CC%20Attribution)
