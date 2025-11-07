## Rename Tabs with F2

![](/promo/rename-tabs-screenshot-1.png)

탭 이름 재설정 페이지를 여는 F2 단축키를 추가하는 크롬 확장 프로그램입니다.

(\* 몇몇 페이지에서는 브라우저 보안상 문제로 작동하지 않습니다. 이 확장 프로그램은 content script를 사용합니다.)

### 사용하는 방법

- `F2` 키를 눌러 탭 이름 재설정 페이지를 열 수 있습니다.
- `Tab` or `Enter` / `Shift+Tab` or `Shift+Enter` to Move around tab titles
- `F5` or `Ctrl+R` to Reset changes (browser original shortcut)
- `Ctrl+Enter` to Apply changes and Close
- `Ctrl+W` or `Ctrl+F4` to Close without applying (browser original shortcut)

### 빌드하는 방법

```bash
npm i && npm run build:zip
# 또는 pnpm i && pnpm build:zip
```

### 빌드한 `zip` 파일 적용하는 방법

1. `chrome://extensions/` 페이지로 가세요.
2. 우상단에 있는 `개발자 모드`를 켜세요.
3. Click `Load unpacked` and select `dist` folder / or drop `dist` folder to the page
4. 변경하거나 새로 빌드한 후에는, 목록 카드에 있는 새로고침 버튼을 클릭하세요.

### 라이센스

`이미지들`

- [Default Favicon Globe Svg](https://www.svgrepo.com/svg/507722/globe-alt) by [scarlab](https://www.svgrepo.com/author/scarlab/) : [MIT License](https://www.svgrepo.com/page/licensing/#MIT)

`홍보 이미지`

- [Right Arrow Svg](https://www.svgrepo.com/svg/491324/arrow-small-right) by [thewolfkit](https://www.svgrepo.com/author/thewolfkit/) : [CC Attribution License](https://www.svgrepo.com/page/licensing/#CC%20Attribution)
