## Upcoming Release

#### User features
- Improved browser detection (i: @mitchhentges, r: @tomitm)
- Add tooltip of mapped address to "mapped" label (i: @mitchhentges, r: @nerdbeere)
- URL list should show browser's requested URLs (i: @mitchhentges, r: @nerdbeere)
- Search both mapped url and original url (i: @mitchhentges, r: @nerdbeere)
- Clicking "URL Mapping" button toggles URL Mapping window instead of just opening (i: @mitchhentges, r: @tomitm)

#### Developer Features
- Update eslint (i: @mitchhentges, r: @tomitm)
- Run npm update prior to running `test-ci` (i: @mitchhentges, r: @nerdbeere)
- Electron updated to `0.37` (i: @mitchhentges, r: @tomitm)
- Fix eslint build error (update to v6.0.0-beta.6 babel-eslint) (i: @mitchhentges, r: @tomitm)
- Add Raven to report errors to Sentry (i: @mitchhentges, r: @tomitm)
- Don't report errors to Sentry if in development environment (i: @mitchhentges, r: @tomitm)

#### Bugfixes
- Fix URL-to-file mapping (i: @mitchhentges, r: @nerdbeere)

### 1.4.3

#### Developer Features
- Add scrolling to request mappings (i: @nerdbeere, r: @mitchhentges, @tomitm)

#### Bugfixes
- Browser versions not detected on Linux (i: @mitchhentges, r: @tomitm)
- Don't compile "global vars" (igv) to keep dirname in electron-app (i: @mitchhentges, r: @nerdbeere)

### 1.4.2

#### User features
- Show status of proxy in the bottom-right corner (i: @mitchhentges, r: @nerdbeere)
- Add keyboard shortcuts for open/close dev tools (i: @mitchhentges, r: @nerdbeere)
- Design changes and refactoring (i: @tomitm, r: @nerdbeere)
- Create new URL Mapping (i: @tomitm, r: @mitchhentges, @nerdbeere)
- Narrow footer (i: @tomitm, r: @nerdbeere)
- UI overhaul of browser list, showing version and fixing React duplication complaints (i: @tomitm, r: @mitchhentges)
- Update UI of browser list so that browser icon is centered, even if no version shown (i: @tomitm, r: @mitchhentges)

#### Developer Features
- Massive component refactoring (i: @tomitm, r: @mitchhentges, @nerdbeere)
- Don't include electron-localshortcut code in repo, set up `keyboard` (i: @mitchhentges, r: @nerdbeere)
- Refactor proxy status to be more simple, yet still flexible (i: @nerdbeere, r: @mitchhentges)
- De-absolute-ify a bunch of elements (i: @mitchhentges, r: @nerdbeere)

#### Bugfixes
- Throttle works again! (i: @mitchhentges, r: @nerdbeere)
- Context menu doesn't go away when clicking in whitespace (i: @mitchhentges, r: @tomitm)
- Hoxy error makes scary icon after enough time (i: @mitchhentges, r: @tomitm)
- Electron X11 can't handle registering command (i: @mitchhentges, r: @tomitm)
- Making a url with a wildcard active/inactive no longer throws error (i: @mitchhentges, r: @nerdbeere)

### 1.4.1

#### User features
- Show query params as a key value list in the request detail view (i: @mitchhentges, r: @nerdbeere)
- Make `Esc` close current in-app window (i: @mitchhentges, r: @nerdbeere)
- "About James" now opens the github page in the default browser (i: @mitchhentges, r: @nerdbeere)
- Properly handle trailing slashes (i: @mitchhentges, r: @nerdbeere)
- Tooltips now appear for each function in the footer (i: @tomitm, r: @nerdbeere)
- Currently-inspected request now bold (i: @tomitm, r: @nerdbeere)
- Also time and status code are now bold  (i: @tomitm, r: @nerdbeere)
- Protocol doesn't matter anymore in URL mapping source (i: @mitchhentges, r: @nerdbeere)

#### Bugfixes
- Fix drag-down-whitespace issue (i: @mitchhentges, r: @nerdbeere)
- Don't try to browserify electron (i: @mitchhentges, r: @nerdbeere)
- Can now scroll through requests when cursor _beside_ "close" tab (i: @tomitm, r: @nerdbeere)
- Close tab is always aligned properly now (i: @tomitm, r: @nerdbeere)
- Copy the entire `electron-localshortcut` file (i: @mitchhentges, r: @nerdbeere)
- Fix max height for inspect-request (i: @tomitm, r: @nerdbeere)

#### Developer Features
- Put "lint" task back in `package.json` (i: @mitchhentges, r: @nerdbeere)
- Fix deprecation warnings about ReactDOM (i: @mitchhentges, r: @nerdbeere)
- Footer components now utilize React 0.14's "stateless componenets" (i: @tomitm, r: @nerdbeere)

#### Documentation
- Add section to readme about joining Matrix room (i: @mitchhentges, r: @nerdbeere)

## 1.4.0
- Only run useref on html files (i: @mitchhentges, r: @nerdbeere)
- Fix `package-browserify` (i: @mitchhentges, r: @nerdbeere)
- Add `Installing` section to `README.md` that links to releases (i: kokarn, r: @mitchhentges)
- Replace close shortcut to use 'Q' instead of 'W' (i: @mitchhentges, r: @davidneat) 
- Support for Wildcards in URLs (i: @mitchhentges, r: @davidneat) 
- Toolbar tab is now aligned properly (i: @mitchhentges, r: @davidneat) 
- Requests in list no longer overlap to the right (i: @davidneat, r: @mitchhentges)
- `npm run watch` no longer stops on babel-error (i: @mitchhentges, r: @nerdbeere)
- Automatically reload Electron instance on-file-change (i: @mitchhentges, r: @nerdbeere)
- Faster build time (use gulp) (i: @mitchhentges, r: @nerdbeere)
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
