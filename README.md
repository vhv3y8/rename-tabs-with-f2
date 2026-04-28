## Rename Tabs with F2

EN | [한국어](./README-ko.md)

![](/promo/rename-tabs-screenshot-1.png)

Chrome Extension that adds a F2 shortcut to open a Tab Rename Extension Page.

⌨️ Rename tabs without using a mouse!

- Press 'F2' to Open Rename Page at any tab
- 'Tab' or 'Enter' / 'Shift+Tab' or 'Shift+Enter' to Move around tab titles
- 'Ctrl+Enter' to Apply changes and Close
- Titles are automatically applied with 'Persist & Apply Titles' option
- 'Shift+R' to reload connectable tabs
- 'F5' or 'Ctrl+R' to Reset changes (browser original)
- 'Ctrl+W' or 'Ctrl+F4' to Close without applying (browser original)

📌 'F2' shortcut and Renaming is ⚠️not available⚠️ at some pages (e.g. ⚠️ chrome web store page ⚠️, chrome:// pages, new tab page, etc) due to security reasons of the browser.

### How to build

Install `pnpm` if you don't have it : [https://pnpm.io/installation](https://pnpm.io/installation)

```bash
pnpm install
pnpm build:zip
```

### How to apply `zip` file

1. Go to `chrome://extensions/`
2. Turn `Developer mode` on at the top right
3. Click `Load unpacked` and select or drop `dist` folder / `zip` file to the page
4. After modifying and rebuilding, click `Refresh Icon` at extension list

### LICENSE

`Images`

- [Default Favicon Globe Svg](https://www.svgrepo.com/svg/507722/globe-alt) by [scarlab](https://www.svgrepo.com/author/scarlab/) : [MIT License](https://www.svgrepo.com/page/licensing/#MIT)

`Promotion Image`

- [Right Arrow Svg](https://www.svgrepo.com/svg/491324/arrow-small-right) by [thewolfkit](https://www.svgrepo.com/author/thewolfkit/) : [CC Attribution License](https://www.svgrepo.com/page/licensing/#CC%20Attribution)
