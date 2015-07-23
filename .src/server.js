'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babel = require('babel');

var _glob = require('glob');

var NordServer = (function () {
  function NordServer() {
    var userRoot = arguments.length <= 0 || arguments[0] === undefined ? 'app' : arguments[0];
    var port = arguments.length <= 1 || arguments[1] === undefined ? 8080 : arguments[1];
    var appRoot = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, NordServer);

    this.userRootPath = userRoot;
    this.rootPath = appRoot || _path2['default'].join(_path2['default'].dirname(userRoot), '.' + _path2['default'].basename(userRoot));
    this.port = port;
  }

  /**
   * Transpiles any babel app code and copies into a temporary folder for the
   * server to access it.
   * Ignoring some 'ES7' features due to https://github.com/babel/babel/issues/1990
   *
   * @param {string} outPath defines path where the files get copied to
   * @returns {array} the list of files that have been created
   */

  NordServer.prototype.transformAppCode = function transformAppCode() {
    console.log(this.userRootPath);
    var appFiles = _glob.sync(this.userRootPath + '/**/*.js');
    var outFiles = [];
    var babelOptions = {
      'stage': 0,
      'blacklist': ['react', 'es7.comprehensions', 'es7.doExpressions', 'es7.functionBind', 'es7.objectRestSpread', 'es7.trailingFunctionCommas'],
      'loose': true,
      'optional': ['runtime'],
      'modules': 'common'
    };

    // TODO(markus): Make this for loop parallel or use async library
    for (var _iterator = appFiles, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var filePath = _ref;

      console.log('filePath', filePath);

      var _transformFileSync = _babel.transformFileSync(filePath, babelOptions);

      var code = _transformFileSync.code;

      var filename = _path2['default'].relative(this.userRootPath, filePath);
      console.log('filename', filename);
      console.log('this.rootPath', this.rootPath);
      var outFile = _path2['default'].join(this.rootPath, filename);
      console.log('outFile', outFile);
      _fsExtra2['default'].outputFileSync(outFile, code);
      outFiles.push(outFile);
    }

    return outFiles;
  };

  /**
   * Starts the http server at the defined port, using the provided router
   * TODO(markus): Implement https support
   * @param {function} router A function used to route all requests
   */

  NordServer.prototype.start = function start(router) {
    var _this = this;

    console.log('Transforming app code into .app/'); // eslint-disable-line no-console
    this.transformAppCode();
    console.log('App code transformed.'); // eslint-disable-line no-console

    // Create a server
    var server = _http2['default'].createServer(router.bind(this));

    // Lets start our server
    server.listen(this.port, function () {
      // Callback triggered when server is successfully listening. Hurray!
      console.log('Server started on: http://localhost:' + _this.port); // eslint-disable-line no-console
    });
  };

  return NordServer;
})();

exports['default'] = NordServer;
module.exports = exports['default'];