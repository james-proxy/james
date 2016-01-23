# James

[![Build Status](https://travis-ci.org/uxebu/james.svg?branch=master)](https://travis-ci.org/uxebu/james)
[![Code Climate](https://codeclimate.com/github/uxebu/james/badges/gpa.svg)](https://codeclimate.com/github/uxebu/james)

James is an HTTP Proxy and Monitor that enables developers to view and intercept requests made from the browser.
It is an open-source alternative to the popular developer tool [Charles](http://www.charlesproxy.com/)

James is build with [hoxy](https://github.com/greim/hoxy), [electron](https://github.com/atom/electron) and [react](https://facebook.github.io/react/index.html)

![](resource/screenshot-1.png)

## Installation

 1. Clone the repository
 2. `npm install`
 3. `npm run build`
 4. `npm start`

## URL Mapping

### Wildcard support

To use wildcards in the "url to map" field, put a "*" between two adjacent slashes. For example:
```
http://foo.com/version/*/app.js -> http://localhost:8000/app.js
```
Requests which will be redirected:
* `http://foo.com/version/1/app.js`
* `http://foo.com/version/26.8/app.js`
* `http://foo.com/version/spaghetti/app.js`

Requests which will **not** be redirected:
* `http://foo.com/version/app.js`
* `http://bar.com/version/1/app.js`

You can also use multiple wildcards in the same URL.
 
## HTTPs Support

To enable HTTPs support follow the [instructions in our wiki](https://github.com/uxebu/james/wiki/Configuring-James-for-HTTPS)

## Other useful NPM Commands

- `npm run watch`: Watches JS and SASS files and transpiles them automatically
- `npm run package`: Creates a standalone App Bundle for OSX
- `npm run lint`: Checks the `src` folder against all defined codestyle rules
- `npm run test`: Runs all tests

## Contributing

Feel free to open pull requests and issues!
If you need inspiration, take a look in the issue section.

### Guidelines
- Make sure that no tests are failing
- Always add tests for new features
- Make sure that there are no linting errors in your code (use `npm run lint`)

## License
The MIT License (MIT)

Copyright (c) 2015 Julian Hollmann

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
