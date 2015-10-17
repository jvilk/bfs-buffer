# BrowserFS Buffer
> An emulation of NodeJS's Buffer module. Used in [BrowserFS](https://github.com/jvilk/BrowserFS).

## Features

* Can be used with Browserify!
  * Relevant config snippet: `{ builtins: { "buffer": require.resolve('bfs-buffer') }, insertGlobalVars: { "Buffer": function() { return "require('bfs-buffer').Buffer" } } }`
* Space-efficient binary representation across browsers.
  * `ArrayBuffer` in modern browsers
  * `CanvasPixelArray` in older browsers that do not support typed arrays, but support the canvas.
  * `Array` of 32-bit ints in older browsers without the above.
* Supports the entirety of the NodeJS `Buffer` API! (including string encoding)
  * ...with a few exceptions, due to browser limitations (see below).
* Well-tested! Passes all of Node's `Buffer` tests.
  * The unit tests are located in the [BrowserFS](https://github.com/jvilk/BrowserFS) repository.

## Limitations

* **Does not support array indexing.** e.g. you cannot do `buff[0] = 3`.
  * Browsers do not let you implement custom arrays, and merely setting the prototype of `Buffer` to `Uint8Array`, as in the official Node implementation of `Buffer`, is not portable across browsers.
