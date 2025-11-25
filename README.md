## Rename Tabs with F2

EN | [한국어](./README-ko.md)

![](/promo/rename-tabs-screenshot-1.png)

Chrome Extension that adds a F2 shortcut to open a Tab Rename Extension Page.

(\* Not available at some pages due to security reasons of the browser. This extension uses content script.)

### How to use

- Press `F2` to Open Tab Rename Page
- `Tab` or `Enter` / `Shift+Tab` or `Shift+Enter` to Move around tab titles
- `F5` or `Ctrl+R` to Reset changes (browser original shortcut)
- `Ctrl+Enter` to Apply changes and Close
- `Ctrl+W` or `Ctrl+F4` to Close without applying (browser original shortcut)

### How to build

```bash
npm i && npm run build:zip
# or pnpm i && pnpm build:zip
```

### How to apply built `zip` file

1. Go to `chrome://extensions/`
2. Turn `Developer mode` on at the top right
3. Click `Load unpacked` and select `dist` folder / or drop `dist` folder to the page
4. After modifying and rebuilding, click `Refresh Icon` at extension list

### LICENSE

`Images`

- [Default Favicon Globe Svg](https://www.svgrepo.com/svg/507722/globe-alt) by [scarlab](https://www.svgrepo.com/author/scarlab/) : [MIT License](https://www.svgrepo.com/page/licensing/#MIT)

`Promotion Image`

- [Right Arrow Svg](https://www.svgrepo.com/svg/491324/arrow-small-right) by [thewolfkit](https://www.svgrepo.com/author/thewolfkit/) : [CC Attribution License](https://www.svgrepo.com/page/licensing/#CC%20Attribution)
