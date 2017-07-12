'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('babel-polyfill');

var Zendesk = function () {
    function Zendesk() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$email = _ref.email,
            email = _ref$email === undefined ? 'vimeostaff@vimeo.com' : _ref$email,
            _ref$token = _ref.token,
            token = _ref$token === undefined ? '' : _ref$token,
            _ref$subdomain = _ref.subdomain,
            subdomain = _ref$subdomain === undefined ? 'vimeo' : _ref$subdomain;

        _classCallCheck(this, Zendesk);

        this.email = email;
        this.token = token;
        this.subdomain = subdomain;
    }

    _createClass(Zendesk, [{
        key: 'request',
        value: function request() {
            var _this = this;

            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                url = _ref2.url,
                path = _ref2.path,
                _ref2$base = _ref2.base,
                base = _ref2$base === undefined ? 'https://' + this.subdomain + '.zendesk.com' : _ref2$base,
                _ref2$method = _ref2.method,
                method = _ref2$method === undefined ? 'GET' : _ref2$method,
                _ref2$data = _ref2.data,
                data = _ref2$data === undefined ? '' : _ref2$data;

            return new Promise(function (resolve, reject) {
                var _ref3 = url ? new _url.URL(url) : new _url.URL(path, base),
                    protocol = _ref3.protocol,
                    hostname = _ref3.hostname,
                    pathname = _ref3.pathname,
                    search = _ref3.search,
                    port = _ref3.port;

                var options = {
                    protocol: protocol,
                    hostname: hostname,
                    path: '' + pathname + search,
                    port: port,
                    method: method,
                    auth: _this.email + '/token:' + _this.token,
                    headers: { 'Accept': 'application/json' }
                };

                if (method === 'POST' || method === 'PUT') {
                    options.headers['Content-Type'] = 'application/json';
                }

                var req = _https2.default.request(options, function (res) {
                    var statusCode = res.statusCode;

                    var raw = '';

                    if (statusCode !== 200) {
                        reject(new Error('Request failed. Status code: ' + statusCode + '.'));
                        res.resume();
                        return;
                    }

                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        return raw += chunk;
                    });
                    res.on('end', function () {
                        return resolve(JSON.parse(raw));
                    });
                });

                req.on('error', function (e) {
                    reject(new Error('Request failed: ' + e.message));
                });

                req.write(JSON.stringify(data));
                req.end();
            });
        }
    }, {
        key: 'getTicket',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ticket_id) {
                var _ref5, ticket;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (ticket_id) {
                                    _context.next = 2;
                                    break;
                                }

                                throw new Error('No ticket ID provided.');

                            case 2:
                                _context.next = 4;
                                return this.request({ path: '/api/v2/tickets/' + ticket_id + '.json' });

                            case 4:
                                _ref5 = _context.sent;
                                ticket = _ref5.ticket;
                                return _context.abrupt('return', ticket);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getTicket(_x3) {
                return _ref4.apply(this, arguments);
            }

            return getTicket;
        }()
    }, {
        key: 'getUserByID',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(user_id) {
                var _ref7, user;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (user_id) {
                                    _context2.next = 2;
                                    break;
                                }

                                throw new Error('No user ID provided.');

                            case 2:
                                _context2.next = 4;
                                return this.request({ path: '/api/v2/users/' + user_id + '.json' });

                            case 4:
                                _ref7 = _context2.sent;
                                user = _ref7.user;
                                return _context2.abrupt('return', user);

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getUserByID(_x4) {
                return _ref6.apply(this, arguments);
            }

            return getUserByID;
        }()
    }, {
        key: 'search',
        value: function () {
            var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    _ref9$query = _ref9.query,
                    query = _ref9$query === undefined ? '' : _ref9$query,
                    _ref9$per_page = _ref9.per_page,
                    per_page = _ref9$per_page === undefined ? 100 : _ref9$per_page;

                var q, results, _ref10, page, next_page, count, _ref11;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                q = encodeURIComponent(query);
                                results = [];
                                _context3.next = 4;
                                return this.request({
                                    path: '/api/v2/search.json?query=' + q + '&per_page=' + per_page
                                });

                            case 4:
                                _ref10 = _context3.sent;
                                page = _ref10.results;
                                next_page = _ref10.next_page;
                                count = _ref10.count;


                                results = [].concat(_toConsumableArray(results), _toConsumableArray(page));

                            case 9:
                                if (!next_page) {
                                    _context3.next = 18;
                                    break;
                                }

                                _context3.next = 12;
                                return this.request({ url: next_page });

                            case 12:
                                _ref11 = _context3.sent;
                                page = _ref11.results;
                                next_page = _ref11.next_page;

                                results = [].concat(_toConsumableArray(results), _toConsumableArray(page));
                                _context3.next = 9;
                                break;

                            case 18:
                                return _context3.abrupt('return', results);

                            case 19:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function search() {
                return _ref8.apply(this, arguments);
            }

            return search;
        }()
    }]);

    return Zendesk;
}();

exports.default = Zendesk;
