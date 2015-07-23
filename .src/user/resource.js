'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _httpResponse = require('../http/response');

var _httpResponse2 = _interopRequireDefault(_httpResponse);

/**
 * To be
 *
 * @param
 * @returns
 */

var Resource = function Resource(req, res) {
  _classCallCheck(this, Resource);

  this.req = req;
  this.res = new _httpResponse2['default'](res);
};

exports['default'] = Resource;
module.exports = exports['default'];