**Upcoming Release**
- Automatically reload Electron instance on-file-change (i: @mitchhentges, r: @nerdbeere)
- Halves build time (i: @mitchhentges, r: @nerdbeere)
- Faster build time (i: @mitchhentges, r: @nerdbeere)
- Show browser as disabled with error message if it won't launch (i: @mitchhentges, r: @nerdbeere)
- Show all available browsers when launching proxy (i: @mitchhentges, r: @nerdbeere)
- Implement connection throttling (i: @mitchhentges, r: @nerdbeere)

### 1.3.2
- Browsers launched through James automatically proxy requests (i: @mitchhentges, r: @nerdbeere)

### 1.3.1
- Update electron (i: @mitchhentges, r: @nerdbeere)
- Fix a bug that prevented the user from adding mappings (i: @nerdbeere, r: @davidneat)

## 1.3.0
- HTTPs support (i: @mitchhentges, r: @nerdbeere)
- Menu items no longer throw errors when clicked (i: @mitchhentges, r: @nerdbeere)
- Development on Windows now supported (i: @nerdbeere, r: @mitchhentges)
- Add mapping active (i: @davidneat, r: @nerdbeere)
- Add remove mapping to context menu (i: @davidneat, r: @nerdbeere)

### 1.2.3
- Add context menu to each request for adding mappings (i: @davidneat, r: @nerdbeere)

### 1.2.2
- Fix a small layout issue (i: @nerdbeere)

### 1.2.1
- Shorten URL based on available space (i: @nerdbeere)

## 1.2.0
- Enable/Disable caching by overwrite/removing reponse cache header properties (i: @nerdbeere, r: @klipstein)
- Add a button that allows the user to clear all requests (i: @nerdbeere)
- Show amount of requests and amount of filtered requests in the footer (i: @nerdbeere)
- Show correct scrollbar position and size when result is filtered (i: @nerdbeere)
- Add tests for proxy and url-mapper (i: @nerdbeere, r: @klipstein)
- Add .eslintrc and apply rules to the codebase (i: @nerdbeere, r: @klipstein)

# 1.0.0
- `npm run package` will now overwrite existing packages
- Show total amount of requests
- Improve scrolling performance
- Refactor component dependencies
