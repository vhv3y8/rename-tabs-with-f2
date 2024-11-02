## Rename Tabs with F2

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
npm i && npm run build
# or pnpm i && pnpm build
```

### How to apply `dist` folder

1. Go to `chrome://extensions/`
2. Turn on `Developer mode` at the top right
3. Click `Load unpacked` and select `dist` folder / or drop `dist` folder to the page
4. After modifying and rebuilding, click `Refresh Icon` at extension list

### LICENSE

`Images`

- [Default Favicon Globe Svg](https://www.svgrepo.com/svg/507722/globe-alt) : [MIT License](https://www.svgrepo.com/page/licensing/#MIT)

`Fonts`

- [Open Sans](https://fonts.google.com/specimen/Open+Sans) : [SIL OPEN FONT LICENSE Version 1.1 ](https://fonts.google.com/specimen/Open+Sans/license)
- [Ubuntu](https://fonts.google.com/specimen/Ubuntu) : [UBUNTU FONT LICENCE Version 1.0](https://fonts.google.com/specimen/Ubuntu/license)
- [Ubuntu Mono](https://fonts.google.com/specimen/Ubuntu+Mono) : [UBUNTU FONT LICENCE Version 1.0](https://ubuntu.com/legal/font-licence)
