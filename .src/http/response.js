/**
 * Description of what this does.
 */
'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

exports.__esModule = true;

var Response = (function () {
  function Response(res) {
    _classCallCheck(this, Response);

    this.res = res;
  }

  /**
   * Creates a JSON response
   *
   * @param {object} content
   */

  Response.prototype.json = function json(content) {
    this.res.writeHead(200, { 'Content-Type': 'application/json' });
    this.res.write(JSON.stringify(content));
  };

  return Response;
})();

exports['default'] = Response;
module.exports = exports['default'];