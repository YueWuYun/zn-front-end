/*XhOL7Tpk7dw6f0g5dItF30c1Dh1c871ozP87sbFllWzBJaKOFBOwLvpFySl9JVc8*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("nc-lightapp-front"), require("react"), require("react-dom"), require("axios"));
	else if(typeof define === 'function' && define.amd)
		define(["nc-lightapp-front", "react", "react-dom", "axios"], factory);
	else if(typeof exports === 'object')
		exports["fbm/fbm/buyerdiscount/list/index"] = factory(require("nc-lightapp-front"), require("react"), require("react-dom"), require("axios"));
	else
		root["fbm/fbm/buyerdiscount/list/index"] = factory(root["nc-lightapp-front"], root["React"], root["ReactDOM"], root["axios"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__6__, __WEBPACK_EXTERNAL_MODULE__142__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../../../../";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 747);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var require;//! moment.js

;(function (global, factory) {
     true ? module.exports = factory() :
    undefined
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            }
            else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate (y) {
        var date;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            var args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays (ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        var weekdays = isArray(this._weekdays) ? this._weekdays :
            this._weekdays[(m && m !== true && this._weekdays.isFormat.test(format)) ? 'format' : 'standalone'];
        return (m === true) ? shiftWeekdays(weekdays, this._week.dow)
            : (m) ? weekdays[m.day()] : weekdays;
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = require;
                __webpack_require__(151)("./" + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
            else {
                if ((typeof console !==  'undefined') && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100, h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
          0 :
          parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year': output = monthDiff(this, that) / 12; break;
            case 'month': output = monthDiff(this, that); break;
            case 'quarter': output = monthDiff(this, that) / 3; break;
            case 'second': output = (this - that) / 1e3; break; // 1000
            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default: output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    var MS_PER_SECOND = 1000;
    var MS_PER_MINUTE = 60 * MS_PER_SECOND;
    var MS_PER_HOUR = 60 * MS_PER_MINUTE;
    var MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return (dividend % divisor + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
          locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':   return months;
                case 'quarter': return months / 3;
                case 'year':    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asQuarters     = makeAs('Q');
    var asYears        = makeAs('y');

    function clone$1 () {
        return createDuration(this);
    }

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
                seconds < thresholds.s   && ['ss', seconds] ||
                minutes <= 1             && ['m']           ||
                minutes < thresholds.m   && ['mm', minutes] ||
                hours   <= 1             && ['h']           ||
                hours   < thresholds.h   && ['hh', hours]   ||
                days    <= 1             && ['d']           ||
                days    < thresholds.d   && ['dd', days]    ||
                months  <= 1             && ['M']           ||
                months  < thresholds.M   && ['MM', months]  ||
                years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asQuarters     = asQuarters;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.clone          = clone$1;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.24.0';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD',                             // <input type="date" />
        TIME: 'HH:mm',                                  // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW',                             // <input type="week" />
        MONTH: 'YYYY-MM'                                // <input type="month" />
    };

    return hooks;

})));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(144)(module)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queryInterestScale = undefined;
exports.pageClick = pageClick;
exports.getCardData = getCardData;
exports.setHeadItemsDisabled = setHeadItemsDisabled;
exports.setHeadItemsVisible = setHeadItemsVisible;
exports.setEditStatus = setEditStatus;
exports.clearAll = clearAll;
exports.initForm = initForm;
exports.initAddForm = initAddForm;
exports.initChangeForm = initChangeForm;
exports.queryCard = queryCard;
exports.initList = initList;
exports.getListDataByLinkPk = getListDataByLinkPk;
exports.getListData = getListData;
exports.listRender = listRender;
exports.toggleListHeadBtnDisabled = toggleListHeadBtnDisabled;
exports.toggleCardHeadBtnDisabled = toggleCardHeadBtnDisabled;
exports.initVersionTree = initVersionTree;
exports.onTreeNodeClick = onTreeNodeClick;
exports.disabledBodyButton = disabledBodyButton;
exports.setChangeDisableItems = setChangeDisableItems;
exports.checkUnderwriter = checkUnderwriter;
exports.underwriterAddRow = underwriterAddRow;
exports.checkUnderwriterDeleteRow = checkUnderwriterDeleteRow;

var _ncLightappFront = __webpack_require__(1);

var _utils = __webpack_require__(148);

var _common = __webpack_require__(5);

var _index = __webpack_require__(140);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* 
                                                                                                                                                                                                                    封装卡片/列表的业务方法
                                                                                                                                                                                                                    created by: liyaoh 2018-09-08
                                                                                                                                                                                                                  */

//引入组织版本视图api


var getCacheById = _ncLightappFront.cardCache.getCacheById,
    updateCache = _ncLightappFront.cardCache.updateCache,
    getDefData = _ncLightappFront.cardCache.getDefData;

/**
 * 卡片分页
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */

function pageClick(props, pks) {
    getCardData.call(this, pks);
    props.setUrlParam(pks);
    this.setState({
        isVersion: false
    });
}

/**
 * 卡片详情
 * @param {*} id         单据id
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 * @param {*} callback  回调函数
 */
function getCardData(id) {
    var _this = this;

    var isRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var callback = arguments[2];

    var cardData = getCacheById(id, this.dataSource);
    var showBackBtn = true;
    if (this.props.getUrlParam('scene') === 'approvesce' || this.props.getUrlParam('showBackBtn') === false) showBackBtn = false;
    if (cardData && !isRefresh) {
        //有缓存且不是刷新按钮
        if (cardData.billCards && cardData.billCards[0].head) {
            //xuhrc 20190514 后端写法不同导致返回前端的数据有时会有billCards包裹head、body，因此不改后端先在前端增加一个对应
            cardData.billCards[0].head && this.props.form.setAllFormValue(_defineProperty({}, this.formId, cardData.billCards[0].head[this.formId]));
        } else {
            cardData.head && this.props.form.setAllFormValue(_defineProperty({}, this.formId, cardData.head[this.formId]));
        }
        if (this.tabOrder) {
            var data = {};
            if (cardData.billCards && !cardData.bodys) {
                //后端写法不同导致返回前端的数据有时会有billCards包裹head、body，因此不改后端先在前端增加一个对应
                cardData = cardData.billCards[0];
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.tabOrder[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    data[item] = cardData.bodys[item] || {
                        rows: []
                    };
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.props.cardTable.setAllTabsData(data, this.tabOrder);
        }
        commonFn.call(this, cardData);
        callback && callback(cardData);
        //设置单据编号
        this.props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: showBackBtn,
            showBillCode: true,
            billCode: this.props.form.getFormItemsValue(this.formId, this.billNo).value
        });
        // 有缓存的时候不会走下面ajax请求后的，所以在这里再加一下
        // 云原生 事务异常 卡片态叹号 begin
        var saga_status = this.props.form.getFormItemsValue(this.formId, 'saga_status') && this.props.form.getFormItemsValue(this.formId, 'saga_status').value;
        if (this.props.getUrlParam('status') === 'browse' && saga_status === '1') {
            this.props.button.toggleErrorStatus(this.props.headBtnArea, { isError: true });
        } else {
            this.props.button.toggleErrorStatus(this.props.headBtnArea, { isError: false });
        }
        // 云原生 事务异常 卡片态叹号 end
        // 增加显示saga错误信息
        var saga_gtxid = this.props.form.getFormItemsValue(this.formId, 'saga_gtxid') && this.props.form.getFormItemsValue(this.formId, 'saga_gtxid').value;
        if (saga_gtxid && saga_status) {
            this.props.socket.showToast({
                gtxid: saga_gtxid,
                billpk: this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value
            });
        }
        return;
    }
    var url = this.API_URL.queryCard;
    if (this.props.getUrlParam('status') === 'copy') {
        url = this.API_URL.copyCard;
    }
    if (this.props.getUrlParam('status') === 'handle') {
        url = this.API_URL.handle;
    }
    (0, _ncLightappFront.ajax)({
        url: url,
        data: {
            pk: id,
            pageCode: this.pageId
        },
        success: function success(res) {
            var success = res.success,
                data = res.data;

            if (success) {
                if (data && data.head) {
                    _this.props.form.setAllFormValue(_defineProperty({}, _this.formId, data.head[_this.formId]));
                }
                if (data && data.bodys) {
                    _this.tabOrder && _this.props.cardTable.setAllTabsData(data.bodys, _this.tabOrder);
                }
                commonFn.call(_this, res.data);
                callback && callback(res.data);

                //设置单据编号
                _this.props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: _this.transferCard || _this.props.getUrlParam('status') === 'browse' && showBackBtn,
                    showBillCode: _this.props.getUrlParam('status') === 'browse',
                    billCode: _this.props.form.getFormItemsValue(_this.formId, _this.billNo).value
                });
                // 更新缓存
                if (_this.props.getUrlParam('status') !== 'copy') {
                    updateCache(_this.primaryId, id, data, _this.formId, _this.dataSource);
                } else {
                    // 复制需要设置主组织不可编辑
                    _this.props.form.setFormItemsDisabled(_this.formId, {
                        pk_org: true //组织
                    });
                }
                _this.buttonVisible && _this.buttonVisible(_this.props);
                // 云原生 事务异常 卡片态叹号 begin
                var _saga_status = _this.props.form.getFormItemsValue(_this.formId, 'saga_status') && _this.props.form.getFormItemsValue(_this.formId, 'saga_status').value;

                if (_this.props.getUrlParam('status') === 'browse' && _saga_status === '1') {
                    _this.props.button.toggleErrorStatus(_this.props.headBtnArea, { isError: true });
                } else {
                    _this.props.button.toggleErrorStatus(_this.props.headBtnArea, { isError: false });
                }
                // 云原生 事务异常 卡片态叹号 end
                // 增加显示saga错误信息
                var _saga_gtxid = _this.props.form.getFormItemsValue(_this.formId, 'saga_gtxid') && _this.props.form.getFormItemsValue(_this.formId, 'saga_gtxid').value;
                if (_saga_gtxid && _saga_status) {
                    _this.props.socket.showToast({
                        gtxid: _saga_gtxid,
                        billpk: _this.props.form.getFormItemsValue(_this.formId, _this.primaryId) && _this.props.form.getFormItemsValue(_this.formId, _this.primaryId).value
                    });
                }
                //编辑状态下设置贴现办理和票据质押的一些字段编辑性
                if (_this.props.getUrlParam("status") === 'edit') {
                    if (_this.billtype === "36HA") {
                        //票据质押 修改时根据票据类型设置网银字段编辑性
                        var fbmbilltype = _this.props.form.getFormItemsValue(_this.formId, "pk_register.fbmbilltype").value;
                        if (null != fbmbilltype && fbmbilltype.length > 0 && fbmbilltype.indexOf("电子") < 0) {
                            _this.props.form.setFormItemsDisabled(_this.formId, {
                                onlinebankflag: true
                            });
                        }
                    } else if (_this.billtype === "36H7") {
                        //贴现办理 根据票据类别设置清算内容以及编辑性
                        var opbilltype = _this.props.form.getFormItemsValue(_this.formId, "opbilltype").value;
                        if (opbilltype == "bill_privacy") {
                            _this.props.form.setFormItemsValue("form_browser", {
                                transactorgpay: { value: null, display: null },
                                pk_outorg: { value: null, display: null },
                                pk_outorg_inneracc: { value: null, display: null },
                                pk_outorg_fbacc: { value: null, display: null },
                                pk_outpayorg: { value: null, display: null },
                                pk_outpayorg_inneracc: { value: null, display: null },
                                reckonamount: { value: null, display: null },
                                olcreckonamount: { value: null, display: null },
                                glcreckonamount: { value: null, display: null },
                                gllcreckonamount: { value: null, display: null },
                                reckoninterest: { value: null, display: null },
                                olcreckoninterest: { value: null, display: null },
                                glcreckoninterest: { value: null, display: null },
                                gllcreckoninterest: { value: null, display: null }
                            });
                            _this.props.form.setFormItemsDisabled("form_browser", {
                                transactorgpay: true,
                                pk_outorg: true,
                                pk_outorg_inneracc: true,
                                pk_outorg_fbacc: true,
                                pk_outpayorg: true,
                                pk_outpayorg_inneracc: true
                            });
                            _this.props.form.closeArea("reckoninfo");
                        } else {
                            _this.props.form.setFormItemsDisabled("form_browser", {
                                transactorgpay: false,
                                pk_outorg: false,
                                pk_outorg_inneracc: false,
                                pk_outorg_fbacc: false,
                                pk_outpayorg: false,
                                pk_outpayorg_inneracc: false
                            });
                            _this.props.form.openArea("reckoninfo");
                        }
                    }
                }
            }
        }
    });

    //经办
    if (this.props.getUrlParam('status') === 'handle' || this.props.getUrlParam('status') === 'mainten') {
        this.props.form.setFormItemsDisabled(this.formId, {
            'pk_org': true,
            'handledate': true
        });
    }

    if (this.billtype == '36HH') {
        var pk_srcbill = this.props.form.getFormItemsValue(this.formId, "pk_srcbill");
        if (pk_srcbill !== null) {
            this.props.form.setFormItemsDisabled(this.formId, {
                'pk_curr': true,
                'initflag': true
            });
        }
    }

    function commonFn(cdata) {
        var _this2 = this;

        var headData = cdata.head && cdata.head[this.formId] && cdata.head[this.formId].rows[0].values;
        this.buttonVisible && this.buttonVisible(this.props);
        (0, _index.orgVersionView)(this.props, this.formId); //组织版本视图
        (0, _index.orgVersionView)(this.props, this.formId, 'pk_fundorg', 'pk_fundorg_v'); //增加资金组织版本视图
        toggleCardHeadBtnDisabled.call(this); //根据字段判断按钮禁用状态
        setHeadItemsDisabled.call(this); //设置表头字段编辑性
        setHeadItemsVisible.call(this);
        //todo先这么写 有时间重构
        if (this.pageId === '36650BC_CARD') {
            //债券契约
            setTimeout(function () {
                //担保方式为信用隐藏担保表体
                if (headData && headData['guaranteetype'] && headData['guaranteetype'].value === '0') {
                    _this2.props.cardTable.tabKeyShowSwitch({
                        guarantee: {
                            show: false,
                            isCur: false,
                            isClear: true
                        }
                    });
                } else {
                    _this2.props.cardTable.tabKeyShowSwitch({
                        guarantee: {
                            show: true,
                            isCur: false,
                            isClear: false
                        }
                    });
                }
            }, 10);
        }
    }
}

/**
 * 根据返回数据设置表头字段编辑性
 *
 * @param {*} disableFields - 需要禁用的字段名
 */
function setHeadItemsDisabled() {
    var _this3 = this;

    var disabledObj = {},
        requiredObj = {};
    var isEdit = this.props.getUrlParam('status') === 'edit' || this.props.getUrlParam('pageType') === 'change';
    this.headDisabledItems && this.headDisabledItems.forEach(function (item) {
        var disabled = typeof item.rules === 'function' ? item.rules() : false;
        var value = _this3.props.form.getFormItemsValue(_this3.formId, item.key).value;
        //多个字段禁用条件一样
        if (Array.isArray(item.key)) {
            disabledObj = item.key.reduce(function (data, k) {
                data[k] = disabled;
                return data;
            }, {});
        } else {
            disabledObj[item.key] = disabled;
            if (isEdit && disabled) {
                //禁用且值为空时去掉必输性
                if ((0, _utils.isEmpty)(value)) {
                    requiredObj[item.key] = false;
                }
            }
        }
    });

    for (var _len = arguments.length, disableFields = Array(_len), _key = 0; _key < _len; _key++) {
        disableFields[_key] = arguments[_key];
    }

    if (disableFields.length > 0) {
        disableFields.forEach(function (field) {
            if (field in disabledObj) {
                _this3.props.form.setFormItemsDisabled(_this3.formId, _defineProperty({}, field, disabledObj[field]));
            }
        });
    } else {
        this.props.form.setFormItemsDisabled(this.formId, disabledObj);
        if (isEdit && Object.keys(requiredObj)[0]) this.props.form.setFormItemsRequired(this.formId, requiredObj);
    }
}

/**
 * 根据返回数据设置表头字段显隐性
 *
 * @param {*} visibleFields - 需要禁用的字段名
 */
function setHeadItemsVisible() {
    var _this4 = this;

    var disabledObj = {},
        requiredObj = {};
    // const isEdit = this.props.getUrlParam('status') === 'edit' || this.props.getUrlParam('pageType') === 'change';
    var isEdit = true;
    this.headItemsVisible && this.headItemsVisible.forEach(function (item) {
        var disabled = typeof item.rules === 'function' ? item.rules() : false;
        var value = _this4.props.form.getFormItemsValue(_this4.formId, item.key).value;
        //多个字段禁用条件一样
        if (Array.isArray(item.key)) {
            disabledObj = item.key.reduce(function (data, k) {
                data[k] = disabled;
                return data;
            }, {});
        } else {
            disabledObj[item.key] = disabled;
            if (isEdit && disabled) {
                //禁用且值为空时去掉必输性
                if ((0, _utils.isEmpty)(value)) {
                    requiredObj[item.key] = false;
                }
            }
        }
    });
    if (this.headItemsVisible && this.headItemsVisible.length > 0) {
        this.headItemsVisible.forEach(function (field) {
            if (field.key in disabledObj) {
                _this4.props.form.setFormItemsVisible(_this4.formId, _defineProperty({}, field.key, disabledObj[field.key]));
            }
        });
    } else {
        this.props.form.setItemsVisible(this.formId, disabledObj);
        if (isEdit && Object.keys(requiredObj)[0]) this.props.form.setItemsVisible(this.formId, requiredObj);
    }
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 * @param {*} editCallback  切换到编辑态后的回调函数
 */
function setEditStatus(status, editCallback) {
    var _this5 = this;

    this.buttonVisible && this.buttonVisible(this.props);
    //设置单据编号
    this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: this.props.getUrlParam('status') === 'browse',
        showBillCode: this.props.getUrlParam('status') === 'browse',
        billCode: this.props.form.getFormItemsValue(this.formId, this.billNo).value
    });

    if (status === 'edit') {
        //异步调用目的是等待页面切换为编辑态之后再调用
        setTimeout(function () {
            setHeadItemsDisabled.call(_this5);
            setHeadItemsVisible.call(_this5);
            _this5.tabCode && _this5.props.cardTable.toggleTabTable(_this5.tabCode); //解决浏览态展开bug
            editCallback && editCallback();
        }, 0);
    } else if (status === 'browse') {
        this.props.setUrlParam({
            pageType: ''
        });
    } else if (status === 'handle' || status === 'mainten') {
        editCallback && editCallback();
    }
    if (this.props.getUrlParam('pageType') !== 'change') {
        this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
    }
    (0, _index.orgVersionView)(this.props, this.formId); //组织版本视图
    (0, _index.orgVersionView)(this.props, this.formId, 'pk_fundorg', 'pk_fundorg_v'); //增加资金组织版本视图
}

//清空表头表体数据
function clearAll() {
    this.props.form.EmptyAllFormValue(this.formId);
    if (this.tabOrder) {
        var data = {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.tabOrder[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var item = _step2.value;

                data[item] = {
                    rows: []
                };
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        this.props.cardTable.setAllTabsData(data, this.tabOrder);
    }
}

/**
 * 初始化表单
 *
 * @param {*} type - 页面类型：add:新增 edit:修改
 * @param {*} callback - 加载后进行的操作
 */
function initForm(type, callback) {
    var id = this.props.getUrlParam('id');
    if (type === 'add') {
        //新增
        initAddForm.call(this, callback);
        if (this.pageId === '36650BC_CARD') {
            //债券契约
            //担保方式为信用隐藏担保表体
            this.props.cardTable.tabKeyShowSwitch({
                guarantee: {
                    show: false,
                    isCur: false,
                    isClear: true
                }
            });
        }
    } else if (id) {
        queryCard.call(this, callback);
    }
    toggleCardHeadBtnDisabled.call(this);
}

/**
 * 加载新增页面
 *
 * @param {*} callback - 回调函数
 */
function initAddForm(callback) {
    (0, _index.orgVersionView)(this.props, this.formId); //组织版本视图
    (0, _index.orgVersionView)(this.props, this.formId, 'pk_fundorg', 'pk_fundorg_v'); //增加资金组织版本视图
    //设置状态
    this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
    });
    //单据有主组织，新增时,将其他字段设置为不可编辑.
    this.props.initMetaByPkorg();
    toggleChangeDisableBtn.call(this, false); //恢复被变更禁用的按钮
    clearAll.call(this);
    this.props.button.setButtonDisabled('addRow', true);
    this.tabCode && this.props.cardTable.setCurrTabKey(this.tabCode); //切换到第一个页签
    callback && callback();
}

/**
 * 加载变更页面
 *
 * @param {*} callback - 回调函数
 */
function initChangeForm(callback) {
    setChangeDisableItems.call(this);
    setEditStatus.call(this, 'edit');
    callback && callback();
}

/**
 * 加载修改页面
 *
 * @param {*} callback - 回调函数
 */
function queryCard(callback) {
    var id = this.props.getUrlParam('id');
    getCardData.call(this, id, true, callback);
}

/**
 * 加载列表页面
 *
 */
function initList() {
    toggleListHeadBtnDisabled.call(this);
}

/**
 * 联查时，根据pks加载列表页面数据
 *
 */
function getListDataByLinkPk(pk) {
    var _this6 = this;

    if (pk) {
        var pks = pk.split(',');
        var data = {
            pageCode: this.pageId,
            pks: pks
        };
        // 取分页查询url
        var url = this.API_URL.queryListPks;
        (0, _ncLightappFront.ajax)({
            url: url,
            data: data,
            success: function success(res) {
                var data = res.data;

                if (data) {
                    _this6.props.table.setAllTableData(_this6.tableId, data.grid[_this6.tableId]);
                    // 显示全部页签
                    _this6.setState({
                        activeTab: _this6.props.listTabs
                    });
                }
            }
        });
    }
}

/**
 * 请求列表接口
 * @param {*} cusCondition     自定义查询条件
 */
function getListData(cusCondition) {
    var _this7 = this;

    var cacheCondition = getDefData(this.searchCache.key, this.searchCache.dataSource);
    var pageInfo = this.props.table.getTablePageInfo(this.tableId);
    pageInfo.pageIndex = 0;
    var queryInfo = this.props.search.getQueryInfo(this.searchId, false);
    var oid = null;
    if (queryInfo && queryInfo.oid) {
        oid = queryInfo.oid;
    }
    var searchdata = cacheCondition ? {
        querycondition: cacheCondition,
        pageInfo: pageInfo,
        oid: oid,
        pageCode: this.pageId,
        queryAreaCode: this.searchId, //查询区编码
        querytype: 'tree'
    } : this.props.search.getQueryInfo(this.searchId);
    if (cusCondition) {
        searchdata.custcondition = {
            logic: "and", //逻辑操作符，and、or
            conditions: cusCondition
        };
    }
    searchdata.pageCode = this.pageId;
    searchdata.pageInfo = pageInfo;
    //根据页签状态添加自定义查询条件
    if (this.state.activeTab && this.state.activeTab !== 'all') {
        var key = this.state.activeTab;
        var conditions = [];
        var tabs = this.tabStatus;
        if (tabs && tabs[key]) {
            var tabfield = tabs[key];
            if (tabfield) {
                // 是否多字段
                var fields = tabfield.split(",");
                for (var index = 0; index < fields.length; index++) {
                    var field = fields[index];
                    var fieldvalue = this[field];
                    var opr = "=";
                    if (fieldvalue && fieldvalue.split(",").length > 1) {
                        // 代表是多个数，需要in
                        opr = "in";
                    }
                    var cuscondition = {
                        field: field,
                        oprtype: opr,
                        value: {
                            firstvalue: fieldvalue,
                            secondvalue: null
                        }
                    };
                    conditions.push(cuscondition);
                }
            }
        } else {
            var _tabfield = this.billstatus;
            var value = this.state.activeTab;
            var _cuscondition = {
                field: _tabfield,
                oprtype: "=",
                value: {
                    firstvalue: value,
                    secondvalue: null
                }
            };
            conditions.push(_cuscondition);
        }
        searchdata.custcondition = {
            logic: "and",
            conditions: conditions
        };
        //额度管理待提交去除经办
        if (this.state.activeTab && this.state.activeTab === "-1" && this.pageId === "36185515_LIST") {
            searchdata.custcondition = {
                logic: "and",
                conditions: [{
                    field: "vbillstatus",
                    oprtype: "=",
                    value: {
                        firstvalue: "-1"
                        //secondvalue: null
                    }
                }, {
                    field: "busistatus",
                    oprtype: "=",
                    value: {
                        firstvalue: "1"
                        //secondvalue: null
                    }
                }]
            };
        }
        // 池内质押页签包含发送指令和解除质押指令状态为不明或失败且未作废的
        if (this.state.activeTab.indexOf("cmd") >= 0) {
            var querystatus = this.state.activeTab.substring(3);
            searchdata.custcondition = {
                logic: "and",
                conditions: [{
                    field: "disableflag",
                    value: {
                        firstvalue: 'N',
                        secondvalue: null
                    },
                    oprtype: "="
                }, {
                    field: "paymentstatus",
                    oprtype: 'in',
                    value: {
                        firstvalue: querystatus,
                        secondvalue: null
                    },
                    logic: "or",
                    conditions: [{
                        field: "backimpawnstatus",
                        oprtype: 'in',
                        value: {
                            firstvalue: querystatus,
                            secondvalue: null
                        }
                    }]
                }]
            };
        }
        //额度申请的待委托办理页签需要是审批通过(vbillstatus)的，并且是待委托办理(busistatus)
        if (this.state.activeTab.indexOf("36180QADWT") >= 0) {
            searchdata.custcondition = {
                logic: "and",
                conditions: [{
                    field: 'vbillstatus',
                    oprtype: '=',
                    value: {
                        firstvalue: '1'
                        //secondvalue: null
                    }
                }, {
                    field: 'busistatus',
                    oprtype: '=',
                    value: {
                        firstvalue: '1'
                        //secondvalue: null
                    }
                }]
            };
            var IS36180QADWT = { 'IS36180QADWT': true };
            searchdata.userdefObj = IS36180QADWT;
        }
        //待委托办理页签需要是审批通过(vbillstatus=1)的，并且是待委托办理(busistatus=1)
        if (this.state.activeTab.indexOf("sub") >= 0) {
            searchdata.custcondition = {
                logic: "and",
                conditions: [{
                    field: "vbillstatus",
                    oprtype: "=",
                    value: {
                        firstvalue: "1"
                        //secondvalue: null
                    }
                }, {
                    field: "busistatus",
                    oprtype: "=",
                    value: {
                        firstvalue: "1"
                        //secondvalue: null
                    }
                }]
            };
            var sub = { 'sub': true };
            searchdata.userdefObj = sub;
        }
    }
    (0, _ncLightappFront.ajax)({
        url: this.API_URL.queryList,
        data: searchdata,
        success: function success(res) {
            listRender.call(_this7, res);
            _this7.queryListCallback && _this7.queryListCallback(res);
            toggleListHeadBtnDisabled.call(_this7);
        }
    });
}

/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 */
function listRender(res) {
    var success = res.success,
        data = res.data;

    if (success && data && data.grid && data.grid[this.tableId]) {
        this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
    } else {
        this.props.table.setAllTableData(this.tableId, {
            rows: []
        });
    }
}

/**
 * 切换列表表头按钮禁用状态，使用call调用
 * @param {*} params 参数格式：
 *  [{
        key: 'creditagreementid', //根据哪个字段判断
        btnName: 'CreditAmount',  //对应控制的按钮名称
        rules: function           //选传。按钮禁用的控制规则，传此字段key可不传。返回值为true/false
    }]
 *
 */
function toggleListHeadBtnDisabled(params) {
    var _this8 = this;

    var btnParams = params || this.disabledBtnsParam;
    if (!this.props.table) {
        return;
    }
    var selectDatas = this.props.table.getCheckedRows(this.tableId);
    // let disabledBtn = this.disabledBtn.filter(item => item !== 'Refresh');
    if (selectDatas.length === 0) {
        this.props.button.setButtonDisabled(this.disabledBtn, true);
    } else {
        if (this.disabledBtnOne && this.disabledBtnOne.length > 0 && selectDatas.length > 1) {
            //当只有一条数据的时候，按钮才能为可用
            var oneLineBtns = [].concat(_toConsumableArray(this.disabledBtn));
            this.disabledBtnOne.map(function (ele) {
                if (_this8.disabledBtn.indexOf(ele) > -1) {
                    oneLineBtns.splice(_this8.disabledBtn.indexOf(ele), 1);
                }
            });
            this.props.button.setButtonDisabled(oneLineBtns, false);
            this.props.button.setButtonDisabled(this.disabledBtnOne, true);
        } else {
            this.props.button.setButtonDisabled(this.disabledBtn, false);
        }
        if (Array.isArray(btnParams)) {
            btnParams.forEach(function (item) {
                if (selectDatas.length > 1) {
                    //多选禁用
                    _this8.props.button.setButtonDisabled(item.btnName, true);
                    _this8.props.button.setButtonDisabled(['SignLink', 'Commission', 'CommissionCancel', 'Return', 'Accept', 'UnAccept', 'Delete', 'Commit', 'Uncommit', 'SendInstruction', 'CancelInstruction', 'Invalid', 'CancelInvalid', 'MakeVoucher', 'CancelVoucher'], false); //多选时不禁用删除按钮
                } else if (selectDatas.length == 1) {
                    var selVals = selectDatas[0].data.values;
                    if (typeof item.rules === 'function') {
                        var disabled = item.rules(selVals);
                        if (typeof disabled !== 'boolean') {
                            console.error(_this8.state.json['fbmpublic-000067']); /* 国际化处理： rules的返回值格式为Boolean*/ /* 国际化处理： rules的返回值格式为Boolean*/
                            return;
                        }
                        _this8.props.button.setButtonDisabled(item.btnName, disabled);
                    } else {
                        var condition = selVals[item.key] && selVals[item.key].value;
                        if (condition) {
                            _this8.props.button.setButtonDisabled(item.btnName, false);
                        } else {
                            _this8.props.button.setButtonDisabled(item.btnName, true);
                        }
                    }
                }
            });
        }
    }
}

/**
 * 切换卡片表头按钮禁用状态，使用call调用
 * @param {*} params 参数格式：
 *  [{
        key: 'creditagreementid', //根据哪个字段判断
        btnName: 'CreditAmount',  //对应控制的按钮名称
        rules: function           //选传。按钮禁用的控制规则，传此字段key可不传
    }]
 *
 */
function toggleCardHeadBtnDisabled(params) {
    var _this9 = this;

    var btnParams = params || this.disabledBtnsParam;
    var formData = this.props.form.getAllFormValue(this.formId);
    if (Array.isArray(btnParams)) {
        btnParams.forEach(function (item) {
            var rowsVal = formData.rows[0].values;
            var condition = typeof item.rules === 'function' && item.rules(rowsVal) || rowsVal[item.key] && rowsVal[item.key].value;
            if (condition) {
                _this9.props.button.setButtonDisabled(item.btnName, false);
            } else {
                _this9.props.button.setButtonDisabled(item.btnName, true);
            }
        });
    }
}
/**
 * 加载查看版本页面
 *
 * @param {*} callback - 回调函数
 */
function initVersionTree(callback) {
    var _this10 = this;

    var treeRoot = {
        isleaf: false,
        pid: "__root__",
        refname: this.state.json['fbmpublic-000068'], /* 国际化处理： 版本号*/
        /* 国际化处理： 版本号*/
        refpk: "-1"
    };
    (0, _ncLightappFront.ajax)({
        url: this.API_URL.viewVersion,
        data: {
            "queryAreaCode": "search",
            "querytype": "tree",
            "querycondition": {},
            "pageCode": this.pageId,
            "pageInfo": {
                "pageIndex": 0,
                "pageSize": "100"
            },
            "def1": this.props.getUrlParam('id') //主键
        },
        success: function success(res) {
            var success = res.success,
                data = res.data;

            if (success) {
                var treeData = _this10.props.syncTree.createTreeData(data.data.rows);
                _this10.setState({
                    isVersion: true
                }, function () {
                    _this10.props.syncTree.setSyncTreeData(_this10.treeId, [Object.assign(treeRoot, {
                        children: treeData
                    })]);
                });
            }
        }
    });
}

/**
 * 同步树节点点击事件
 *
 * @param {*} key - 叶子节点key
 * @param {*} data - 树数据
 */
function onTreeNodeClick(key, data) {
    var _this11 = this;

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.queryVersion,
        data: {
            pk: key,
            pageCode: this.pageId
        },
        success: function success(res) {
            var success = res.success,
                data = res.data;

            if (success) {
                if (data && data.head) {
                    _this11.props.form.setAllFormValue(_defineProperty({}, _this11.formId, data.head[_this11.formId]));
                }
                if (data && data.bodys) {
                    _this11.tabOrder && _this11.props.cardTable.setAllTabsData(data.bodys, _this11.tabOrder);
                }
            }
        }
    });
}

//肩部按钮禁用状态
function disabledBodyButton() {
    var disabledBtn = ['deleteRow', 'copyRow'];
    var oneDisabled = ['copyRow'];
    var checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    if (checkedRows.length > 0) {
        if (checkedRows.length == 1) {
            this.props.button.setButtonDisabled(oneDisabled, false);
        } else {
            this.props.button.setButtonDisabled(oneDisabled, true);
        }
        this.props.button.setButtonDisabled('deleteRow', false);
    } else {
        this.props.button.setButtonDisabled(disabledBtn, true);
    }
}

//变更禁用字段
function setChangeDisableItems() {
    if (this.props.getUrlParam('pageType') !== 'change') return;
    var changeDisabledObj = {},
        changeDisabledFields = [],
        //变更可以编辑的字段
    underEditableFields = []; //承销商可编辑字段
    this.props.initMetaByPkorg();
    //判断是契约还是发行
    if (this.pageId === '36650BC_CARD') {
        //发债契约
        changeDisabledFields = ['issueenddate', 'bonddesc', 'creditagreementid', 'credittype', 'creditoccupy']; //结束日期/债券说明/授信编号/授信类别/授信占用额度
        underEditableFields = ['underwriterid', 'aggredratio', 'aggredissuancemny', 'ratio', 'issuancemny']; //承销商可编辑字段
        //担保信息可以编辑占用担保金额
        this.props.cardTable.setColEditableByKey(this.tabCode, ['occupymny'], false);
    } else if (this.pageId === '36650BIS_CARD') {
        //债券发行
        changeDisabledFields = ['capitalplanproject', 'capitalpurpose', 'expirydate']; //资金计划项目/资金用途/结息日
        underEditableFields = ['mainunderwriter', 'agreeratio', 'agreeissuemny', 'ratio', 'issuemny']; //承销商可编辑字段
    }
    //数组转成对象格式
    changeDisabledObj = changeDisabledFields.reduce(function (data, k) {
        data[k] = false;
        return data;
    }, {});
    this.props.form.setFormItemsDisabled(this.formId, changeDisabledObj); //变更表头禁用字段
    //承销商信息可以编辑
    this.props.cardTable.setColEditableByKey('underwriter', underEditableFields, false);
    toggleChangeDisableBtn.call(this, true);
}

/**
 * 切换变更禁用按钮（财务组织、增行等）
 *
 * @param {*} flag - 禁用状态 true:禁用 false:启用
 */
function toggleChangeDisableBtn(flag) {
    this.props.form.setFormItemsDisabled(this.formId, {
        'pk_org': flag
    });
    this.props.cardTable.setAllCheckboxAble(this.tabCode, !flag); //禁用子表复选框
}

/**
 * 校验承销商子表
 *
 * @param {*} registmny - 注册金额
 * @param {*} agreeAmount - 约定承销金额
 * @param {*} actualAmount - 实际承销金额
 * @returns
 * 
 */
function checkUnderwriter(type, _ref) {
    var registmny = _ref.registmny,
        agreeAmount = _ref.agreeAmount,
        actualAmount = _ref.actualAmount;

    var valid = true;
    var amountMsg = this.state.json['fbmpublic-000069']; /* 国际化处理： 注册金额*/ /* 国际化处理： 注册金额*/
    if (type === 'register') amountMsg = this.state.json['fbmpublic-000070']; /* 国际化处理： 发行金额*/ /* 国际化处理： 发行金额*/
    var registmnyVal = this.props.form.getFormItemsValue(this.formId, registmny).value; //注册金额
    var allData = this.props.createTabsCardData(this.pageId, this.formId, this.tabOrder);
    if (allData.bodys['underwriter'].rows.length > 0) {
        var aggColData = this.props.cardTable.getTabColValue('underwriter', agreeAmount, false, false); //约定承销金额列数据
        var issmnyColData = this.props.cardTable.getTabColValue('underwriter', actualAmount, false, false); //实际承销金额列数据
        var aggTotal = aggColData[0] && aggColData.map(function (item) {
            return item.value;
        }).reduce(function (prev, cur) {
            return (0, _utils.AccSum)(+prev, +cur);
        });
        var issmnyTotal = issmnyColData[0] && issmnyColData.map(function (item) {
            return item.value;
        }).reduce(function (prev, cur) {
            return (0, _utils.AccSum)(+prev, +cur);
        });
        //约定金额之和必须等于注册金额
        if (aggTotal !== 0 && aggTotal && aggTotal != +registmnyVal) {
            (0, _ncLightappFront.toast)({
                color: 'warning',
                content: this.state.json['fbmpublic-000071'] + amountMsg /* 国际化处理： 约定金额之和必须等于*/
            }); /* 国际化处理： 约定金额之和必须等于*/
            valid = false;
            return;
        }
        //实际金额之和必须等于注册金额
        if (issmnyTotal !== 0 && issmnyTotal && issmnyTotal != +registmnyVal) {
            (0, _ncLightappFront.toast)({
                color: 'warning',
                content: this.state.json['fbmpublic-000072'] + amountMsg /* 国际化处理： 实际金额之和必须等于*/
            }); /* 国际化处理： 实际金额之和必须等于*/
            valid = false;
            return;
        }
    }
    return valid;
}

/**
 * 承销商子表增行
 * 
 * @param {*} params - addRow的参数
 *
 */
function underwriterAddRow() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _params$autoFocus = params.autoFocus,
        autoFocus = _params$autoFocus === undefined ? true : _params$autoFocus,
        index = params.index;

    var addData = {};
    var visibleRows = this.props.cardTable.getVisibleRows(this.tabCode);
    //第一行必须为主承销商，其余为联席承销商
    if (visibleRows.length == 0) {
        addData = {
            ismain: {
                display: this.state.json['fbmpublic-000073'], /* 国际化处理： 主承销商*/
                value: '1'
            },
            /* 国际化处理： 主承销商*/
            aggredratio: {
                value: 100
            },
            ratio: {
                value: 100
            }
        };
    } else {
        addData.ismain = {
            display: this.state.json['fbmpublic-000074'], /* 国际化处理： 联席承销商*/
            value: '2'
        }; /* 国际化处理： 联席承销商*/
    }
    //this.props.cardTable.setColEditableByKey(this.tabCode,['agreeratio', 'agreeissuemny',"olcagreeissuemny",'ratio','olcissuemny'], false)
    this.props.cardTable.addRow(this.tabCode, index, addData, autoFocus);
}

/**
 * 校验承销商子表是否可删行
 *
 */
function checkUnderwriterDeleteRow() {
    var checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    var chceckedIndex = checkedRows.map(function (item) {
        return item.index;
    });
    var hasMainunderwriter = checkedRows[0] && checkedRows.some(function (item) {
        return item.data.values.ismain.value == '1';
    });
    if (hasMainunderwriter) {
        if (checkedRows.length > 1) {
            (0, _ncLightappFront.toast)({
                color: 'warning',
                content: this.state.json['fbmpublic-000075'] /* 国际化处理： 有联席承销商时不能删除主承销商*/
            }); /* 国际化处理： 有联席承销商时不能删除主承销商*/
            return false;
        } else if (checkedRows.length === 1) {
            (0, _ncLightappFront.toast)({
                color: 'warning',
                content: this.state.json['fbmpublic-000076'] /* 国际化处理： 主承销商不能删除*/
            }); /* 国际化处理： 主承销商不能删除*/
            return false;
        }
    }
    return true;
}

//查询利率精度
var queryInterestScale = exports.queryInterestScale = function queryInterestScale() {
    return (0, _common.request)({
        url: '/nccloud/tmpub/tmbd/ratecodequeryparaint.do'
    });
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cardEvent = exports.common = exports.card = exports.list = undefined;

var _list = __webpack_require__(147);

var list = _interopRequireWildcard(_list);

var _card = __webpack_require__(149);

var card = _interopRequireWildcard(_card);

var _common = __webpack_require__(5);

var common = _interopRequireWildcard(_common);

var _cardEvent = __webpack_require__(150);

var cardEvent = _interopRequireWildcard(_cardEvent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.list = list;
exports.card = card;
exports.common = common;
exports.cardEvent = cardEvent;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.linkAppFromTmpub = exports.OPR_NAME = exports.MODULE_ID = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.api = api;
exports.apiSaga = apiSaga;
exports.request = request;
exports.printFnList = printFnList;
exports.printFn = printFn;
exports.output = output;
exports.fileMgr = fileMgr;
exports.approveDetail = approveDetail;
exports.linkApp = linkApp;
exports.linkApproveDetail = linkApproveDetail;
exports.linkVoucher = linkVoucher;
exports.voucherLinkBill = voucherLinkBill;
exports.linkNtb = linkNtb;
exports.linkCredit = linkCredit;
exports.linkInnerAccount = linkInnerAccount;
exports.linkBankBalance = linkBankBalance;
exports.linkQuotaApply = linkQuotaApply;
exports.linkUnitQuota = linkUnitQuota;
exports.linkReceAndPaybill = linkReceAndPaybill;
exports.linkBuyerDiscount = linkBuyerDiscount;
exports.linkUpquota = linkUpquota;
exports.linkInterestList = linkInterestList;
exports.linkLinkSDBook = linkLinkSDBook;
exports.SDBookLinkBill = SDBookLinkBill;
exports.doCommission = doCommission;
exports.doUnCommission = doUnCommission;
exports.clsRowno = clsRowno;
exports.signLink = signLink;
exports.signApplyLink = signApplyLink;
exports.SignBillLink = SignBillLink;
exports.acceptLink = acceptLink;
exports.buyerDiscountLink = buyerDiscountLink;
exports.registerLink = registerLink;
exports.discountTransact = discountTransact;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(145);

var constant = _interopRequireWildcard(_constant);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* 
                                                                                                                                                                                                                                 公共方法（与业务无关）
                                                                                                                                                                                                                                 created by: liyaoh 2018-09-08
                                                                                                                                                                                                                             */


//公共文件moduleid
var MODULE_ID = exports.MODULE_ID = '';
//按钮操作名称
var OPR_NAME = exports.OPR_NAME = {
    commit: 'fbmpublic-000027', /* 国际化处理： 提交*/
    uncommit: 'fbmpublic-000028', /* 国际化处理： 收回*/
    delete: 'fbmpublic-000000', /* 国际化处理： 删除*/
    terminate: 'fbmpublic-000002', /* 国际化处理： 终止*/
    unterminate: 'fbmpublic-000029', /* 国际化处理： 取消终止*/
    save: 'fbmpublic-000030', /* 国际化处理： 保存*/
    saveCommit: 'fbmpublic-000031', /* 国际化处理： 保存提交*/
    change: 'fbmpublic-000032', /* 国际化处理： 变更*/
    deleteVersion: 'fbmpublic-000033', /* 国际化处理： 删除版本*/
    makeVoucher: 'fbmpublic-000034', /* 国际化处理： 制证*/
    cancelVoucher: 'fbmpublic-000035', /* 国际化处理： 取消制证*/
    interest: 'fbmpublic-000036', /* 国际化处理： 计息*/
    uninterest: 'fbmpublic-000037', /* 国际化处理： 取消计息*/
    disable: 'fbmpublic-000038', /* 国际化处理： 作废*/
    cancelDisable: 'fbmpublic-000039', /* 国际化处理： 取消作废*/
    sendCommand: 'fbmpublic-000040', /* 国际化处理： 发送指令*/
    counterCommand: 'fbmpublic-000041', /* 国际化处理： 撤回指令*/
    return: 'fbmpublic-000042', /* 国际化处理： 退回*/
    handle: 'fbmpublic-000043', /* 国际化处理： 经办*/
    upquota: 'fbmpublic-000044', /* 国际化处理： 额度上收*/
    downquota: 'fbmpublic-000045', /* 国际化处理： 额度下拨*/
    withdrawInstruction: 'fbmpublic-000018', /* 国际化处理： 解除质押*/
    cancelImpawnBack: 'fbmpublic-000046', /* 国际化处理： 取消解押*/
    withdrawImpawn: 'fbmpublic-000047', /* 国际化处理： 质押/解押撤回*/
    confirmreceipt: 'fbmpublic-000011', /* 国际化处理： 确认收妥*/
    unconfirmreceipt: 'fbmpublic-000048', /* 国际化处理： 取消确认*/
    commission: 'fbmpublic-000079', /* 国际化处理： 委托办理*/
    uncommission: 'fbmpublic-000080', /* 国际化处理： 取消委托办理*/
    destroy: 'fbmpublic-000077', /* 国际化处理： 核销*/
    transform: 'fbmpublic-000083', /* 国际化处理： 冲销*/
    cancelTransform: 'fbmpublic-000084', /* 国际化处理： 取消冲销*/
    accept: 'fbmpublic-000086', /* 国际化处理：  受理 */
    unaccept: 'fbmpublic-000087', /* 国际化处理：  取消受理 */
    impawnBackSign: 'fbmpublic-000088', /* 国际化处理：  解除质押签收 */
    tally: 'fbmpublic-000089', /* 国际化处理： 记账*/
    cancelTally: 'fbmpublic-000090' /* 国际化处理： 取消记账*/


    /**
     * 按钮接口操作 需要使用call调用。调用的接口需要在constant.js中定义
     *
     * @param {*} name - 接口名称
     * @param {*} data - 请求数据
     * @param {*} success - 成功回调
     */
};function api(params) {
    var name = params.name,
        data = params.data,
        _success = params.success,
        error = params.error;

    (0, _ncLightappFront.ajax)({
        url: this.API_URL[name],
        data: data,
        success: function success(res) {
            _success && _success(res);
        }
    });
}
/**
 * 给修改按钮用，做saga校验
 *
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
function apiSaga(params) {
    var data = params.data,
        _success2 = params.success,
        error = params.error;

    (0, _ncLightappFront.ajax)({
        url: '/nccloud/tmpub/pub/sagacheck.do',
        data: data,
        success: function success(res) {
            _success2 && _success2(res);
        }
    });
}
/**
 * 基于Promise封装ajax请求
 *
 * @param {*} { url, data }
 * @returns
 */
function request(_ref) {
    var url = _ref.url,
        data = _ref.data;

    return new Promise(function (resolve, reject) {
        (0, _ncLightappFront.ajax)({
            url: url,
            data: data,
            success: function success(res) {
                resolve(res);
            },
            error: function error(res) {
                (0, _ncLightappFront.toast)({ color: 'danger', content: res.message });
                reject(res);
            }
        });
    });
}

/**
 * 打印清单
 *
 * @param {*} pks - 数组类型pk
 */
function printFnList(pks) {
    (0, _ncLightappFront.print)('pdf', this.API_URL.print, {
        appcode: this.appcode,
        nodekey: this.nodekeyList,
        oids: pks
    });
}

/**
 * 打印
 *
 * @param {*} pks - 数组类型pk
 */
function printFn(pks) {
    (0, _ncLightappFront.print)('pdf', this.API_URL.print, {
        appcode: this.appcode,
        nodekey: this.nodekey,
        oids: pks
    });
}

/**
 * 输出
 *
 * @param {*} pks - 数组类型pk
 */
function output(pks) {
    var _this = this;

    this.setState({
        outputData: {
            nodekey: this.nodekey,
            oids: pks,
            outputType: 'output'
        }
    }, function () {
        _this.refs.printOutput.open();
    });
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
function fileMgr(billId, billNo) {
    this.setState({
        showUploader: !this.state.showUploader,
        billInfo: { billId: billId, billNo: billNo }
    });
}

/**
 * 联查审批详情
 *
 * @param {*} billId - 主键id
 */
function approveDetail(billId) {
    this.setState({
        showApproveDetail: true,
        billInfo: { billId: billId }
    });
}

/**
 *
 * @param {*} props
 * @param {*} {
 *     url, 联查应用地址
 *     status = 'browse', 页面编辑状态，默认浏览态
 *     appcode, 小应用编码
 *     pagecode, 页面编码
 *     scene, 场景名称，默认联查
 *     id 被联查单据主键
 * }
 */
function linkApp(props, _ref2) {
    var url = _ref2.url,
        _ref2$status = _ref2.status,
        status = _ref2$status === undefined ? 'browse' : _ref2$status,
        appcode = _ref2.appcode,
        pagecode = _ref2.pagecode,
        _ref2$scene = _ref2.scene,
        scene = _ref2$scene === undefined ? 'linksce' : _ref2$scene,
        id = _ref2.id,
        other = _objectWithoutProperties(_ref2, ['url', 'status', 'appcode', 'pagecode', 'scene', 'id']);

    props.openTo(url, _extends({
        status: status,
        appcode: appcode,
        pagecode: pagecode,
        scene: scene,
        id: id,
        // scene: "linksce", // 前端代码控制时需要的 场景参数
        sence: "4" }, other));
}

var linkAppFromTmpub = exports.linkAppFromTmpub = function linkAppFromTmpub(props, billTypeOrTransType, urlExtParam) {
    var base_url = '/nccloud/tmpub/pub/';
    (0, _ncLightappFront.ajax)({
        url: base_url + 'qrylinkinfo.do',
        data: { billTypeOrTransType: billTypeOrTransType },
        success: function success(res) {
            var data = res.data;

            if (!data) {
                return;
            }
            var url = data.url,
                appCode = data.appCode,
                linkPageCode = data.linkPageCode;

            if (!urlExtParam || Object.keys(urlExtParam).length == 0) {
                urlExtParam = {};
            }
            //默认指定联查场景
            if (!urlExtParam['scene']) {
                urlExtParam['scene'] = 'linksce';
            }
            //默认浏览态
            if (!urlExtParam['status']) {
                urlExtParam['status'] = 'browse';
            }
            urlExtParam['appcode'] = appCode;
            urlExtParam['pagecode'] = linkPageCode;
            //begin tm tangleic 地址平台会根据appcode和pagecode来获取，故无需指定小应用url
            // props.openTo(url, urlExtParam);
            props.openTo(null, urlExtParam);
            //end tangleic
        }
    });
};

/* 
    ====================联查====================
*/

/**
 * 联查审批详情
 *
 * @param {*} pk - 主键id
 */
function linkApproveDetail(pk) {
    approveDetail.call(this, pk);
    // this.setState({
    //     showApproveDetail: true,
    //     billInfo: { billId: pk }
    // });
}

/**
 * 联查凭证
 *
 * @param {*} voucherArr - 联查凭证需要的数据，pk_group/pk_org/relationID组成的数组
 *      格式:[{pk_group: '', //集团主键
                pk_org:'', //组织主键
                relationID: '', //单据主键
                pk_billtype: ''
 *           }]
 */
function linkVoucher(voucherArr) {
    var _this2 = this;

    //拼接联查数据,支持批量联查
    // let querydata = [{
    //     pk_group: voucherArr[0].pk_group, //集团主键
    //     pk_org: voucherArr[0].pk_org, //组织主键
    //     relationID: voucherArr[0].relationID, //单据主键
    //     pk_billtype: voucherArr[0].pk_billtype//交易类型
    // }];
    (0, _ncLightappFront.ajax)({
        url: this.API_URL.linkVoucher, //业务组自己写入口类
        data: voucherArr,
        success: function success(res) {
            if (res.success) {
                var srcCode = res.data.src;
                if ('_LinkVouchar2019' == srcCode) {
                    //走联查
                    if (res.data.des) {
                        //跳转到凭证界面
                        if (res.data.pklist) {
                            // cacheTools.set(this.appcode+'_LinkVouchar',voucherArr);
                            if (res.data.pklist.length == 1) {
                                //单笔联查
                                _this2.props.openTo(res.data.url, {
                                    status: 'browse',
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    id: res.data.pklist[0],
                                    pagekey: 'link', //这个参数去掉,不传了
                                    n: _this2.state.json['fbmpublic-000049'], //'联查凭证'/* 国际化处理： 联查凭证*/
                                    backflag: 'noback'
                                });
                                return;
                            } else {
                                //多笔联查
                                // cacheTools.set("checkedData", res.data.pklist);
                                _ncLightappFront.cacheTools.set(res.data.cachekey, res.data.pklist); //之前缓存的key是”checkedData”,现在改为res.data.cachekey,从接口获取缓存的key
                                _this2.props.openTo(res.data.url, {
                                    status: 'browse',
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    n: _this2.state.json['fbmpublic-000049'], //'联查凭证'/* 国际化处理： 联查凭证*/
                                    scene: _this2.appcode + srcCode //多笔联查新加scene字段
                                });
                                return;
                            }
                        }
                    }
                } else {
                    //跳转到会计平台 这里的appcode是业务组的小应用编码
                    //cacheTools.set(appcode + srcCode, res.data.pklist);
                    (0, _ncLightappFront.toast)({ color: 'warning', content: _this2.state.json['fbmpublic-000050'] }); //000057/* 国际化处理： 未查到凭证*/
                    return;
                }
                // else if ('_Preview2019' == srcCode) {
                //     //走预览 这里的appcode是业务组的小应用编码
                //     cacheTools.set(res.data.appcode + srcCode, viewDataviewData);
                // }
                //打开凭证节点
                // this.props.openTo(res.data.url, {
                //     status: 'browse',
                //     appcode: res.data.appcode,
                //     pagecode: res.data.pagecode,
                //     scene: res.data.appcode + srcCode,
                //     n:this.state.json['36650PUB-000056'] // '凭证预览' 凭证使用这个参数,会计平台不用
                // });
            }
        }
    });
}

// 凭证联查单据
function voucherLinkBill() {
    var _this3 = this;

    var checkedData = [];
    //缓存中的key为’checkedData’,
    checkedData = _ncLightappFront.cacheTools.get('checkedData');
    if (checkedData && checkedData.length > 0) {
        (0, _ncLightappFront.ajax)({
            url: this.API_URL.voucherlink,
            data: {
                operatingLogVO: checkedData,
                pageCode: this.pageId
            },
            success: function success(res) {
                var success = res.success,
                    data = res.data;

                if (success) {
                    if (data) {
                        var rowlenght = data[_this3.tableId].rows;
                        if (rowlenght.length == 1) {
                            var record = rowlenght[0];
                            //1条数据跳转到卡片页面
                            _this3.props.pushTo("/card", {
                                status: 'browse',
                                id: record.values[_this3.primaryId] && record.values[_this3.primaryId].value,
                                scene: "linksce",
                                pagecode: _this3.cardPageCode
                            });
                        } else {
                            //多条数据跳转到列表页面
                            _this3.props.table.setAllTableData(_this3.tableId, data[_this3.tableId]);
                        }
                    } else {
                        _this3.props.table.setAllTableData(_this3.tableId, { rows: [] });
                    }
                }
            }
        });
    }
}

/**
 * 联查预算计划
 *
 * @param {*} pk - 主键
 */
function linkNtb(pk) {
    var _this4 = this;

    if (!this.fullAggClassName) {
        (0, _ncLightappFront.toast)({
            color: 'warning',
            content: this.state.json['fbmpublic-000014'] + this.fullAggClassName /* 国际化处理： 全路径类名错误，请检查！*/
        });
        return;
    }
    // 联查预算url
    var url = this.API_URL.linkNtb ? this.API_URL.linkNtb : '/nccloud/fbm/pub/fbmntblinkplan.do';
    (0, _ncLightappFront.ajax)({
        url: url,
        data: {
            pk: pk,
            className: this.fullAggClassName,
            modulecode: this.modulecode
        },
        success: function success(res) {
            var data = res.data;

            if (data.hint) {
                (0, _ncLightappFront.toast)({ color: 'warning', content: res.data.hint });
            } else {
                _this4.setState({
                    showNtbDetail: true,
                    ntbdata: data
                });
            }
        }
    });
}

/**
 * 联查授信
 *
 * @param {*} balanceinfo - 授信协议参数 
 */
function linkCredit(balanceinfo) {
    this.setState({
        showCCCBalance: balanceinfo,
        showCCC: true
    });
}

/**
 * 联查内部结算账户
 *
 * @param {*} accpk - 内部账户参数 
 */
function linkInnerAccount(accpk) {
    this.setState({
        showInneraccpk: accpk,
        showInnerAccount: true
    });
}

/**
 * 联查余额
 *
 * @param {*} balanceData
 *     pk_org 财务组织id
 *     pk_account 银行账户id（可选）
 *     pk_cashaccount 现金账户id（可选）
 * 
 */
function linkBankBalance(balanceData) {
    this.setState({
        showOriginalData: balanceData,
        showOriginalBalance: true
    });
}

/**
 * 申请单
 *
 * @param {*} pk - 主键
 */
function linkQuotaApply(pks) {
    var _constant$quotaapplyC = constant.quotaapplyConst,
        urlCard = _constant$quotaapplyC.urlCard,
        appcode = _constant$quotaapplyC.appcode,
        pagecodeCard = _constant$quotaapplyC.pagecodeCard;

    linkApp(this.props, {
        url: urlCard,
        appcode: appcode,
        pagecode: pagecodeCard,
        id: pks,
        billtype: '36HQ'
    });
}

/**
 * 单位下拨可用额度
 *
 * @param {*} pk - 主键
 */
function linkUnitQuota(pk) {
    var _constant$unitquotaCo = constant.unitquotaConst,
        urlList = _constant$unitquotaCo.urlList,
        appcode = _constant$unitquotaCo.appcode,
        pagecodeList = _constant$unitquotaCo.pagecodeList;

    linkApp(this.props, {
        url: urlList,
        appcode: appcode,
        pagecode: pagecodeList,
        id: pk,
        srcPage: this.pageId,
        billtype: '36US'
    });
}

/**
 * 收付单据
 *
 * @param {*} pk - 主键
 */
function linkReceAndPaybill(pk, vbillno, pk_register, pk_group) {
    var _this5 = this;

    //首先通过pk进行后台查询 找到要联查页面的类型和pk
    (0, _ncLightappFront.ajax)({
        url: this.API_URL.linkReceAndPaybill,
        data: {
            pk: pk,
            extParam: {
                vbillno: vbillno,
                pk_register: pk_register,
                pk_group: pk_group
            }
        },
        success: function success(res) {
            var data = res.data;

            if (data) {
                var pk_outerbill_h = data.pk_outerbill_h;
                var billtype = data.billtype;
                var rreturnExtparam = {
                    status: 'browse',
                    id: pk_outerbill_h
                };
                linkAppFromTmpub(_this5.props, billtype, rreturnExtparam);
            }
        }
    });
}

/**
 * 应付票据贴现
 *
 * @param {*} pk - 主键
 */
function linkBuyerDiscount(pks) {
    var _constant$buyerdiscou = constant.buyerdiscount,
        urlList = _constant$buyerdiscou.urlList,
        urlCard = _constant$buyerdiscou.urlCard,
        appcode = _constant$buyerdiscou.appcode,
        pagecodeList = _constant$buyerdiscou.pagecodeList,
        pagecodeCard = _constant$buyerdiscou.pagecodeCard;

    linkApp(this.props, {
        url: urlCard,
        appcode: appcode,
        pagecode: pagecodeCard,
        id: pks,
        billtype: '36HV'
    });
}

/**
 * 额度上收
 *
 * @param {*} pk - 主键
 */
function linkUpquota(pks) {
    var _constant$upquotaCons = constant.upquotaConst,
        urlList = _constant$upquotaCons.urlList,
        urlCard = _constant$upquotaCons.urlCard,
        appcode = _constant$upquotaCons.appcode,
        pagecodeList = _constant$upquotaCons.pagecodeList,
        pagecodeCard = _constant$upquotaCons.pagecodeCard;

    linkApp(this.props, {
        url: urlList,
        appcode: appcode,
        pagecode: pagecodeList,
        id: pks,
        billtype: '36HS'
    });
}

/**
 * 联查利息清单
 * 票据不用这个方法
 * @param {*} pk - 主键
 */
function linkInterestList(pk) {
    var _this6 = this;

    var _constant$interestLis = constant.interestListConst,
        urlList = _constant$interestLis.urlList,
        urlCard = _constant$interestLis.urlCard,
        appcode = _constant$interestLis.appcode,
        pagecodeList = _constant$interestLis.pagecodeList,
        pagecodeCard = _constant$interestLis.pagecodeCard;

    if (this.appcode === '36650BCIA') {
        // 利息调整走其他接口，且只存在一对一，跳卡片
        (0, _ncLightappFront.ajax)({
            url: '/nccloud/bond/interestadjust/queryinterestlistpk.do',
            data: { pk: pk },
            success: function success(res) {
                var data = res.data;

                if (data) {
                    linkApp(_this6.props, {
                        url: urlCard,
                        appcode: appcode,
                        pagecode: pagecodeCard,
                        id: data,
                        billtype: ''
                    });
                } else {
                    (0, _ncLightappFront.toast)({ color: 'warning', content: _this6.state.json['fbmpublic-000051'] }); /* 国际化处理： 此利息调整单无利息清单！*/ /* 国际化处理： 此利息调整单无利息清单！*/
                }
            }
        });
    } else {
        (0, _ncLightappFront.ajax)({
            url: '/nccloud/bond/calcintst/interestlistlink.do',
            data: { pks: [pk] },
            success: function success(res) {
                var data = res.data;

                var pagecode = pagecodeList;
                var url = urlList;
                var rowsData = data.table && data.table.rows;
                //单条条卡片，多条跳列表
                if (rowsData.length == 1) {
                    url = urlCard;
                    pagecode = pagecodeCard;
                    pk = rowsData[0].values['pk_bondinterestslist'] && rowsData[0].values['pk_bondinterestslist'].value;
                }
                linkApp(_this6.props, {
                    url: url,
                    appcode: appcode,
                    pagecode: pagecode,
                    id: pk,
                    billtype: ''
                });
            }
        });
    }
}
/**
 * 联查票据台账
 *
 * @param {*} pk_register
 *     pk_register 票据pk

 */
function linkLinkSDBook(pk_register) {
    this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        billtype: "36HM", // 单据类型管理中的 (目标应用)类型代码
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: "linksce",
        sence: "4",
        id: pk_register
    });
}
/**列表页
 * 票据台账反联查单据
 * @param pk 单据pk
 */
function SDBookLinkBill(pk) {
    var _this7 = this;

    if (pk) {
        var pks = pk.split(',');
        // if ((pks && pks.length>1) || this.linkAtList) {
        // 数组多条，单条也当做多条来做
        var data = {
            pageCode: this.pageId,
            pks: pks,
            extParam: {
                srcPage: this.props.getUrlParam("srcPage")
            }
        };
        // 取联查url，没有就取分页查询url
        var url = this.API_URL.linkSence ? this.API_URL.linkSence : this.API_URL.queryListPks;
        (0, _ncLightappFront.ajax)({
            url: url,
            data: data,
            success: function success(res) {
                var data = res.data;

                if (data) {
                    var grid = data.grid,
                        head = data.head;

                    var gridRow = grid && grid[_this7.tableId].rows;
                    if (gridRow.length > 1 || _this7.linkAtList) {
                        _this7.props.table.setAllTableData(_this7.tableId, data.grid[_this7.tableId]);
                        // 显示全部页签
                        _this7.setState({
                            activeTab: _this7.props.listTabs
                        });
                    } else if (gridRow.length == 1) {
                        var _pk = grid[_this7.tableId].rows[0].values[_this7.primaryId].value;
                        _this7.props.pushTo("/card", {
                            status: "browse",
                            id: _pk,
                            scene: "linksce",
                            showBackBtn: false,
                            pagecode: _this7.cardPageCode
                        });
                    }
                }
            }
        });
        // }else{
        //     let linkpk = '';
        //     if (Array.isArray(pk)) {
        //         linkpk=pk[0];
        //     }else{
        //         linkpk = pk;
        //     }
        //     this.props.pushTo("/card",{
        //         status: 'browse',
        //         id: linkpk,
        //         scene: "linksce",
        //     });
        // }
    }
}

/**
 * 委托办理
 * @param {*} props 
 */
function doCommission(props) {
    var _this8 = this;

    var that = this;
    var pk = props.form.getFormItemsValue(this.formId, "pk_quotaapply").value;
    var sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: true
    };

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.commission,
        data: sendData,
        success: function success(res) {
            var data = res.data;

            if (data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: 'error',
                    content: data.errMsg
                });
            } else if (data.billCard.head) {
                _this8.props.form.setAllFormValue(_defineProperty({}, that.formId, res.data.billCard.head[that.formId]));
            }
            _this8.buttonVisible(_this8.props);
        }
    });
}

/**
 * 取消委托办理
 */
function doUnCommission(props) {
    var _this9 = this;

    var that = this;
    var pk = props.form.getFormItemsValue(this.formId, "pk_quotaapply").value;
    var sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: true
    };

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.uncommission,
        data: sendData,
        success: function success(res) {
            var data = res.data;

            if (data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: 'error',
                    content: data.errMsg
                });
            } else if (data.billCard.head) {
                _this9.props.form.setAllFormValue(_defineProperty({}, that.formId, res.data.billCard.head[that.formId]));
            }
            _this9.buttonVisible(_this9.props);
        }
    });
}

function clsRowno(card_table_id) {
    var allTableData = this.props.cardTable.getAllRows(card_table_id);
    var maxrowno = void 0;
    if (allTableData[0].values.banklineno && allTableData[0].values.banklineno.value) {
        maxrowno = parseInt(allTableData[0].values.banklineno.value);
    } else {
        maxrowno = parseInt(0);
    }
    if (allTableData) {
        allTableData.forEach(function (val) {
            if (val.values.banklineno && val.values.banklineno.value) {
                if (maxrowno < parseInt(val.values.banklineno.value)) {
                    maxrowno = parseInt(val.values.banklineno.value);
                }
            }
        });
        allTableData.forEach(function (val) {
            if (val.values.banklineno && val.values.banklineno.value) {} else {
                maxrowno = parseInt(maxrowno) + parseInt(10);
                val.values.banklineno.value = String(maxrowno);
            }
        });
    }
}
/**
 * 跳转到票据签发
 * @param {*} pk 开票申请受理的主键
 */
function signLink(signAcceptPk) {
    this.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
        billtype: "36H2", // 票据签发的单据类型
        pagecode: "36180BS_CARD",
        appcode: "36180BS",
        status: "add",
        id: signAcceptPk
    });
}
/**
 * 联查开票申请单
 * @param {*} signApplyPk 开票申请单的主键
 */
function signApplyLink(signApplyPk) {
    this.props.openTo("/fbm/cfbm/signapply/main/index.html#/card", {
        billtype: "36NA", // 开票申请的单据类型
        pagecode: "36370IFBA_CARD",
        appcode: "36370IFBA",
        status: "browse",
        scene: "linksce",
        id: signApplyPk
    });
}

/**
 * 联查票据签发单
 * @param  signAcceptPk 开票申请受理的主键
 */
function SignBillLink(signAcceptPk) {
    var _this10 = this;

    api.call(this, {
        name: "querysignpk",
        data: { pks: [signAcceptPk] },
        success: function success(res) {
            var result = res["data"];
            if (result) {
                _this10.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
                    billtype: "36H2", // 票据签发的单据类型
                    pagecode: "36180BS_CARD",
                    appcode: "36180BS",
                    status: "browse",
                    scene: "linksce",
                    id: result
                });
            } else {
                (0, _ncLightappFront.toast)({
                    color: "warning",
                    content: _this10.state.json["fbmpublic-000093"] /* 国际化处理： 该单据未签发，没有查询到票据签发单*/
                });
                return;
            }
        }
    });
}

/**
* 联查票据付款单
* @param {*} pk_accept 票据付款单的主键
*/
function acceptLink(pk_accept) {
    this.props.openTo("/fbm/fbm/accept/main/index.html#/cardlinkq", {
        billtype: "36HD", // 单据类型
        pagecode: "36180BP_C02",
        appcode: "36180BP",
        status: "browse",
        scene: "linksce",
        id: pk_accept
    });
}

/**
* 联查应付票据贴现单
* @param {*} pk_buyerdiscount 应付票据贴现单的主键
*/
function buyerDiscountLink(pk_buyerdiscount) {
    this.props.openTo("/fbm/fbm/buyerdiscount/main/index.html#/card", {
        billtype: "36HV", // 单据类型
        pagecode: "36180PDT_CARD",
        appcode: "36180PDT",
        status: "browse",
        scene: "linksce",
        id: pk_buyerdiscount
    });
}

/**
* 联查票据签发单
* 通过主键联查
* @param {*}  registerPK 票据签发单的主键
*/
function registerLink(registerPK) {
    this.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
        billtype: "36H2", // 票据签发的单据类型
        pagecode: "36180BS_CARD",
        appcode: "36180BS",
        status: "browse",
        scene: "linksce",
        id: registerPK
    });
}

/**
* 贴现申请点贴现办理按钮
* @param pk 申请单主键,对应贴现办理pk_discount_app字段
* @param pk_billtypecode 单据类型
 */
function discountTransact(pk, pk_billtypecode) {
    var _this11 = this;

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.discounttransact,
        data: { pk: pk },
        success: function success(res) {
            var data = res.data;

            if (data) {
                var openurl = void 0,
                    billtype = void 0,
                    appcode = void 0,
                    pagecode = void 0;
                if (pk_billtypecode) {
                    // 来源贴现申请，目标贴现办理
                    if (pk_billtypecode.value == "36H6") {
                        openurl = "/fbm/fbm/discount/main/index.html#/card";
                        billtype = "36H7";
                        appcode = "36180DT";
                        pagecode = "36180DT_C01";
                    }
                    // 来源为池内贴现申请，目标池内贴现
                    else if (pk_billtypecode.value == "36HL") {
                            openurl = "/fbm/pfbm/discountin/main/index.html#/card";
                            billtype = "36HJ";
                            appcode = "36200DT";
                            pagecode = "36200DT_C01";
                        }
                    _this11.props.openTo(openurl, {
                        billtype: billtype, // 单据类型管理中的 (目标应用)类型代码
                        pagecode: pagecode,
                        status: "add",
                        appcode: appcode,
                        // 申请单主键,对应贴现办理pk_discount_app字段
                        id: pk
                    });
                }
            }
        }
    });
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(143);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/** 地址栏参数 */
var URL_PARAM = exports.URL_PARAM = {
  /** 主键 */
  ID: 'id',
  /** 界面状态 */
  STATE: 'status',
  /** 场景标志 */
  SCENE: 'scene',
  /** 预算联查参数 */
  TBB_LINK: 'pk_ntbparadimvo',
  /** 联查主键 */
  LINK_ID: 'linkId',
  /** 来源单据主键 */
  PK_SRC: 'pk_src'

  /**Saga字端定义 */
};var sagaField = exports.sagaField = {
  /**冻结状态 */
  frozen: 'saga_frozen',
  /**全局事务id */
  gtxid: 'saga_gtxid',
  /**本地事务id */
  btxid: 'saga_btxid',
  /**分布式事务状态 */
  status: 'saga_status'

  /**Saga冻结状态枚举 */
};var sagaFrozenEnum = exports.sagaFrozenEnum = {
  /**冻结 */
  frozen: 1,
  /**未冻结 */
  unfrozen: 0

  /**Saga事务状态枚举 */
};var sagaStateEnum = exports.sagaStateEnum = {
  /**成功 */
  success: 0,
  /**失败 */
  fail: 1
  /**
  * 场景标志
  */
};var SCENE = exports.SCENE = {
  /**
  * 默认场景
  */
  DEFAULT: 'defaultsce',
  /**
  * 审批场景
  */
  APPROVE: 'approvesce',
  /**
  * 联查
  */
  LINK: 'linksce',
  /**
  * 凭证反联查
  */
  FIP: 'fip',
  /**
  * 其他
  */
  OTHER: 'othersce'

  /**
  * 联查类型
  */
};var LINKTYPE = exports.LINKTYPE = {
  /**普通联查 */
  NORMAL: 'NORMAL',
  /**单据追溯 */
  BILL_REVIEW: 'BILL_REVIEW'

  /**
   * 联查地址栏参数
   */
};var LINK_PARAM = exports.LINK_PARAM = {
  ARAP: {
    FLAG: "flag",
    FLAG_VALUE: 'ftsLinkArap'
  }
  /**
   * 模块信息
   */
};var MODULE_INFO = exports.MODULE_INFO = {
  TMPUB: 'tmpub',
  TMPUB_NUM: '3601'

  /** 公共请求URL定义 */
};var COMMON_URL = exports.COMMON_URL = {
  //电子签章打印检查
  ELECSIGNPRINTCHECK: '/nccloud/tmpub/pub/elecsignprintcheck.do'

  /**公共缓存 */
};var cache = exports.cache = {
  //汇率信息
  rateinfo: 'rateinfo',
  /**是否进行异常弹框 */
  iserrtoast: 'iserrtoast'
  /**预算控制类型 */
};var SPLIT_TBBCTRLTYPE = exports.SPLIT_TBBCTRLTYPE = '_ctrltype_';
/**预算提示类型 */
var tbbwarntype = exports.tbbwarntype = {
  /**柔性控制 */
  flexibility: '0',
  /**刚性控制 */
  inflexibility: '1',
  /**预警 */
  warning: '2'
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.go2CardCheck = exports.tbbWarnDialog = exports.showTBBMsg = exports.getTBBMsg = exports.saveCommit = exports.frozenBtnCtrl = exports.showErrBtn = exports.createCardWebSocket = exports.createListWebSocket = exports.setRate2NewRow = exports.getCacheRateValue = exports.bodyRateEditOnAfterEdit = exports.addDefReferFilter = exports.elecSignCardPrint = exports.elecSignListPrint = exports.createSimpleBillData = exports.buildLightBodyAfterEditData = exports.loadMultiLang = exports.getMultiLangRes = exports.appendMultiLangRes = exports.saveMultiLangRes = exports.getPropCache = exports.setPropCache = exports.showPagination = exports.setDefOrg2AdvanceSrchArea = exports.setDefOrg2ListSrchArea = exports.setDefOrg2Form = exports.hasDefaultOrg = exports.isLinkScene = undefined;

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(9);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * 资金领域 公共api
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @author tangleic
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


/**
 * 判断是否是联查场景
 * @param {*} props 页面内置对象
 */
var isLinkScene = exports.isLinkScene = function isLinkScene(props) {
    //获取场景标志
    var scene = props.getUrlParam(_constant.URL_PARAM.SCENE);
    //是否预算反联查(鄙视，预算反联查没有联查标志，只能通过是否有参数值来判断是否预算反联查)
    var isTbbLink = !props.getUrlParam(_constant.URL_PARAM.TBB_LINK) ? false : true;
    //被联查场景(凭证反联查以及预算反联查)不渲染查询区域，故无需加载默认业务单元到查询区域
    return isTbbLink || scene == _constant.SCENE.LINK || scene == _constant.SCENE.FIP ? true : false;
};

/**
 * 判断是否有默认业务单元数据
 * @param {*} data createUIDom请求返回数据
 */
var hasDefaultOrg = exports.hasDefaultOrg = function hasDefaultOrg(data) {
    return data && data.context && data.context && data.context.pk_org;
};

/**
 * 判断查询区域查询条件是否有值
 * @param {*} props 页面内置对象
 * @param {*} areaCode 查询区域编码
 * @param {*} item 查询条件字段名
 */
var hasSearchValue = function hasSearchValue(props, areaCode, item) {
    if (!props || !props.search || !areaCode || !item) {
        return false;
    }
    try {
        var searchValue = props.search.getSearchValByField(areaCode, item);
        return searchValue && searchValue.value && (searchValue.value.firstvalue || searchValue.value.secondvalue) ? true : false;
    } catch (e) {
        //console.log(e);
        return true;
    }
};
/**
 * 给卡片头部区域赋默认业务单元(在setMeta之后使用)
 * @param {*} props 页面内置对象
 * @param {*} areaCode 卡片头部区域编码
 * @param {*} data  createUIDom请求返回数据
 */
var setDefOrg2Form = exports.setDefOrg2Form = function setDefOrg2Form(props, areaCode, data) {
    //判空
    if (!props || !areaCode || !hasDefaultOrg(data)) {
        return;
    }
    var _data$context = data.context,
        pk_org = _data$context.pk_org,
        org_Name = _data$context.org_Name,
        pk_org_v = _data$context.pk_org_v,
        org_v_Name = _data$context.org_v_Name;
    //将默认业务单元加载到头部表单

    props.form.setFormItemsValue(areaCode, {
        'pk_org': { value: pk_org, display: org_Name },
        'pk_org_v': { value: pk_org_v, display: org_v_Name }
    });
};

/**
 * 给列表查询区域赋默认业务单元(在setMeta之后使用)
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
var setDefOrg2ListSrchArea = exports.setDefOrg2ListSrchArea = function setDefOrg2ListSrchArea(props, areaCode, data) {
    var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org';

    //判空
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data)) {
        return;
    }
    //联查场景不渲染查询区域
    if (isLinkScene(props)) {
        return;
    }
    //判断查询区域组织是否有值，如果有则表明快速查询方案已个性化定制。无需加载默认业务单元
    if (hasSearchValue(props, areaCode, field)) {
        return;
    }
    //获取默认业务单元
    var _data$context2 = data.context,
        pk_org = _data$context2.pk_org,
        org_Name = _data$context2.org_Name;

    var searchData = { 'display': org_Name, 'value': pk_org };
    //更新列表查询区域
    props.search.setSearchValByField(areaCode, field, searchData);
};

/**
 * 给高级查询区域赋默认业务单元(在setMeta之前使用)
 * 
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
var setDefOrg2AdvanceSrchArea = exports.setDefOrg2AdvanceSrchArea = function setDefOrg2AdvanceSrchArea(props, areaCode, data) {
    var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org';

    //判空
    if (!props || !props.search || !areaCode || !hasDefaultOrg(data) || !data.template) {
        return;
    }
    //联查场景不渲染查询区域
    if (isLinkScene(props)) {
        return;
    }
    var meta = data.template;
    //获取默认业务单元
    var _data$context3 = data.context,
        pk_org = _data$context3.pk_org,
        org_Name = _data$context3.org_Name;
    //遍历查询区域字段，将默认业务单元赋值给组织字段

    meta[areaCode].items.map(function (item) {
        if (item.attrcode == field) {
            item.initialvalue = { 'display': org_Name, 'value': pk_org };
        }
    });
};

/**
 * 联查隐藏翻页按钮专用
 * 
 * @param {*} props 页面内置对象
 * @param {*} tableCode 列表tableID
 * @param {*} data  createUIDom请求返回数据
 */
var showPagination = exports.showPagination = function showPagination(props, tableCode, data) {
    if (!props || !tableCode || !data || data.template) {
        return;
    }
    var meta = data.template;
    //联查场景不渲染查询区域
    meta[tableCode].pagination = !isLinkScene(props);
};

//获取拓展数据对象的键
var getExtObjKey = function getExtObjKey(appCode) {
    return appCode + "_" + "extObj";
};

var getMultiLangKey = function getMultiLangKey() {
    return 'multiLang';
};
/**
 * 将数据存储到页面级缓存
 * @param {*} props 页面内置对象
 * @param {*} appCode 应用编码
 * @param {*} key 键
 * @param {*} value 值 
 */
var setPropCache = exports.setPropCache = function setPropCache(props, appCode, key, value) {
    //参数判空
    if (!props || !appCode || !key) {
        return;
    }
    var extObjKey = getExtObjKey(appCode);
    //从页面级缓存中获取拓展对象
    var extObj = props.ViewModel.getData(extObjKey);
    if (!extObj) {
        extObj = {};
    }
    //将键值对存储到拓展对象
    extObj[key] = value;
    //将拓展对象存储到页面级缓存
    props.ViewModel.setData(extObjKey, extObj);
};

/**
 * 获取页面级缓存中指定键的数据
 * @param {*} props 页面内置对象
 * @param {*} appCode 应用编码
 * @param {*} key 键
 */
var getPropCache = exports.getPropCache = function getPropCache(props, appCode, key) {
    //参数判空
    if (!props || !appCode || !key) {
        return null;
    }
    var extObjKey = getExtObjKey(appCode);
    //从页面级缓存中获取拓展对象
    var extObj = props.ViewModel.getData(extObjKey);
    if (!extObj || !extObj.hasOwnProperty(key)) {
        return null;
    }
    //从页面级缓存中获取指定键的值
    return extObj[key];
};

/**
 * 存储多语资源
 * @param {*} props 
 * @param {*} multiLang 
 */
var saveMultiLangRes = exports.saveMultiLangRes = function saveMultiLangRes(props, multiLang) {
    if (!props || !multiLang) {
        return;
    }
    var key = getMultiLangKey();
    props.ViewModel.setData(key, multiLang);
};

/**
 * 追加多语资源
 * @param {*} props 页面内置对象
 * @param {*} multiLang 多语资源
 */
var appendMultiLangRes = exports.appendMultiLangRes = function appendMultiLangRes(props, multiLang) {
    if (!props || !multiLang) {
        return;
    }
    //获取多语资源
    var lang = getMultiLangRes(props);
    if (!lang) {
        saveMultiLangRes(props, multiLang);
    } else {
        Object.assign(lang, multiLang);
    }
};
/**
 * 获取多语资源对象
 * @param {*} props 
 */
var getMultiLangRes = exports.getMultiLangRes = function getMultiLangRes(props) {
    if (!props) {
        return;
    }
    var key = getMultiLangKey();
    return props.ViewModel.getData(key);
};

/**
 * 加载多语信息
 * @param {*} props 页面内置对象
 * @param {*} key 多语资源键
 */
var loadMultiLang = exports.loadMultiLang = function loadMultiLang(props, key) {
    //获取多语资源
    var lang = getMultiLangRes(props);
    if (!lang) {
        return '';
    }
    return lang[key] || '';
};

/**
 * 构建编辑后事件表头数据
 * @param {*} props 页面内置对象
 * @param {*} headCode 表头区域编码
 */
var buildAfterEditHeadData = function buildAfterEditHeadData(props, headCode) {
    var data = {};
    var formData = props.form.getAllFormValue(headCode);
    formData['areacode'] = headCode;
    data[headCode] = formData;
    return data;
};

/**
 * 构建表体编辑后事件数据
 * @param {*} props 页面内置对象
 * @param {*} bodyCode 表体区域编码
 */
var buildAfterEditBodyData = function buildAfterEditBodyData(props, bodyCode) {
    var bodyData = {
        'rows': props.cardTable.getChangedRows(bodyCode),
        'areaType': 'table',
        'areacode': bodyCode
    };
    var data = {};
    data[bodyCode] = bodyData;
    return data;
};

/**
 * 构建编辑后事件的卡片数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 表头区域编码
 * @param {*} bodyCode 表体区域编码（当前修改的表体）
 * @param {*} attrcode 修改的字段
 * @param {*} changedrows 修改的行信息
 * @param {*} index 行索引
 * @param {*} isSingleBody 是否单表体
 */
var buildAfterEditEventData = function buildAfterEditEventData(props, pageCode, headCode, bodyCode, attrcode, changedrows, index, isSingleBody) {
    var card = {
        'head': buildAfterEditHeadData(props, headCode),
        'pageid': pageCode
    };
    if (isSingleBody) {
        card['body'] = buildAfterEditBodyData(props, bodyCode);
    } else {
        card['bodys'] = buildAfterEditBodyData(props, bodyCode);
    }
    return {
        'areacode': bodyCode,
        attrcode: attrcode,
        card: card,
        changedrows: changedrows,
        index: index
    };
};
/**
 * 构建精简表体编辑后事件数据(旨在替代原来平台API：createBodyAfterEventData，只保留修改的当前行数据)
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 表头区域编码
 * @param {*} handleBodyCode 当前操作表体区域编码
 * @param {*} attrCode 编辑的字段
 * @param {*} changeRows 编辑的行信息
 * @param {*} index 行索引
 * @param {*} isSingleBody 是否是单表体
 */
var buildLightBodyAfterEditData = exports.buildLightBodyAfterEditData = function buildLightBodyAfterEditData(props, pageCode, headCode, handleBodyCode, attrCode, changeRows, index) {
    var isSingleBody = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

    try {
        //参数判空
        if (!props || !pageCode || !headCode || !handleBodyCode || !attrCode || !changeRows) {
            throw new Error("参数缺失！");
        }
        //构建表体编辑后事件数据
        var eventData = buildAfterEditEventData(props, pageCode, headCode, handleBodyCode, attrCode, changeRows, index, isSingleBody);
        var card = eventData.card;
        var body = card.body,
            bodys = card.bodys;
        //当编辑后事件数据只有一行表体时，不做额外处理。有多行时，对多行表体过滤，只保留当前编辑行

        if (isSingleBody && body[handleBodyCode].rows.length == 1 || !isSingleBody && bodys[handleBodyCode].rows.length == 1) {
            return eventData;
        }
        var newRowArr = [];
        //修改行的行ID
        var changeRowID = changeRows[0].rowid;
        //获取当前编辑的表体
        body = isSingleBody ? body[handleBodyCode] : bodys[handleBodyCode];
        if (!body) {
            throw new Error("未获取到指定的表体[" + handleBodyCode + "]!");
        }
        var _body = body,
            rows = _body.rows;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var row = _step.value;
                var rowid = row.rowid;
                //过滤非当前修改的行

                if (!rowid || rowid != changeRowID) {
                    continue;
                }
                newRowArr.push(row);
                break;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (newRowArr.length == 0) {
            throw new Error("未找到修改的行!");
        }
        body.rows = newRowArr;
        return eventData;
    } catch (e) {
        //console.log("构建精简表体编辑后数据时出错！:" + e.message);
        throw e;
    }
};

/**
 * 清空值为空的字段
 * @param {*} rows 字段数组
 */
var filterEmptyItem = function filterEmptyItem(rows) {
    if (!rows || rows.length == 0) {
        return null;
    }
    //遍历行数据
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = rows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var row = _step2.value;

            if (!row || !row.values || Object.keys(row.values).length == 0) {
                continue;
            }
            var values = row.values;

            var keys = Object.keys(values);
            //遍历一行数据中所有字段，过滤空值字段
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var key = _step3.value;

                    var item = values[key];
                    if (!item || Object.keys(item).length == 0 || !item.value) {
                        delete values[key];
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
};
/**
 * 构建一主一子页面数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 头部区域编码
 * @param {*} bodyCode 表体区域编码
 * @param {*} clearEmptyItem 是否过滤空值字段
 */
var createSimpleBillDataOneBody = function createSimpleBillDataOneBody(props, pageCode, headCode, bodyCode, clearEmptyItem) {
    var billData = props.createMasterChildDataSimple(pageCode, headCode, bodyCode);
    var head = billData.head,
        body = billData.body;

    if (clearEmptyItem) {
        filterEmptyItem(head[headCode].rows);
        filterEmptyItem(body[bodyCode].rows);
    }
    return billData;
};

/**
 * 构建一主多子页面数据
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 头部区域编码
 * @param {*} bodyCodeArr 表体区域编码数组
 * @param {*} clearEmptyItem 是否过滤空值字段
 */
var createSimpleBillDataMultiBody = function createSimpleBillDataMultiBody(props, pageCode, headCode, bodyCodeArr, clearEmptyItem) {
    var billData = props.createExtCardDataSimple(pageCode, headCode, bodyCodeArr);
    var head = billData.head,
        bodys = billData.bodys;

    if (clearEmptyItem) {
        filterEmptyItem(head[headCode].rows);
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = bodyCodeArr[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var bodyCode = _step4.value;

                filterEmptyItem(bodys[bodyCode].rows);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
    }
    return billData;
};

/**
 * 构建轻量级的页面数据(适合保存操作)
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode 头部区域编码
 * @param {*} bodyCodes 表体区域编码（一主多子为表体区域编码数组）
 * @param {*} clearEmptyItem 是否过滤空值字段(默认不过滤)
 */
var createSimpleBillData = exports.createSimpleBillData = function createSimpleBillData(props, pageCode, headCode, bodyCodes) {
    var clearEmptyItem = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (!props || !pageCode || !headCode || !bodyCodes) {
        return null;
    }
    //根据表体区域编码参数来判断是一主一子还是一主多子
    var isMultiBody = Array.isArray(bodyCodes) ? bodyCodes.length > 1 : false;
    var bodyCodeArr = Array.isArray(bodyCodes) ? bodyCodes : [bodyCodes];
    var billData = null;
    //一主一子单据处理
    if (!isMultiBody) {
        billData = createSimpleBillDataOneBody(props, pageCode, headCode, bodyCodeArr[0], clearEmptyItem);
    }
    //一主多子单据处理
    else {
            billData = createSimpleBillDataMultiBody(props, pageCode, headCode, bodyCodeArr, clearEmptyItem);
        }
    return billData;
};

/**
 * 电子签章列表打印
 * @param {*} props 
 * @param {*} param1 
 */
var elecSignListPrint = exports.elecSignListPrint = function elecSignListPrint(props, _ref) {
    var url = _ref.url,
        _ref$offical = _ref.offical,
        offical = _ref$offical === undefined ? false : _ref$offical,
        appCode = _ref.appCode,
        nodeKey = _ref.nodeKey,
        tableCode = _ref.tableCode,
        field_id = _ref.field_id,
        _ref$field_billno = _ref.field_billno,
        field_billno = _ref$field_billno === undefined ? 'vbillno' : _ref$field_billno,
        getOrgFunc = _ref.getOrgFunc,
        validateFunc = _ref.validateFunc;

    //参数判空
    if (!url || !appCode || !tableCode || !field_id || !field_billno) {
        throw new Error("参数缺失！");
    }
    var selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({ color: 'warning', content: loadMultiLang(props, '3601-000010') }); /* 国际化处理： 未选中行！*/
        return;
    }
    var detail = [];
    var errMessArr = [];
    //遍历选中数据，获取打印需要的参数
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = selectDatas[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var selectData = _step5.value;

            //主键
            var id = selectData && selectData.data && selectData.data.values && selectData.data.values[field_id] && selectData.data.values[field_id].value;
            if (!id) {
                continue;
            }
            //单据编号
            var vbillno = selectData && selectData.data && selectData.data.values && selectData.data.values[field_billno] && selectData.data.values[field_billno].value;
            //组织
            var pk_org = selectData && selectData.data && selectData.data.values && selectData.data.values['pk_org'] && selectData.data.values['pk_org'].value;
            //行索引
            var index = selectData.index;
            //获取自定义的组织
            if (getOrgFunc && typeof getOrgFunc == 'function') {
                pk_org = getOrgFunc(selectData);
            }
            //业务自定义的校验
            var flag = true;
            if (validateFunc && typeof validateFunc == 'function') {
                var errMess = validateFunc(selectData);
                if (errMess) {
                    errMessArr.push(buildErrMess(props, errMess, vbillno, index));
                    flag = false;
                }
            }
            if (flag) {
                detail.push({ id: id, vbillno: vbillno, pk_org: pk_org, index: index });
            }
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    elecSignPrint(props, {
        url: url, offical: offical, appCode: appCode, nodeKey: nodeKey, detail: detail, errMessArr: errMessArr
    });
};

/**
 * 电子签章卡片打印
 * @param {*} props 
 * @param {*} param1 
 */
var elecSignCardPrint = exports.elecSignCardPrint = function elecSignCardPrint(props, _ref2) {
    var url = _ref2.url,
        _ref2$offical = _ref2.offical,
        offical = _ref2$offical === undefined ? false : _ref2$offical,
        appCode = _ref2.appCode,
        nodeKey = _ref2.nodeKey,
        headCode = _ref2.headCode,
        field_id = _ref2.field_id,
        _ref2$field_billno = _ref2.field_billno,
        field_billno = _ref2$field_billno === undefined ? 'vbillno' : _ref2$field_billno,
        getOrgFunc = _ref2.getOrgFunc,
        validateFunc = _ref2.validateFunc;

    //参数判空
    if (!url || !appCode || !headCode || !field_id || !field_billno) {
        throw new Error("参数缺失！");
    }
    //主键
    var id = props.form.getFormItemsValue(headCode, field_id).value;
    //单据编号
    var vbillno = props.form.getFormItemsValue(headCode, field_billno).value;
    //组织
    var pk_org = props.form.getFormItemsValue(headCode, 'pk_org').value;
    //如果有自定义获取组织的逻辑则采用自定义的逻辑来获取组织
    if (getOrgFunc && typeof getOrgFunc == 'function') {
        pk_org = getOrgFunc();
    }
    var errMessArr = [];
    var flag = true;
    if (validateFunc && typeof validateFunc == 'function') {
        var errMess = validateFunc();
        if (errMess) {
            errMessArr.push(buildErrMess(props, errMess, vbillno, 0));
            flag = false;
        }
    }
    elecSignPrint(props, {
        url: url,
        offical: offical,
        appCode: appCode,
        nodeKey: nodeKey,
        detail: flag ? [{ id: id, vbillno: vbillno, pk_org: pk_org }] : null,
        errMessArr: errMessArr
    });
};

/**
 * 电子签章打印输出错误信息
 * @param {*} props 
 * @param {*} errMessArr 
 */
var elecSingPrintErrMsg = function elecSingPrintErrMsg(props, errMessArr) {
    if (!errMessArr || errMessArr.length == 0) {
        return;
    } else if (errMessArr.length == 1) {
        (0, _ncLightappFront.toast)({
            duration: 'infinity',
            color: 'danger',
            content: errMessArr[0],
            hasCloseBtn: true
        });
    } else {
        //提示
        (0, _ncLightappFront.toast)({
            duration: 'infinity',
            color: 'danger',
            TextArr: [loadMultiLang(props, '3601-000000'), loadMultiLang(props, '3601-000001'), loadMultiLang(props, '3601-000021')], /* 国际化处理： 展开,收起,我知道了*/
            groupOperation: true,
            groupOperationMsg: errMessArr
        });
    }
};
/**
 * 电子签章打印
 * @param {*} props 
 * @param {*} param 
 */
var elecSignPrint = function elecSignPrint(props, _ref3) {
    var url = _ref3.url,
        offical = _ref3.offical,
        appCode = _ref3.appCode,
        nodeKey = _ref3.nodeKey,
        detail = _ref3.detail,
        _ref3$errMessArr = _ref3.errMessArr,
        errMessArr = _ref3$errMessArr === undefined ? [] : _ref3$errMessArr;

    //没有要检查的数据，但是有异常信息，则直接提示，不再与后端交互
    if (errMessArr && errMessArr.length > 0 && (!detail || detail.length == 0)) {
        elecSingPrintErrMsg(props, errMessArr);
        return;
    }
    //构建检查参数
    var checkParam = {
        offical: offical, detail: detail
    };
    (0, _ncLightappFront.ajax)({
        url: _constant.COMMON_URL.ELECSIGNPRINTCHECK,
        data: checkParam,
        success: function success(res) {
            var _res$data = res.data,
                passPKs = _res$data.passPKs,
                passInfos = _res$data.passInfos,
                unPassInfos = _res$data.unPassInfos;

            if (errMessArr.length > 0 || unPassInfos && unPassInfos.length > 0) {
                //遍历检查不通过的数据，组装提示信息
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = unPassInfos[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var unPassInfo = _step6.value;
                        var vbillno = unPassInfo.vbillno,
                            mess = unPassInfo.mess,
                            index = unPassInfo.index;

                        var errMess = buildErrMess(props, mess, vbillno, index);
                        errMessArr.push(errMess);
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                elecSingPrintErrMsg(props, errMessArr);
            }
            //有检查通过的数据，则进行打印
            if (passPKs && passPKs.length > 0 && passInfos && passInfos.length > 0) {
                var printParam = {
                    offical: offical,
                    detail: passInfos
                };
                (0, _ncLightappFront.print)('pdf', url, {
                    nodekey: nodeKey, //模版标示
                    appcode: appCode, //应用编码
                    oids: passPKs, //单据主键
                    userjson: JSON.stringify(printParam)
                });
            }
        }
    });
};

//组装异常信息
var buildErrMess = function buildErrMess(props, errMess, vbillno, index) {
    return loadMultiLang(props, '3601-000008') + vbillno + loadMultiLang(props, '3601-000009') + errMess || '';
};

/**
 * 添加自定义项参照过滤
 * @param {*} props 页面内置对象
 * @param {*} param 参数对象
 */
var addDefReferFilter = exports.addDefReferFilter = function addDefReferFilter(props, _ref4) {
    var headCode = _ref4.headCode,
        areaCode = _ref4.areaCode,
        meta = _ref4.meta,
        orgField = _ref4.orgField,
        getOrgFunc = _ref4.getOrgFunc;

    if (!areaCode || !meta || !headCode && !orgField && !getOrgFunc) {
        return;
    }
    var areaCodeArr = Array.isArray(areaCode) ? areaCode : [areaCode];
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = areaCodeArr[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var code = _step7.value;

            meta[code].items.map(function (item) {
                if (item.attrcode.startsWith('vdef') || item.attrcode.startsWith('vuserdef')) {
                    item.queryCondition = function () {
                        return {
                            pk_org: getOrgFunc && typeof getOrgFunc == 'function' ? getOrgFunc() : (props.form.getFormItemsValue(headCode, orgField) || {}).value
                        };
                    };
                }
            });
        }
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }
};

/**缓存汇率信息 */
var cacheRateInfo = function cacheRateInfo(_ref5) {
    var rateInfo = _ref5.rateInfo,
        datasource = _ref5.datasource;

    if (!rateInfo || !datasource) {
        return;
    }
    _ncLightappFront.cardCache.setDefData(_constant.cache.rateinfo, datasource, rateInfo);
    var obj = _ncLightappFront.cardCache.getDefData(_constant.cache.rateinfo, datasource);
    //console.log(obj);
};

/** 编辑后事件处理汇率 */
var bodyRateEditOnAfterEdit = exports.bodyRateEditOnAfterEdit = function bodyRateEditOnAfterEdit(_ref6) {
    var props = _ref6.props,
        bodyCodes = _ref6.bodyCodes,
        rateInfo = _ref6.rateInfo,
        datasource = _ref6.datasource,
        olcRates = _ref6.olcRates,
        glcRates = _ref6.glcRates,
        gllcRates = _ref6.gllcRates;

    if (!props || !rateInfo || !datasource || !bodyCodes) {
        return;
    }
    //缓存汇率信息
    cacheRateInfo({ rateInfo: rateInfo, datasource: datasource });
    //兼容非数组场景
    if (!Array.isArray(bodyCodes)) {
        bodyCodes = [bodyCodes];
    }
    var olcRateEditable = rateInfo.olcRateEditable,
        glcRateEditable = rateInfo.glcRateEditable,
        gllcRateEditable = rateInfo.gllcRateEditable;
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = bodyCodes[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var bodyCode = _step8.value;

            //处理组织本币汇率
            if (olcRates) {
                //兼容非数组场景
                if (!Array.isArray(olcRates)) {
                    olcRates = [olcRates];
                }
                props.cardTable.setColEditableByKey(bodyCode, olcRates, !olcRateEditable);
            }
            //处理集团本币汇率
            if (glcRates) {
                //兼容非数组场景
                if (!Array.isArray(glcRates)) {
                    glcRates = [glcRates];
                }
                props.cardTable.setColEditableByKey(bodyCode, glcRates, !glcRateEditable);
            }
            //处理全局本币汇率
            if (gllcRates) {
                //兼容非数组场景
                if (!Array.isArray(gllcRates)) {
                    gllcRates = [gllcRates];
                }
                props.cardTable.setColEditableByKey(bodyCode, gllcRates, !gllcRateEditable);
            }
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
        }
    }
};

/**获取缓存中的汇率信息 */
var getCacheRateValue = exports.getCacheRateValue = function getCacheRateValue(_ref7) {
    var datasource = _ref7.datasource;

    if (!datasource) {
        return;
    }
    var rateInfo = _ncLightappFront.cardCache.getDefData(_constant.cache.rateinfo, datasource);
    if (!rateInfo) {
        return null;
    }
    return {
        olcRate: rateInfo.olcRate,
        glcRate: rateInfo.glcRate,
        gllcRate: rateInfo.gllcRate
    };
};
/**给新的行注入汇率 */
var setRate2NewRow = exports.setRate2NewRow = function setRate2NewRow(_ref8) {
    var olcRates = _ref8.olcRates,
        glcRates = _ref8.glcRates,
        gllcRates = _ref8.gllcRates,
        datasource = _ref8.datasource,
        row = _ref8.row;

    if (!datasource) {
        return;
    }
    var rateInfo = getCacheRateValue({ datasource: datasource });
    if (!rateInfo) {
        return;
    }
    var olcRate = rateInfo.olcRate,
        glcRate = rateInfo.glcRate,
        gllcRate = rateInfo.gllcRate;

    if (olcRates) {
        if (!Array.isArray(olcRates)) {
            olcRates = [olcRates];
        }
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            for (var _iterator9 = olcRates[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var rate = _step9.value;

                row[rate] = { value: olcRate };
            }
        } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                    _iterator9.return();
                }
            } finally {
                if (_didIteratorError9) {
                    throw _iteratorError9;
                }
            }
        }
    }
    if (glcRates) {
        if (!Array.isArray(glcRates)) {
            glcRates = [glcRates];
        }
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
            for (var _iterator10 = glcRates[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var _rate = _step10.value;

                row[_rate] = { value: glcRate };
            }
        } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                    _iterator10.return();
                }
            } finally {
                if (_didIteratorError10) {
                    throw _iteratorError10;
                }
            }
        }
    }
    if (gllcRates) {
        if (!Array.isArray(gllcRates)) {
            gllcRates = [gllcRates];
        }
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
            for (var _iterator11 = gllcRates[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var _rate2 = _step11.value;

                row[_rate2] = { value: gllcRate };
            }
        } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                    _iterator11.return();
                }
            } finally {
                if (_didIteratorError11) {
                    throw _iteratorError11;
                }
            }
        }
    }
};

/**
 * 列表websocket
 * @param {*} props 
 */
var createListWebSocket = exports.createListWebSocket = function createListWebSocket(props, _ref9) {
    var tableAreaCode = _ref9.tableAreaCode,
        tablePkName = _ref9.tablePkName,
        billtype = _ref9.billtype,
        dataSource = _ref9.dataSource,
        serverLocation = _ref9.serverLocation;

    if (!props || !tableAreaCode || !tablePkName || !billtype) {
        return;
    }
    var socket = props.socket;

    var param = {
        tableAreaCode: tableAreaCode,
        billpkname: tablePkName,
        billtype: billtype,
        dataSource: dataSource
    };
    if (serverLocation) {
        param['serverLocation'] = serverLocation;
    }
    return React.createElement(
        'div',
        null,
        socket.connectMesg(param)
    );
};

/**
 * 创建卡片websocket连接
 * @param {*} props 
 * @param {*} param1 
 */
var createCardWebSocket = exports.createCardWebSocket = function createCardWebSocket(props, _ref10) {
    var headBtnAreaCode = _ref10.headBtnAreaCode,
        formAreaCode = _ref10.formAreaCode,
        billpkname = _ref10.billpkname,
        billtype = _ref10.billtype,
        dataSource = _ref10.dataSource,
        serverLocation = _ref10.serverLocation;

    if (!props || !headBtnAreaCode || !formAreaCode || !billpkname || !billtype) {
        return;
    }
    var socket = props.socket;

    var param = {
        headBtnAreaCode: headBtnAreaCode,
        formAreaCode: formAreaCode,
        billtype: billtype,
        billpkname: billpkname,
        dataSource: dataSource
    };
    if (serverLocation) {
        param['serverLocation'] = serverLocation;
    }
    return React.createElement(
        'div',
        null,
        socket.connectMesg(param)
    );
};

/**异常按钮显示 */
var showErrBtn = exports.showErrBtn = function showErrBtn(props, _ref11) {
    var headBtnCode = _ref11.headBtnCode,
        headAreaCode = _ref11.headAreaCode,
        fieldPK = _ref11.fieldPK,
        datasource = _ref11.datasource;

    if (!props || !headBtnCode || !headAreaCode) {
        return;
    }
    var status = props.getUrlParam(_constant.URL_PARAM.STATE);
    var saga_status = '0';
    try {
        saga_status = props.form.getFormItemsValue(headAreaCode, _constant.sagaField.status).value;
    } catch (error) {
        saga_status = '0';
    }
    var errFlag = saga_status === "1" && status == 'browse';
    props.button.toggleErrorStatus(headBtnCode, { isError: errFlag });
    if (errFlag) {
        errToast(props, { headAreaCode: headAreaCode, fieldPK: fieldPK });
    }
};

/**异常提示 */
var errToast = function errToast(props, _ref12) {
    var headAreaCode = _ref12.headAreaCode,
        fieldPK = _ref12.fieldPK;

    if (!headAreaCode || !fieldPK) {
        return;
    }
    //begin tm tangleic 20191212 取消通过缓存标志来控制是否提示，UE交互决定只要刷新就提示，无需区分
    //是否异常提示（这里从缓存中获取，业务单据在列表跳转卡片的动作中注入缓存标志）
    // let iserrtoast = cardCache.getDefData(cache.iserrtoast, datasource);
    // if (!iserrtoast) {
    // return;
    // }
    //避免标志位重复 立即初始化标志位
    // cardCache.setDefData(cache.iserrtoast, datasource, false);
    //end tangleic
    var status = props.getUrlParam("status");
    var gtxid = props.form.getFormItemsValue(headAreaCode, _constant.sagaField.gtxid);
    var billpk = props.form.getFormItemsValue(headAreaCode, fieldPK);
    if (status == 'browse' && gtxid && gtxid.value && billpk && billpk.value) {
        props.socket.showToast({
            gtxid: gtxid.value,
            billpk: billpk.value
        });
    }
};
/**冻结按钮控制 */
var frozenBtnCtrl = exports.frozenBtnCtrl = function frozenBtnCtrl(props, _ref13) {
    var btnCodes = _ref13.btnCodes;

    if (!props || !btnCodes) {
        return;
    }
    var btnArr = Array.isArray(btnCodes) ? btnCodes : [btnCodes];
    var status = props.getUrlParam(_constant.URL_PARAM.STATE);
    if (status != 'browse') {
        return;
    }
    var saga_frozen = '1';
    try {
        saga_frozen = props.form.getFormItemsValue(headAreaCode, _constant.sagaField.frozen).value;
    } catch (error) {
        saga_frozen = '1';
    }
    props.button.setButtonDisabled(btnArr, saga_frozen == '1');
};

/**构建表体区域编码数组 */
var buildBodyCodeArr = function buildBodyCodeArr(bodyCodes) {
    //表体区域编码兼容 单个和数组
    if (!bodyCodes) {
        return [];
    } else if (!Array.isArray(bodyCodes)) {
        return [bodyCodes];
    } else {
        return bodyCodes;
    }
};
/** 预保存(实现验证公式) */
var preSave = function preSave(props, _ref14) {
    var pageCode = _ref14.pageCode,
        headCode = _ref14.headCode,
        bodyCodeArr = _ref14.bodyCodeArr,
        saveFunc = _ref14.saveFunc;

    //获取界面数据
    var billdata = bodyCodeArr.length > 1 ? props.createExtCardData(pageCode, headCode, bodyCodeArr) : props.createMasterChildData(pageCode, headCode, bodyCodeArr[0]);
    var saveObj = {};
    //考虑单表的情况
    if (bodyCodeArr.length == 0) {
        saveObj[headCode] = 'form';
    } else {
        //组装区域数据
        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
            for (var _iterator12 = bodyCodeArr[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                var code = _step12.value;

                saveObj[code] = 'cardTable';
            }
        } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion12 && _iterator12.return) {
                    _iterator12.return();
                }
            } finally {
                if (_didIteratorError12) {
                    throw _iteratorError12;
                }
            }
        }
    }
    props.validateToSave(billdata, saveFunc, saveObj, '');
};
/**构建保存数据 */
var buildSaveData = function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props, _ref16) {
        var pageCode = _ref16.pageCode,
            headCode = _ref16.headCode,
            bodyCodeArr = _ref16.bodyCodeArr,
            saveValidate = _ref16.saveValidate,
            processSaveData = _ref16.processSaveData;
        var billdata;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (props.form.isCheckNow(headCode)) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt('return', null);

                    case 2:
                        if (!(bodyCodeArr && bodyCodeArr.length > 0 && !props.cardTable.checkTableRequired())) {
                            _context.next = 4;
                            break;
                        }

                        return _context.abrupt('return', null);

                    case 4:
                        if (!(saveValidate && typeof saveValidate == 'function')) {
                            _context.next = 7;
                            break;
                        }

                        if (saveValidate()) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt('return', null);

                    case 7:
                        //构建卡片界面数据（流量优化后去除display和scale）
                        billdata = createSimpleBillData(props, pageCode, headCode, bodyCodeArr);
                        //处理保存数据

                        if (!(processSaveData && typeof processSaveData == 'function')) {
                            _context.next = 12;
                            break;
                        }

                        _context.next = 11;
                        return processSaveData(billdata);

                    case 11:
                        billdata = _context.sent;

                    case 12:
                        return _context.abrupt('return', { data: JSON.stringify(billdata), pageCode: pageCode });

                    case 13:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function buildSaveData(_x5, _x6) {
        return _ref15.apply(this, arguments);
    };
}();

/**公共的保存提交 */
var saveCommit = exports.saveCommit = function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(props, _ref18) {
        var pageCode = _ref18.pageCode,
            headCode = _ref18.headCode,
            bodyCode = _ref18.bodyCode,
            url = _ref18.url,
            assign = _ref18.assign,
            showAssignFunc = _ref18.showAssignFunc,
            updateViewFunc = _ref18.updateViewFunc,
            saveValidate = _ref18.saveValidate,
            processSaveData = _ref18.processSaveData,
            extParam = _ref18.extParam;
        var bodyCodeArr, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!(!pageCode || !headCode || !url || !showAssignFunc || !updateViewFunc)) {
                            _context2.next = 2;
                            break;
                        }

                        return _context2.abrupt('return');

                    case 2:
                        //拓展参数容错
                        if (!extParam) {
                            extParam = {};
                        }
                        bodyCodeArr = buildBodyCodeArr(bodyCode);
                        _context2.next = 6;
                        return buildSaveData(props, { pageCode: pageCode, headCode: headCode, bodyCodeArr: bodyCodeArr, saveValidate: saveValidate, processSaveData: processSaveData });

                    case 6:
                        data = _context2.sent;

                        if (data) {
                            _context2.next = 9;
                            break;
                        }

                        return _context2.abrupt('return');

                    case 9:
                        //将指派信息追加到拓展参数
                        if (assign) {
                            extParam['content'] = JSON.stringify(assign);
                        }
                        //将拓展参数追加到请求数据
                        data['extParam'] = extParam;
                        preSave(props, {
                            pageCode: pageCode,
                            headCode: headCode,
                            bodyCodeArr: bodyCodeArr,
                            saveFunc: function saveFunc() {
                                (0, _ncLightappFront.ajax)({
                                    url: url,
                                    data: data,
                                    success: function success(res) {
                                        var workflow = res.data.workflow;
                                        //有指派信息，则指派 没有则更新界面

                                        if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                                            showAssignFunc(res);
                                        } else {
                                            updateViewFunc(res);
                                        }
                                    }
                                });
                            }
                        });

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function saveCommit(_x7, _x8) {
        return _ref17.apply(this, arguments);
    };
}();

/**
 * 获取预算信息
 * @return 预算提示信息
 */
var getTBBMsg = exports.getTBBMsg = function getTBBMsg(_ref19) {
    var row = _ref19.row,
        msgfield = _ref19.msgfield;

    if (!msgfield) {
        msgfield = 'ntbinfo';
    }
    var ntbinfo = (row && row.values && row.values[msgfield] || {}).value;
    if (ntbinfo) {
        //清空预算提示字段
        row.values[msgfield] = { value: null, display: null };
    }
    return ntbinfo;
};

/**
 * 卡片预算信息提示（主要用于柔性控制提示）
 * @return 是否进行过预算提示
 */
var showTBBMsg = exports.showTBBMsg = function showTBBMsg(_ref20) {
    var head = _ref20.head,
        headCode = _ref20.headCode,
        msgfield = _ref20.msgfield;

    if (!head || !headCode || !head[headCode] || !head[headCode].rows || head[headCode].rows.length == 0) {
        return false;
    }
    var flag = false;
    var row = head[headCode].rows[0];
    var ntbinfo = getTBBMsg({ row: row, msgfield: msgfield });
    if (ntbinfo) {
        //气泡提示
        (0, _ncLightappFront.toast)({ color: 'warning', content: ntbinfo });
        flag = true;
    }
    return flag;
};

/**
 * 预算预警弹框
 */
var tbbWarnDialog = exports.tbbWarnDialog = function tbbWarnDialog(props, _ref21) {
    var ntbinfos = _ref21.ntbinfos,
        onConfirm = _ref21.onConfirm;

    if (!ntbinfos || ntbinfos.length == 0) {
        return;
    }
    //主键数组
    var pkArr = [];
    //是否多条
    var ismulti = ntbinfos.length > 1;
    var index = 1;
    //多条时第一条信息为汇总信息
    var lineArr = ismulti ? [loadMultiLang(props, '3601-000019') /* 国际化处理： 总共*/ + '[' + ntbinfos.length + ']' + loadMultiLang(props, '3601-000020') /* 国际化处理： 条数据超预算*/] : [];
    var _iteratorNormalCompletion13 = true;
    var _didIteratorError13 = false;
    var _iteratorError13 = undefined;

    try {
        for (var _iterator13 = ntbinfos[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var ntbinfo = _step13.value;

            if (ntbinfo == null) {
                continue;
            }
            var pk = ntbinfo.pk,
                msg = ntbinfo.msg,
                vbillno = ntbinfo.vbillno;

            if (!pk || !vbillno) {
                continue;
            }
            pkArr.push(pk);
            var line = '';
            //只有多条 时拼接序号，单据编号
            if (ismulti) {
                line = '' + index + '. ' + loadMultiLang(props, '3601-000018') /* 国际化处理： 单据号*/ + '[' + vbillno + '] ';
            }
            lineArr.push(React.createElement(
                'li',
                null,
                line + msg
            ));
            index++;
        }
    } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
            }
        } finally {
            if (_didIteratorError13) {
                throw _iteratorError13;
            }
        }
    }

    if (lineArr.length == 0) {
        return;
    }
    (0, _ncLightappFront.promptBox)({
        color: "warning",
        title: loadMultiLang(props, '3601-000017'), /* 国际化处理： 预算预警提示信息*/
        content: React.createElement(
            'ul',
            null,
            lineArr
        ),
        beSureBtnClick: function beSureBtnClick() {
            onConfirm(pkArr);
        }
    });
};

/**
 * 跳转卡片检查
 */
var go2CardCheck = exports.go2CardCheck = function go2CardCheck(_ref22) {
    var props = _ref22.props,
        url = _ref22.url,
        pk = _ref22.pk,
        ts = _ref22.ts,
        fieldPK = _ref22.fieldPK,
        actionCode = _ref22.actionCode,
        permissionCode = _ref22.permissionCode,
        _ref22$checkSaga = _ref22.checkSaga,
        checkSaga = _ref22$checkSaga === undefined ? true : _ref22$checkSaga,
        _ref22$checkTS = _ref22.checkTS,
        checkTS = _ref22$checkTS === undefined ? true : _ref22$checkTS,
        go2CardFunc = _ref22.go2CardFunc;

    if (!go2CardFunc || typeof go2CardFunc != 'function') {
        return;
    }
    if (!props || !url || !pk || !ts || !fieldPK) {
        go2CardFunc();
    }
    (0, _ncLightappFront.ajax)({
        url: url,
        data: { pk: pk, ts: ts, actionCode: actionCode, permissionCode: permissionCode, fieldPK: fieldPK, checkSaga: checkSaga, checkTS: checkTS },
        success: function success(res) {
            go2CardFunc();
        }
    });
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

// 获取签名字段信息
var getSignStr = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, head, encryptVOClassName, div) {
        var signStr, returnData, order, tabledata, tableinfo, encryptkey, tablerelation, _returnData$scale, scale, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, name, signObj, list, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, item, key;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        signStr = "";
                        _context2.next = 3;
                        return getSignDetail(encryptVOClassName, div);

                    case 3:
                        returnData = _context2.sent;
                        order = returnData.order, tabledata = returnData.tabledata, tableinfo = returnData.tableinfo, encryptkey = returnData.encryptkey, tablerelation = returnData.tablerelation, _returnData$scale = returnData.scale, scale = _returnData$scale === undefined ? { scale: 8 } : _returnData$scale;

                        if (!(JSON.stringify(returnData) === "{}")) {
                            _context2.next = 7;
                            break;
                        }

                        return _context2.abrupt("return", {});

                    case 7:
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context2.prev = 10;
                        _iterator2 = tableinfo[Symbol.iterator]();

                    case 12:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context2.next = 60;
                            break;
                        }

                        name = _step2.value;
                        signObj = tabledata[name];
                        list = (name === "head" ? data[head] : data["body"] || data["bodys"])[tablerelation[name]]["rows"].sort(function (a, b) {
                            return a["values"][order]["value"] - b["values"][order]["value"];
                        });
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context2.prev = 19;
                        _iterator3 = list[Symbol.iterator]();

                    case 21:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context2.next = 43;
                            break;
                        }

                        item = _step3.value;

                        if (!(item.status === "3")) {
                            _context2.next = 25;
                            break;
                        }

                        return _context2.abrupt("continue", 40);

                    case 25:
                        if (!Object.keys(signObj).length) {
                            //某表内无需要签名字段时，拼接null
                            signStr += "null";
                        }
                        _context2.t0 = regeneratorRuntime.keys(signObj);

                    case 27:
                        if ((_context2.t1 = _context2.t0()).done) {
                            _context2.next = 40;
                            break;
                        }

                        key = _context2.t1.value;
                        _context2.t2 = Number(signObj[key]);
                        _context2.next = _context2.t2 === 0 ? 32 : _context2.t2 === 1 ? 34 : _context2.t2 === 2 ? 36 : 38;
                        break;

                    case 32:
                        signStr += item["values"][key] ? item["values"][key]["value"] || "" : "";
                        return _context2.abrupt("break", 38);

                    case 34:
                        signStr += item["values"][key] ? item["values"][key]["display"] || "" : "";
                        return _context2.abrupt("break", 38);

                    case 36:
                        signStr += item["values"][key] && item["values"][key]["value"] ? (Number(item["values"][key]["value"]) || 0).toFixed(scale.scale) : "";
                        return _context2.abrupt("break", 38);

                    case 38:
                        _context2.next = 27;
                        break;

                    case 40:
                        _iteratorNormalCompletion3 = true;
                        _context2.next = 21;
                        break;

                    case 43:
                        _context2.next = 49;
                        break;

                    case 45:
                        _context2.prev = 45;
                        _context2.t3 = _context2["catch"](19);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context2.t3;

                    case 49:
                        _context2.prev = 49;
                        _context2.prev = 50;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 52:
                        _context2.prev = 52;

                        if (!_didIteratorError3) {
                            _context2.next = 55;
                            break;
                        }

                        throw _iteratorError3;

                    case 55:
                        return _context2.finish(52);

                    case 56:
                        return _context2.finish(49);

                    case 57:
                        _iteratorNormalCompletion2 = true;
                        _context2.next = 12;
                        break;

                    case 60:
                        _context2.next = 66;
                        break;

                    case 62:
                        _context2.prev = 62;
                        _context2.t4 = _context2["catch"](10);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context2.t4;

                    case 66:
                        _context2.prev = 66;
                        _context2.prev = 67;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 69:
                        _context2.prev = 69;

                        if (!_didIteratorError2) {
                            _context2.next = 72;
                            break;
                        }

                        throw _iteratorError2;

                    case 72:
                        return _context2.finish(69);

                    case 73:
                        return _context2.finish(66);

                    case 74:
                        return _context2.abrupt("return", {
                            signStr: signStr,
                            encryptkey: encryptkey,
                            tablerelation: tablerelation
                        });

                    case 75:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[10, 62, 66, 74], [19, 45, 49, 57], [50,, 52, 56], [67,, 69, 73]]);
    }));

    return function getSignStr(_x2, _x3, _x4, _x5) {
        return _ref3.apply(this, arguments);
    };
}();

var _ncLightappFront = __webpack_require__(1);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var setGlobalStorage = _ncLightappFront.viewModel.setGlobalStorage,
    getGlobalStorage = _ncLightappFront.viewModel.getGlobalStorage,
    removeGlobalStorage = _ncLightappFront.viewModel.removeGlobalStorage;
var NCLoading = _ncLightappFront.base.NCLoading;

exports.default = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var _ref2$data = _ref2.data,
            data = _ref2$data === undefined ? {} : _ref2$data,
            _ref2$encryptVOClassN = _ref2.encryptVOClassName,
            encryptVOClassName = _ref2$encryptVOClassN === undefined ? "" : _ref2$encryptVOClassN,
            _ref2$isSign = _ref2.isSign,
            isSign = _ref2$isSign === undefined ? true : _ref2$isSign,
            _ref2$isKey = _ref2.isKey,
            isKey = _ref2$isKey === undefined ? true : _ref2$isKey,
            _ref2$head = _ref2.head,
            head = _ref2$head === undefined ? "head" : _ref2$head,
            _ref2$isSave = _ref2.isSave,
            isSave = _ref2$isSave === undefined ? false : _ref2$isSave,
            _ref2$primaryId = _ref2.primaryId,
            primaryId = _ref2$primaryId === undefined ? null : _ref2$primaryId;

        var isSignKey, businessInfo, div, returnData, signStr, encryptkey, isca, signVal, tablerelation, key, datas, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        primaryId = primaryId ? Array.isArray(primaryId) ? primaryId : [primaryId] : primaryId;
                        data = primaryId ? { text: primaryId.join(""), signText: null } : data;

                        if (isSign || isKey) {
                            _context.next = 4;
                            break;
                        }

                        return _context.abrupt("return", {
                            data: data,
                            isStop: false
                        });

                    case 4:
                        if (isSave) {
                            //保存操作，已弹过框，就不弹第二次
                            isSignKey = getGlobalStorage("localStorage", "isSignKey");

                            if (isSignKey === "1") {
                                isKey = false;
                            } else {
                                setGlobalStorage("localStorage", "isSignKey", isKey ? 1 : 2, function () {});
                            }
                        }

                        businessInfo = (0, _ncLightappFront.getBusinessInfo)();

                        if (!(!businessInfo || !businessInfo.userCode)) {
                            _context.next = 9;
                            break;
                        }

                        (0, _ncLightappFront.toast)({
                            color: "warning",
                            content: "无法获取当前登录用户信息, 请重新登录!"
                        });
                        return _context.abrupt("return", {
                            data: data,
                            isStop: true
                        });

                    case 9:
                        div = void 0, returnData = {}, signStr = "", encryptkey = {};

                        div = document.createElement("div");
                        document.body.appendChild(div);
                        _reactDom2.default.render(React.createElement(NCLoading, { show: true, fullScreen: true }), div);

                        //执行Ajax请求

                        if (!isSign) {
                            _context.next = 26;
                            break;
                        }

                        if (primaryId) {
                            _context.next = 25;
                            break;
                        }

                        _context.next = 17;
                        return getSignStr(data, head, encryptVOClassName, div);

                    case 17:
                        returnData = _context.sent;

                        if (!(JSON.stringify(returnData) === "{}")) {
                            _context.next = 21;
                            break;
                        }

                        div && _reactDom2.default.unmountComponentAtNode(div);
                        return _context.abrupt("return", {
                            data: data,
                            isStop: true
                        });

                    case 21:
                        signStr = returnData.signStr;
                        encryptkey = returnData.encryptkey;
                        _context.next = 26;
                        break;

                    case 25:
                        //支付时使用
                        signStr = data.text;

                    case 26:
                        _context.next = 28;
                        return getIsca();

                    case 28:
                        isca = _context.sent;

                        if (!isca) {
                            isKey = false;
                        }
                        signVal = superSign(signStr, businessInfo.userCode, isKey, isca);

                        if (!(signVal.status !== 0)) {
                            _context.next = 35;
                            break;
                        }

                        (0, _ncLightappFront.toast)({
                            color: "warning",
                            content: signVal.msg || "系统异常错误, 请重新尝试!"
                        });
                        div && _reactDom2.default.unmountComponentAtNode(div);
                        return _context.abrupt("return", {
                            data: data,
                            isStop: true
                        });

                    case 35:
                        if (!isSign) {
                            _context.next = 69;
                            break;
                        }

                        if (primaryId) {
                            _context.next = 67;
                            break;
                        }

                        //非支付时使用
                        signStr = signVal.signStr;
                        tablerelation = returnData.tablerelation;
                        _context.t0 = regeneratorRuntime.keys(encryptkey);

                    case 40:
                        if ((_context.t1 = _context.t0()).done) {
                            _context.next = 64;
                            break;
                        }

                        key = _context.t1.value;
                        datas = (key === "head" ? data[head] : data["body"] || data["bodys"])[tablerelation[key]]["rows"];
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 46;

                        for (_iterator = datas[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            item = _step.value;

                            item["values"][encryptkey[key]] = { value: signStr };
                        }
                        _context.next = 54;
                        break;

                    case 50:
                        _context.prev = 50;
                        _context.t2 = _context["catch"](46);
                        _didIteratorError = true;
                        _iteratorError = _context.t2;

                    case 54:
                        _context.prev = 54;
                        _context.prev = 55;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 57:
                        _context.prev = 57;

                        if (!_didIteratorError) {
                            _context.next = 60;
                            break;
                        }

                        throw _iteratorError;

                    case 60:
                        return _context.finish(57);

                    case 61:
                        return _context.finish(54);

                    case 62:
                        _context.next = 40;
                        break;

                    case 64:
                        data.userjson = signVal.sn;
                        _context.next = 69;
                        break;

                    case 67:
                        //支付时使用
                        data.signText = signVal.signStr;
                        data.userjson = signVal.sn;

                    case 69:
                        //console.log(data, "data");
                        //console.log(signStr, "signStr--暗文");
                        div && _reactDom2.default.unmountComponentAtNode(div);
                        return _context.abrupt("return", {
                            data: data,
                            isStop: false
                        });

                    case 71:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[46, 50, 54, 62], [55,, 57, 61]]);
    }));

    function Sign(_x) {
        return _ref.apply(this, arguments);
    }

    return Sign;
}();

function getSignDetail(encryptVOClassName, div) {
    return new Promise(function (resolve) {
        return (0, _ncLightappFront.ajax)({
            type: "post",
            url: "/nccloud/tmpub/pub/qryencryptinfo.do", //添加自己的接口链接
            data: { encryptVOClassName: encryptVOClassName },
            loading: false,
            async: false,
            success: function success(res) {
                if (res.success) {
                    resolve(res.data);
                }
            },
            error: function error(res) {
                div && _reactDom2.default.unmountComponentAtNode(div);
                (0, _ncLightappFront.toast)({ color: "warning", content: res.message });
                resolve({});
            }
        });
    });
}

function getIsca() {
    return new Promise(function (resolve) {
        return (0, _ncLightappFront.ajax)({
            type: "post",
            url: "/nccloud/tmpub/pub/iscauser.do",
            loading: false,
            async: false,
            success: function success(res) {
                if (res.success) {
                    resolve(res.data);
                }
            },
            error: function error(res) {
                resolve(false);
            }
        });
    });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var af = moment.defineLocale('af', {
        months : 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
        monthsShort : 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
        weekdays : 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
        weekdaysShort : 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
        weekdaysMin : 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
        meridiemParse: /vm|nm/i,
        isPM : function (input) {
            return /^nm$/i.test(input);
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours < 12) {
                return isLower ? 'vm' : 'VM';
            } else {
                return isLower ? 'nm' : 'NM';
            }
        },
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Vandag om] LT',
            nextDay : '[Môre om] LT',
            nextWeek : 'dddd [om] LT',
            lastDay : '[Gister om] LT',
            lastWeek : '[Laas] dddd [om] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'oor %s',
            past : '%s gelede',
            s : '\'n paar sekondes',
            ss : '%d sekondes',
            m : '\'n minuut',
            mm : '%d minute',
            h : '\'n uur',
            hh : '%d ure',
            d : '\'n dag',
            dd : '%d dae',
            M : '\'n maand',
            MM : '%d maande',
            y : '\'n jaar',
            yy : '%d jaar'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal : function (number) {
            return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
        },
        week : {
            dow : 1, // Maandag is die eerste dag van die week.
            doy : 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
        }
    });

    return af;

})));


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩',
        '0': '٠'
    }, numberMap = {
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
        '٠': '0'
    }, pluralForm = function (n) {
        return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
    }, plurals = {
        s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
        m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
        h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
        d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
        M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
        y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
    }, pluralize = function (u) {
        return function (number, withoutSuffix, string, isFuture) {
            var f = pluralForm(number),
                str = plurals[u][pluralForm(number)];
            if (f === 2) {
                str = str[withoutSuffix ? 0 : 1];
            }
            return str.replace(/%d/i, number);
        };
    }, months = [
        'يناير',
        'فبراير',
        'مارس',
        'أبريل',
        'مايو',
        'يونيو',
        'يوليو',
        'أغسطس',
        'سبتمبر',
        'أكتوبر',
        'نوفمبر',
        'ديسمبر'
    ];

    var ar = moment.defineLocale('ar', {
        months : months,
        monthsShort : months,
        weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'D/\u200FM/\u200FYYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        meridiemParse: /ص|م/,
        isPM : function (input) {
            return 'م' === input;
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ص';
            } else {
                return 'م';
            }
        },
        calendar : {
            sameDay: '[اليوم عند الساعة] LT',
            nextDay: '[غدًا عند الساعة] LT',
            nextWeek: 'dddd [عند الساعة] LT',
            lastDay: '[أمس عند الساعة] LT',
            lastWeek: 'dddd [عند الساعة] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'بعد %s',
            past : 'منذ %s',
            s : pluralize('s'),
            ss : pluralize('s'),
            m : pluralize('m'),
            mm : pluralize('m'),
            h : pluralize('h'),
            hh : pluralize('h'),
            d : pluralize('d'),
            dd : pluralize('d'),
            M : pluralize('M'),
            MM : pluralize('M'),
            y : pluralize('y'),
            yy : pluralize('y')
        },
        preparse: function (string) {
            return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
                return numberMap[match];
            }).replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            }).replace(/,/g, '،');
        },
        week : {
            dow : 6, // Saturday is the first day of the week.
            doy : 12  // The week that contains Jan 12th is the first week of the year.
        }
    });

    return ar;

})));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var arDz = moment.defineLocale('ar-dz', {
        months : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
        monthsShort : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
        weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort : 'احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin : 'أح_إث_ثلا_أر_خم_جم_سب'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'في %s',
            past : 'منذ %s',
            s : 'ثوان',
            ss : '%d ثانية',
            m : 'دقيقة',
            mm : '%d دقائق',
            h : 'ساعة',
            hh : '%d ساعات',
            d : 'يوم',
            dd : '%d أيام',
            M : 'شهر',
            MM : '%d أشهر',
            y : 'سنة',
            yy : '%d سنوات'
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return arDz;

})));


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var arKw = moment.defineLocale('ar-kw', {
        months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
        monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
        weekdays : 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort : 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'في %s',
            past : 'منذ %s',
            s : 'ثوان',
            ss : '%d ثانية',
            m : 'دقيقة',
            mm : '%d دقائق',
            h : 'ساعة',
            hh : '%d ساعات',
            d : 'يوم',
            dd : '%d أيام',
            M : 'شهر',
            MM : '%d أشهر',
            y : 'سنة',
            yy : '%d سنوات'
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 12  // The week that contains Jan 12th is the first week of the year.
        }
    });

    return arKw;

})));


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '0': '0'
    }, pluralForm = function (n) {
        return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
    }, plurals = {
        s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
        m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
        h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
        d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
        M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
        y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
    }, pluralize = function (u) {
        return function (number, withoutSuffix, string, isFuture) {
            var f = pluralForm(number),
                str = plurals[u][pluralForm(number)];
            if (f === 2) {
                str = str[withoutSuffix ? 0 : 1];
            }
            return str.replace(/%d/i, number);
        };
    }, months = [
        'يناير',
        'فبراير',
        'مارس',
        'أبريل',
        'مايو',
        'يونيو',
        'يوليو',
        'أغسطس',
        'سبتمبر',
        'أكتوبر',
        'نوفمبر',
        'ديسمبر'
    ];

    var arLy = moment.defineLocale('ar-ly', {
        months : months,
        monthsShort : months,
        weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'D/\u200FM/\u200FYYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        meridiemParse: /ص|م/,
        isPM : function (input) {
            return 'م' === input;
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ص';
            } else {
                return 'م';
            }
        },
        calendar : {
            sameDay: '[اليوم عند الساعة] LT',
            nextDay: '[غدًا عند الساعة] LT',
            nextWeek: 'dddd [عند الساعة] LT',
            lastDay: '[أمس عند الساعة] LT',
            lastWeek: 'dddd [عند الساعة] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'بعد %s',
            past : 'منذ %s',
            s : pluralize('s'),
            ss : pluralize('s'),
            m : pluralize('m'),
            mm : pluralize('m'),
            h : pluralize('h'),
            hh : pluralize('h'),
            d : pluralize('d'),
            dd : pluralize('d'),
            M : pluralize('M'),
            MM : pluralize('M'),
            y : pluralize('y'),
            yy : pluralize('y')
        },
        preparse: function (string) {
            return string.replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            }).replace(/,/g, '،');
        },
        week : {
            dow : 6, // Saturday is the first day of the week.
            doy : 12  // The week that contains Jan 12th is the first week of the year.
        }
    });

    return arLy;

})));


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var arMa = moment.defineLocale('ar-ma', {
        months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
        monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
        weekdays : 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort : 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'في %s',
            past : 'منذ %s',
            s : 'ثوان',
            ss : '%d ثانية',
            m : 'دقيقة',
            mm : '%d دقائق',
            h : 'ساعة',
            hh : '%d ساعات',
            d : 'يوم',
            dd : '%d أيام',
            M : 'شهر',
            MM : '%d أشهر',
            y : 'سنة',
            yy : '%d سنوات'
        },
        week : {
            dow : 6, // Saturday is the first day of the week.
            doy : 12  // The week that contains Jan 12th is the first week of the year.
        }
    });

    return arMa;

})));


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩',
        '0': '٠'
    }, numberMap = {
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
        '٠': '0'
    };

    var arSa = moment.defineLocale('ar-sa', {
        months : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
        monthsShort : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
        weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        meridiemParse: /ص|م/,
        isPM : function (input) {
            return 'م' === input;
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ص';
            } else {
                return 'م';
            }
        },
        calendar : {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'في %s',
            past : 'منذ %s',
            s : 'ثوان',
            ss : '%d ثانية',
            m : 'دقيقة',
            mm : '%d دقائق',
            h : 'ساعة',
            hh : '%d ساعات',
            d : 'يوم',
            dd : '%d أيام',
            M : 'شهر',
            MM : '%d أشهر',
            y : 'سنة',
            yy : '%d سنوات'
        },
        preparse: function (string) {
            return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
                return numberMap[match];
            }).replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            }).replace(/,/g, '،');
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return arSa;

})));


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var arTn = moment.defineLocale('ar-tn', {
        months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
        monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
        weekdaysParseExact : true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm'
        },
        calendar: {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: 'في %s',
            past: 'منذ %s',
            s: 'ثوان',
            ss : '%d ثانية',
            m: 'دقيقة',
            mm: '%d دقائق',
            h: 'ساعة',
            hh: '%d ساعات',
            d: 'يوم',
            dd: '%d أيام',
            M: 'شهر',
            MM: '%d أشهر',
            y: 'سنة',
            yy: '%d سنوات'
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4 // The week that contains Jan 4th is the first week of the year.
        }
    });

    return arTn;

})));


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var suffixes = {
        1: '-inci',
        5: '-inci',
        8: '-inci',
        70: '-inci',
        80: '-inci',
        2: '-nci',
        7: '-nci',
        20: '-nci',
        50: '-nci',
        3: '-üncü',
        4: '-üncü',
        100: '-üncü',
        6: '-ncı',
        9: '-uncu',
        10: '-uncu',
        30: '-uncu',
        60: '-ıncı',
        90: '-ıncı'
    };

    var az = moment.defineLocale('az', {
        months : 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
        monthsShort : 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
        weekdays : 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
        weekdaysShort : 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
        weekdaysMin : 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[bugün saat] LT',
            nextDay : '[sabah saat] LT',
            nextWeek : '[gələn həftə] dddd [saat] LT',
            lastDay : '[dünən] LT',
            lastWeek : '[keçən həftə] dddd [saat] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s sonra',
            past : '%s əvvəl',
            s : 'birneçə saniyə',
            ss : '%d saniyə',
            m : 'bir dəqiqə',
            mm : '%d dəqiqə',
            h : 'bir saat',
            hh : '%d saat',
            d : 'bir gün',
            dd : '%d gün',
            M : 'bir ay',
            MM : '%d ay',
            y : 'bir il',
            yy : '%d il'
        },
        meridiemParse: /gecə|səhər|gündüz|axşam/,
        isPM : function (input) {
            return /^(gündüz|axşam)$/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'gecə';
            } else if (hour < 12) {
                return 'səhər';
            } else if (hour < 17) {
                return 'gündüz';
            } else {
                return 'axşam';
            }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
        ordinal : function (number) {
            if (number === 0) {  // special case for zero
                return number + '-ıncı';
            }
            var a = number % 10,
                b = number % 100 - a,
                c = number >= 100 ? 100 : null;
            return number + (suffixes[a] || suffixes[b] || suffixes[c]);
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return az;

})));


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function plural(word, num) {
        var forms = word.split('_');
        return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
    }
    function relativeTimeWithPlural(number, withoutSuffix, key) {
        var format = {
            'ss': withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
            'mm': withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
            'hh': withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
            'dd': 'дзень_дні_дзён',
            'MM': 'месяц_месяцы_месяцаў',
            'yy': 'год_гады_гадоў'
        };
        if (key === 'm') {
            return withoutSuffix ? 'хвіліна' : 'хвіліну';
        }
        else if (key === 'h') {
            return withoutSuffix ? 'гадзіна' : 'гадзіну';
        }
        else {
            return number + ' ' + plural(format[key], +number);
        }
    }

    var be = moment.defineLocale('be', {
        months : {
            format: 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split('_'),
            standalone: 'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split('_')
        },
        monthsShort : 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
        weekdays : {
            format: 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_'),
            standalone: 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
            isFormat: /\[ ?[Ууў] ?(?:мінулую|наступную)? ?\] ?dddd/
        },
        weekdaysShort : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
        weekdaysMin : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY г.',
            LLL : 'D MMMM YYYY г., HH:mm',
            LLLL : 'dddd, D MMMM YYYY г., HH:mm'
        },
        calendar : {
            sameDay: '[Сёння ў] LT',
            nextDay: '[Заўтра ў] LT',
            lastDay: '[Учора ў] LT',
            nextWeek: function () {
                return '[У] dddd [ў] LT';
            },
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                    case 3:
                    case 5:
                    case 6:
                        return '[У мінулую] dddd [ў] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[У мінулы] dddd [ў] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'праз %s',
            past : '%s таму',
            s : 'некалькі секунд',
            m : relativeTimeWithPlural,
            mm : relativeTimeWithPlural,
            h : relativeTimeWithPlural,
            hh : relativeTimeWithPlural,
            d : 'дзень',
            dd : relativeTimeWithPlural,
            M : 'месяц',
            MM : relativeTimeWithPlural,
            y : 'год',
            yy : relativeTimeWithPlural
        },
        meridiemParse: /ночы|раніцы|дня|вечара/,
        isPM : function (input) {
            return /^(дня|вечара)$/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'ночы';
            } else if (hour < 12) {
                return 'раніцы';
            } else if (hour < 17) {
                return 'дня';
            } else {
                return 'вечара';
            }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(і|ы|га)/,
        ordinal: function (number, period) {
            switch (period) {
                case 'M':
                case 'd':
                case 'DDD':
                case 'w':
                case 'W':
                    return (number % 10 === 2 || number % 10 === 3) && (number % 100 !== 12 && number % 100 !== 13) ? number + '-і' : number + '-ы';
                case 'D':
                    return number + '-га';
                default:
                    return number;
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return be;

})));


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var bg = moment.defineLocale('bg', {
        months : 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
        monthsShort : 'янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
        weekdays : 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
        weekdaysShort : 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
        weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'D.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY H:mm',
            LLLL : 'dddd, D MMMM YYYY H:mm'
        },
        calendar : {
            sameDay : '[Днес в] LT',
            nextDay : '[Утре в] LT',
            nextWeek : 'dddd [в] LT',
            lastDay : '[Вчера в] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                    case 3:
                    case 6:
                        return '[В изминалата] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[В изминалия] dddd [в] LT';
                }
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'след %s',
            past : 'преди %s',
            s : 'няколко секунди',
            ss : '%d секунди',
            m : 'минута',
            mm : '%d минути',
            h : 'час',
            hh : '%d часа',
            d : 'ден',
            dd : '%d дни',
            M : 'месец',
            MM : '%d месеца',
            y : 'година',
            yy : '%d години'
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
        ordinal : function (number) {
            var lastDigit = number % 10,
                last2Digits = number % 100;
            if (number === 0) {
                return number + '-ев';
            } else if (last2Digits === 0) {
                return number + '-ен';
            } else if (last2Digits > 10 && last2Digits < 20) {
                return number + '-ти';
            } else if (lastDigit === 1) {
                return number + '-ви';
            } else if (lastDigit === 2) {
                return number + '-ри';
            } else if (lastDigit === 7 || lastDigit === 8) {
                return number + '-ми';
            } else {
                return number + '-ти';
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return bg;

})));


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var bm = moment.defineLocale('bm', {
        months : 'Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_Mɛkalo_Zuwɛnkalo_Zuluyekalo_Utikalo_Sɛtanburukalo_ɔkutɔburukalo_Nowanburukalo_Desanburukalo'.split('_'),
        monthsShort : 'Zan_Few_Mar_Awi_Mɛ_Zuw_Zul_Uti_Sɛt_ɔku_Now_Des'.split('_'),
        weekdays : 'Kari_Ntɛnɛn_Tarata_Araba_Alamisa_Juma_Sibiri'.split('_'),
        weekdaysShort : 'Kar_Ntɛ_Tar_Ara_Ala_Jum_Sib'.split('_'),
        weekdaysMin : 'Ka_Nt_Ta_Ar_Al_Ju_Si'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'MMMM [tile] D [san] YYYY',
            LLL : 'MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm',
            LLLL : 'dddd MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm'
        },
        calendar : {
            sameDay : '[Bi lɛrɛ] LT',
            nextDay : '[Sini lɛrɛ] LT',
            nextWeek : 'dddd [don lɛrɛ] LT',
            lastDay : '[Kunu lɛrɛ] LT',
            lastWeek : 'dddd [tɛmɛnen lɛrɛ] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s kɔnɔ',
            past : 'a bɛ %s bɔ',
            s : 'sanga dama dama',
            ss : 'sekondi %d',
            m : 'miniti kelen',
            mm : 'miniti %d',
            h : 'lɛrɛ kelen',
            hh : 'lɛrɛ %d',
            d : 'tile kelen',
            dd : 'tile %d',
            M : 'kalo kelen',
            MM : 'kalo %d',
            y : 'san kelen',
            yy : 'san %d'
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return bm;

})));


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '১',
        '2': '২',
        '3': '৩',
        '4': '৪',
        '5': '৫',
        '6': '৬',
        '7': '৭',
        '8': '৮',
        '9': '৯',
        '0': '০'
    },
    numberMap = {
        '১': '1',
        '২': '2',
        '৩': '3',
        '৪': '4',
        '৫': '5',
        '৬': '6',
        '৭': '7',
        '৮': '8',
        '৯': '9',
        '০': '0'
    };

    var bn = moment.defineLocale('bn', {
        months : 'জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
        monthsShort : 'জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে'.split('_'),
        weekdays : 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
        weekdaysShort : 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
        weekdaysMin : 'রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি'.split('_'),
        longDateFormat : {
            LT : 'A h:mm সময়',
            LTS : 'A h:mm:ss সময়',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, A h:mm সময়',
            LLLL : 'dddd, D MMMM YYYY, A h:mm সময়'
        },
        calendar : {
            sameDay : '[আজ] LT',
            nextDay : '[আগামীকাল] LT',
            nextWeek : 'dddd, LT',
            lastDay : '[গতকাল] LT',
            lastWeek : '[গত] dddd, LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s পরে',
            past : '%s আগে',
            s : 'কয়েক সেকেন্ড',
            ss : '%d সেকেন্ড',
            m : 'এক মিনিট',
            mm : '%d মিনিট',
            h : 'এক ঘন্টা',
            hh : '%d ঘন্টা',
            d : 'এক দিন',
            dd : '%d দিন',
            M : 'এক মাস',
            MM : '%d মাস',
            y : 'এক বছর',
            yy : '%d বছর'
        },
        preparse: function (string) {
            return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if ((meridiem === 'রাত' && hour >= 4) ||
                    (meridiem === 'দুপুর' && hour < 5) ||
                    meridiem === 'বিকাল') {
                return hour + 12;
            } else {
                return hour;
            }
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'রাত';
            } else if (hour < 10) {
                return 'সকাল';
            } else if (hour < 17) {
                return 'দুপুর';
            } else if (hour < 20) {
                return 'বিকাল';
            } else {
                return 'রাত';
            }
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return bn;

})));


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '༡',
        '2': '༢',
        '3': '༣',
        '4': '༤',
        '5': '༥',
        '6': '༦',
        '7': '༧',
        '8': '༨',
        '9': '༩',
        '0': '༠'
    },
    numberMap = {
        '༡': '1',
        '༢': '2',
        '༣': '3',
        '༤': '4',
        '༥': '5',
        '༦': '6',
        '༧': '7',
        '༨': '8',
        '༩': '9',
        '༠': '0'
    };

    var bo = moment.defineLocale('bo', {
        months : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
        monthsShort : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
        weekdays : 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
        weekdaysShort : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
        weekdaysMin : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
        longDateFormat : {
            LT : 'A h:mm',
            LTS : 'A h:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, A h:mm',
            LLLL : 'dddd, D MMMM YYYY, A h:mm'
        },
        calendar : {
            sameDay : '[དི་རིང] LT',
            nextDay : '[སང་ཉིན] LT',
            nextWeek : '[བདུན་ཕྲག་རྗེས་མ], LT',
            lastDay : '[ཁ་སང] LT',
            lastWeek : '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s ལ་',
            past : '%s སྔན་ལ',
            s : 'ལམ་སང',
            ss : '%d སྐར་ཆ།',
            m : 'སྐར་མ་གཅིག',
            mm : '%d སྐར་མ',
            h : 'ཆུ་ཚོད་གཅིག',
            hh : '%d ཆུ་ཚོད',
            d : 'ཉིན་གཅིག',
            dd : '%d ཉིན་',
            M : 'ཟླ་བ་གཅིག',
            MM : '%d ཟླ་བ',
            y : 'ལོ་གཅིག',
            yy : '%d ལོ'
        },
        preparse: function (string) {
            return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if ((meridiem === 'མཚན་མོ' && hour >= 4) ||
                    (meridiem === 'ཉིན་གུང' && hour < 5) ||
                    meridiem === 'དགོང་དག') {
                return hour + 12;
            } else {
                return hour;
            }
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'མཚན་མོ';
            } else if (hour < 10) {
                return 'ཞོགས་ཀས';
            } else if (hour < 17) {
                return 'ཉིན་གུང';
            } else if (hour < 20) {
                return 'དགོང་དག';
            } else {
                return 'མཚན་མོ';
            }
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return bo;

})));


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function relativeTimeWithMutation(number, withoutSuffix, key) {
        var format = {
            'mm': 'munutenn',
            'MM': 'miz',
            'dd': 'devezh'
        };
        return number + ' ' + mutation(format[key], number);
    }
    function specialMutationForYears(number) {
        switch (lastNumber(number)) {
            case 1:
            case 3:
            case 4:
            case 5:
            case 9:
                return number + ' bloaz';
            default:
                return number + ' vloaz';
        }
    }
    function lastNumber(number) {
        if (number > 9) {
            return lastNumber(number % 10);
        }
        return number;
    }
    function mutation(text, number) {
        if (number === 2) {
            return softMutation(text);
        }
        return text;
    }
    function softMutation(text) {
        var mutationTable = {
            'm': 'v',
            'b': 'v',
            'd': 'z'
        };
        if (mutationTable[text.charAt(0)] === undefined) {
            return text;
        }
        return mutationTable[text.charAt(0)] + text.substring(1);
    }

    var br = moment.defineLocale('br', {
        months : 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
        monthsShort : 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
        weekdays : 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
        weekdaysShort : 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
        weekdaysMin : 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'h[e]mm A',
            LTS : 'h[e]mm:ss A',
            L : 'DD/MM/YYYY',
            LL : 'D [a viz] MMMM YYYY',
            LLL : 'D [a viz] MMMM YYYY h[e]mm A',
            LLLL : 'dddd, D [a viz] MMMM YYYY h[e]mm A'
        },
        calendar : {
            sameDay : '[Hiziv da] LT',
            nextDay : '[Warc\'hoazh da] LT',
            nextWeek : 'dddd [da] LT',
            lastDay : '[Dec\'h da] LT',
            lastWeek : 'dddd [paset da] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'a-benn %s',
            past : '%s \'zo',
            s : 'un nebeud segondennoù',
            ss : '%d eilenn',
            m : 'ur vunutenn',
            mm : relativeTimeWithMutation,
            h : 'un eur',
            hh : '%d eur',
            d : 'un devezh',
            dd : relativeTimeWithMutation,
            M : 'ur miz',
            MM : relativeTimeWithMutation,
            y : 'ur bloaz',
            yy : specialMutationForYears
        },
        dayOfMonthOrdinalParse: /\d{1,2}(añ|vet)/,
        ordinal : function (number) {
            var output = (number === 1) ? 'añ' : 'vet';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return br;

})));


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function translate(number, withoutSuffix, key) {
        var result = number + ' ';
        switch (key) {
            case 'ss':
                if (number === 1) {
                    result += 'sekunda';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'sekunde';
                } else {
                    result += 'sekundi';
                }
                return result;
            case 'm':
                return withoutSuffix ? 'jedna minuta' : 'jedne minute';
            case 'mm':
                if (number === 1) {
                    result += 'minuta';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'minute';
                } else {
                    result += 'minuta';
                }
                return result;
            case 'h':
                return withoutSuffix ? 'jedan sat' : 'jednog sata';
            case 'hh':
                if (number === 1) {
                    result += 'sat';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'sata';
                } else {
                    result += 'sati';
                }
                return result;
            case 'dd':
                if (number === 1) {
                    result += 'dan';
                } else {
                    result += 'dana';
                }
                return result;
            case 'MM':
                if (number === 1) {
                    result += 'mjesec';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'mjeseca';
                } else {
                    result += 'mjeseci';
                }
                return result;
            case 'yy':
                if (number === 1) {
                    result += 'godina';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'godine';
                } else {
                    result += 'godina';
                }
                return result;
        }
    }

    var bs = moment.defineLocale('bs', {
        months : 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
        monthsShort : 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
        monthsParseExact: true,
        weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
        weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
        weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay  : '[danas u] LT',
            nextDay  : '[sutra u] LT',
            nextWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[u] [nedjelju] [u] LT';
                    case 3:
                        return '[u] [srijedu] [u] LT';
                    case 6:
                        return '[u] [subotu] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[u] dddd [u] LT';
                }
            },
            lastDay  : '[jučer u] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                    case 3:
                        return '[prošlu] dddd [u] LT';
                    case 6:
                        return '[prošle] [subote] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[prošli] dddd [u] LT';
                }
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'za %s',
            past   : 'prije %s',
            s      : 'par sekundi',
            ss     : translate,
            m      : translate,
            mm     : translate,
            h      : translate,
            hh     : translate,
            d      : 'dan',
            dd     : translate,
            M      : 'mjesec',
            MM     : translate,
            y      : 'godinu',
            yy     : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return bs;

})));


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var ca = moment.defineLocale('ca', {
        months : {
            standalone: 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
            format: 'de gener_de febrer_de març_d\'abril_de maig_de juny_de juliol_d\'agost_de setembre_d\'octubre_de novembre_de desembre'.split('_'),
            isFormat: /D[oD]?(\s)+MMMM/
        },
        monthsShort : 'gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.'.split('_'),
        monthsParseExact : true,
        weekdays : 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
        weekdaysShort : 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
        weekdaysMin : 'dg_dl_dt_dc_dj_dv_ds'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM [de] YYYY',
            ll : 'D MMM YYYY',
            LLL : 'D MMMM [de] YYYY [a les] H:mm',
            lll : 'D MMM YYYY, H:mm',
            LLLL : 'dddd D MMMM [de] YYYY [a les] H:mm',
            llll : 'ddd D MMM YYYY, H:mm'
        },
        calendar : {
            sameDay : function () {
                return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            nextDay : function () {
                return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            nextWeek : function () {
                return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            lastDay : function () {
                return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            lastWeek : function () {
                return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'd\'aquí %s',
            past : 'fa %s',
            s : 'uns segons',
            ss : '%d segons',
            m : 'un minut',
            mm : '%d minuts',
            h : 'una hora',
            hh : '%d hores',
            d : 'un dia',
            dd : '%d dies',
            M : 'un mes',
            MM : '%d mesos',
            y : 'un any',
            yy : '%d anys'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
        ordinal : function (number, period) {
            var output = (number === 1) ? 'r' :
                (number === 2) ? 'n' :
                (number === 3) ? 'r' :
                (number === 4) ? 't' : 'è';
            if (period === 'w' || period === 'W') {
                output = 'a';
            }
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return ca;

})));


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_'),
        monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');

    var monthsParse = [/^led/i, /^úno/i, /^bře/i, /^dub/i, /^kvě/i, /^(čvn|červen$|června)/i, /^(čvc|červenec|července)/i, /^srp/i, /^zář/i, /^říj/i, /^lis/i, /^pro/i];
    // NOTE: 'červen' is substring of 'červenec'; therefore 'červenec' must precede 'červen' in the regex to be fully matched.
    // Otherwise parser matches '1. červenec' as '1. červen' + 'ec'.
    var monthsRegex = /^(leden|únor|březen|duben|květen|červenec|července|červen|června|srpen|září|říjen|listopad|prosinec|led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i;

    function plural(n) {
        return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
    }
    function translate(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':  // a few seconds / in a few seconds / a few seconds ago
                return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
            case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'sekundy' : 'sekund');
                } else {
                    return result + 'sekundami';
                }
                break;
            case 'm':  // a minute / in a minute / a minute ago
                return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
            case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'minuty' : 'minut');
                } else {
                    return result + 'minutami';
                }
                break;
            case 'h':  // an hour / in an hour / an hour ago
                return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
            case 'hh': // 9 hours / in 9 hours / 9 hours ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'hodiny' : 'hodin');
                } else {
                    return result + 'hodinami';
                }
                break;
            case 'd':  // a day / in a day / a day ago
                return (withoutSuffix || isFuture) ? 'den' : 'dnem';
            case 'dd': // 9 days / in 9 days / 9 days ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'dny' : 'dní');
                } else {
                    return result + 'dny';
                }
                break;
            case 'M':  // a month / in a month / a month ago
                return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
            case 'MM': // 9 months / in 9 months / 9 months ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'měsíce' : 'měsíců');
                } else {
                    return result + 'měsíci';
                }
                break;
            case 'y':  // a year / in a year / a year ago
                return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
            case 'yy': // 9 years / in 9 years / 9 years ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'roky' : 'let');
                } else {
                    return result + 'lety';
                }
                break;
        }
    }

    var cs = moment.defineLocale('cs', {
        months : months,
        monthsShort : monthsShort,
        monthsRegex : monthsRegex,
        monthsShortRegex : monthsRegex,
        // NOTE: 'červen' is substring of 'červenec'; therefore 'červenec' must precede 'červen' in the regex to be fully matched.
        // Otherwise parser matches '1. červenec' as '1. červen' + 'ec'.
        monthsStrictRegex : /^(leden|ledna|února|únor|březen|března|duben|dubna|květen|května|červenec|července|červen|června|srpen|srpna|září|říjen|října|listopadu|listopad|prosinec|prosince)/i,
        monthsShortStrictRegex : /^(led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i,
        monthsParse : monthsParse,
        longMonthsParse : monthsParse,
        shortMonthsParse : monthsParse,
        weekdays : 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
        weekdaysShort : 'ne_po_út_st_čt_pá_so'.split('_'),
        weekdaysMin : 'ne_po_út_st_čt_pá_so'.split('_'),
        longDateFormat : {
            LT: 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd D. MMMM YYYY H:mm',
            l : 'D. M. YYYY'
        },
        calendar : {
            sameDay: '[dnes v] LT',
            nextDay: '[zítra v] LT',
            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[v neděli v] LT';
                    case 1:
                    case 2:
                        return '[v] dddd [v] LT';
                    case 3:
                        return '[ve středu v] LT';
                    case 4:
                        return '[ve čtvrtek v] LT';
                    case 5:
                        return '[v pátek v] LT';
                    case 6:
                        return '[v sobotu v] LT';
                }
            },
            lastDay: '[včera v] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[minulou neděli v] LT';
                    case 1:
                    case 2:
                        return '[minulé] dddd [v] LT';
                    case 3:
                        return '[minulou středu v] LT';
                    case 4:
                    case 5:
                        return '[minulý] dddd [v] LT';
                    case 6:
                        return '[minulou sobotu v] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'za %s',
            past : 'před %s',
            s : translate,
            ss : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        dayOfMonthOrdinalParse : /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return cs;

})));


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var cv = moment.defineLocale('cv', {
        months : 'кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав'.split('_'),
        monthsShort : 'кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш'.split('_'),
        weekdays : 'вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун'.split('_'),
        weekdaysShort : 'выр_тун_ытл_юн_кӗҫ_эрн_шӑм'.split('_'),
        weekdaysMin : 'вр_тн_ыт_юн_кҫ_эр_шм'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD-MM-YYYY',
            LL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]',
            LLL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
            LLLL : 'dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm'
        },
        calendar : {
            sameDay: '[Паян] LT [сехетре]',
            nextDay: '[Ыран] LT [сехетре]',
            lastDay: '[Ӗнер] LT [сехетре]',
            nextWeek: '[Ҫитес] dddd LT [сехетре]',
            lastWeek: '[Иртнӗ] dddd LT [сехетре]',
            sameElse: 'L'
        },
        relativeTime : {
            future : function (output) {
                var affix = /сехет$/i.exec(output) ? 'рен' : /ҫул$/i.exec(output) ? 'тан' : 'ран';
                return output + affix;
            },
            past : '%s каялла',
            s : 'пӗр-ик ҫеккунт',
            ss : '%d ҫеккунт',
            m : 'пӗр минут',
            mm : '%d минут',
            h : 'пӗр сехет',
            hh : '%d сехет',
            d : 'пӗр кун',
            dd : '%d кун',
            M : 'пӗр уйӑх',
            MM : '%d уйӑх',
            y : 'пӗр ҫул',
            yy : '%d ҫул'
        },
        dayOfMonthOrdinalParse: /\d{1,2}-мӗш/,
        ordinal : '%d-мӗш',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return cv;

})));


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var cy = moment.defineLocale('cy', {
        months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
        monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
        weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
        weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
        weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
        weekdaysParseExact : true,
        // time formats are the same as en-gb
        longDateFormat: {
            LT: 'HH:mm',
            LTS : 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm'
        },
        calendar: {
            sameDay: '[Heddiw am] LT',
            nextDay: '[Yfory am] LT',
            nextWeek: 'dddd [am] LT',
            lastDay: '[Ddoe am] LT',
            lastWeek: 'dddd [diwethaf am] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: 'mewn %s',
            past: '%s yn ôl',
            s: 'ychydig eiliadau',
            ss: '%d eiliad',
            m: 'munud',
            mm: '%d munud',
            h: 'awr',
            hh: '%d awr',
            d: 'diwrnod',
            dd: '%d diwrnod',
            M: 'mis',
            MM: '%d mis',
            y: 'blwyddyn',
            yy: '%d flynedd'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
        // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
        ordinal: function (number) {
            var b = number,
                output = '',
                lookup = [
                    '', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
                    'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
                ];
            if (b > 20) {
                if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
                    output = 'fed'; // not 30ain, 70ain or 90ain
                } else {
                    output = 'ain';
                }
            } else if (b > 0) {
                output = lookup[b];
            }
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return cy;

})));


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var da = moment.defineLocale('da', {
        months : 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
        monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
        weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
        weekdaysShort : 'søn_man_tir_ons_tor_fre_lør'.split('_'),
        weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY HH:mm',
            LLLL : 'dddd [d.] D. MMMM YYYY [kl.] HH:mm'
        },
        calendar : {
            sameDay : '[i dag kl.] LT',
            nextDay : '[i morgen kl.] LT',
            nextWeek : 'på dddd [kl.] LT',
            lastDay : '[i går kl.] LT',
            lastWeek : '[i] dddd[s kl.] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'om %s',
            past : '%s siden',
            s : 'få sekunder',
            ss : '%d sekunder',
            m : 'et minut',
            mm : '%d minutter',
            h : 'en time',
            hh : '%d timer',
            d : 'en dag',
            dd : '%d dage',
            M : 'en måned',
            MM : '%d måneder',
            y : 'et år',
            yy : '%d år'
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return da;

})));


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            'm': ['eine Minute', 'einer Minute'],
            'h': ['eine Stunde', 'einer Stunde'],
            'd': ['ein Tag', 'einem Tag'],
            'dd': [number + ' Tage', number + ' Tagen'],
            'M': ['ein Monat', 'einem Monat'],
            'MM': [number + ' Monate', number + ' Monaten'],
            'y': ['ein Jahr', 'einem Jahr'],
            'yy': [number + ' Jahre', number + ' Jahren']
        };
        return withoutSuffix ? format[key][0] : format[key][1];
    }

    var de = moment.defineLocale('de', {
        months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
        monthsShort : 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
        monthsParseExact : true,
        weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
        weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
        weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY HH:mm',
            LLLL : 'dddd, D. MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]'
        },
        relativeTime : {
            future : 'in %s',
            past : 'vor %s',
            s : 'ein paar Sekunden',
            ss : '%d Sekunden',
            m : processRelativeTime,
            mm : '%d Minuten',
            h : processRelativeTime,
            hh : '%d Stunden',
            d : processRelativeTime,
            dd : processRelativeTime,
            M : processRelativeTime,
            MM : processRelativeTime,
            y : processRelativeTime,
            yy : processRelativeTime
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return de;

})));


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            'm': ['eine Minute', 'einer Minute'],
            'h': ['eine Stunde', 'einer Stunde'],
            'd': ['ein Tag', 'einem Tag'],
            'dd': [number + ' Tage', number + ' Tagen'],
            'M': ['ein Monat', 'einem Monat'],
            'MM': [number + ' Monate', number + ' Monaten'],
            'y': ['ein Jahr', 'einem Jahr'],
            'yy': [number + ' Jahre', number + ' Jahren']
        };
        return withoutSuffix ? format[key][0] : format[key][1];
    }

    var deAt = moment.defineLocale('de-at', {
        months : 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
        monthsShort : 'Jän._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
        monthsParseExact : true,
        weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
        weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
        weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY HH:mm',
            LLLL : 'dddd, D. MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]'
        },
        relativeTime : {
            future : 'in %s',
            past : 'vor %s',
            s : 'ein paar Sekunden',
            ss : '%d Sekunden',
            m : processRelativeTime,
            mm : '%d Minuten',
            h : processRelativeTime,
            hh : '%d Stunden',
            d : processRelativeTime,
            dd : processRelativeTime,
            M : processRelativeTime,
            MM : processRelativeTime,
            y : processRelativeTime,
            yy : processRelativeTime
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return deAt;

})));


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            'm': ['eine Minute', 'einer Minute'],
            'h': ['eine Stunde', 'einer Stunde'],
            'd': ['ein Tag', 'einem Tag'],
            'dd': [number + ' Tage', number + ' Tagen'],
            'M': ['ein Monat', 'einem Monat'],
            'MM': [number + ' Monate', number + ' Monaten'],
            'y': ['ein Jahr', 'einem Jahr'],
            'yy': [number + ' Jahre', number + ' Jahren']
        };
        return withoutSuffix ? format[key][0] : format[key][1];
    }

    var deCh = moment.defineLocale('de-ch', {
        months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
        monthsShort : 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
        monthsParseExact : true,
        weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
        weekdaysShort : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
        weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY HH:mm',
            LLLL : 'dddd, D. MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]'
        },
        relativeTime : {
            future : 'in %s',
            past : 'vor %s',
            s : 'ein paar Sekunden',
            ss : '%d Sekunden',
            m : processRelativeTime,
            mm : '%d Minuten',
            h : processRelativeTime,
            hh : '%d Stunden',
            d : processRelativeTime,
            dd : processRelativeTime,
            M : processRelativeTime,
            MM : processRelativeTime,
            y : processRelativeTime,
            yy : processRelativeTime
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return deCh;

})));


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var months = [
        'ޖެނުއަރީ',
        'ފެބްރުއަރީ',
        'މާރިޗު',
        'އޭޕްރީލު',
        'މޭ',
        'ޖޫން',
        'ޖުލައި',
        'އޯގަސްޓު',
        'ސެޕްޓެމްބަރު',
        'އޮކްޓޯބަރު',
        'ނޮވެމްބަރު',
        'ޑިސެމްބަރު'
    ], weekdays = [
        'އާދިއްތަ',
        'ހޯމަ',
        'އަންގާރަ',
        'ބުދަ',
        'ބުރާސްފަތި',
        'ހުކުރު',
        'ހޮނިހިރު'
    ];

    var dv = moment.defineLocale('dv', {
        months : months,
        monthsShort : months,
        weekdays : weekdays,
        weekdaysShort : weekdays,
        weekdaysMin : 'އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި'.split('_'),
        longDateFormat : {

            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'D/M/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        meridiemParse: /މކ|މފ/,
        isPM : function (input) {
            return 'މފ' === input;
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'މކ';
            } else {
                return 'މފ';
            }
        },
        calendar : {
            sameDay : '[މިއަދު] LT',
            nextDay : '[މާދަމާ] LT',
            nextWeek : 'dddd LT',
            lastDay : '[އިއްޔެ] LT',
            lastWeek : '[ފާއިތުވި] dddd LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'ތެރޭގައި %s',
            past : 'ކުރިން %s',
            s : 'ސިކުންތުކޮޅެއް',
            ss : 'd% ސިކުންތު',
            m : 'މިނިޓެއް',
            mm : 'މިނިޓު %d',
            h : 'ގަޑިއިރެއް',
            hh : 'ގަޑިއިރު %d',
            d : 'ދުވަހެއް',
            dd : 'ދުވަސް %d',
            M : 'މަހެއް',
            MM : 'މަސް %d',
            y : 'އަހަރެއް',
            yy : 'އަހަރު %d'
        },
        preparse: function (string) {
            return string.replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/,/g, '،');
        },
        week : {
            dow : 7,  // Sunday is the first day of the week.
            doy : 12  // The week that contains Jan 12th is the first week of the year.
        }
    });

    return dv;

})));


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }


    var el = moment.defineLocale('el', {
        monthsNominativeEl : 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
        monthsGenitiveEl : 'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split('_'),
        months : function (momentToFormat, format) {
            if (!momentToFormat) {
                return this._monthsNominativeEl;
            } else if (typeof format === 'string' && /D/.test(format.substring(0, format.indexOf('MMMM')))) { // if there is a day number before 'MMMM'
                return this._monthsGenitiveEl[momentToFormat.month()];
            } else {
                return this._monthsNominativeEl[momentToFormat.month()];
            }
        },
        monthsShort : 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
        weekdays : 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
        weekdaysShort : 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
        weekdaysMin : 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'μμ' : 'ΜΜ';
            } else {
                return isLower ? 'πμ' : 'ΠΜ';
            }
        },
        isPM : function (input) {
            return ((input + '').toLowerCase()[0] === 'μ');
        },
        meridiemParse : /[ΠΜ]\.?Μ?\.?/i,
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY h:mm A',
            LLLL : 'dddd, D MMMM YYYY h:mm A'
        },
        calendarEl : {
            sameDay : '[Σήμερα {}] LT',
            nextDay : '[Αύριο {}] LT',
            nextWeek : 'dddd [{}] LT',
            lastDay : '[Χθες {}] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 6:
                        return '[το προηγούμενο] dddd [{}] LT';
                    default:
                        return '[την προηγούμενη] dddd [{}] LT';
                }
            },
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendarEl[key],
                hours = mom && mom.hours();
            if (isFunction(output)) {
                output = output.apply(mom);
            }
            return output.replace('{}', (hours % 12 === 1 ? 'στη' : 'στις'));
        },
        relativeTime : {
            future : 'σε %s',
            past : '%s πριν',
            s : 'λίγα δευτερόλεπτα',
            ss : '%d δευτερόλεπτα',
            m : 'ένα λεπτό',
            mm : '%d λεπτά',
            h : 'μία ώρα',
            hh : '%d ώρες',
            d : 'μία μέρα',
            dd : '%d μέρες',
            M : 'ένας μήνας',
            MM : '%d μήνες',
            y : 'ένας χρόνος',
            yy : '%d χρόνια'
        },
        dayOfMonthOrdinalParse: /\d{1,2}η/,
        ordinal: '%dη',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4st is the first week of the year.
        }
    });

    return el;

})));


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var enSG = moment.defineLocale('en-SG', {
        months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            ss : '%d seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return enSG;

})));


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var enAu = moment.defineLocale('en-au', {
        months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY h:mm A',
            LLLL : 'dddd, D MMMM YYYY h:mm A'
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            ss : '%d seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return enAu;

})));


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var enCa = moment.defineLocale('en-ca', {
        months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'YYYY-MM-DD',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY h:mm A',
            LLLL : 'dddd, MMMM D, YYYY h:mm A'
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            ss : '%d seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    return enCa;

})));


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var enGb = moment.defineLocale('en-gb', {
        months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            ss : '%d seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return enGb;

})));


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var enIe = moment.defineLocale('en-ie', {
        months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            ss : '%d seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return enIe;

})));


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var enIl = moment.defineLocale('en-il', {
        months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    return enIl;

})));


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var enNz = moment.defineLocale('en-nz', {
        months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY h:mm A',
            LLLL : 'dddd, D MMMM YYYY h:mm A'
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            ss : '%d seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return enNz;

})));


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var eo = moment.defineLocale('eo', {
        months : 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
        monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
        weekdays : 'dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato'.split('_'),
        weekdaysShort : 'dim_lun_mard_merk_ĵaŭ_ven_sab'.split('_'),
        weekdaysMin : 'di_lu_ma_me_ĵa_ve_sa'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY-MM-DD',
            LL : 'D[-a de] MMMM, YYYY',
            LLL : 'D[-a de] MMMM, YYYY HH:mm',
            LLLL : 'dddd, [la] D[-a de] MMMM, YYYY HH:mm'
        },
        meridiemParse: /[ap]\.t\.m/i,
        isPM: function (input) {
            return input.charAt(0).toLowerCase() === 'p';
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'p.t.m.' : 'P.T.M.';
            } else {
                return isLower ? 'a.t.m.' : 'A.T.M.';
            }
        },
        calendar : {
            sameDay : '[Hodiaŭ je] LT',
            nextDay : '[Morgaŭ je] LT',
            nextWeek : 'dddd [je] LT',
            lastDay : '[Hieraŭ je] LT',
            lastWeek : '[pasinta] dddd [je] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'post %s',
            past : 'antaŭ %s',
            s : 'sekundoj',
            ss : '%d sekundoj',
            m : 'minuto',
            mm : '%d minutoj',
            h : 'horo',
            hh : '%d horoj',
            d : 'tago',//ne 'diurno', ĉar estas uzita por proksimumo
            dd : '%d tagoj',
            M : 'monato',
            MM : '%d monatoj',
            y : 'jaro',
            yy : '%d jaroj'
        },
        dayOfMonthOrdinalParse: /\d{1,2}a/,
        ordinal : '%da',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return eo;

})));


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
        monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

    var monthsParse = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
    var monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

    var es = moment.defineLocale('es', {
        months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
        monthsShort : function (m, format) {
            if (!m) {
                return monthsShortDot;
            } else if (/-MMM-/.test(format)) {
                return monthsShort[m.month()];
            } else {
                return monthsShortDot[m.month()];
            }
        },
        monthsRegex : monthsRegex,
        monthsShortRegex : monthsRegex,
        monthsStrictRegex : /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
        monthsShortStrictRegex : /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
        monthsParse : monthsParse,
        longMonthsParse : monthsParse,
        shortMonthsParse : monthsParse,
        weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
        weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
        weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY H:mm',
            LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
        },
        calendar : {
            sameDay : function () {
                return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextDay : function () {
                return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextWeek : function () {
                return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastDay : function () {
                return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastWeek : function () {
                return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'en %s',
            past : 'hace %s',
            s : 'unos segundos',
            ss : '%d segundos',
            m : 'un minuto',
            mm : '%d minutos',
            h : 'una hora',
            hh : '%d horas',
            d : 'un día',
            dd : '%d días',
            M : 'un mes',
            MM : '%d meses',
            y : 'un año',
            yy : '%d años'
        },
        dayOfMonthOrdinalParse : /\d{1,2}º/,
        ordinal : '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return es;

})));


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
        monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

    var monthsParse = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
    var monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

    var esDo = moment.defineLocale('es-do', {
        months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
        monthsShort : function (m, format) {
            if (!m) {
                return monthsShortDot;
            } else if (/-MMM-/.test(format)) {
                return monthsShort[m.month()];
            } else {
                return monthsShortDot[m.month()];
            }
        },
        monthsRegex: monthsRegex,
        monthsShortRegex: monthsRegex,
        monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
        monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
        monthsParse: monthsParse,
        longMonthsParse: monthsParse,
        shortMonthsParse: monthsParse,
        weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
        weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
        weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY h:mm A',
            LLLL : 'dddd, D [de] MMMM [de] YYYY h:mm A'
        },
        calendar : {
            sameDay : function () {
                return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextDay : function () {
                return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextWeek : function () {
                return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastDay : function () {
                return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastWeek : function () {
                return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'en %s',
            past : 'hace %s',
            s : 'unos segundos',
            ss : '%d segundos',
            m : 'un minuto',
            mm : '%d minutos',
            h : 'una hora',
            hh : '%d horas',
            d : 'un día',
            dd : '%d días',
            M : 'un mes',
            MM : '%d meses',
            y : 'un año',
            yy : '%d años'
        },
        dayOfMonthOrdinalParse : /\d{1,2}º/,
        ordinal : '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return esDo;

})));


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
        monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

    var monthsParse = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
    var monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

    var esUs = moment.defineLocale('es-us', {
        months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
        monthsShort : function (m, format) {
            if (!m) {
                return monthsShortDot;
            } else if (/-MMM-/.test(format)) {
                return monthsShort[m.month()];
            } else {
                return monthsShortDot[m.month()];
            }
        },
        monthsRegex: monthsRegex,
        monthsShortRegex: monthsRegex,
        monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
        monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
        monthsParse: monthsParse,
        longMonthsParse: monthsParse,
        shortMonthsParse: monthsParse,
        weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
        weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
        weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'MM/DD/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY h:mm A',
            LLLL : 'dddd, D [de] MMMM [de] YYYY h:mm A'
        },
        calendar : {
            sameDay : function () {
                return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextDay : function () {
                return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextWeek : function () {
                return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastDay : function () {
                return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastWeek : function () {
                return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'en %s',
            past : 'hace %s',
            s : 'unos segundos',
            ss : '%d segundos',
            m : 'un minuto',
            mm : '%d minutos',
            h : 'una hora',
            hh : '%d horas',
            d : 'un día',
            dd : '%d días',
            M : 'un mes',
            MM : '%d meses',
            y : 'un año',
            yy : '%d años'
        },
        dayOfMonthOrdinalParse : /\d{1,2}º/,
        ordinal : '%dº',
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return esUs;

})));


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            's' : ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
            'ss': [number + 'sekundi', number + 'sekundit'],
            'm' : ['ühe minuti', 'üks minut'],
            'mm': [number + ' minuti', number + ' minutit'],
            'h' : ['ühe tunni', 'tund aega', 'üks tund'],
            'hh': [number + ' tunni', number + ' tundi'],
            'd' : ['ühe päeva', 'üks päev'],
            'M' : ['kuu aja', 'kuu aega', 'üks kuu'],
            'MM': [number + ' kuu', number + ' kuud'],
            'y' : ['ühe aasta', 'aasta', 'üks aasta'],
            'yy': [number + ' aasta', number + ' aastat']
        };
        if (withoutSuffix) {
            return format[key][2] ? format[key][2] : format[key][1];
        }
        return isFuture ? format[key][0] : format[key][1];
    }

    var et = moment.defineLocale('et', {
        months        : 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
        monthsShort   : 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
        weekdays      : 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
        weekdaysShort : 'P_E_T_K_N_R_L'.split('_'),
        weekdaysMin   : 'P_E_T_K_N_R_L'.split('_'),
        longDateFormat : {
            LT   : 'H:mm',
            LTS : 'H:mm:ss',
            L    : 'DD.MM.YYYY',
            LL   : 'D. MMMM YYYY',
            LLL  : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay  : '[Täna,] LT',
            nextDay  : '[Homme,] LT',
            nextWeek : '[Järgmine] dddd LT',
            lastDay  : '[Eile,] LT',
            lastWeek : '[Eelmine] dddd LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s pärast',
            past   : '%s tagasi',
            s      : processRelativeTime,
            ss     : processRelativeTime,
            m      : processRelativeTime,
            mm     : processRelativeTime,
            h      : processRelativeTime,
            hh     : processRelativeTime,
            d      : processRelativeTime,
            dd     : '%d päeva',
            M      : processRelativeTime,
            MM     : processRelativeTime,
            y      : processRelativeTime,
            yy     : processRelativeTime
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return et;

})));


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var eu = moment.defineLocale('eu', {
        months : 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
        monthsShort : 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
        monthsParseExact : true,
        weekdays : 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
        weekdaysShort : 'ig._al._ar._az._og._ol._lr.'.split('_'),
        weekdaysMin : 'ig_al_ar_az_og_ol_lr'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY-MM-DD',
            LL : 'YYYY[ko] MMMM[ren] D[a]',
            LLL : 'YYYY[ko] MMMM[ren] D[a] HH:mm',
            LLLL : 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
            l : 'YYYY-M-D',
            ll : 'YYYY[ko] MMM D[a]',
            lll : 'YYYY[ko] MMM D[a] HH:mm',
            llll : 'ddd, YYYY[ko] MMM D[a] HH:mm'
        },
        calendar : {
            sameDay : '[gaur] LT[etan]',
            nextDay : '[bihar] LT[etan]',
            nextWeek : 'dddd LT[etan]',
            lastDay : '[atzo] LT[etan]',
            lastWeek : '[aurreko] dddd LT[etan]',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s barru',
            past : 'duela %s',
            s : 'segundo batzuk',
            ss : '%d segundo',
            m : 'minutu bat',
            mm : '%d minutu',
            h : 'ordu bat',
            hh : '%d ordu',
            d : 'egun bat',
            dd : '%d egun',
            M : 'hilabete bat',
            MM : '%d hilabete',
            y : 'urte bat',
            yy : '%d urte'
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return eu;

})));


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '۱',
        '2': '۲',
        '3': '۳',
        '4': '۴',
        '5': '۵',
        '6': '۶',
        '7': '۷',
        '8': '۸',
        '9': '۹',
        '0': '۰'
    }, numberMap = {
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9',
        '۰': '0'
    };

    var fa = moment.defineLocale('fa', {
        months : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
        monthsShort : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
        weekdays : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
        weekdaysShort : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
        weekdaysMin : 'ی_د_س_چ_پ_ج_ش'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        meridiemParse: /قبل از ظهر|بعد از ظهر/,
        isPM: function (input) {
            return /بعد از ظهر/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'قبل از ظهر';
            } else {
                return 'بعد از ظهر';
            }
        },
        calendar : {
            sameDay : '[امروز ساعت] LT',
            nextDay : '[فردا ساعت] LT',
            nextWeek : 'dddd [ساعت] LT',
            lastDay : '[دیروز ساعت] LT',
            lastWeek : 'dddd [پیش] [ساعت] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'در %s',
            past : '%s پیش',
            s : 'چند ثانیه',
            ss : 'ثانیه d%',
            m : 'یک دقیقه',
            mm : '%d دقیقه',
            h : 'یک ساعت',
            hh : '%d ساعت',
            d : 'یک روز',
            dd : '%d روز',
            M : 'یک ماه',
            MM : '%d ماه',
            y : 'یک سال',
            yy : '%d سال'
        },
        preparse: function (string) {
            return string.replace(/[۰-۹]/g, function (match) {
                return numberMap[match];
            }).replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            }).replace(/,/g, '،');
        },
        dayOfMonthOrdinalParse: /\d{1,2}م/,
        ordinal : '%dم',
        week : {
            dow : 6, // Saturday is the first day of the week.
            doy : 12 // The week that contains Jan 12th is the first week of the year.
        }
    });

    return fa;

})));


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' '),
        numbersFuture = [
            'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
            numbersPast[7], numbersPast[8], numbersPast[9]
        ];
    function translate(number, withoutSuffix, key, isFuture) {
        var result = '';
        switch (key) {
            case 's':
                return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
            case 'ss':
                return isFuture ? 'sekunnin' : 'sekuntia';
            case 'm':
                return isFuture ? 'minuutin' : 'minuutti';
            case 'mm':
                result = isFuture ? 'minuutin' : 'minuuttia';
                break;
            case 'h':
                return isFuture ? 'tunnin' : 'tunti';
            case 'hh':
                result = isFuture ? 'tunnin' : 'tuntia';
                break;
            case 'd':
                return isFuture ? 'päivän' : 'päivä';
            case 'dd':
                result = isFuture ? 'päivän' : 'päivää';
                break;
            case 'M':
                return isFuture ? 'kuukauden' : 'kuukausi';
            case 'MM':
                result = isFuture ? 'kuukauden' : 'kuukautta';
                break;
            case 'y':
                return isFuture ? 'vuoden' : 'vuosi';
            case 'yy':
                result = isFuture ? 'vuoden' : 'vuotta';
                break;
        }
        result = verbalNumber(number, isFuture) + ' ' + result;
        return result;
    }
    function verbalNumber(number, isFuture) {
        return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
    }

    var fi = moment.defineLocale('fi', {
        months : 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
        monthsShort : 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
        weekdays : 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
        weekdaysShort : 'su_ma_ti_ke_to_pe_la'.split('_'),
        weekdaysMin : 'su_ma_ti_ke_to_pe_la'.split('_'),
        longDateFormat : {
            LT : 'HH.mm',
            LTS : 'HH.mm.ss',
            L : 'DD.MM.YYYY',
            LL : 'Do MMMM[ta] YYYY',
            LLL : 'Do MMMM[ta] YYYY, [klo] HH.mm',
            LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
            l : 'D.M.YYYY',
            ll : 'Do MMM YYYY',
            lll : 'Do MMM YYYY, [klo] HH.mm',
            llll : 'ddd, Do MMM YYYY, [klo] HH.mm'
        },
        calendar : {
            sameDay : '[tänään] [klo] LT',
            nextDay : '[huomenna] [klo] LT',
            nextWeek : 'dddd [klo] LT',
            lastDay : '[eilen] [klo] LT',
            lastWeek : '[viime] dddd[na] [klo] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s päästä',
            past : '%s sitten',
            s : translate,
            ss : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return fi;

})));


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var fo = moment.defineLocale('fo', {
        months : 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
        monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
        weekdays : 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
        weekdaysShort : 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
        weekdaysMin : 'su_má_tý_mi_hó_fr_le'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D. MMMM, YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Í dag kl.] LT',
            nextDay : '[Í morgin kl.] LT',
            nextWeek : 'dddd [kl.] LT',
            lastDay : '[Í gjár kl.] LT',
            lastWeek : '[síðstu] dddd [kl] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'um %s',
            past : '%s síðani',
            s : 'fá sekund',
            ss : '%d sekundir',
            m : 'ein minuttur',
            mm : '%d minuttir',
            h : 'ein tími',
            hh : '%d tímar',
            d : 'ein dagur',
            dd : '%d dagar',
            M : 'ein mánaður',
            MM : '%d mánaðir',
            y : 'eitt ár',
            yy : '%d ár'
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return fo;

})));


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var fr = moment.defineLocale('fr', {
        months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact : true,
        weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin : 'di_lu_ma_me_je_ve_sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Aujourd’hui à] LT',
            nextDay : '[Demain à] LT',
            nextWeek : 'dddd [à] LT',
            lastDay : '[Hier à] LT',
            lastWeek : 'dddd [dernier à] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dans %s',
            past : 'il y a %s',
            s : 'quelques secondes',
            ss : '%d secondes',
            m : 'une minute',
            mm : '%d minutes',
            h : 'une heure',
            hh : '%d heures',
            d : 'un jour',
            dd : '%d jours',
            M : 'un mois',
            MM : '%d mois',
            y : 'un an',
            yy : '%d ans'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
        ordinal : function (number, period) {
            switch (period) {
                // TODO: Return 'e' when day of month > 1. Move this case inside
                // block for masculine words below.
                // See https://github.com/moment/moment/issues/3375
                case 'D':
                    return number + (number === 1 ? 'er' : '');

                // Words with masculine grammatical gender: mois, trimestre, jour
                default:
                case 'M':
                case 'Q':
                case 'DDD':
                case 'd':
                    return number + (number === 1 ? 'er' : 'e');

                // Words with feminine grammatical gender: semaine
                case 'w':
                case 'W':
                    return number + (number === 1 ? 're' : 'e');
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return fr;

})));


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var frCa = moment.defineLocale('fr-ca', {
        months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact : true,
        weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin : 'di_lu_ma_me_je_ve_sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY-MM-DD',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Aujourd’hui à] LT',
            nextDay : '[Demain à] LT',
            nextWeek : 'dddd [à] LT',
            lastDay : '[Hier à] LT',
            lastWeek : 'dddd [dernier à] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dans %s',
            past : 'il y a %s',
            s : 'quelques secondes',
            ss : '%d secondes',
            m : 'une minute',
            mm : '%d minutes',
            h : 'une heure',
            hh : '%d heures',
            d : 'un jour',
            dd : '%d jours',
            M : 'un mois',
            MM : '%d mois',
            y : 'un an',
            yy : '%d ans'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
        ordinal : function (number, period) {
            switch (period) {
                // Words with masculine grammatical gender: mois, trimestre, jour
                default:
                case 'M':
                case 'Q':
                case 'D':
                case 'DDD':
                case 'd':
                    return number + (number === 1 ? 'er' : 'e');

                // Words with feminine grammatical gender: semaine
                case 'w':
                case 'W':
                    return number + (number === 1 ? 're' : 'e');
            }
        }
    });

    return frCa;

})));


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var frCh = moment.defineLocale('fr-ch', {
        months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact : true,
        weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin : 'di_lu_ma_me_je_ve_sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Aujourd’hui à] LT',
            nextDay : '[Demain à] LT',
            nextWeek : 'dddd [à] LT',
            lastDay : '[Hier à] LT',
            lastWeek : 'dddd [dernier à] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dans %s',
            past : 'il y a %s',
            s : 'quelques secondes',
            ss : '%d secondes',
            m : 'une minute',
            mm : '%d minutes',
            h : 'une heure',
            hh : '%d heures',
            d : 'un jour',
            dd : '%d jours',
            M : 'un mois',
            MM : '%d mois',
            y : 'un an',
            yy : '%d ans'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
        ordinal : function (number, period) {
            switch (period) {
                // Words with masculine grammatical gender: mois, trimestre, jour
                default:
                case 'M':
                case 'Q':
                case 'D':
                case 'DDD':
                case 'd':
                    return number + (number === 1 ? 'er' : 'e');

                // Words with feminine grammatical gender: semaine
                case 'w':
                case 'W':
                    return number + (number === 1 ? 're' : 'e');
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return frCh;

})));


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_'),
        monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

    var fy = moment.defineLocale('fy', {
        months : 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
        monthsShort : function (m, format) {
            if (!m) {
                return monthsShortWithDots;
            } else if (/-MMM-/.test(format)) {
                return monthsShortWithoutDots[m.month()];
            } else {
                return monthsShortWithDots[m.month()];
            }
        },
        monthsParseExact : true,
        weekdays : 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
        weekdaysShort : 'si._mo._ti._wo._to._fr._so.'.split('_'),
        weekdaysMin : 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD-MM-YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[hjoed om] LT',
            nextDay: '[moarn om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[juster om] LT',
            lastWeek: '[ôfrûne] dddd [om] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'oer %s',
            past : '%s lyn',
            s : 'in pear sekonden',
            ss : '%d sekonden',
            m : 'ien minút',
            mm : '%d minuten',
            h : 'ien oere',
            hh : '%d oeren',
            d : 'ien dei',
            dd : '%d dagen',
            M : 'ien moanne',
            MM : '%d moannen',
            y : 'ien jier',
            yy : '%d jierren'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal : function (number) {
            return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return fy;

})));


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';



    var months = [
        'Eanáir', 'Feabhra', 'Márta', 'Aibreán', 'Bealtaine', 'Méitheamh', 'Iúil', 'Lúnasa', 'Meán Fómhair', 'Deaireadh Fómhair', 'Samhain', 'Nollaig'
    ];

    var monthsShort = ['Eaná', 'Feab', 'Márt', 'Aibr', 'Beal', 'Méit', 'Iúil', 'Lúna', 'Meán', 'Deai', 'Samh', 'Noll'];

    var weekdays = ['Dé Domhnaigh', 'Dé Luain', 'Dé Máirt', 'Dé Céadaoin', 'Déardaoin', 'Dé hAoine', 'Dé Satharn'];

    var weekdaysShort = ['Dom', 'Lua', 'Mái', 'Céa', 'Déa', 'hAo', 'Sat'];

    var weekdaysMin = ['Do', 'Lu', 'Má', 'Ce', 'Dé', 'hA', 'Sa'];

    var ga = moment.defineLocale('ga', {
        months: months,
        monthsShort: monthsShort,
        monthsParseExact: true,
        weekdays: weekdays,
        weekdaysShort: weekdaysShort,
        weekdaysMin: weekdaysMin,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm'
        },
        calendar: {
            sameDay: '[Inniu ag] LT',
            nextDay: '[Amárach ag] LT',
            nextWeek: 'dddd [ag] LT',
            lastDay: '[Inné aig] LT',
            lastWeek: 'dddd [seo caite] [ag] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: 'i %s',
            past: '%s ó shin',
            s: 'cúpla soicind',
            ss: '%d soicind',
            m: 'nóiméad',
            mm: '%d nóiméad',
            h: 'uair an chloig',
            hh: '%d uair an chloig',
            d: 'lá',
            dd: '%d lá',
            M: 'mí',
            MM: '%d mí',
            y: 'bliain',
            yy: '%d bliain'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
        ordinal: function (number) {
            var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
            return number + output;
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return ga;

})));


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var months = [
        'Am Faoilleach', 'An Gearran', 'Am Màrt', 'An Giblean', 'An Cèitean', 'An t-Ògmhios', 'An t-Iuchar', 'An Lùnastal', 'An t-Sultain', 'An Dàmhair', 'An t-Samhain', 'An Dùbhlachd'
    ];

    var monthsShort = ['Faoi', 'Gear', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùn', 'Sult', 'Dàmh', 'Samh', 'Dùbh'];

    var weekdays = ['Didòmhnaich', 'Diluain', 'Dimàirt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'];

    var weekdaysShort = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'];

    var weekdaysMin = ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'];

    var gd = moment.defineLocale('gd', {
        months : months,
        monthsShort : monthsShort,
        monthsParseExact : true,
        weekdays : weekdays,
        weekdaysShort : weekdaysShort,
        weekdaysMin : weekdaysMin,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[An-diugh aig] LT',
            nextDay : '[A-màireach aig] LT',
            nextWeek : 'dddd [aig] LT',
            lastDay : '[An-dè aig] LT',
            lastWeek : 'dddd [seo chaidh] [aig] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'ann an %s',
            past : 'bho chionn %s',
            s : 'beagan diogan',
            ss : '%d diogan',
            m : 'mionaid',
            mm : '%d mionaidean',
            h : 'uair',
            hh : '%d uairean',
            d : 'latha',
            dd : '%d latha',
            M : 'mìos',
            MM : '%d mìosan',
            y : 'bliadhna',
            yy : '%d bliadhna'
        },
        dayOfMonthOrdinalParse : /\d{1,2}(d|na|mh)/,
        ordinal : function (number) {
            var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return gd;

})));


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var gl = moment.defineLocale('gl', {
        months : 'xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro'.split('_'),
        monthsShort : 'xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.'.split('_'),
        monthsParseExact: true,
        weekdays : 'domingo_luns_martes_mércores_xoves_venres_sábado'.split('_'),
        weekdaysShort : 'dom._lun._mar._mér._xov._ven._sáb.'.split('_'),
        weekdaysMin : 'do_lu_ma_mé_xo_ve_sá'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY H:mm',
            LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
        },
        calendar : {
            sameDay : function () {
                return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
            },
            nextDay : function () {
                return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
            },
            nextWeek : function () {
                return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
            },
            lastDay : function () {
                return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
            },
            lastWeek : function () {
                return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : function (str) {
                if (str.indexOf('un') === 0) {
                    return 'n' + str;
                }
                return 'en ' + str;
            },
            past : 'hai %s',
            s : 'uns segundos',
            ss : '%d segundos',
            m : 'un minuto',
            mm : '%d minutos',
            h : 'unha hora',
            hh : '%d horas',
            d : 'un día',
            dd : '%d días',
            M : 'un mes',
            MM : '%d meses',
            y : 'un ano',
            yy : '%d anos'
        },
        dayOfMonthOrdinalParse : /\d{1,2}º/,
        ordinal : '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return gl;

})));


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            's': ['thodde secondanim', 'thodde second'],
            'ss': [number + ' secondanim', number + ' second'],
            'm': ['eka mintan', 'ek minute'],
            'mm': [number + ' mintanim', number + ' mintam'],
            'h': ['eka voran', 'ek vor'],
            'hh': [number + ' voranim', number + ' voram'],
            'd': ['eka disan', 'ek dis'],
            'dd': [number + ' disanim', number + ' dis'],
            'M': ['eka mhoinean', 'ek mhoino'],
            'MM': [number + ' mhoineanim', number + ' mhoine'],
            'y': ['eka vorsan', 'ek voros'],
            'yy': [number + ' vorsanim', number + ' vorsam']
        };
        return withoutSuffix ? format[key][0] : format[key][1];
    }

    var gomLatn = moment.defineLocale('gom-latn', {
        months : 'Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr'.split('_'),
        monthsShort : 'Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.'.split('_'),
        monthsParseExact : true,
        weekdays : 'Aitar_Somar_Mongllar_Budvar_Brestar_Sukrar_Son\'var'.split('_'),
        weekdaysShort : 'Ait._Som._Mon._Bud._Bre._Suk._Son.'.split('_'),
        weekdaysMin : 'Ai_Sm_Mo_Bu_Br_Su_Sn'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'A h:mm [vazta]',
            LTS : 'A h:mm:ss [vazta]',
            L : 'DD-MM-YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY A h:mm [vazta]',
            LLLL : 'dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]',
            llll: 'ddd, D MMM YYYY, A h:mm [vazta]'
        },
        calendar : {
            sameDay: '[Aiz] LT',
            nextDay: '[Faleam] LT',
            nextWeek: '[Ieta to] dddd[,] LT',
            lastDay: '[Kal] LT',
            lastWeek: '[Fatlo] dddd[,] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : '%s',
            past : '%s adim',
            s : processRelativeTime,
            ss : processRelativeTime,
            m : processRelativeTime,
            mm : processRelativeTime,
            h : processRelativeTime,
            hh : processRelativeTime,
            d : processRelativeTime,
            dd : processRelativeTime,
            M : processRelativeTime,
            MM : processRelativeTime,
            y : processRelativeTime,
            yy : processRelativeTime
        },
        dayOfMonthOrdinalParse : /\d{1,2}(er)/,
        ordinal : function (number, period) {
            switch (period) {
                // the ordinal 'er' only applies to day of the month
                case 'D':
                    return number + 'er';
                default:
                case 'M':
                case 'Q':
                case 'DDD':
                case 'd':
                case 'w':
                case 'W':
                    return number;
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        },
        meridiemParse: /rati|sokalli|donparam|sanje/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'rati') {
                return hour < 4 ? hour : hour + 12;
            } else if (meridiem === 'sokalli') {
                return hour;
            } else if (meridiem === 'donparam') {
                return hour > 12 ? hour : hour + 12;
            } else if (meridiem === 'sanje') {
                return hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'rati';
            } else if (hour < 12) {
                return 'sokalli';
            } else if (hour < 16) {
                return 'donparam';
            } else if (hour < 20) {
                return 'sanje';
            } else {
                return 'rati';
            }
        }
    });

    return gomLatn;

})));


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
            '1': '૧',
            '2': '૨',
            '3': '૩',
            '4': '૪',
            '5': '૫',
            '6': '૬',
            '7': '૭',
            '8': '૮',
            '9': '૯',
            '0': '૦'
        },
        numberMap = {
            '૧': '1',
            '૨': '2',
            '૩': '3',
            '૪': '4',
            '૫': '5',
            '૬': '6',
            '૭': '7',
            '૮': '8',
            '૯': '9',
            '૦': '0'
        };

    var gu = moment.defineLocale('gu', {
        months: 'જાન્યુઆરી_ફેબ્રુઆરી_માર્ચ_એપ્રિલ_મે_જૂન_જુલાઈ_ઑગસ્ટ_સપ્ટેમ્બર_ઑક્ટ્બર_નવેમ્બર_ડિસેમ્બર'.split('_'),
        monthsShort: 'જાન્યુ._ફેબ્રુ._માર્ચ_એપ્રિ._મે_જૂન_જુલા._ઑગ._સપ્ટે._ઑક્ટ્._નવે._ડિસે.'.split('_'),
        monthsParseExact: true,
        weekdays: 'રવિવાર_સોમવાર_મંગળવાર_બુધ્વાર_ગુરુવાર_શુક્રવાર_શનિવાર'.split('_'),
        weekdaysShort: 'રવિ_સોમ_મંગળ_બુધ્_ગુરુ_શુક્ર_શનિ'.split('_'),
        weekdaysMin: 'ર_સો_મં_બુ_ગુ_શુ_શ'.split('_'),
        longDateFormat: {
            LT: 'A h:mm વાગ્યે',
            LTS: 'A h:mm:ss વાગ્યે',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY, A h:mm વાગ્યે',
            LLLL: 'dddd, D MMMM YYYY, A h:mm વાગ્યે'
        },
        calendar: {
            sameDay: '[આજ] LT',
            nextDay: '[કાલે] LT',
            nextWeek: 'dddd, LT',
            lastDay: '[ગઇકાલે] LT',
            lastWeek: '[પાછલા] dddd, LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: '%s મા',
            past: '%s પેહલા',
            s: 'અમુક પળો',
            ss: '%d સેકંડ',
            m: 'એક મિનિટ',
            mm: '%d મિનિટ',
            h: 'એક કલાક',
            hh: '%d કલાક',
            d: 'એક દિવસ',
            dd: '%d દિવસ',
            M: 'એક મહિનો',
            MM: '%d મહિનો',
            y: 'એક વર્ષ',
            yy: '%d વર્ષ'
        },
        preparse: function (string) {
            return string.replace(/[૧૨૩૪૫૬૭૮૯૦]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        // Gujarati notation for meridiems are quite fuzzy in practice. While there exists
        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Gujarati.
        meridiemParse: /રાત|બપોર|સવાર|સાંજ/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'રાત') {
                return hour < 4 ? hour : hour + 12;
            } else if (meridiem === 'સવાર') {
                return hour;
            } else if (meridiem === 'બપોર') {
                return hour >= 10 ? hour : hour + 12;
            } else if (meridiem === 'સાંજ') {
                return hour + 12;
            }
        },
        meridiem: function (hour, minute, isLower) {
            if (hour < 4) {
                return 'રાત';
            } else if (hour < 10) {
                return 'સવાર';
            } else if (hour < 17) {
                return 'બપોર';
            } else if (hour < 20) {
                return 'સાંજ';
            } else {
                return 'રાત';
            }
        },
        week: {
            dow: 0, // Sunday is the first day of the week.
            doy: 6 // The week that contains Jan 6th is the first week of the year.
        }
    });

    return gu;

})));


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var he = moment.defineLocale('he', {
        months : 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
        monthsShort : 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
        weekdays : 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
        weekdaysShort : 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
        weekdaysMin : 'א_ב_ג_ד_ה_ו_ש'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [ב]MMMM YYYY',
            LLL : 'D [ב]MMMM YYYY HH:mm',
            LLLL : 'dddd, D [ב]MMMM YYYY HH:mm',
            l : 'D/M/YYYY',
            ll : 'D MMM YYYY',
            lll : 'D MMM YYYY HH:mm',
            llll : 'ddd, D MMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[היום ב־]LT',
            nextDay : '[מחר ב־]LT',
            nextWeek : 'dddd [בשעה] LT',
            lastDay : '[אתמול ב־]LT',
            lastWeek : '[ביום] dddd [האחרון בשעה] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'בעוד %s',
            past : 'לפני %s',
            s : 'מספר שניות',
            ss : '%d שניות',
            m : 'דקה',
            mm : '%d דקות',
            h : 'שעה',
            hh : function (number) {
                if (number === 2) {
                    return 'שעתיים';
                }
                return number + ' שעות';
            },
            d : 'יום',
            dd : function (number) {
                if (number === 2) {
                    return 'יומיים';
                }
                return number + ' ימים';
            },
            M : 'חודש',
            MM : function (number) {
                if (number === 2) {
                    return 'חודשיים';
                }
                return number + ' חודשים';
            },
            y : 'שנה',
            yy : function (number) {
                if (number === 2) {
                    return 'שנתיים';
                } else if (number % 10 === 0 && number !== 10) {
                    return number + ' שנה';
                }
                return number + ' שנים';
            }
        },
        meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
        isPM : function (input) {
            return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 5) {
                return 'לפנות בוקר';
            } else if (hour < 10) {
                return 'בבוקר';
            } else if (hour < 12) {
                return isLower ? 'לפנה"צ' : 'לפני הצהריים';
            } else if (hour < 18) {
                return isLower ? 'אחה"צ' : 'אחרי הצהריים';
            } else {
                return 'בערב';
            }
        }
    });

    return he;

})));


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '१',
        '2': '२',
        '3': '३',
        '4': '४',
        '5': '५',
        '6': '६',
        '7': '७',
        '8': '८',
        '9': '९',
        '0': '०'
    },
    numberMap = {
        '१': '1',
        '२': '2',
        '३': '3',
        '४': '4',
        '५': '5',
        '६': '6',
        '७': '7',
        '८': '8',
        '९': '9',
        '०': '0'
    };

    var hi = moment.defineLocale('hi', {
        months : 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
        monthsShort : 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
        monthsParseExact: true,
        weekdays : 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
        weekdaysShort : 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
        weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
        longDateFormat : {
            LT : 'A h:mm बजे',
            LTS : 'A h:mm:ss बजे',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, A h:mm बजे',
            LLLL : 'dddd, D MMMM YYYY, A h:mm बजे'
        },
        calendar : {
            sameDay : '[आज] LT',
            nextDay : '[कल] LT',
            nextWeek : 'dddd, LT',
            lastDay : '[कल] LT',
            lastWeek : '[पिछले] dddd, LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s में',
            past : '%s पहले',
            s : 'कुछ ही क्षण',
            ss : '%d सेकंड',
            m : 'एक मिनट',
            mm : '%d मिनट',
            h : 'एक घंटा',
            hh : '%d घंटे',
            d : 'एक दिन',
            dd : '%d दिन',
            M : 'एक महीने',
            MM : '%d महीने',
            y : 'एक वर्ष',
            yy : '%d वर्ष'
        },
        preparse: function (string) {
            return string.replace(/[१२३४५६७८९०]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        // Hindi notation for meridiems are quite fuzzy in practice. While there exists
        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
        meridiemParse: /रात|सुबह|दोपहर|शाम/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'रात') {
                return hour < 4 ? hour : hour + 12;
            } else if (meridiem === 'सुबह') {
                return hour;
            } else if (meridiem === 'दोपहर') {
                return hour >= 10 ? hour : hour + 12;
            } else if (meridiem === 'शाम') {
                return hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'रात';
            } else if (hour < 10) {
                return 'सुबह';
            } else if (hour < 17) {
                return 'दोपहर';
            } else if (hour < 20) {
                return 'शाम';
            } else {
                return 'रात';
            }
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return hi;

})));


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function translate(number, withoutSuffix, key) {
        var result = number + ' ';
        switch (key) {
            case 'ss':
                if (number === 1) {
                    result += 'sekunda';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'sekunde';
                } else {
                    result += 'sekundi';
                }
                return result;
            case 'm':
                return withoutSuffix ? 'jedna minuta' : 'jedne minute';
            case 'mm':
                if (number === 1) {
                    result += 'minuta';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'minute';
                } else {
                    result += 'minuta';
                }
                return result;
            case 'h':
                return withoutSuffix ? 'jedan sat' : 'jednog sata';
            case 'hh':
                if (number === 1) {
                    result += 'sat';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'sata';
                } else {
                    result += 'sati';
                }
                return result;
            case 'dd':
                if (number === 1) {
                    result += 'dan';
                } else {
                    result += 'dana';
                }
                return result;
            case 'MM':
                if (number === 1) {
                    result += 'mjesec';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'mjeseca';
                } else {
                    result += 'mjeseci';
                }
                return result;
            case 'yy':
                if (number === 1) {
                    result += 'godina';
                } else if (number === 2 || number === 3 || number === 4) {
                    result += 'godine';
                } else {
                    result += 'godina';
                }
                return result;
        }
    }

    var hr = moment.defineLocale('hr', {
        months : {
            format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
            standalone: 'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
        },
        monthsShort : 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
        monthsParseExact: true,
        weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
        weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
        weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay  : '[danas u] LT',
            nextDay  : '[sutra u] LT',
            nextWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[u] [nedjelju] [u] LT';
                    case 3:
                        return '[u] [srijedu] [u] LT';
                    case 6:
                        return '[u] [subotu] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[u] dddd [u] LT';
                }
            },
            lastDay  : '[jučer u] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                    case 3:
                        return '[prošlu] dddd [u] LT';
                    case 6:
                        return '[prošle] [subote] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[prošli] dddd [u] LT';
                }
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'za %s',
            past   : 'prije %s',
            s      : 'par sekundi',
            ss     : translate,
            m      : translate,
            mm     : translate,
            h      : translate,
            hh     : translate,
            d      : 'dan',
            dd     : translate,
            M      : 'mjesec',
            MM     : translate,
            y      : 'godinu',
            yy     : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return hr;

})));


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');
    function translate(number, withoutSuffix, key, isFuture) {
        var num = number;
        switch (key) {
            case 's':
                return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
            case 'ss':
                return num + (isFuture || withoutSuffix) ? ' másodperc' : ' másodperce';
            case 'm':
                return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
            case 'mm':
                return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
            case 'h':
                return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
            case 'hh':
                return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
            case 'd':
                return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
            case 'dd':
                return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
            case 'M':
                return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
            case 'MM':
                return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
            case 'y':
                return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
            case 'yy':
                return num + (isFuture || withoutSuffix ? ' év' : ' éve');
        }
        return '';
    }
    function week(isFuture) {
        return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
    }

    var hu = moment.defineLocale('hu', {
        months : 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
        monthsShort : 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
        weekdays : 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
        weekdaysShort : 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
        weekdaysMin : 'v_h_k_sze_cs_p_szo'.split('_'),
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'YYYY.MM.DD.',
            LL : 'YYYY. MMMM D.',
            LLL : 'YYYY. MMMM D. H:mm',
            LLLL : 'YYYY. MMMM D., dddd H:mm'
        },
        meridiemParse: /de|du/i,
        isPM: function (input) {
            return input.charAt(1).toLowerCase() === 'u';
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours < 12) {
                return isLower === true ? 'de' : 'DE';
            } else {
                return isLower === true ? 'du' : 'DU';
            }
        },
        calendar : {
            sameDay : '[ma] LT[-kor]',
            nextDay : '[holnap] LT[-kor]',
            nextWeek : function () {
                return week.call(this, true);
            },
            lastDay : '[tegnap] LT[-kor]',
            lastWeek : function () {
                return week.call(this, false);
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s múlva',
            past : '%s',
            s : translate,
            ss : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return hu;

})));


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var hyAm = moment.defineLocale('hy-am', {
        months : {
            format: 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_'),
            standalone: 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_')
        },
        monthsShort : 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_'),
        weekdays : 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_'),
        weekdaysShort : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
        weekdaysMin : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY թ.',
            LLL : 'D MMMM YYYY թ., HH:mm',
            LLLL : 'dddd, D MMMM YYYY թ., HH:mm'
        },
        calendar : {
            sameDay: '[այսօր] LT',
            nextDay: '[վաղը] LT',
            lastDay: '[երեկ] LT',
            nextWeek: function () {
                return 'dddd [օրը ժամը] LT';
            },
            lastWeek: function () {
                return '[անցած] dddd [օրը ժամը] LT';
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : '%s հետո',
            past : '%s առաջ',
            s : 'մի քանի վայրկյան',
            ss : '%d վայրկյան',
            m : 'րոպե',
            mm : '%d րոպե',
            h : 'ժամ',
            hh : '%d ժամ',
            d : 'օր',
            dd : '%d օր',
            M : 'ամիս',
            MM : '%d ամիս',
            y : 'տարի',
            yy : '%d տարի'
        },
        meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
        isPM: function (input) {
            return /^(ցերեկվա|երեկոյան)$/.test(input);
        },
        meridiem : function (hour) {
            if (hour < 4) {
                return 'գիշերվա';
            } else if (hour < 12) {
                return 'առավոտվա';
            } else if (hour < 17) {
                return 'ցերեկվա';
            } else {
                return 'երեկոյան';
            }
        },
        dayOfMonthOrdinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
        ordinal: function (number, period) {
            switch (period) {
                case 'DDD':
                case 'w':
                case 'W':
                case 'DDDo':
                    if (number === 1) {
                        return number + '-ին';
                    }
                    return number + '-րդ';
                default:
                    return number;
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return hyAm;

})));


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var id = moment.defineLocale('id', {
        months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Agt_Sep_Okt_Nov_Des'.split('_'),
        weekdays : 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
        weekdaysShort : 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
        weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
        longDateFormat : {
            LT : 'HH.mm',
            LTS : 'HH.mm.ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY [pukul] HH.mm',
            LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
        },
        meridiemParse: /pagi|siang|sore|malam/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'pagi') {
                return hour;
            } else if (meridiem === 'siang') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === 'sore' || meridiem === 'malam') {
                return hour + 12;
            }
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours < 11) {
                return 'pagi';
            } else if (hours < 15) {
                return 'siang';
            } else if (hours < 19) {
                return 'sore';
            } else {
                return 'malam';
            }
        },
        calendar : {
            sameDay : '[Hari ini pukul] LT',
            nextDay : '[Besok pukul] LT',
            nextWeek : 'dddd [pukul] LT',
            lastDay : '[Kemarin pukul] LT',
            lastWeek : 'dddd [lalu pukul] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dalam %s',
            past : '%s yang lalu',
            s : 'beberapa detik',
            ss : '%d detik',
            m : 'semenit',
            mm : '%d menit',
            h : 'sejam',
            hh : '%d jam',
            d : 'sehari',
            dd : '%d hari',
            M : 'sebulan',
            MM : '%d bulan',
            y : 'setahun',
            yy : '%d tahun'
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return id;

})));


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function plural(n) {
        if (n % 100 === 11) {
            return true;
        } else if (n % 10 === 1) {
            return false;
        }
        return true;
    }
    function translate(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':
                return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
            case 'ss':
                if (plural(number)) {
                    return result + (withoutSuffix || isFuture ? 'sekúndur' : 'sekúndum');
                }
                return result + 'sekúnda';
            case 'm':
                return withoutSuffix ? 'mínúta' : 'mínútu';
            case 'mm':
                if (plural(number)) {
                    return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
                } else if (withoutSuffix) {
                    return result + 'mínúta';
                }
                return result + 'mínútu';
            case 'hh':
                if (plural(number)) {
                    return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
                }
                return result + 'klukkustund';
            case 'd':
                if (withoutSuffix) {
                    return 'dagur';
                }
                return isFuture ? 'dag' : 'degi';
            case 'dd':
                if (plural(number)) {
                    if (withoutSuffix) {
                        return result + 'dagar';
                    }
                    return result + (isFuture ? 'daga' : 'dögum');
                } else if (withoutSuffix) {
                    return result + 'dagur';
                }
                return result + (isFuture ? 'dag' : 'degi');
            case 'M':
                if (withoutSuffix) {
                    return 'mánuður';
                }
                return isFuture ? 'mánuð' : 'mánuði';
            case 'MM':
                if (plural(number)) {
                    if (withoutSuffix) {
                        return result + 'mánuðir';
                    }
                    return result + (isFuture ? 'mánuði' : 'mánuðum');
                } else if (withoutSuffix) {
                    return result + 'mánuður';
                }
                return result + (isFuture ? 'mánuð' : 'mánuði');
            case 'y':
                return withoutSuffix || isFuture ? 'ár' : 'ári';
            case 'yy':
                if (plural(number)) {
                    return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
                }
                return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
        }
    }

    var is = moment.defineLocale('is', {
        months : 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
        monthsShort : 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
        weekdays : 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
        weekdaysShort : 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
        weekdaysMin : 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY [kl.] H:mm',
            LLLL : 'dddd, D. MMMM YYYY [kl.] H:mm'
        },
        calendar : {
            sameDay : '[í dag kl.] LT',
            nextDay : '[á morgun kl.] LT',
            nextWeek : 'dddd [kl.] LT',
            lastDay : '[í gær kl.] LT',
            lastWeek : '[síðasta] dddd [kl.] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'eftir %s',
            past : 'fyrir %s síðan',
            s : translate,
            ss : translate,
            m : translate,
            mm : translate,
            h : 'klukkustund',
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return is;

})));


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var it = moment.defineLocale('it', {
        months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
        monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
        weekdays : 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
        weekdaysShort : 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
        weekdaysMin : 'do_lu_ma_me_gi_ve_sa'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[Oggi alle] LT',
            nextDay: '[Domani alle] LT',
            nextWeek: 'dddd [alle] LT',
            lastDay: '[Ieri alle] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[la scorsa] dddd [alle] LT';
                    default:
                        return '[lo scorso] dddd [alle] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : function (s) {
                return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
            },
            past : '%s fa',
            s : 'alcuni secondi',
            ss : '%d secondi',
            m : 'un minuto',
            mm : '%d minuti',
            h : 'un\'ora',
            hh : '%d ore',
            d : 'un giorno',
            dd : '%d giorni',
            M : 'un mese',
            MM : '%d mesi',
            y : 'un anno',
            yy : '%d anni'
        },
        dayOfMonthOrdinalParse : /\d{1,2}º/,
        ordinal: '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return it;

})));


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var itCh = moment.defineLocale('it-ch', {
        months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
        monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
        weekdays : 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
        weekdaysShort : 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
        weekdaysMin : 'do_lu_ma_me_gi_ve_sa'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[Oggi alle] LT',
            nextDay: '[Domani alle] LT',
            nextWeek: 'dddd [alle] LT',
            lastDay: '[Ieri alle] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[la scorsa] dddd [alle] LT';
                    default:
                        return '[lo scorso] dddd [alle] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : function (s) {
                return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
            },
            past : '%s fa',
            s : 'alcuni secondi',
            ss : '%d secondi',
            m : 'un minuto',
            mm : '%d minuti',
            h : 'un\'ora',
            hh : '%d ore',
            d : 'un giorno',
            dd : '%d giorni',
            M : 'un mese',
            MM : '%d mesi',
            y : 'un anno',
            yy : '%d anni'
        },
        dayOfMonthOrdinalParse : /\d{1,2}º/,
        ordinal: '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return itCh;

})));


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var ja = moment.defineLocale('ja', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
        weekdaysShort : '日_月_火_水_木_金_土'.split('_'),
        weekdaysMin : '日_月_火_水_木_金_土'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY/MM/DD',
            LL : 'YYYY年M月D日',
            LLL : 'YYYY年M月D日 HH:mm',
            LLLL : 'YYYY年M月D日 dddd HH:mm',
            l : 'YYYY/MM/DD',
            ll : 'YYYY年M月D日',
            lll : 'YYYY年M月D日 HH:mm',
            llll : 'YYYY年M月D日(ddd) HH:mm'
        },
        meridiemParse: /午前|午後/i,
        isPM : function (input) {
            return input === '午後';
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return '午前';
            } else {
                return '午後';
            }
        },
        calendar : {
            sameDay : '[今日] LT',
            nextDay : '[明日] LT',
            nextWeek : function (now) {
                if (now.week() < this.week()) {
                    return '[来週]dddd LT';
                } else {
                    return 'dddd LT';
                }
            },
            lastDay : '[昨日] LT',
            lastWeek : function (now) {
                if (this.week() < now.week()) {
                    return '[先週]dddd LT';
                } else {
                    return 'dddd LT';
                }
            },
            sameElse : 'L'
        },
        dayOfMonthOrdinalParse : /\d{1,2}日/,
        ordinal : function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'DDD':
                    return number + '日';
                default:
                    return number;
            }
        },
        relativeTime : {
            future : '%s後',
            past : '%s前',
            s : '数秒',
            ss : '%d秒',
            m : '1分',
            mm : '%d分',
            h : '1時間',
            hh : '%d時間',
            d : '1日',
            dd : '%d日',
            M : '1ヶ月',
            MM : '%dヶ月',
            y : '1年',
            yy : '%d年'
        }
    });

    return ja;

})));


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var jv = moment.defineLocale('jv', {
        months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
        weekdays : 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
        weekdaysShort : 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
        weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
        longDateFormat : {
            LT : 'HH.mm',
            LTS : 'HH.mm.ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY [pukul] HH.mm',
            LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
        },
        meridiemParse: /enjing|siyang|sonten|ndalu/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'enjing') {
                return hour;
            } else if (meridiem === 'siyang') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === 'sonten' || meridiem === 'ndalu') {
                return hour + 12;
            }
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours < 11) {
                return 'enjing';
            } else if (hours < 15) {
                return 'siyang';
            } else if (hours < 19) {
                return 'sonten';
            } else {
                return 'ndalu';
            }
        },
        calendar : {
            sameDay : '[Dinten puniko pukul] LT',
            nextDay : '[Mbenjang pukul] LT',
            nextWeek : 'dddd [pukul] LT',
            lastDay : '[Kala wingi pukul] LT',
            lastWeek : 'dddd [kepengker pukul] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'wonten ing %s',
            past : '%s ingkang kepengker',
            s : 'sawetawis detik',
            ss : '%d detik',
            m : 'setunggal menit',
            mm : '%d menit',
            h : 'setunggal jam',
            hh : '%d jam',
            d : 'sedinten',
            dd : '%d dinten',
            M : 'sewulan',
            MM : '%d wulan',
            y : 'setaun',
            yy : '%d taun'
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return jv;

})));


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var ka = moment.defineLocale('ka', {
        months : {
            standalone: 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
            format: 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
        },
        monthsShort : 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
        weekdays : {
            standalone: 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
            format: 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_'),
            isFormat: /(წინა|შემდეგ)/
        },
        weekdaysShort : 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
        weekdaysMin : 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY h:mm A',
            LLLL : 'dddd, D MMMM YYYY h:mm A'
        },
        calendar : {
            sameDay : '[დღეს] LT[-ზე]',
            nextDay : '[ხვალ] LT[-ზე]',
            lastDay : '[გუშინ] LT[-ზე]',
            nextWeek : '[შემდეგ] dddd LT[-ზე]',
            lastWeek : '[წინა] dddd LT-ზე',
            sameElse : 'L'
        },
        relativeTime : {
            future : function (s) {
                return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
                    s.replace(/ი$/, 'ში') :
                    s + 'ში';
            },
            past : function (s) {
                if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
                    return s.replace(/(ი|ე)$/, 'ის წინ');
                }
                if ((/წელი/).test(s)) {
                    return s.replace(/წელი$/, 'წლის წინ');
                }
            },
            s : 'რამდენიმე წამი',
            ss : '%d წამი',
            m : 'წუთი',
            mm : '%d წუთი',
            h : 'საათი',
            hh : '%d საათი',
            d : 'დღე',
            dd : '%d დღე',
            M : 'თვე',
            MM : '%d თვე',
            y : 'წელი',
            yy : '%d წელი'
        },
        dayOfMonthOrdinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
        ordinal : function (number) {
            if (number === 0) {
                return number;
            }
            if (number === 1) {
                return number + '-ლი';
            }
            if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
                return 'მე-' + number;
            }
            return number + '-ე';
        },
        week : {
            dow : 1,
            doy : 7
        }
    });

    return ka;

})));


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var suffixes = {
        0: '-ші',
        1: '-ші',
        2: '-ші',
        3: '-ші',
        4: '-ші',
        5: '-ші',
        6: '-шы',
        7: '-ші',
        8: '-ші',
        9: '-шы',
        10: '-шы',
        20: '-шы',
        30: '-шы',
        40: '-шы',
        50: '-ші',
        60: '-шы',
        70: '-ші',
        80: '-ші',
        90: '-шы',
        100: '-ші'
    };

    var kk = moment.defineLocale('kk', {
        months : 'қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан'.split('_'),
        monthsShort : 'қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел'.split('_'),
        weekdays : 'жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі'.split('_'),
        weekdaysShort : 'жек_дүй_сей_сәр_бей_жұм_сен'.split('_'),
        weekdaysMin : 'жк_дй_сй_ср_бй_жм_сн'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Бүгін сағат] LT',
            nextDay : '[Ертең сағат] LT',
            nextWeek : 'dddd [сағат] LT',
            lastDay : '[Кеше сағат] LT',
            lastWeek : '[Өткен аптаның] dddd [сағат] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s ішінде',
            past : '%s бұрын',
            s : 'бірнеше секунд',
            ss : '%d секунд',
            m : 'бір минут',
            mm : '%d минут',
            h : 'бір сағат',
            hh : '%d сағат',
            d : 'бір күн',
            dd : '%d күн',
            M : 'бір ай',
            MM : '%d ай',
            y : 'бір жыл',
            yy : '%d жыл'
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ші|шы)/,
        ordinal : function (number) {
            var a = number % 10,
                b = number >= 100 ? 100 : null;
            return number + (suffixes[number] || suffixes[a] || suffixes[b]);
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return kk;

})));


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '១',
        '2': '២',
        '3': '៣',
        '4': '៤',
        '5': '៥',
        '6': '៦',
        '7': '៧',
        '8': '៨',
        '9': '៩',
        '0': '០'
    }, numberMap = {
        '១': '1',
        '២': '2',
        '៣': '3',
        '៤': '4',
        '៥': '5',
        '៦': '6',
        '៧': '7',
        '៨': '8',
        '៩': '9',
        '០': '0'
    };

    var km = moment.defineLocale('km', {
        months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split(
            '_'
        ),
        monthsShort: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split(
            '_'
        ),
        weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
        weekdaysShort: 'អា_ច_អ_ព_ព្រ_សុ_ស'.split('_'),
        weekdaysMin: 'អា_ច_អ_ព_ព្រ_សុ_ស'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm'
        },
        meridiemParse: /ព្រឹក|ល្ងាច/,
        isPM: function (input) {
            return input === 'ល្ងាច';
        },
        meridiem: function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ព្រឹក';
            } else {
                return 'ល្ងាច';
            }
        },
        calendar: {
            sameDay: '[ថ្ងៃនេះ ម៉ោង] LT',
            nextDay: '[ស្អែក ម៉ោង] LT',
            nextWeek: 'dddd [ម៉ោង] LT',
            lastDay: '[ម្សិលមិញ ម៉ោង] LT',
            lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: '%sទៀត',
            past: '%sមុន',
            s: 'ប៉ុន្មានវិនាទី',
            ss: '%d វិនាទី',
            m: 'មួយនាទី',
            mm: '%d នាទី',
            h: 'មួយម៉ោង',
            hh: '%d ម៉ោង',
            d: 'មួយថ្ងៃ',
            dd: '%d ថ្ងៃ',
            M: 'មួយខែ',
            MM: '%d ខែ',
            y: 'មួយឆ្នាំ',
            yy: '%d ឆ្នាំ'
        },
        dayOfMonthOrdinalParse : /ទី\d{1,2}/,
        ordinal : 'ទី%d',
        preparse: function (string) {
            return string.replace(/[១២៣៤៥៦៧៨៩០]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4 // The week that contains Jan 4th is the first week of the year.
        }
    });

    return km;

})));


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '೧',
        '2': '೨',
        '3': '೩',
        '4': '೪',
        '5': '೫',
        '6': '೬',
        '7': '೭',
        '8': '೮',
        '9': '೯',
        '0': '೦'
    },
    numberMap = {
        '೧': '1',
        '೨': '2',
        '೩': '3',
        '೪': '4',
        '೫': '5',
        '೬': '6',
        '೭': '7',
        '೮': '8',
        '೯': '9',
        '೦': '0'
    };

    var kn = moment.defineLocale('kn', {
        months : 'ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್'.split('_'),
        monthsShort : 'ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂ_ಅಕ್ಟೋ_ನವೆಂ_ಡಿಸೆಂ'.split('_'),
        monthsParseExact: true,
        weekdays : 'ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ'.split('_'),
        weekdaysShort : 'ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ'.split('_'),
        weekdaysMin : 'ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ'.split('_'),
        longDateFormat : {
            LT : 'A h:mm',
            LTS : 'A h:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, A h:mm',
            LLLL : 'dddd, D MMMM YYYY, A h:mm'
        },
        calendar : {
            sameDay : '[ಇಂದು] LT',
            nextDay : '[ನಾಳೆ] LT',
            nextWeek : 'dddd, LT',
            lastDay : '[ನಿನ್ನೆ] LT',
            lastWeek : '[ಕೊನೆಯ] dddd, LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s ನಂತರ',
            past : '%s ಹಿಂದೆ',
            s : 'ಕೆಲವು ಕ್ಷಣಗಳು',
            ss : '%d ಸೆಕೆಂಡುಗಳು',
            m : 'ಒಂದು ನಿಮಿಷ',
            mm : '%d ನಿಮಿಷ',
            h : 'ಒಂದು ಗಂಟೆ',
            hh : '%d ಗಂಟೆ',
            d : 'ಒಂದು ದಿನ',
            dd : '%d ದಿನ',
            M : 'ಒಂದು ತಿಂಗಳು',
            MM : '%d ತಿಂಗಳು',
            y : 'ಒಂದು ವರ್ಷ',
            yy : '%d ವರ್ಷ'
        },
        preparse: function (string) {
            return string.replace(/[೧೨೩೪೫೬೭೮೯೦]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        meridiemParse: /ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'ರಾತ್ರಿ') {
                return hour < 4 ? hour : hour + 12;
            } else if (meridiem === 'ಬೆಳಿಗ್ಗೆ') {
                return hour;
            } else if (meridiem === 'ಮಧ್ಯಾಹ್ನ') {
                return hour >= 10 ? hour : hour + 12;
            } else if (meridiem === 'ಸಂಜೆ') {
                return hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'ರಾತ್ರಿ';
            } else if (hour < 10) {
                return 'ಬೆಳಿಗ್ಗೆ';
            } else if (hour < 17) {
                return 'ಮಧ್ಯಾಹ್ನ';
            } else if (hour < 20) {
                return 'ಸಂಜೆ';
            } else {
                return 'ರಾತ್ರಿ';
            }
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ನೇ)/,
        ordinal : function (number) {
            return number + 'ನೇ';
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return kn;

})));


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var ko = moment.defineLocale('ko', {
        months : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
        monthsShort : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
        weekdays : '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
        weekdaysShort : '일_월_화_수_목_금_토'.split('_'),
        weekdaysMin : '일_월_화_수_목_금_토'.split('_'),
        longDateFormat : {
            LT : 'A h:mm',
            LTS : 'A h:mm:ss',
            L : 'YYYY.MM.DD.',
            LL : 'YYYY년 MMMM D일',
            LLL : 'YYYY년 MMMM D일 A h:mm',
            LLLL : 'YYYY년 MMMM D일 dddd A h:mm',
            l : 'YYYY.MM.DD.',
            ll : 'YYYY년 MMMM D일',
            lll : 'YYYY년 MMMM D일 A h:mm',
            llll : 'YYYY년 MMMM D일 dddd A h:mm'
        },
        calendar : {
            sameDay : '오늘 LT',
            nextDay : '내일 LT',
            nextWeek : 'dddd LT',
            lastDay : '어제 LT',
            lastWeek : '지난주 dddd LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s 후',
            past : '%s 전',
            s : '몇 초',
            ss : '%d초',
            m : '1분',
            mm : '%d분',
            h : '한 시간',
            hh : '%d시간',
            d : '하루',
            dd : '%d일',
            M : '한 달',
            MM : '%d달',
            y : '일 년',
            yy : '%d년'
        },
        dayOfMonthOrdinalParse : /\d{1,2}(일|월|주)/,
        ordinal : function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'DDD':
                    return number + '일';
                case 'M':
                    return number + '월';
                case 'w':
                case 'W':
                    return number + '주';
                default:
                    return number;
            }
        },
        meridiemParse : /오전|오후/,
        isPM : function (token) {
            return token === '오후';
        },
        meridiem : function (hour, minute, isUpper) {
            return hour < 12 ? '오전' : '오후';
        }
    });

    return ko;

})));


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩',
        '0': '٠'
    }, numberMap = {
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
        '٠': '0'
    },
    months = [
        'کانونی دووەم',
        'شوبات',
        'ئازار',
        'نیسان',
        'ئایار',
        'حوزەیران',
        'تەمموز',
        'ئاب',
        'ئەیلوول',
        'تشرینی یەكەم',
        'تشرینی دووەم',
        'كانونی یەکەم'
    ];


    var ku = moment.defineLocale('ku', {
        months : months,
        monthsShort : months,
        weekdays : 'یه‌كشه‌ممه‌_دووشه‌ممه‌_سێشه‌ممه‌_چوارشه‌ممه‌_پێنجشه‌ممه‌_هه‌ینی_شه‌ممه‌'.split('_'),
        weekdaysShort : 'یه‌كشه‌م_دووشه‌م_سێشه‌م_چوارشه‌م_پێنجشه‌م_هه‌ینی_شه‌ممه‌'.split('_'),
        weekdaysMin : 'ی_د_س_چ_پ_ه_ش'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        meridiemParse: /ئێواره‌|به‌یانی/,
        isPM: function (input) {
            return /ئێواره‌/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'به‌یانی';
            } else {
                return 'ئێواره‌';
            }
        },
        calendar : {
            sameDay : '[ئه‌مرۆ كاتژمێر] LT',
            nextDay : '[به‌یانی كاتژمێر] LT',
            nextWeek : 'dddd [كاتژمێر] LT',
            lastDay : '[دوێنێ كاتژمێر] LT',
            lastWeek : 'dddd [كاتژمێر] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'له‌ %s',
            past : '%s',
            s : 'چه‌ند چركه‌یه‌ك',
            ss : 'چركه‌ %d',
            m : 'یه‌ك خوله‌ك',
            mm : '%d خوله‌ك',
            h : 'یه‌ك كاتژمێر',
            hh : '%d كاتژمێر',
            d : 'یه‌ك ڕۆژ',
            dd : '%d ڕۆژ',
            M : 'یه‌ك مانگ',
            MM : '%d مانگ',
            y : 'یه‌ك ساڵ',
            yy : '%d ساڵ'
        },
        preparse: function (string) {
            return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
                return numberMap[match];
            }).replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            }).replace(/,/g, '،');
        },
        week : {
            dow : 6, // Saturday is the first day of the week.
            doy : 12 // The week that contains Jan 12th is the first week of the year.
        }
    });

    return ku;

})));


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var suffixes = {
        0: '-чү',
        1: '-чи',
        2: '-чи',
        3: '-чү',
        4: '-чү',
        5: '-чи',
        6: '-чы',
        7: '-чи',
        8: '-чи',
        9: '-чу',
        10: '-чу',
        20: '-чы',
        30: '-чу',
        40: '-чы',
        50: '-чү',
        60: '-чы',
        70: '-чи',
        80: '-чи',
        90: '-чу',
        100: '-чү'
    };

    var ky = moment.defineLocale('ky', {
        months : 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
        monthsShort : 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
        weekdays : 'Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби'.split('_'),
        weekdaysShort : 'Жек_Дүй_Шей_Шар_Бей_Жум_Ише'.split('_'),
        weekdaysMin : 'Жк_Дй_Шй_Шр_Бй_Жм_Иш'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Бүгүн саат] LT',
            nextDay : '[Эртең саат] LT',
            nextWeek : 'dddd [саат] LT',
            lastDay : '[Кечээ саат] LT',
            lastWeek : '[Өткөн аптанын] dddd [күнү] [саат] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s ичинде',
            past : '%s мурун',
            s : 'бирнече секунд',
            ss : '%d секунд',
            m : 'бир мүнөт',
            mm : '%d мүнөт',
            h : 'бир саат',
            hh : '%d саат',
            d : 'бир күн',
            dd : '%d күн',
            M : 'бир ай',
            MM : '%d ай',
            y : 'бир жыл',
            yy : '%d жыл'
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
        ordinal : function (number) {
            var a = number % 10,
                b = number >= 100 ? 100 : null;
            return number + (suffixes[number] || suffixes[a] || suffixes[b]);
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return ky;

})));


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            'm': ['eng Minutt', 'enger Minutt'],
            'h': ['eng Stonn', 'enger Stonn'],
            'd': ['een Dag', 'engem Dag'],
            'M': ['ee Mount', 'engem Mount'],
            'y': ['ee Joer', 'engem Joer']
        };
        return withoutSuffix ? format[key][0] : format[key][1];
    }
    function processFutureTime(string) {
        var number = string.substr(0, string.indexOf(' '));
        if (eifelerRegelAppliesToNumber(number)) {
            return 'a ' + string;
        }
        return 'an ' + string;
    }
    function processPastTime(string) {
        var number = string.substr(0, string.indexOf(' '));
        if (eifelerRegelAppliesToNumber(number)) {
            return 'viru ' + string;
        }
        return 'virun ' + string;
    }
    /**
     * Returns true if the word before the given number loses the '-n' ending.
     * e.g. 'an 10 Deeg' but 'a 5 Deeg'
     *
     * @param number {integer}
     * @returns {boolean}
     */
    function eifelerRegelAppliesToNumber(number) {
        number = parseInt(number, 10);
        if (isNaN(number)) {
            return false;
        }
        if (number < 0) {
            // Negative Number --> always true
            return true;
        } else if (number < 10) {
            // Only 1 digit
            if (4 <= number && number <= 7) {
                return true;
            }
            return false;
        } else if (number < 100) {
            // 2 digits
            var lastDigit = number % 10, firstDigit = number / 10;
            if (lastDigit === 0) {
                return eifelerRegelAppliesToNumber(firstDigit);
            }
            return eifelerRegelAppliesToNumber(lastDigit);
        } else if (number < 10000) {
            // 3 or 4 digits --> recursively check first digit
            while (number >= 10) {
                number = number / 10;
            }
            return eifelerRegelAppliesToNumber(number);
        } else {
            // Anything larger than 4 digits: recursively check first n-3 digits
            number = number / 1000;
            return eifelerRegelAppliesToNumber(number);
        }
    }

    var lb = moment.defineLocale('lb', {
        months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
        monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
        monthsParseExact : true,
        weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
        weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
        weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat: {
            LT: 'H:mm [Auer]',
            LTS: 'H:mm:ss [Auer]',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm [Auer]',
            LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]'
        },
        calendar: {
            sameDay: '[Haut um] LT',
            sameElse: 'L',
            nextDay: '[Muer um] LT',
            nextWeek: 'dddd [um] LT',
            lastDay: '[Gëschter um] LT',
            lastWeek: function () {
                // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
                switch (this.day()) {
                    case 2:
                    case 4:
                        return '[Leschten] dddd [um] LT';
                    default:
                        return '[Leschte] dddd [um] LT';
                }
            }
        },
        relativeTime : {
            future : processFutureTime,
            past : processPastTime,
            s : 'e puer Sekonnen',
            ss : '%d Sekonnen',
            m : processRelativeTime,
            mm : '%d Minutten',
            h : processRelativeTime,
            hh : '%d Stonnen',
            d : processRelativeTime,
            dd : '%d Deeg',
            M : processRelativeTime,
            MM : '%d Méint',
            y : processRelativeTime,
            yy : '%d Joer'
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: '%d.',
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return lb;

})));


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var lo = moment.defineLocale('lo', {
        months : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
        monthsShort : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
        weekdays : 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
        weekdaysShort : 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
        weekdaysMin : 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'ວັນdddd D MMMM YYYY HH:mm'
        },
        meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
        isPM: function (input) {
            return input === 'ຕອນແລງ';
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ຕອນເຊົ້າ';
            } else {
                return 'ຕອນແລງ';
            }
        },
        calendar : {
            sameDay : '[ມື້ນີ້ເວລາ] LT',
            nextDay : '[ມື້ອື່ນເວລາ] LT',
            nextWeek : '[ວັນ]dddd[ໜ້າເວລາ] LT',
            lastDay : '[ມື້ວານນີ້ເວລາ] LT',
            lastWeek : '[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'ອີກ %s',
            past : '%sຜ່ານມາ',
            s : 'ບໍ່ເທົ່າໃດວິນາທີ',
            ss : '%d ວິນາທີ' ,
            m : '1 ນາທີ',
            mm : '%d ນາທີ',
            h : '1 ຊົ່ວໂມງ',
            hh : '%d ຊົ່ວໂມງ',
            d : '1 ມື້',
            dd : '%d ມື້',
            M : '1 ເດືອນ',
            MM : '%d ເດືອນ',
            y : '1 ປີ',
            yy : '%d ປີ'
        },
        dayOfMonthOrdinalParse: /(ທີ່)\d{1,2}/,
        ordinal : function (number) {
            return 'ທີ່' + number;
        }
    });

    return lo;

})));


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var units = {
        'ss' : 'sekundė_sekundžių_sekundes',
        'm' : 'minutė_minutės_minutę',
        'mm': 'minutės_minučių_minutes',
        'h' : 'valanda_valandos_valandą',
        'hh': 'valandos_valandų_valandas',
        'd' : 'diena_dienos_dieną',
        'dd': 'dienos_dienų_dienas',
        'M' : 'mėnuo_mėnesio_mėnesį',
        'MM': 'mėnesiai_mėnesių_mėnesius',
        'y' : 'metai_metų_metus',
        'yy': 'metai_metų_metus'
    };
    function translateSeconds(number, withoutSuffix, key, isFuture) {
        if (withoutSuffix) {
            return 'kelios sekundės';
        } else {
            return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
        }
    }
    function translateSingular(number, withoutSuffix, key, isFuture) {
        return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
    }
    function special(number) {
        return number % 10 === 0 || (number > 10 && number < 20);
    }
    function forms(key) {
        return units[key].split('_');
    }
    function translate(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        if (number === 1) {
            return result + translateSingular(number, withoutSuffix, key[0], isFuture);
        } else if (withoutSuffix) {
            return result + (special(number) ? forms(key)[1] : forms(key)[0]);
        } else {
            if (isFuture) {
                return result + forms(key)[1];
            } else {
                return result + (special(number) ? forms(key)[1] : forms(key)[2]);
            }
        }
    }
    var lt = moment.defineLocale('lt', {
        months : {
            format: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
            standalone: 'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split('_'),
            isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
        },
        monthsShort : 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
        weekdays : {
            format: 'sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį'.split('_'),
            standalone: 'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_'),
            isFormat: /dddd HH:mm/
        },
        weekdaysShort : 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
        weekdaysMin : 'S_P_A_T_K_Pn_Š'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY-MM-DD',
            LL : 'YYYY [m.] MMMM D [d.]',
            LLL : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
            LLLL : 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
            l : 'YYYY-MM-DD',
            ll : 'YYYY [m.] MMMM D [d.]',
            lll : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
            llll : 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]'
        },
        calendar : {
            sameDay : '[Šiandien] LT',
            nextDay : '[Rytoj] LT',
            nextWeek : 'dddd LT',
            lastDay : '[Vakar] LT',
            lastWeek : '[Praėjusį] dddd LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'po %s',
            past : 'prieš %s',
            s : translateSeconds,
            ss : translate,
            m : translateSingular,
            mm : translate,
            h : translateSingular,
            hh : translate,
            d : translateSingular,
            dd : translate,
            M : translateSingular,
            MM : translate,
            y : translateSingular,
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}-oji/,
        ordinal : function (number) {
            return number + '-oji';
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return lt;

})));


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var units = {
        'ss': 'sekundes_sekundēm_sekunde_sekundes'.split('_'),
        'm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
        'mm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
        'h': 'stundas_stundām_stunda_stundas'.split('_'),
        'hh': 'stundas_stundām_stunda_stundas'.split('_'),
        'd': 'dienas_dienām_diena_dienas'.split('_'),
        'dd': 'dienas_dienām_diena_dienas'.split('_'),
        'M': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
        'MM': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
        'y': 'gada_gadiem_gads_gadi'.split('_'),
        'yy': 'gada_gadiem_gads_gadi'.split('_')
    };
    /**
     * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
     */
    function format(forms, number, withoutSuffix) {
        if (withoutSuffix) {
            // E.g. "21 minūte", "3 minūtes".
            return number % 10 === 1 && number % 100 !== 11 ? forms[2] : forms[3];
        } else {
            // E.g. "21 minūtes" as in "pēc 21 minūtes".
            // E.g. "3 minūtēm" as in "pēc 3 minūtēm".
            return number % 10 === 1 && number % 100 !== 11 ? forms[0] : forms[1];
        }
    }
    function relativeTimeWithPlural(number, withoutSuffix, key) {
        return number + ' ' + format(units[key], number, withoutSuffix);
    }
    function relativeTimeWithSingular(number, withoutSuffix, key) {
        return format(units[key], number, withoutSuffix);
    }
    function relativeSeconds(number, withoutSuffix) {
        return withoutSuffix ? 'dažas sekundes' : 'dažām sekundēm';
    }

    var lv = moment.defineLocale('lv', {
        months : 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
        monthsShort : 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
        weekdays : 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
        weekdaysShort : 'Sv_P_O_T_C_Pk_S'.split('_'),
        weekdaysMin : 'Sv_P_O_T_C_Pk_S'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY.',
            LL : 'YYYY. [gada] D. MMMM',
            LLL : 'YYYY. [gada] D. MMMM, HH:mm',
            LLLL : 'YYYY. [gada] D. MMMM, dddd, HH:mm'
        },
        calendar : {
            sameDay : '[Šodien pulksten] LT',
            nextDay : '[Rīt pulksten] LT',
            nextWeek : 'dddd [pulksten] LT',
            lastDay : '[Vakar pulksten] LT',
            lastWeek : '[Pagājušā] dddd [pulksten] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'pēc %s',
            past : 'pirms %s',
            s : relativeSeconds,
            ss : relativeTimeWithPlural,
            m : relativeTimeWithSingular,
            mm : relativeTimeWithPlural,
            h : relativeTimeWithSingular,
            hh : relativeTimeWithPlural,
            d : relativeTimeWithSingular,
            dd : relativeTimeWithPlural,
            M : relativeTimeWithSingular,
            MM : relativeTimeWithPlural,
            y : relativeTimeWithSingular,
            yy : relativeTimeWithPlural
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return lv;

})));


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var translator = {
        words: { //Different grammatical cases
            ss: ['sekund', 'sekunda', 'sekundi'],
            m: ['jedan minut', 'jednog minuta'],
            mm: ['minut', 'minuta', 'minuta'],
            h: ['jedan sat', 'jednog sata'],
            hh: ['sat', 'sata', 'sati'],
            dd: ['dan', 'dana', 'dana'],
            MM: ['mjesec', 'mjeseca', 'mjeseci'],
            yy: ['godina', 'godine', 'godina']
        },
        correctGrammaticalCase: function (number, wordKey) {
            return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
        },
        translate: function (number, withoutSuffix, key) {
            var wordKey = translator.words[key];
            if (key.length === 1) {
                return withoutSuffix ? wordKey[0] : wordKey[1];
            } else {
                return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
            }
        }
    };

    var me = moment.defineLocale('me', {
        months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
        monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
        monthsParseExact : true,
        weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
        weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
        weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
        weekdaysParseExact : true,
        longDateFormat: {
            LT: 'H:mm',
            LTS : 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm',
            LLLL: 'dddd, D. MMMM YYYY H:mm'
        },
        calendar: {
            sameDay: '[danas u] LT',
            nextDay: '[sjutra u] LT',

            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[u] [nedjelju] [u] LT';
                    case 3:
                        return '[u] [srijedu] [u] LT';
                    case 6:
                        return '[u] [subotu] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[u] dddd [u] LT';
                }
            },
            lastDay  : '[juče u] LT',
            lastWeek : function () {
                var lastWeekDays = [
                    '[prošle] [nedjelje] [u] LT',
                    '[prošlog] [ponedjeljka] [u] LT',
                    '[prošlog] [utorka] [u] LT',
                    '[prošle] [srijede] [u] LT',
                    '[prošlog] [četvrtka] [u] LT',
                    '[prošlog] [petka] [u] LT',
                    '[prošle] [subote] [u] LT'
                ];
                return lastWeekDays[this.day()];
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'za %s',
            past   : 'prije %s',
            s      : 'nekoliko sekundi',
            ss     : translator.translate,
            m      : translator.translate,
            mm     : translator.translate,
            h      : translator.translate,
            hh     : translator.translate,
            d      : 'dan',
            dd     : translator.translate,
            M      : 'mjesec',
            MM     : translator.translate,
            y      : 'godinu',
            yy     : translator.translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return me;

})));


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var mi = moment.defineLocale('mi', {
        months: 'Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea'.split('_'),
        monthsShort: 'Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split('_'),
        monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
        monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
        monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
        monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
        weekdays: 'Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei'.split('_'),
        weekdaysShort: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
        weekdaysMin: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY [i] HH:mm',
            LLLL: 'dddd, D MMMM YYYY [i] HH:mm'
        },
        calendar: {
            sameDay: '[i teie mahana, i] LT',
            nextDay: '[apopo i] LT',
            nextWeek: 'dddd [i] LT',
            lastDay: '[inanahi i] LT',
            lastWeek: 'dddd [whakamutunga i] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: 'i roto i %s',
            past: '%s i mua',
            s: 'te hēkona ruarua',
            ss: '%d hēkona',
            m: 'he meneti',
            mm: '%d meneti',
            h: 'te haora',
            hh: '%d haora',
            d: 'he ra',
            dd: '%d ra',
            M: 'he marama',
            MM: '%d marama',
            y: 'he tau',
            yy: '%d tau'
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return mi;

})));


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var mk = moment.defineLocale('mk', {
        months : 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
        monthsShort : 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
        weekdays : 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
        weekdaysShort : 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
        weekdaysMin : 'нe_пo_вт_ср_че_пе_сa'.split('_'),
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'D.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY H:mm',
            LLLL : 'dddd, D MMMM YYYY H:mm'
        },
        calendar : {
            sameDay : '[Денес во] LT',
            nextDay : '[Утре во] LT',
            nextWeek : '[Во] dddd [во] LT',
            lastDay : '[Вчера во] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                    case 3:
                    case 6:
                        return '[Изминатата] dddd [во] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[Изминатиот] dddd [во] LT';
                }
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'после %s',
            past : 'пред %s',
            s : 'неколку секунди',
            ss : '%d секунди',
            m : 'минута',
            mm : '%d минути',
            h : 'час',
            hh : '%d часа',
            d : 'ден',
            dd : '%d дена',
            M : 'месец',
            MM : '%d месеци',
            y : 'година',
            yy : '%d години'
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
        ordinal : function (number) {
            var lastDigit = number % 10,
                last2Digits = number % 100;
            if (number === 0) {
                return number + '-ев';
            } else if (last2Digits === 0) {
                return number + '-ен';
            } else if (last2Digits > 10 && last2Digits < 20) {
                return number + '-ти';
            } else if (lastDigit === 1) {
                return number + '-ви';
            } else if (lastDigit === 2) {
                return number + '-ри';
            } else if (lastDigit === 7 || lastDigit === 8) {
                return number + '-ми';
            } else {
                return number + '-ти';
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return mk;

})));


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var ml = moment.defineLocale('ml', {
        months : 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
        monthsShort : 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
        monthsParseExact : true,
        weekdays : 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
        weekdaysShort : 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
        weekdaysMin : 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
        longDateFormat : {
            LT : 'A h:mm -നു',
            LTS : 'A h:mm:ss -നു',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, A h:mm -നു',
            LLLL : 'dddd, D MMMM YYYY, A h:mm -നു'
        },
        calendar : {
            sameDay : '[ഇന്ന്] LT',
            nextDay : '[നാളെ] LT',
            nextWeek : 'dddd, LT',
            lastDay : '[ഇന്നലെ] LT',
            lastWeek : '[കഴിഞ്ഞ] dddd, LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s കഴിഞ്ഞ്',
            past : '%s മുൻപ്',
            s : 'അൽപ നിമിഷങ്ങൾ',
            ss : '%d സെക്കൻഡ്',
            m : 'ഒരു മിനിറ്റ്',
            mm : '%d മിനിറ്റ്',
            h : 'ഒരു മണിക്കൂർ',
            hh : '%d മണിക്കൂർ',
            d : 'ഒരു ദിവസം',
            dd : '%d ദിവസം',
            M : 'ഒരു മാസം',
            MM : '%d മാസം',
            y : 'ഒരു വർഷം',
            yy : '%d വർഷം'
        },
        meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if ((meridiem === 'രാത്രി' && hour >= 4) ||
                    meridiem === 'ഉച്ച കഴിഞ്ഞ്' ||
                    meridiem === 'വൈകുന്നേരം') {
                return hour + 12;
            } else {
                return hour;
            }
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'രാത്രി';
            } else if (hour < 12) {
                return 'രാവിലെ';
            } else if (hour < 17) {
                return 'ഉച്ച കഴിഞ്ഞ്';
            } else if (hour < 20) {
                return 'വൈകുന്നേരം';
            } else {
                return 'രാത്രി';
            }
        }
    });

    return ml;

})));


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function translate(number, withoutSuffix, key, isFuture) {
        switch (key) {
            case 's':
                return withoutSuffix ? 'хэдхэн секунд' : 'хэдхэн секундын';
            case 'ss':
                return number + (withoutSuffix ? ' секунд' : ' секундын');
            case 'm':
            case 'mm':
                return number + (withoutSuffix ? ' минут' : ' минутын');
            case 'h':
            case 'hh':
                return number + (withoutSuffix ? ' цаг' : ' цагийн');
            case 'd':
            case 'dd':
                return number + (withoutSuffix ? ' өдөр' : ' өдрийн');
            case 'M':
            case 'MM':
                return number + (withoutSuffix ? ' сар' : ' сарын');
            case 'y':
            case 'yy':
                return number + (withoutSuffix ? ' жил' : ' жилийн');
            default:
                return number;
        }
    }

    var mn = moment.defineLocale('mn', {
        months : 'Нэгдүгээр сар_Хоёрдугаар сар_Гуравдугаар сар_Дөрөвдүгээр сар_Тавдугаар сар_Зургадугаар сар_Долдугаар сар_Наймдугаар сар_Есдүгээр сар_Аравдугаар сар_Арван нэгдүгээр сар_Арван хоёрдугаар сар'.split('_'),
        monthsShort : '1 сар_2 сар_3 сар_4 сар_5 сар_6 сар_7 сар_8 сар_9 сар_10 сар_11 сар_12 сар'.split('_'),
        monthsParseExact : true,
        weekdays : 'Ням_Даваа_Мягмар_Лхагва_Пүрэв_Баасан_Бямба'.split('_'),
        weekdaysShort : 'Ням_Дав_Мяг_Лха_Пүр_Баа_Бям'.split('_'),
        weekdaysMin : 'Ня_Да_Мя_Лх_Пү_Ба_Бя'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY-MM-DD',
            LL : 'YYYY оны MMMMын D',
            LLL : 'YYYY оны MMMMын D HH:mm',
            LLLL : 'dddd, YYYY оны MMMMын D HH:mm'
        },
        meridiemParse: /ҮӨ|ҮХ/i,
        isPM : function (input) {
            return input === 'ҮХ';
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ҮӨ';
            } else {
                return 'ҮХ';
            }
        },
        calendar : {
            sameDay : '[Өнөөдөр] LT',
            nextDay : '[Маргааш] LT',
            nextWeek : '[Ирэх] dddd LT',
            lastDay : '[Өчигдөр] LT',
            lastWeek : '[Өнгөрсөн] dddd LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s дараа',
            past : '%s өмнө',
            s : translate,
            ss : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2} өдөр/,
        ordinal : function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'DDD':
                    return number + ' өдөр';
                default:
                    return number;
            }
        }
    });

    return mn;

})));


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '१',
        '2': '२',
        '3': '३',
        '4': '४',
        '5': '५',
        '6': '६',
        '7': '७',
        '8': '८',
        '9': '९',
        '0': '०'
    },
    numberMap = {
        '१': '1',
        '२': '2',
        '३': '3',
        '४': '4',
        '५': '5',
        '६': '6',
        '७': '7',
        '८': '8',
        '९': '9',
        '०': '0'
    };

    function relativeTimeMr(number, withoutSuffix, string, isFuture)
    {
        var output = '';
        if (withoutSuffix) {
            switch (string) {
                case 's': output = 'काही सेकंद'; break;
                case 'ss': output = '%d सेकंद'; break;
                case 'm': output = 'एक मिनिट'; break;
                case 'mm': output = '%d मिनिटे'; break;
                case 'h': output = 'एक तास'; break;
                case 'hh': output = '%d तास'; break;
                case 'd': output = 'एक दिवस'; break;
                case 'dd': output = '%d दिवस'; break;
                case 'M': output = 'एक महिना'; break;
                case 'MM': output = '%d महिने'; break;
                case 'y': output = 'एक वर्ष'; break;
                case 'yy': output = '%d वर्षे'; break;
            }
        }
        else {
            switch (string) {
                case 's': output = 'काही सेकंदां'; break;
                case 'ss': output = '%d सेकंदां'; break;
                case 'm': output = 'एका मिनिटा'; break;
                case 'mm': output = '%d मिनिटां'; break;
                case 'h': output = 'एका तासा'; break;
                case 'hh': output = '%d तासां'; break;
                case 'd': output = 'एका दिवसा'; break;
                case 'dd': output = '%d दिवसां'; break;
                case 'M': output = 'एका महिन्या'; break;
                case 'MM': output = '%d महिन्यां'; break;
                case 'y': output = 'एका वर्षा'; break;
                case 'yy': output = '%d वर्षां'; break;
            }
        }
        return output.replace(/%d/i, number);
    }

    var mr = moment.defineLocale('mr', {
        months : 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
        monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
        monthsParseExact : true,
        weekdays : 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
        weekdaysShort : 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
        weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
        longDateFormat : {
            LT : 'A h:mm वाजता',
            LTS : 'A h:mm:ss वाजता',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, A h:mm वाजता',
            LLLL : 'dddd, D MMMM YYYY, A h:mm वाजता'
        },
        calendar : {
            sameDay : '[आज] LT',
            nextDay : '[उद्या] LT',
            nextWeek : 'dddd, LT',
            lastDay : '[काल] LT',
            lastWeek: '[मागील] dddd, LT',
            sameElse : 'L'
        },
        relativeTime : {
            future: '%sमध्ये',
            past: '%sपूर्वी',
            s: relativeTimeMr,
            ss: relativeTimeMr,
            m: relativeTimeMr,
            mm: relativeTimeMr,
            h: relativeTimeMr,
            hh: relativeTimeMr,
            d: relativeTimeMr,
            dd: relativeTimeMr,
            M: relativeTimeMr,
            MM: relativeTimeMr,
            y: relativeTimeMr,
            yy: relativeTimeMr
        },
        preparse: function (string) {
            return string.replace(/[१२३४५६७८९०]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'रात्री') {
                return hour < 4 ? hour : hour + 12;
            } else if (meridiem === 'सकाळी') {
                return hour;
            } else if (meridiem === 'दुपारी') {
                return hour >= 10 ? hour : hour + 12;
            } else if (meridiem === 'सायंकाळी') {
                return hour + 12;
            }
        },
        meridiem: function (hour, minute, isLower) {
            if (hour < 4) {
                return 'रात्री';
            } else if (hour < 10) {
                return 'सकाळी';
            } else if (hour < 17) {
                return 'दुपारी';
            } else if (hour < 20) {
                return 'सायंकाळी';
            } else {
                return 'रात्री';
            }
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return mr;

})));


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var ms = moment.defineLocale('ms', {
        months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
        monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
        weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
        weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
        weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
        longDateFormat : {
            LT : 'HH.mm',
            LTS : 'HH.mm.ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY [pukul] HH.mm',
            LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
        },
        meridiemParse: /pagi|tengahari|petang|malam/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'pagi') {
                return hour;
            } else if (meridiem === 'tengahari') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === 'petang' || meridiem === 'malam') {
                return hour + 12;
            }
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours < 11) {
                return 'pagi';
            } else if (hours < 15) {
                return 'tengahari';
            } else if (hours < 19) {
                return 'petang';
            } else {
                return 'malam';
            }
        },
        calendar : {
            sameDay : '[Hari ini pukul] LT',
            nextDay : '[Esok pukul] LT',
            nextWeek : 'dddd [pukul] LT',
            lastDay : '[Kelmarin pukul] LT',
            lastWeek : 'dddd [lepas pukul] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dalam %s',
            past : '%s yang lepas',
            s : 'beberapa saat',
            ss : '%d saat',
            m : 'seminit',
            mm : '%d minit',
            h : 'sejam',
            hh : '%d jam',
            d : 'sehari',
            dd : '%d hari',
            M : 'sebulan',
            MM : '%d bulan',
            y : 'setahun',
            yy : '%d tahun'
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return ms;

})));


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var msMy = moment.defineLocale('ms-my', {
        months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
        monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
        weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
        weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
        weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
        longDateFormat : {
            LT : 'HH.mm',
            LTS : 'HH.mm.ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY [pukul] HH.mm',
            LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
        },
        meridiemParse: /pagi|tengahari|petang|malam/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'pagi') {
                return hour;
            } else if (meridiem === 'tengahari') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === 'petang' || meridiem === 'malam') {
                return hour + 12;
            }
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours < 11) {
                return 'pagi';
            } else if (hours < 15) {
                return 'tengahari';
            } else if (hours < 19) {
                return 'petang';
            } else {
                return 'malam';
            }
        },
        calendar : {
            sameDay : '[Hari ini pukul] LT',
            nextDay : '[Esok pukul] LT',
            nextWeek : 'dddd [pukul] LT',
            lastDay : '[Kelmarin pukul] LT',
            lastWeek : 'dddd [lepas pukul] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dalam %s',
            past : '%s yang lepas',
            s : 'beberapa saat',
            ss : '%d saat',
            m : 'seminit',
            mm : '%d minit',
            h : 'sejam',
            hh : '%d jam',
            d : 'sehari',
            dd : '%d hari',
            M : 'sebulan',
            MM : '%d bulan',
            y : 'setahun',
            yy : '%d tahun'
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return msMy;

})));


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var mt = moment.defineLocale('mt', {
        months : 'Jannar_Frar_Marzu_April_Mejju_Ġunju_Lulju_Awwissu_Settembru_Ottubru_Novembru_Diċembru'.split('_'),
        monthsShort : 'Jan_Fra_Mar_Apr_Mej_Ġun_Lul_Aww_Set_Ott_Nov_Diċ'.split('_'),
        weekdays : 'Il-Ħadd_It-Tnejn_It-Tlieta_L-Erbgħa_Il-Ħamis_Il-Ġimgħa_Is-Sibt'.split('_'),
        weekdaysShort : 'Ħad_Tne_Tli_Erb_Ħam_Ġim_Sib'.split('_'),
        weekdaysMin : 'Ħa_Tn_Tl_Er_Ħa_Ġi_Si'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Illum fil-]LT',
            nextDay : '[Għada fil-]LT',
            nextWeek : 'dddd [fil-]LT',
            lastDay : '[Il-bieraħ fil-]LT',
            lastWeek : 'dddd [li għadda] [fil-]LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'f’ %s',
            past : '%s ilu',
            s : 'ftit sekondi',
            ss : '%d sekondi',
            m : 'minuta',
            mm : '%d minuti',
            h : 'siegħa',
            hh : '%d siegħat',
            d : 'ġurnata',
            dd : '%d ġranet',
            M : 'xahar',
            MM : '%d xhur',
            y : 'sena',
            yy : '%d sni'
        },
        dayOfMonthOrdinalParse : /\d{1,2}º/,
        ordinal: '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return mt;

})));


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '၁',
        '2': '၂',
        '3': '၃',
        '4': '၄',
        '5': '၅',
        '6': '၆',
        '7': '၇',
        '8': '၈',
        '9': '၉',
        '0': '၀'
    }, numberMap = {
        '၁': '1',
        '၂': '2',
        '၃': '3',
        '၄': '4',
        '၅': '5',
        '၆': '6',
        '၇': '7',
        '၈': '8',
        '၉': '9',
        '၀': '0'
    };

    var my = moment.defineLocale('my', {
        months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
        monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
        weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
        weekdaysShort: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
        weekdaysMin: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),

        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm'
        },
        calendar: {
            sameDay: '[ယနေ.] LT [မှာ]',
            nextDay: '[မနက်ဖြန်] LT [မှာ]',
            nextWeek: 'dddd LT [မှာ]',
            lastDay: '[မနေ.က] LT [မှာ]',
            lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
            sameElse: 'L'
        },
        relativeTime: {
            future: 'လာမည့် %s မှာ',
            past: 'လွန်ခဲ့သော %s က',
            s: 'စက္ကန်.အနည်းငယ်',
            ss : '%d စက္ကန့်',
            m: 'တစ်မိနစ်',
            mm: '%d မိနစ်',
            h: 'တစ်နာရီ',
            hh: '%d နာရီ',
            d: 'တစ်ရက်',
            dd: '%d ရက်',
            M: 'တစ်လ',
            MM: '%d လ',
            y: 'တစ်နှစ်',
            yy: '%d နှစ်'
        },
        preparse: function (string) {
            return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4 // The week that contains Jan 4th is the first week of the year.
        }
    });

    return my;

})));


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var nb = moment.defineLocale('nb', {
        months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
        monthsShort : 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
        monthsParseExact : true,
        weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
        weekdaysShort : 'sø._ma._ti._on._to._fr._lø.'.split('_'),
        weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY [kl.] HH:mm',
            LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
        },
        calendar : {
            sameDay: '[i dag kl.] LT',
            nextDay: '[i morgen kl.] LT',
            nextWeek: 'dddd [kl.] LT',
            lastDay: '[i går kl.] LT',
            lastWeek: '[forrige] dddd [kl.] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'om %s',
            past : '%s siden',
            s : 'noen sekunder',
            ss : '%d sekunder',
            m : 'ett minutt',
            mm : '%d minutter',
            h : 'en time',
            hh : '%d timer',
            d : 'en dag',
            dd : '%d dager',
            M : 'en måned',
            MM : '%d måneder',
            y : 'ett år',
            yy : '%d år'
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return nb;

})));


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '१',
        '2': '२',
        '3': '३',
        '4': '४',
        '5': '५',
        '6': '६',
        '7': '७',
        '8': '८',
        '9': '९',
        '0': '०'
    },
    numberMap = {
        '१': '1',
        '२': '2',
        '३': '3',
        '४': '4',
        '५': '5',
        '६': '6',
        '७': '7',
        '८': '8',
        '९': '9',
        '०': '0'
    };

    var ne = moment.defineLocale('ne', {
        months : 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
        monthsShort : 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
        monthsParseExact : true,
        weekdays : 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
        weekdaysShort : 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
        weekdaysMin : 'आ._सो._मं._बु._बि._शु._श.'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'Aको h:mm बजे',
            LTS : 'Aको h:mm:ss बजे',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, Aको h:mm बजे',
            LLLL : 'dddd, D MMMM YYYY, Aको h:mm बजे'
        },
        preparse: function (string) {
            return string.replace(/[१२३४५६७८९०]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'राति') {
                return hour < 4 ? hour : hour + 12;
            } else if (meridiem === 'बिहान') {
                return hour;
            } else if (meridiem === 'दिउँसो') {
                return hour >= 10 ? hour : hour + 12;
            } else if (meridiem === 'साँझ') {
                return hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 3) {
                return 'राति';
            } else if (hour < 12) {
                return 'बिहान';
            } else if (hour < 16) {
                return 'दिउँसो';
            } else if (hour < 20) {
                return 'साँझ';
            } else {
                return 'राति';
            }
        },
        calendar : {
            sameDay : '[आज] LT',
            nextDay : '[भोलि] LT',
            nextWeek : '[आउँदो] dddd[,] LT',
            lastDay : '[हिजो] LT',
            lastWeek : '[गएको] dddd[,] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%sमा',
            past : '%s अगाडि',
            s : 'केही क्षण',
            ss : '%d सेकेण्ड',
            m : 'एक मिनेट',
            mm : '%d मिनेट',
            h : 'एक घण्टा',
            hh : '%d घण्टा',
            d : 'एक दिन',
            dd : '%d दिन',
            M : 'एक महिना',
            MM : '%d महिना',
            y : 'एक बर्ष',
            yy : '%d बर्ष'
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return ne;

})));


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
        monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

    var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
    var monthsRegex = /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

    var nl = moment.defineLocale('nl', {
        months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
        monthsShort : function (m, format) {
            if (!m) {
                return monthsShortWithDots;
            } else if (/-MMM-/.test(format)) {
                return monthsShortWithoutDots[m.month()];
            } else {
                return monthsShortWithDots[m.month()];
            }
        },

        monthsRegex: monthsRegex,
        monthsShortRegex: monthsRegex,
        monthsStrictRegex: /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
        monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

        monthsParse : monthsParse,
        longMonthsParse : monthsParse,
        shortMonthsParse : monthsParse,

        weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
        weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
        weekdaysMin : 'zo_ma_di_wo_do_vr_za'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD-MM-YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[vandaag om] LT',
            nextDay: '[morgen om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[gisteren om] LT',
            lastWeek: '[afgelopen] dddd [om] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'over %s',
            past : '%s geleden',
            s : 'een paar seconden',
            ss : '%d seconden',
            m : 'één minuut',
            mm : '%d minuten',
            h : 'één uur',
            hh : '%d uur',
            d : 'één dag',
            dd : '%d dagen',
            M : 'één maand',
            MM : '%d maanden',
            y : 'één jaar',
            yy : '%d jaar'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal : function (number) {
            return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return nl;

})));


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
        monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

    var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
    var monthsRegex = /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

    var nlBe = moment.defineLocale('nl-be', {
        months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
        monthsShort : function (m, format) {
            if (!m) {
                return monthsShortWithDots;
            } else if (/-MMM-/.test(format)) {
                return monthsShortWithoutDots[m.month()];
            } else {
                return monthsShortWithDots[m.month()];
            }
        },

        monthsRegex: monthsRegex,
        monthsShortRegex: monthsRegex,
        monthsStrictRegex: /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
        monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

        monthsParse : monthsParse,
        longMonthsParse : monthsParse,
        shortMonthsParse : monthsParse,

        weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
        weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
        weekdaysMin : 'zo_ma_di_wo_do_vr_za'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[vandaag om] LT',
            nextDay: '[morgen om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[gisteren om] LT',
            lastWeek: '[afgelopen] dddd [om] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'over %s',
            past : '%s geleden',
            s : 'een paar seconden',
            ss : '%d seconden',
            m : 'één minuut',
            mm : '%d minuten',
            h : 'één uur',
            hh : '%d uur',
            d : 'één dag',
            dd : '%d dagen',
            M : 'één maand',
            MM : '%d maanden',
            y : 'één jaar',
            yy : '%d jaar'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal : function (number) {
            return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return nlBe;

})));


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var nn = moment.defineLocale('nn', {
        months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
        monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
        weekdays : 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
        weekdaysShort : 'sun_mån_tys_ons_tor_fre_lau'.split('_'),
        weekdaysMin : 'su_må_ty_on_to_fr_lø'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY [kl.] H:mm',
            LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
        },
        calendar : {
            sameDay: '[I dag klokka] LT',
            nextDay: '[I morgon klokka] LT',
            nextWeek: 'dddd [klokka] LT',
            lastDay: '[I går klokka] LT',
            lastWeek: '[Føregåande] dddd [klokka] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'om %s',
            past : '%s sidan',
            s : 'nokre sekund',
            ss : '%d sekund',
            m : 'eit minutt',
            mm : '%d minutt',
            h : 'ein time',
            hh : '%d timar',
            d : 'ein dag',
            dd : '%d dagar',
            M : 'ein månad',
            MM : '%d månader',
            y : 'eit år',
            yy : '%d år'
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return nn;

})));


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '੧',
        '2': '੨',
        '3': '੩',
        '4': '੪',
        '5': '੫',
        '6': '੬',
        '7': '੭',
        '8': '੮',
        '9': '੯',
        '0': '੦'
    },
    numberMap = {
        '੧': '1',
        '੨': '2',
        '੩': '3',
        '੪': '4',
        '੫': '5',
        '੬': '6',
        '੭': '7',
        '੮': '8',
        '੯': '9',
        '੦': '0'
    };

    var paIn = moment.defineLocale('pa-in', {
        // There are months name as per Nanakshahi Calendar but they are not used as rigidly in modern Punjabi.
        months : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
        monthsShort : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
        weekdays : 'ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ'.split('_'),
        weekdaysShort : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
        weekdaysMin : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
        longDateFormat : {
            LT : 'A h:mm ਵਜੇ',
            LTS : 'A h:mm:ss ਵਜੇ',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, A h:mm ਵਜੇ',
            LLLL : 'dddd, D MMMM YYYY, A h:mm ਵਜੇ'
        },
        calendar : {
            sameDay : '[ਅਜ] LT',
            nextDay : '[ਕਲ] LT',
            nextWeek : '[ਅਗਲਾ] dddd, LT',
            lastDay : '[ਕਲ] LT',
            lastWeek : '[ਪਿਛਲੇ] dddd, LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s ਵਿੱਚ',
            past : '%s ਪਿਛਲੇ',
            s : 'ਕੁਝ ਸਕਿੰਟ',
            ss : '%d ਸਕਿੰਟ',
            m : 'ਇਕ ਮਿੰਟ',
            mm : '%d ਮਿੰਟ',
            h : 'ਇੱਕ ਘੰਟਾ',
            hh : '%d ਘੰਟੇ',
            d : 'ਇੱਕ ਦਿਨ',
            dd : '%d ਦਿਨ',
            M : 'ਇੱਕ ਮਹੀਨਾ',
            MM : '%d ਮਹੀਨੇ',
            y : 'ਇੱਕ ਸਾਲ',
            yy : '%d ਸਾਲ'
        },
        preparse: function (string) {
            return string.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        // Punjabi notation for meridiems are quite fuzzy in practice. While there exists
        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
        meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'ਰਾਤ') {
                return hour < 4 ? hour : hour + 12;
            } else if (meridiem === 'ਸਵੇਰ') {
                return hour;
            } else if (meridiem === 'ਦੁਪਹਿਰ') {
                return hour >= 10 ? hour : hour + 12;
            } else if (meridiem === 'ਸ਼ਾਮ') {
                return hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'ਰਾਤ';
            } else if (hour < 10) {
                return 'ਸਵੇਰ';
            } else if (hour < 17) {
                return 'ਦੁਪਹਿਰ';
            } else if (hour < 20) {
                return 'ਸ਼ਾਮ';
            } else {
                return 'ਰਾਤ';
            }
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return paIn;

})));


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_'),
        monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');
    function plural(n) {
        return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
    }
    function translate(number, withoutSuffix, key) {
        var result = number + ' ';
        switch (key) {
            case 'ss':
                return result + (plural(number) ? 'sekundy' : 'sekund');
            case 'm':
                return withoutSuffix ? 'minuta' : 'minutę';
            case 'mm':
                return result + (plural(number) ? 'minuty' : 'minut');
            case 'h':
                return withoutSuffix  ? 'godzina'  : 'godzinę';
            case 'hh':
                return result + (plural(number) ? 'godziny' : 'godzin');
            case 'MM':
                return result + (plural(number) ? 'miesiące' : 'miesięcy');
            case 'yy':
                return result + (plural(number) ? 'lata' : 'lat');
        }
    }

    var pl = moment.defineLocale('pl', {
        months : function (momentToFormat, format) {
            if (!momentToFormat) {
                return monthsNominative;
            } else if (format === '') {
                // Hack: if format empty we know this is used to generate
                // RegExp by moment. Give then back both valid forms of months
                // in RegExp ready format.
                return '(' + monthsSubjective[momentToFormat.month()] + '|' + monthsNominative[momentToFormat.month()] + ')';
            } else if (/D MMMM/.test(format)) {
                return monthsSubjective[momentToFormat.month()];
            } else {
                return monthsNominative[momentToFormat.month()];
            }
        },
        monthsShort : 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
        weekdays : 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
        weekdaysShort : 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
        weekdaysMin : 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[Dziś o] LT',
            nextDay: '[Jutro o] LT',
            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[W niedzielę o] LT';

                    case 2:
                        return '[We wtorek o] LT';

                    case 3:
                        return '[W środę o] LT';

                    case 6:
                        return '[W sobotę o] LT';

                    default:
                        return '[W] dddd [o] LT';
                }
            },
            lastDay: '[Wczoraj o] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[W zeszłą niedzielę o] LT';
                    case 3:
                        return '[W zeszłą środę o] LT';
                    case 6:
                        return '[W zeszłą sobotę o] LT';
                    default:
                        return '[W zeszły] dddd [o] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'za %s',
            past : '%s temu',
            s : 'kilka sekund',
            ss : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : '1 dzień',
            dd : '%d dni',
            M : 'miesiąc',
            MM : translate,
            y : 'rok',
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return pl;

})));


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var pt = moment.defineLocale('pt', {
        months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
        weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        weekdaysMin : 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY HH:mm',
            LLLL : 'dddd, D [de] MMMM [de] YYYY HH:mm'
        },
        calendar : {
            sameDay: '[Hoje às] LT',
            nextDay: '[Amanhã às] LT',
            nextWeek: 'dddd [às] LT',
            lastDay: '[Ontem às] LT',
            lastWeek: function () {
                return (this.day() === 0 || this.day() === 6) ?
                    '[Último] dddd [às] LT' : // Saturday + Sunday
                    '[Última] dddd [às] LT'; // Monday - Friday
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'em %s',
            past : 'há %s',
            s : 'segundos',
            ss : '%d segundos',
            m : 'um minuto',
            mm : '%d minutos',
            h : 'uma hora',
            hh : '%d horas',
            d : 'um dia',
            dd : '%d dias',
            M : 'um mês',
            MM : '%d meses',
            y : 'um ano',
            yy : '%d anos'
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal : '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return pt;

})));


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var ptBr = moment.defineLocale('pt-br', {
        months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
        weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        weekdaysMin : 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY [às] HH:mm',
            LLLL : 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
        },
        calendar : {
            sameDay: '[Hoje às] LT',
            nextDay: '[Amanhã às] LT',
            nextWeek: 'dddd [às] LT',
            lastDay: '[Ontem às] LT',
            lastWeek: function () {
                return (this.day() === 0 || this.day() === 6) ?
                    '[Último] dddd [às] LT' : // Saturday + Sunday
                    '[Última] dddd [às] LT'; // Monday - Friday
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'em %s',
            past : 'há %s',
            s : 'poucos segundos',
            ss : '%d segundos',
            m : 'um minuto',
            mm : '%d minutos',
            h : 'uma hora',
            hh : '%d horas',
            d : 'um dia',
            dd : '%d dias',
            M : 'um mês',
            MM : '%d meses',
            y : 'um ano',
            yy : '%d anos'
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal : '%dº'
    });

    return ptBr;

})));


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function relativeTimeWithPlural(number, withoutSuffix, key) {
        var format = {
                'ss': 'secunde',
                'mm': 'minute',
                'hh': 'ore',
                'dd': 'zile',
                'MM': 'luni',
                'yy': 'ani'
            },
            separator = ' ';
        if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
            separator = ' de ';
        }
        return number + separator + format[key];
    }

    var ro = moment.defineLocale('ro', {
        months : 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
        monthsShort : 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
        monthsParseExact: true,
        weekdays : 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
        weekdaysShort : 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
        weekdaysMin : 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY H:mm',
            LLLL : 'dddd, D MMMM YYYY H:mm'
        },
        calendar : {
            sameDay: '[azi la] LT',
            nextDay: '[mâine la] LT',
            nextWeek: 'dddd [la] LT',
            lastDay: '[ieri la] LT',
            lastWeek: '[fosta] dddd [la] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'peste %s',
            past : '%s în urmă',
            s : 'câteva secunde',
            ss : relativeTimeWithPlural,
            m : 'un minut',
            mm : relativeTimeWithPlural,
            h : 'o oră',
            hh : relativeTimeWithPlural,
            d : 'o zi',
            dd : relativeTimeWithPlural,
            M : 'o lună',
            MM : relativeTimeWithPlural,
            y : 'un an',
            yy : relativeTimeWithPlural
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return ro;

})));


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function plural(word, num) {
        var forms = word.split('_');
        return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
    }
    function relativeTimeWithPlural(number, withoutSuffix, key) {
        var format = {
            'ss': withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
            'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
            'hh': 'час_часа_часов',
            'dd': 'день_дня_дней',
            'MM': 'месяц_месяца_месяцев',
            'yy': 'год_года_лет'
        };
        if (key === 'm') {
            return withoutSuffix ? 'минута' : 'минуту';
        }
        else {
            return number + ' ' + plural(format[key], +number);
        }
    }
    var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

    // http://new.gramota.ru/spravka/rules/139-prop : § 103
    // Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
    // CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
    var ru = moment.defineLocale('ru', {
        months : {
            format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
            standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
        },
        monthsShort : {
            // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
            format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
            standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
        },
        weekdays : {
            standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
            format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
            isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
        },
        weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
        weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
        monthsParse : monthsParse,
        longMonthsParse : monthsParse,
        shortMonthsParse : monthsParse,

        // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
        monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

        // копия предыдущего
        monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

        // полные названия с падежами
        monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

        // Выражение, которое соотвествует только сокращённым формам
        monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY г.',
            LLL : 'D MMMM YYYY г., H:mm',
            LLLL : 'dddd, D MMMM YYYY г., H:mm'
        },
        calendar : {
            sameDay: '[Сегодня, в] LT',
            nextDay: '[Завтра, в] LT',
            lastDay: '[Вчера, в] LT',
            nextWeek: function (now) {
                if (now.week() !== this.week()) {
                    switch (this.day()) {
                        case 0:
                            return '[В следующее] dddd, [в] LT';
                        case 1:
                        case 2:
                        case 4:
                            return '[В следующий] dddd, [в] LT';
                        case 3:
                        case 5:
                        case 6:
                            return '[В следующую] dddd, [в] LT';
                    }
                } else {
                    if (this.day() === 2) {
                        return '[Во] dddd, [в] LT';
                    } else {
                        return '[В] dddd, [в] LT';
                    }
                }
            },
            lastWeek: function (now) {
                if (now.week() !== this.week()) {
                    switch (this.day()) {
                        case 0:
                            return '[В прошлое] dddd, [в] LT';
                        case 1:
                        case 2:
                        case 4:
                            return '[В прошлый] dddd, [в] LT';
                        case 3:
                        case 5:
                        case 6:
                            return '[В прошлую] dddd, [в] LT';
                    }
                } else {
                    if (this.day() === 2) {
                        return '[Во] dddd, [в] LT';
                    } else {
                        return '[В] dddd, [в] LT';
                    }
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'через %s',
            past : '%s назад',
            s : 'несколько секунд',
            ss : relativeTimeWithPlural,
            m : relativeTimeWithPlural,
            mm : relativeTimeWithPlural,
            h : 'час',
            hh : relativeTimeWithPlural,
            d : 'день',
            dd : relativeTimeWithPlural,
            M : 'месяц',
            MM : relativeTimeWithPlural,
            y : 'год',
            yy : relativeTimeWithPlural
        },
        meridiemParse: /ночи|утра|дня|вечера/i,
        isPM : function (input) {
            return /^(дня|вечера)$/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'ночи';
            } else if (hour < 12) {
                return 'утра';
            } else if (hour < 17) {
                return 'дня';
            } else {
                return 'вечера';
            }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
        ordinal: function (number, period) {
            switch (period) {
                case 'M':
                case 'd':
                case 'DDD':
                    return number + '-й';
                case 'D':
                    return number + '-го';
                case 'w':
                case 'W':
                    return number + '-я';
                default:
                    return number;
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return ru;

})));


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var months = [
        'جنوري',
        'فيبروري',
        'مارچ',
        'اپريل',
        'مئي',
        'جون',
        'جولاءِ',
        'آگسٽ',
        'سيپٽمبر',
        'آڪٽوبر',
        'نومبر',
        'ڊسمبر'
    ];
    var days = [
        'آچر',
        'سومر',
        'اڱارو',
        'اربع',
        'خميس',
        'جمع',
        'ڇنڇر'
    ];

    var sd = moment.defineLocale('sd', {
        months : months,
        monthsShort : months,
        weekdays : days,
        weekdaysShort : days,
        weekdaysMin : days,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd، D MMMM YYYY HH:mm'
        },
        meridiemParse: /صبح|شام/,
        isPM : function (input) {
            return 'شام' === input;
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'صبح';
            }
            return 'شام';
        },
        calendar : {
            sameDay : '[اڄ] LT',
            nextDay : '[سڀاڻي] LT',
            nextWeek : 'dddd [اڳين هفتي تي] LT',
            lastDay : '[ڪالهه] LT',
            lastWeek : '[گزريل هفتي] dddd [تي] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s پوء',
            past : '%s اڳ',
            s : 'چند سيڪنڊ',
            ss : '%d سيڪنڊ',
            m : 'هڪ منٽ',
            mm : '%d منٽ',
            h : 'هڪ ڪلاڪ',
            hh : '%d ڪلاڪ',
            d : 'هڪ ڏينهن',
            dd : '%d ڏينهن',
            M : 'هڪ مهينو',
            MM : '%d مهينا',
            y : 'هڪ سال',
            yy : '%d سال'
        },
        preparse: function (string) {
            return string.replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/,/g, '،');
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return sd;

})));


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var se = moment.defineLocale('se', {
        months : 'ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu'.split('_'),
        monthsShort : 'ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov'.split('_'),
        weekdays : 'sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat'.split('_'),
        weekdaysShort : 'sotn_vuos_maŋ_gask_duor_bear_láv'.split('_'),
        weekdaysMin : 's_v_m_g_d_b_L'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'MMMM D. [b.] YYYY',
            LLL : 'MMMM D. [b.] YYYY [ti.] HH:mm',
            LLLL : 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm'
        },
        calendar : {
            sameDay: '[otne ti] LT',
            nextDay: '[ihttin ti] LT',
            nextWeek: 'dddd [ti] LT',
            lastDay: '[ikte ti] LT',
            lastWeek: '[ovddit] dddd [ti] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : '%s geažes',
            past : 'maŋit %s',
            s : 'moadde sekunddat',
            ss: '%d sekunddat',
            m : 'okta minuhta',
            mm : '%d minuhtat',
            h : 'okta diimmu',
            hh : '%d diimmut',
            d : 'okta beaivi',
            dd : '%d beaivvit',
            M : 'okta mánnu',
            MM : '%d mánut',
            y : 'okta jahki',
            yy : '%d jagit'
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return se;

})));


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    /*jshint -W100*/
    var si = moment.defineLocale('si', {
        months : 'ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්'.split('_'),
        monthsShort : 'ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ'.split('_'),
        weekdays : 'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split('_'),
        weekdaysShort : 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
        weekdaysMin : 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'a h:mm',
            LTS : 'a h:mm:ss',
            L : 'YYYY/MM/DD',
            LL : 'YYYY MMMM D',
            LLL : 'YYYY MMMM D, a h:mm',
            LLLL : 'YYYY MMMM D [වැනි] dddd, a h:mm:ss'
        },
        calendar : {
            sameDay : '[අද] LT[ට]',
            nextDay : '[හෙට] LT[ට]',
            nextWeek : 'dddd LT[ට]',
            lastDay : '[ඊයේ] LT[ට]',
            lastWeek : '[පසුගිය] dddd LT[ට]',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%sකින්',
            past : '%sකට පෙර',
            s : 'තත්පර කිහිපය',
            ss : 'තත්පර %d',
            m : 'මිනිත්තුව',
            mm : 'මිනිත්තු %d',
            h : 'පැය',
            hh : 'පැය %d',
            d : 'දිනය',
            dd : 'දින %d',
            M : 'මාසය',
            MM : 'මාස %d',
            y : 'වසර',
            yy : 'වසර %d'
        },
        dayOfMonthOrdinalParse: /\d{1,2} වැනි/,
        ordinal : function (number) {
            return number + ' වැනි';
        },
        meridiemParse : /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
        isPM : function (input) {
            return input === 'ප.ව.' || input === 'පස් වරු';
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'ප.ව.' : 'පස් වරු';
            } else {
                return isLower ? 'පෙ.ව.' : 'පෙර වරු';
            }
        }
    });

    return si;

})));


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var months = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_'),
        monthsShort = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');
    function plural(n) {
        return (n > 1) && (n < 5);
    }
    function translate(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':  // a few seconds / in a few seconds / a few seconds ago
                return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
            case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'sekundy' : 'sekúnd');
                } else {
                    return result + 'sekundami';
                }
                break;
            case 'm':  // a minute / in a minute / a minute ago
                return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
            case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'minúty' : 'minút');
                } else {
                    return result + 'minútami';
                }
                break;
            case 'h':  // an hour / in an hour / an hour ago
                return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
            case 'hh': // 9 hours / in 9 hours / 9 hours ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'hodiny' : 'hodín');
                } else {
                    return result + 'hodinami';
                }
                break;
            case 'd':  // a day / in a day / a day ago
                return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
            case 'dd': // 9 days / in 9 days / 9 days ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'dni' : 'dní');
                } else {
                    return result + 'dňami';
                }
                break;
            case 'M':  // a month / in a month / a month ago
                return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
            case 'MM': // 9 months / in 9 months / 9 months ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'mesiace' : 'mesiacov');
                } else {
                    return result + 'mesiacmi';
                }
                break;
            case 'y':  // a year / in a year / a year ago
                return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
            case 'yy': // 9 years / in 9 years / 9 years ago
                if (withoutSuffix || isFuture) {
                    return result + (plural(number) ? 'roky' : 'rokov');
                } else {
                    return result + 'rokmi';
                }
                break;
        }
    }

    var sk = moment.defineLocale('sk', {
        months : months,
        monthsShort : monthsShort,
        weekdays : 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
        weekdaysShort : 'ne_po_ut_st_št_pi_so'.split('_'),
        weekdaysMin : 'ne_po_ut_st_št_pi_so'.split('_'),
        longDateFormat : {
            LT: 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay: '[dnes o] LT',
            nextDay: '[zajtra o] LT',
            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[v nedeľu o] LT';
                    case 1:
                    case 2:
                        return '[v] dddd [o] LT';
                    case 3:
                        return '[v stredu o] LT';
                    case 4:
                        return '[vo štvrtok o] LT';
                    case 5:
                        return '[v piatok o] LT';
                    case 6:
                        return '[v sobotu o] LT';
                }
            },
            lastDay: '[včera o] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[minulú nedeľu o] LT';
                    case 1:
                    case 2:
                        return '[minulý] dddd [o] LT';
                    case 3:
                        return '[minulú stredu o] LT';
                    case 4:
                    case 5:
                        return '[minulý] dddd [o] LT';
                    case 6:
                        return '[minulú sobotu o] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'za %s',
            past : 'pred %s',
            s : translate,
            ss : translate,
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : translate,
            dd : translate,
            M : translate,
            MM : translate,
            y : translate,
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return sk;

})));


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':
                return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
            case 'ss':
                if (number === 1) {
                    result += withoutSuffix ? 'sekundo' : 'sekundi';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'sekundi' : 'sekundah';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'sekunde' : 'sekundah';
                } else {
                    result += 'sekund';
                }
                return result;
            case 'm':
                return withoutSuffix ? 'ena minuta' : 'eno minuto';
            case 'mm':
                if (number === 1) {
                    result += withoutSuffix ? 'minuta' : 'minuto';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'minute' : 'minutami';
                } else {
                    result += withoutSuffix || isFuture ? 'minut' : 'minutami';
                }
                return result;
            case 'h':
                return withoutSuffix ? 'ena ura' : 'eno uro';
            case 'hh':
                if (number === 1) {
                    result += withoutSuffix ? 'ura' : 'uro';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'uri' : 'urama';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'ure' : 'urami';
                } else {
                    result += withoutSuffix || isFuture ? 'ur' : 'urami';
                }
                return result;
            case 'd':
                return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
            case 'dd':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'dan' : 'dnem';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
                } else {
                    result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
                }
                return result;
            case 'M':
                return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
            case 'MM':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
                } else {
                    result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
                }
                return result;
            case 'y':
                return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
            case 'yy':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'leto' : 'letom';
                } else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'leti' : 'letoma';
                } else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'leta' : 'leti';
                } else {
                    result += withoutSuffix || isFuture ? 'let' : 'leti';
                }
                return result;
        }
    }

    var sl = moment.defineLocale('sl', {
        months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
        monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
        monthsParseExact: true,
        weekdays : 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
        weekdaysShort : 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
        weekdaysMin : 'ne_po_to_sr_če_pe_so'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
        },
        calendar : {
            sameDay  : '[danes ob] LT',
            nextDay  : '[jutri ob] LT',

            nextWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[v] [nedeljo] [ob] LT';
                    case 3:
                        return '[v] [sredo] [ob] LT';
                    case 6:
                        return '[v] [soboto] [ob] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[v] dddd [ob] LT';
                }
            },
            lastDay  : '[včeraj ob] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[prejšnjo] [nedeljo] [ob] LT';
                    case 3:
                        return '[prejšnjo] [sredo] [ob] LT';
                    case 6:
                        return '[prejšnjo] [soboto] [ob] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[prejšnji] dddd [ob] LT';
                }
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'čez %s',
            past   : 'pred %s',
            s      : processRelativeTime,
            ss     : processRelativeTime,
            m      : processRelativeTime,
            mm     : processRelativeTime,
            h      : processRelativeTime,
            hh     : processRelativeTime,
            d      : processRelativeTime,
            dd     : processRelativeTime,
            M      : processRelativeTime,
            MM     : processRelativeTime,
            y      : processRelativeTime,
            yy     : processRelativeTime
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return sl;

})));


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var sq = moment.defineLocale('sq', {
        months : 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
        monthsShort : 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
        weekdays : 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
        weekdaysShort : 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
        weekdaysMin : 'D_H_Ma_Më_E_P_Sh'.split('_'),
        weekdaysParseExact : true,
        meridiemParse: /PD|MD/,
        isPM: function (input) {
            return input.charAt(0) === 'M';
        },
        meridiem : function (hours, minutes, isLower) {
            return hours < 12 ? 'PD' : 'MD';
        },
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Sot në] LT',
            nextDay : '[Nesër në] LT',
            nextWeek : 'dddd [në] LT',
            lastDay : '[Dje në] LT',
            lastWeek : 'dddd [e kaluar në] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'në %s',
            past : '%s më parë',
            s : 'disa sekonda',
            ss : '%d sekonda',
            m : 'një minutë',
            mm : '%d minuta',
            h : 'një orë',
            hh : '%d orë',
            d : 'një ditë',
            dd : '%d ditë',
            M : 'një muaj',
            MM : '%d muaj',
            y : 'një vit',
            yy : '%d vite'
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return sq;

})));


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var translator = {
        words: { //Different grammatical cases
            ss: ['sekunda', 'sekunde', 'sekundi'],
            m: ['jedan minut', 'jedne minute'],
            mm: ['minut', 'minute', 'minuta'],
            h: ['jedan sat', 'jednog sata'],
            hh: ['sat', 'sata', 'sati'],
            dd: ['dan', 'dana', 'dana'],
            MM: ['mesec', 'meseca', 'meseci'],
            yy: ['godina', 'godine', 'godina']
        },
        correctGrammaticalCase: function (number, wordKey) {
            return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
        },
        translate: function (number, withoutSuffix, key) {
            var wordKey = translator.words[key];
            if (key.length === 1) {
                return withoutSuffix ? wordKey[0] : wordKey[1];
            } else {
                return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
            }
        }
    };

    var sr = moment.defineLocale('sr', {
        months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
        monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
        monthsParseExact: true,
        weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split('_'),
        weekdaysShort: 'ned._pon._uto._sre._čet._pet._sub.'.split('_'),
        weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
        weekdaysParseExact : true,
        longDateFormat: {
            LT: 'H:mm',
            LTS : 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm',
            LLLL: 'dddd, D. MMMM YYYY H:mm'
        },
        calendar: {
            sameDay: '[danas u] LT',
            nextDay: '[sutra u] LT',
            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[u] [nedelju] [u] LT';
                    case 3:
                        return '[u] [sredu] [u] LT';
                    case 6:
                        return '[u] [subotu] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[u] dddd [u] LT';
                }
            },
            lastDay  : '[juče u] LT',
            lastWeek : function () {
                var lastWeekDays = [
                    '[prošle] [nedelje] [u] LT',
                    '[prošlog] [ponedeljka] [u] LT',
                    '[prošlog] [utorka] [u] LT',
                    '[prošle] [srede] [u] LT',
                    '[prošlog] [četvrtka] [u] LT',
                    '[prošlog] [petka] [u] LT',
                    '[prošle] [subote] [u] LT'
                ];
                return lastWeekDays[this.day()];
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'za %s',
            past   : 'pre %s',
            s      : 'nekoliko sekundi',
            ss     : translator.translate,
            m      : translator.translate,
            mm     : translator.translate,
            h      : translator.translate,
            hh     : translator.translate,
            d      : 'dan',
            dd     : translator.translate,
            M      : 'mesec',
            MM     : translator.translate,
            y      : 'godinu',
            yy     : translator.translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return sr;

})));


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var translator = {
        words: { //Different grammatical cases
            ss: ['секунда', 'секунде', 'секунди'],
            m: ['један минут', 'једне минуте'],
            mm: ['минут', 'минуте', 'минута'],
            h: ['један сат', 'једног сата'],
            hh: ['сат', 'сата', 'сати'],
            dd: ['дан', 'дана', 'дана'],
            MM: ['месец', 'месеца', 'месеци'],
            yy: ['година', 'године', 'година']
        },
        correctGrammaticalCase: function (number, wordKey) {
            return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
        },
        translate: function (number, withoutSuffix, key) {
            var wordKey = translator.words[key];
            if (key.length === 1) {
                return withoutSuffix ? wordKey[0] : wordKey[1];
            } else {
                return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
            }
        }
    };

    var srCyrl = moment.defineLocale('sr-cyrl', {
        months: 'јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар'.split('_'),
        monthsShort: 'јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.'.split('_'),
        monthsParseExact: true,
        weekdays: 'недеља_понедељак_уторак_среда_четвртак_петак_субота'.split('_'),
        weekdaysShort: 'нед._пон._уто._сре._чет._пет._суб.'.split('_'),
        weekdaysMin: 'не_по_ут_ср_че_пе_су'.split('_'),
        weekdaysParseExact : true,
        longDateFormat: {
            LT: 'H:mm',
            LTS : 'H:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D. MMMM YYYY',
            LLL: 'D. MMMM YYYY H:mm',
            LLLL: 'dddd, D. MMMM YYYY H:mm'
        },
        calendar: {
            sameDay: '[данас у] LT',
            nextDay: '[сутра у] LT',
            nextWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[у] [недељу] [у] LT';
                    case 3:
                        return '[у] [среду] [у] LT';
                    case 6:
                        return '[у] [суботу] [у] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[у] dddd [у] LT';
                }
            },
            lastDay  : '[јуче у] LT',
            lastWeek : function () {
                var lastWeekDays = [
                    '[прошле] [недеље] [у] LT',
                    '[прошлог] [понедељка] [у] LT',
                    '[прошлог] [уторка] [у] LT',
                    '[прошле] [среде] [у] LT',
                    '[прошлог] [четвртка] [у] LT',
                    '[прошлог] [петка] [у] LT',
                    '[прошле] [суботе] [у] LT'
                ];
                return lastWeekDays[this.day()];
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'за %s',
            past   : 'пре %s',
            s      : 'неколико секунди',
            ss     : translator.translate,
            m      : translator.translate,
            mm     : translator.translate,
            h      : translator.translate,
            hh     : translator.translate,
            d      : 'дан',
            dd     : translator.translate,
            M      : 'месец',
            MM     : translator.translate,
            y      : 'годину',
            yy     : translator.translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return srCyrl;

})));


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var ss = moment.defineLocale('ss', {
        months : "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split('_'),
        monthsShort : 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
        weekdays : 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
        weekdaysShort : 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
        weekdaysMin : 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY h:mm A',
            LLLL : 'dddd, D MMMM YYYY h:mm A'
        },
        calendar : {
            sameDay : '[Namuhla nga] LT',
            nextDay : '[Kusasa nga] LT',
            nextWeek : 'dddd [nga] LT',
            lastDay : '[Itolo nga] LT',
            lastWeek : 'dddd [leliphelile] [nga] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'nga %s',
            past : 'wenteka nga %s',
            s : 'emizuzwana lomcane',
            ss : '%d mzuzwana',
            m : 'umzuzu',
            mm : '%d emizuzu',
            h : 'lihora',
            hh : '%d emahora',
            d : 'lilanga',
            dd : '%d emalanga',
            M : 'inyanga',
            MM : '%d tinyanga',
            y : 'umnyaka',
            yy : '%d iminyaka'
        },
        meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
        meridiem : function (hours, minutes, isLower) {
            if (hours < 11) {
                return 'ekuseni';
            } else if (hours < 15) {
                return 'emini';
            } else if (hours < 19) {
                return 'entsambama';
            } else {
                return 'ebusuku';
            }
        },
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'ekuseni') {
                return hour;
            } else if (meridiem === 'emini') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === 'entsambama' || meridiem === 'ebusuku') {
                if (hour === 0) {
                    return 0;
                }
                return hour + 12;
            }
        },
        dayOfMonthOrdinalParse: /\d{1,2}/,
        ordinal : '%d',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return ss;

})));


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var sv = moment.defineLocale('sv', {
        months : 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
        monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
        weekdays : 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
        weekdaysShort : 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
        weekdaysMin : 'sö_må_ti_on_to_fr_lö'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY-MM-DD',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY [kl.] HH:mm',
            LLLL : 'dddd D MMMM YYYY [kl.] HH:mm',
            lll : 'D MMM YYYY HH:mm',
            llll : 'ddd D MMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[Idag] LT',
            nextDay: '[Imorgon] LT',
            lastDay: '[Igår] LT',
            nextWeek: '[På] dddd LT',
            lastWeek: '[I] dddd[s] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'om %s',
            past : 'för %s sedan',
            s : 'några sekunder',
            ss : '%d sekunder',
            m : 'en minut',
            mm : '%d minuter',
            h : 'en timme',
            hh : '%d timmar',
            d : 'en dag',
            dd : '%d dagar',
            M : 'en månad',
            MM : '%d månader',
            y : 'ett år',
            yy : '%d år'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(e|a)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'e' :
                (b === 1) ? 'a' :
                (b === 2) ? 'a' :
                (b === 3) ? 'e' : 'e';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return sv;

})));


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var sw = moment.defineLocale('sw', {
        months : 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split('_'),
        monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
        weekdays : 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
        weekdaysShort : 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
        weekdaysMin : 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[leo saa] LT',
            nextDay : '[kesho saa] LT',
            nextWeek : '[wiki ijayo] dddd [saat] LT',
            lastDay : '[jana] LT',
            lastWeek : '[wiki iliyopita] dddd [saat] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s baadaye',
            past : 'tokea %s',
            s : 'hivi punde',
            ss : 'sekunde %d',
            m : 'dakika moja',
            mm : 'dakika %d',
            h : 'saa limoja',
            hh : 'masaa %d',
            d : 'siku moja',
            dd : 'masiku %d',
            M : 'mwezi mmoja',
            MM : 'miezi %d',
            y : 'mwaka mmoja',
            yy : 'miaka %d'
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return sw;

})));


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var symbolMap = {
        '1': '௧',
        '2': '௨',
        '3': '௩',
        '4': '௪',
        '5': '௫',
        '6': '௬',
        '7': '௭',
        '8': '௮',
        '9': '௯',
        '0': '௦'
    }, numberMap = {
        '௧': '1',
        '௨': '2',
        '௩': '3',
        '௪': '4',
        '௫': '5',
        '௬': '6',
        '௭': '7',
        '௮': '8',
        '௯': '9',
        '௦': '0'
    };

    var ta = moment.defineLocale('ta', {
        months : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
        monthsShort : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
        weekdays : 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split('_'),
        weekdaysShort : 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
        weekdaysMin : 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, HH:mm',
            LLLL : 'dddd, D MMMM YYYY, HH:mm'
        },
        calendar : {
            sameDay : '[இன்று] LT',
            nextDay : '[நாளை] LT',
            nextWeek : 'dddd, LT',
            lastDay : '[நேற்று] LT',
            lastWeek : '[கடந்த வாரம்] dddd, LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s இல்',
            past : '%s முன்',
            s : 'ஒரு சில விநாடிகள்',
            ss : '%d விநாடிகள்',
            m : 'ஒரு நிமிடம்',
            mm : '%d நிமிடங்கள்',
            h : 'ஒரு மணி நேரம்',
            hh : '%d மணி நேரம்',
            d : 'ஒரு நாள்',
            dd : '%d நாட்கள்',
            M : 'ஒரு மாதம்',
            MM : '%d மாதங்கள்',
            y : 'ஒரு வருடம்',
            yy : '%d ஆண்டுகள்'
        },
        dayOfMonthOrdinalParse: /\d{1,2}வது/,
        ordinal : function (number) {
            return number + 'வது';
        },
        preparse: function (string) {
            return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
                return numberMap[match];
            });
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            });
        },
        // refer http://ta.wikipedia.org/s/1er1
        meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
        meridiem : function (hour, minute, isLower) {
            if (hour < 2) {
                return ' யாமம்';
            } else if (hour < 6) {
                return ' வைகறை';  // வைகறை
            } else if (hour < 10) {
                return ' காலை'; // காலை
            } else if (hour < 14) {
                return ' நண்பகல்'; // நண்பகல்
            } else if (hour < 18) {
                return ' எற்பாடு'; // எற்பாடு
            } else if (hour < 22) {
                return ' மாலை'; // மாலை
            } else {
                return ' யாமம்';
            }
        },
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'யாமம்') {
                return hour < 2 ? hour : hour + 12;
            } else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
                return hour;
            } else if (meridiem === 'நண்பகல்') {
                return hour >= 10 ? hour : hour + 12;
            } else {
                return hour + 12;
            }
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return ta;

})));


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var te = moment.defineLocale('te', {
        months : 'జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జులై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్'.split('_'),
        monthsShort : 'జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జులై_ఆగ._సెప్._అక్టో._నవ._డిసె.'.split('_'),
        monthsParseExact : true,
        weekdays : 'ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం'.split('_'),
        weekdaysShort : 'ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని'.split('_'),
        weekdaysMin : 'ఆ_సో_మం_బు_గు_శు_శ'.split('_'),
        longDateFormat : {
            LT : 'A h:mm',
            LTS : 'A h:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY, A h:mm',
            LLLL : 'dddd, D MMMM YYYY, A h:mm'
        },
        calendar : {
            sameDay : '[నేడు] LT',
            nextDay : '[రేపు] LT',
            nextWeek : 'dddd, LT',
            lastDay : '[నిన్న] LT',
            lastWeek : '[గత] dddd, LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s లో',
            past : '%s క్రితం',
            s : 'కొన్ని క్షణాలు',
            ss : '%d సెకన్లు',
            m : 'ఒక నిమిషం',
            mm : '%d నిమిషాలు',
            h : 'ఒక గంట',
            hh : '%d గంటలు',
            d : 'ఒక రోజు',
            dd : '%d రోజులు',
            M : 'ఒక నెల',
            MM : '%d నెలలు',
            y : 'ఒక సంవత్సరం',
            yy : '%d సంవత్సరాలు'
        },
        dayOfMonthOrdinalParse : /\d{1,2}వ/,
        ordinal : '%dవ',
        meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'రాత్రి') {
                return hour < 4 ? hour : hour + 12;
            } else if (meridiem === 'ఉదయం') {
                return hour;
            } else if (meridiem === 'మధ్యాహ్నం') {
                return hour >= 10 ? hour : hour + 12;
            } else if (meridiem === 'సాయంత్రం') {
                return hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'రాత్రి';
            } else if (hour < 10) {
                return 'ఉదయం';
            } else if (hour < 17) {
                return 'మధ్యాహ్నం';
            } else if (hour < 20) {
                return 'సాయంత్రం';
            } else {
                return 'రాత్రి';
            }
        },
        week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 6th is the first week of the year.
        }
    });

    return te;

})));


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var tet = moment.defineLocale('tet', {
        months : 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juñu_Jullu_Agustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
        monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        weekdays : 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sesta_Sabadu'.split('_'),
        weekdaysShort : 'Dom_Seg_Ters_Kua_Kint_Sest_Sab'.split('_'),
        weekdaysMin : 'Do_Seg_Te_Ku_Ki_Ses_Sa'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[Ohin iha] LT',
            nextDay: '[Aban iha] LT',
            nextWeek: 'dddd [iha] LT',
            lastDay: '[Horiseik iha] LT',
            lastWeek: 'dddd [semana kotuk] [iha] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'iha %s',
            past : '%s liuba',
            s : 'minutu balun',
            ss : 'minutu %d',
            m : 'minutu ida',
            mm : 'minutu %d',
            h : 'oras ida',
            hh : 'oras %d',
            d : 'loron ida',
            dd : 'loron %d',
            M : 'fulan ida',
            MM : 'fulan %d',
            y : 'tinan ida',
            yy : 'tinan %d'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return tet;

})));


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var suffixes = {
        0: '-ум',
        1: '-ум',
        2: '-юм',
        3: '-юм',
        4: '-ум',
        5: '-ум',
        6: '-ум',
        7: '-ум',
        8: '-ум',
        9: '-ум',
        10: '-ум',
        12: '-ум',
        13: '-ум',
        20: '-ум',
        30: '-юм',
        40: '-ум',
        50: '-ум',
        60: '-ум',
        70: '-ум',
        80: '-ум',
        90: '-ум',
        100: '-ум'
    };

    var tg = moment.defineLocale('tg', {
        months : 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
        monthsShort : 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
        weekdays : 'якшанбе_душанбе_сешанбе_чоршанбе_панҷшанбе_ҷумъа_шанбе'.split('_'),
        weekdaysShort : 'яшб_дшб_сшб_чшб_пшб_ҷум_шнб'.split('_'),
        weekdaysMin : 'яш_дш_сш_чш_пш_ҷм_шб'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Имрӯз соати] LT',
            nextDay : '[Пагоҳ соати] LT',
            lastDay : '[Дирӯз соати] LT',
            nextWeek : 'dddd[и] [ҳафтаи оянда соати] LT',
            lastWeek : 'dddd[и] [ҳафтаи гузашта соати] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'баъди %s',
            past : '%s пеш',
            s : 'якчанд сония',
            m : 'як дақиқа',
            mm : '%d дақиқа',
            h : 'як соат',
            hh : '%d соат',
            d : 'як рӯз',
            dd : '%d рӯз',
            M : 'як моҳ',
            MM : '%d моҳ',
            y : 'як сол',
            yy : '%d сол'
        },
        meridiemParse: /шаб|субҳ|рӯз|бегоҳ/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === 'шаб') {
                return hour < 4 ? hour : hour + 12;
            } else if (meridiem === 'субҳ') {
                return hour;
            } else if (meridiem === 'рӯз') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === 'бегоҳ') {
                return hour + 12;
            }
        },
        meridiem: function (hour, minute, isLower) {
            if (hour < 4) {
                return 'шаб';
            } else if (hour < 11) {
                return 'субҳ';
            } else if (hour < 16) {
                return 'рӯз';
            } else if (hour < 19) {
                return 'бегоҳ';
            } else {
                return 'шаб';
            }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ум|юм)/,
        ordinal: function (number) {
            var a = number % 10,
                b = number >= 100 ? 100 : null;
            return number + (suffixes[number] || suffixes[a] || suffixes[b]);
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1th is the first week of the year.
        }
    });

    return tg;

})));


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var th = moment.defineLocale('th', {
        months : 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
        monthsShort : 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
        monthsParseExact: true,
        weekdays : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
        weekdaysShort : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
        weekdaysMin : 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY เวลา H:mm',
            LLLL : 'วันddddที่ D MMMM YYYY เวลา H:mm'
        },
        meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
        isPM: function (input) {
            return input === 'หลังเที่ยง';
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ก่อนเที่ยง';
            } else {
                return 'หลังเที่ยง';
            }
        },
        calendar : {
            sameDay : '[วันนี้ เวลา] LT',
            nextDay : '[พรุ่งนี้ เวลา] LT',
            nextWeek : 'dddd[หน้า เวลา] LT',
            lastDay : '[เมื่อวานนี้ เวลา] LT',
            lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'อีก %s',
            past : '%sที่แล้ว',
            s : 'ไม่กี่วินาที',
            ss : '%d วินาที',
            m : '1 นาที',
            mm : '%d นาที',
            h : '1 ชั่วโมง',
            hh : '%d ชั่วโมง',
            d : '1 วัน',
            dd : '%d วัน',
            M : '1 เดือน',
            MM : '%d เดือน',
            y : '1 ปี',
            yy : '%d ปี'
        }
    });

    return th;

})));


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var tlPh = moment.defineLocale('tl-ph', {
        months : 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
        monthsShort : 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
        weekdays : 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
        weekdaysShort : 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
        weekdaysMin : 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'MM/D/YYYY',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY HH:mm',
            LLLL : 'dddd, MMMM DD, YYYY HH:mm'
        },
        calendar : {
            sameDay: 'LT [ngayong araw]',
            nextDay: '[Bukas ng] LT',
            nextWeek: 'LT [sa susunod na] dddd',
            lastDay: 'LT [kahapon]',
            lastWeek: 'LT [noong nakaraang] dddd',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'sa loob ng %s',
            past : '%s ang nakalipas',
            s : 'ilang segundo',
            ss : '%d segundo',
            m : 'isang minuto',
            mm : '%d minuto',
            h : 'isang oras',
            hh : '%d oras',
            d : 'isang araw',
            dd : '%d araw',
            M : 'isang buwan',
            MM : '%d buwan',
            y : 'isang taon',
            yy : '%d taon'
        },
        dayOfMonthOrdinalParse: /\d{1,2}/,
        ordinal : function (number) {
            return number;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return tlPh;

})));


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var numbersNouns = 'pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');

    function translateFuture(output) {
        var time = output;
        time = (output.indexOf('jaj') !== -1) ?
        time.slice(0, -3) + 'leS' :
        (output.indexOf('jar') !== -1) ?
        time.slice(0, -3) + 'waQ' :
        (output.indexOf('DIS') !== -1) ?
        time.slice(0, -3) + 'nem' :
        time + ' pIq';
        return time;
    }

    function translatePast(output) {
        var time = output;
        time = (output.indexOf('jaj') !== -1) ?
        time.slice(0, -3) + 'Hu’' :
        (output.indexOf('jar') !== -1) ?
        time.slice(0, -3) + 'wen' :
        (output.indexOf('DIS') !== -1) ?
        time.slice(0, -3) + 'ben' :
        time + ' ret';
        return time;
    }

    function translate(number, withoutSuffix, string, isFuture) {
        var numberNoun = numberAsNoun(number);
        switch (string) {
            case 'ss':
                return numberNoun + ' lup';
            case 'mm':
                return numberNoun + ' tup';
            case 'hh':
                return numberNoun + ' rep';
            case 'dd':
                return numberNoun + ' jaj';
            case 'MM':
                return numberNoun + ' jar';
            case 'yy':
                return numberNoun + ' DIS';
        }
    }

    function numberAsNoun(number) {
        var hundred = Math.floor((number % 1000) / 100),
        ten = Math.floor((number % 100) / 10),
        one = number % 10,
        word = '';
        if (hundred > 0) {
            word += numbersNouns[hundred] + 'vatlh';
        }
        if (ten > 0) {
            word += ((word !== '') ? ' ' : '') + numbersNouns[ten] + 'maH';
        }
        if (one > 0) {
            word += ((word !== '') ? ' ' : '') + numbersNouns[one];
        }
        return (word === '') ? 'pagh' : word;
    }

    var tlh = moment.defineLocale('tlh', {
        months : 'tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’'.split('_'),
        monthsShort : 'jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’'.split('_'),
        monthsParseExact : true,
        weekdays : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
        weekdaysShort : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
        weekdaysMin : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[DaHjaj] LT',
            nextDay: '[wa’leS] LT',
            nextWeek: 'LLL',
            lastDay: '[wa’Hu’] LT',
            lastWeek: 'LLL',
            sameElse: 'L'
        },
        relativeTime : {
            future : translateFuture,
            past : translatePast,
            s : 'puS lup',
            ss : translate,
            m : 'wa’ tup',
            mm : translate,
            h : 'wa’ rep',
            hh : translate,
            d : 'wa’ jaj',
            dd : translate,
            M : 'wa’ jar',
            MM : translate,
            y : 'wa’ DIS',
            yy : translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return tlh;

})));


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {


;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';

    var suffixes = {
        1: '\'inci',
        5: '\'inci',
        8: '\'inci',
        70: '\'inci',
        80: '\'inci',
        2: '\'nci',
        7: '\'nci',
        20: '\'nci',
        50: '\'nci',
        3: '\'üncü',
        4: '\'üncü',
        100: '\'üncü',
        6: '\'ncı',
        9: '\'uncu',
        10: '\'uncu',
        30: '\'uncu',
        60: '\'ıncı',
        90: '\'ıncı'
    };

    var tr = moment.defineLocale('tr', {
        months : 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
        monthsShort : 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
        weekdays : 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
        weekdaysShort : 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
        weekdaysMin : 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[bugün saat] LT',
            nextDay : '[yarın saat] LT',
            nextWeek : '[gelecek] dddd [saat] LT',
            lastDay : '[dün] LT',
            lastWeek : '[geçen] dddd [saat] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s sonra',
            past : '%s önce',
            s : 'birkaç saniye',
            ss : '%d saniye',
            m : 'bir dakika',
            mm : '%d dakika',
            h : 'bir saat',
            hh : '%d saat',
            d : 'bir gün',
            dd : '%d gün',
            M : 'bir ay',
            MM : '%d ay',
            y : 'bir yıl',
            yy : '%d yıl'
        },
        ordinal: function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'Do':
                case 'DD':
                    return number;
                default:
                    if (number === 0) {  // special case for zero
                        return number + '\'ıncı';
                    }
                    var a = number % 10,
                        b = number % 100 - a,
                        c = number >= 100 ? 100 : null;
                    return number + (suffixes[a] || suffixes[b] || suffixes[c]);
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return tr;

})));


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    // After the year there should be a slash and the amount of years since December 26, 1979 in Roman numerals.
    // This is currently too difficult (maybe even impossible) to add.
    var tzl = moment.defineLocale('tzl', {
        months : 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split('_'),
        monthsShort : 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
        weekdays : 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
        weekdaysShort : 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
        weekdaysMin : 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
        longDateFormat : {
            LT : 'HH.mm',
            LTS : 'HH.mm.ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM [dallas] YYYY',
            LLL : 'D. MMMM [dallas] YYYY HH.mm',
            LLLL : 'dddd, [li] D. MMMM [dallas] YYYY HH.mm'
        },
        meridiemParse: /d\'o|d\'a/i,
        isPM : function (input) {
            return 'd\'o' === input.toLowerCase();
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'd\'o' : 'D\'O';
            } else {
                return isLower ? 'd\'a' : 'D\'A';
            }
        },
        calendar : {
            sameDay : '[oxhi à] LT',
            nextDay : '[demà à] LT',
            nextWeek : 'dddd [à] LT',
            lastDay : '[ieiri à] LT',
            lastWeek : '[sür el] dddd [lasteu à] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'osprei %s',
            past : 'ja%s',
            s : processRelativeTime,
            ss : processRelativeTime,
            m : processRelativeTime,
            mm : processRelativeTime,
            h : processRelativeTime,
            hh : processRelativeTime,
            d : processRelativeTime,
            dd : processRelativeTime,
            M : processRelativeTime,
            MM : processRelativeTime,
            y : processRelativeTime,
            yy : processRelativeTime
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            's': ['viensas secunds', '\'iensas secunds'],
            'ss': [number + ' secunds', '' + number + ' secunds'],
            'm': ['\'n míut', '\'iens míut'],
            'mm': [number + ' míuts', '' + number + ' míuts'],
            'h': ['\'n þora', '\'iensa þora'],
            'hh': [number + ' þoras', '' + number + ' þoras'],
            'd': ['\'n ziua', '\'iensa ziua'],
            'dd': [number + ' ziuas', '' + number + ' ziuas'],
            'M': ['\'n mes', '\'iens mes'],
            'MM': [number + ' mesen', '' + number + ' mesen'],
            'y': ['\'n ar', '\'iens ar'],
            'yy': [number + ' ars', '' + number + ' ars']
        };
        return isFuture ? format[key][0] : (withoutSuffix ? format[key][0] : format[key][1]);
    }

    return tzl;

})));


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var tzm = moment.defineLocale('tzm', {
        months : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
        monthsShort : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
        weekdays : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
        weekdaysShort : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
        weekdaysMin : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS: 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
            nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
            nextWeek: 'dddd [ⴴ] LT',
            lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
            lastWeek: 'dddd [ⴴ] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
            past : 'ⵢⴰⵏ %s',
            s : 'ⵉⵎⵉⴽ',
            ss : '%d ⵉⵎⵉⴽ',
            m : 'ⵎⵉⵏⵓⴺ',
            mm : '%d ⵎⵉⵏⵓⴺ',
            h : 'ⵙⴰⵄⴰ',
            hh : '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
            d : 'ⴰⵙⵙ',
            dd : '%d oⵙⵙⴰⵏ',
            M : 'ⴰⵢoⵓⵔ',
            MM : '%d ⵉⵢⵢⵉⵔⵏ',
            y : 'ⴰⵙⴳⴰⵙ',
            yy : '%d ⵉⵙⴳⴰⵙⵏ'
        },
        week : {
            dow : 6, // Saturday is the first day of the week.
            doy : 12  // The week that contains Jan 12th is the first week of the year.
        }
    });

    return tzm;

})));


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var tzmLatn = moment.defineLocale('tzm-latn', {
        months : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
        monthsShort : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
        weekdays : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
        weekdaysShort : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
        weekdaysMin : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[asdkh g] LT',
            nextDay: '[aska g] LT',
            nextWeek: 'dddd [g] LT',
            lastDay: '[assant g] LT',
            lastWeek: 'dddd [g] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : 'dadkh s yan %s',
            past : 'yan %s',
            s : 'imik',
            ss : '%d imik',
            m : 'minuḍ',
            mm : '%d minuḍ',
            h : 'saɛa',
            hh : '%d tassaɛin',
            d : 'ass',
            dd : '%d ossan',
            M : 'ayowr',
            MM : '%d iyyirn',
            y : 'asgas',
            yy : '%d isgasn'
        },
        week : {
            dow : 6, // Saturday is the first day of the week.
            doy : 12  // The week that contains Jan 12th is the first week of the year.
        }
    });

    return tzmLatn;

})));


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js language configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var ugCn = moment.defineLocale('ug-cn', {
        months: 'يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر'.split(
            '_'
        ),
        monthsShort: 'يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر'.split(
            '_'
        ),
        weekdays: 'يەكشەنبە_دۈشەنبە_سەيشەنبە_چارشەنبە_پەيشەنبە_جۈمە_شەنبە'.split(
            '_'
        ),
        weekdaysShort: 'يە_دۈ_سە_چا_پە_جۈ_شە'.split('_'),
        weekdaysMin: 'يە_دۈ_سە_چا_پە_جۈ_شە'.split('_'),
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY-MM-DD',
            LL: 'YYYY-يىلىM-ئاينىڭD-كۈنى',
            LLL: 'YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm',
            LLLL: 'dddd، YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm'
        },
        meridiemParse: /يېرىم كېچە|سەھەر|چۈشتىن بۇرۇن|چۈش|چۈشتىن كېيىن|كەچ/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (
                meridiem === 'يېرىم كېچە' ||
                meridiem === 'سەھەر' ||
                meridiem === 'چۈشتىن بۇرۇن'
            ) {
                return hour;
            } else if (meridiem === 'چۈشتىن كېيىن' || meridiem === 'كەچ') {
                return hour + 12;
            } else {
                return hour >= 11 ? hour : hour + 12;
            }
        },
        meridiem: function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return 'يېرىم كېچە';
            } else if (hm < 900) {
                return 'سەھەر';
            } else if (hm < 1130) {
                return 'چۈشتىن بۇرۇن';
            } else if (hm < 1230) {
                return 'چۈش';
            } else if (hm < 1800) {
                return 'چۈشتىن كېيىن';
            } else {
                return 'كەچ';
            }
        },
        calendar: {
            sameDay: '[بۈگۈن سائەت] LT',
            nextDay: '[ئەتە سائەت] LT',
            nextWeek: '[كېلەركى] dddd [سائەت] LT',
            lastDay: '[تۆنۈگۈن] LT',
            lastWeek: '[ئالدىنقى] dddd [سائەت] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: '%s كېيىن',
            past: '%s بۇرۇن',
            s: 'نەچچە سېكونت',
            ss: '%d سېكونت',
            m: 'بىر مىنۇت',
            mm: '%d مىنۇت',
            h: 'بىر سائەت',
            hh: '%d سائەت',
            d: 'بىر كۈن',
            dd: '%d كۈن',
            M: 'بىر ئاي',
            MM: '%d ئاي',
            y: 'بىر يىل',
            yy: '%d يىل'
        },

        dayOfMonthOrdinalParse: /\d{1,2}(-كۈنى|-ئاي|-ھەپتە)/,
        ordinal: function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'DDD':
                    return number + '-كۈنى';
                case 'w':
                case 'W':
                    return number + '-ھەپتە';
                default:
                    return number;
            }
        },
        preparse: function (string) {
            return string.replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/,/g, '،');
        },
        week: {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow: 1, // Monday is the first day of the week.
            doy: 7 // The week that contains Jan 1st is the first week of the year.
        }
    });

    return ugCn;

})));


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    function plural(word, num) {
        var forms = word.split('_');
        return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
    }
    function relativeTimeWithPlural(number, withoutSuffix, key) {
        var format = {
            'ss': withoutSuffix ? 'секунда_секунди_секунд' : 'секунду_секунди_секунд',
            'mm': withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
            'hh': withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
            'dd': 'день_дні_днів',
            'MM': 'місяць_місяці_місяців',
            'yy': 'рік_роки_років'
        };
        if (key === 'm') {
            return withoutSuffix ? 'хвилина' : 'хвилину';
        }
        else if (key === 'h') {
            return withoutSuffix ? 'година' : 'годину';
        }
        else {
            return number + ' ' + plural(format[key], +number);
        }
    }
    function weekdaysCaseReplace(m, format) {
        var weekdays = {
            'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
            'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
            'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
        };

        if (m === true) {
            return weekdays['nominative'].slice(1, 7).concat(weekdays['nominative'].slice(0, 1));
        }
        if (!m) {
            return weekdays['nominative'];
        }

        var nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
            'accusative' :
            ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
                'genitive' :
                'nominative');
        return weekdays[nounCase][m.day()];
    }
    function processHoursFunction(str) {
        return function () {
            return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
        };
    }

    var uk = moment.defineLocale('uk', {
        months : {
            'format': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
            'standalone': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_')
        },
        monthsShort : 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
        weekdays : weekdaysCaseReplace,
        weekdaysShort : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
        weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY р.',
            LLL : 'D MMMM YYYY р., HH:mm',
            LLLL : 'dddd, D MMMM YYYY р., HH:mm'
        },
        calendar : {
            sameDay: processHoursFunction('[Сьогодні '),
            nextDay: processHoursFunction('[Завтра '),
            lastDay: processHoursFunction('[Вчора '),
            nextWeek: processHoursFunction('[У] dddd ['),
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                    case 3:
                    case 5:
                    case 6:
                        return processHoursFunction('[Минулої] dddd [').call(this);
                    case 1:
                    case 2:
                    case 4:
                        return processHoursFunction('[Минулого] dddd [').call(this);
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'за %s',
            past : '%s тому',
            s : 'декілька секунд',
            ss : relativeTimeWithPlural,
            m : relativeTimeWithPlural,
            mm : relativeTimeWithPlural,
            h : 'годину',
            hh : relativeTimeWithPlural,
            d : 'день',
            dd : relativeTimeWithPlural,
            M : 'місяць',
            MM : relativeTimeWithPlural,
            y : 'рік',
            yy : relativeTimeWithPlural
        },
        // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
        meridiemParse: /ночі|ранку|дня|вечора/,
        isPM: function (input) {
            return /^(дня|вечора)$/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'ночі';
            } else if (hour < 12) {
                return 'ранку';
            } else if (hour < 17) {
                return 'дня';
            } else {
                return 'вечора';
            }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
        ordinal: function (number, period) {
            switch (period) {
                case 'M':
                case 'd':
                case 'DDD':
                case 'w':
                case 'W':
                    return number + '-й';
                case 'D':
                    return number + '-го';
                default:
                    return number;
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return uk;

})));


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var months = [
        'جنوری',
        'فروری',
        'مارچ',
        'اپریل',
        'مئی',
        'جون',
        'جولائی',
        'اگست',
        'ستمبر',
        'اکتوبر',
        'نومبر',
        'دسمبر'
    ];
    var days = [
        'اتوار',
        'پیر',
        'منگل',
        'بدھ',
        'جمعرات',
        'جمعہ',
        'ہفتہ'
    ];

    var ur = moment.defineLocale('ur', {
        months : months,
        monthsShort : months,
        weekdays : days,
        weekdaysShort : days,
        weekdaysMin : days,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd، D MMMM YYYY HH:mm'
        },
        meridiemParse: /صبح|شام/,
        isPM : function (input) {
            return 'شام' === input;
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'صبح';
            }
            return 'شام';
        },
        calendar : {
            sameDay : '[آج بوقت] LT',
            nextDay : '[کل بوقت] LT',
            nextWeek : 'dddd [بوقت] LT',
            lastDay : '[گذشتہ روز بوقت] LT',
            lastWeek : '[گذشتہ] dddd [بوقت] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s بعد',
            past : '%s قبل',
            s : 'چند سیکنڈ',
            ss : '%d سیکنڈ',
            m : 'ایک منٹ',
            mm : '%d منٹ',
            h : 'ایک گھنٹہ',
            hh : '%d گھنٹے',
            d : 'ایک دن',
            dd : '%d دن',
            M : 'ایک ماہ',
            MM : '%d ماہ',
            y : 'ایک سال',
            yy : '%d سال'
        },
        preparse: function (string) {
            return string.replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/,/g, '،');
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return ur;

})));


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var uz = moment.defineLocale('uz', {
        months : 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
        monthsShort : 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
        weekdays : 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
        weekdaysShort : 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
        weekdaysMin : 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'D MMMM YYYY, dddd HH:mm'
        },
        calendar : {
            sameDay : '[Бугун соат] LT [да]',
            nextDay : '[Эртага] LT [да]',
            nextWeek : 'dddd [куни соат] LT [да]',
            lastDay : '[Кеча соат] LT [да]',
            lastWeek : '[Утган] dddd [куни соат] LT [да]',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'Якин %s ичида',
            past : 'Бир неча %s олдин',
            s : 'фурсат',
            ss : '%d фурсат',
            m : 'бир дакика',
            mm : '%d дакика',
            h : 'бир соат',
            hh : '%d соат',
            d : 'бир кун',
            dd : '%d кун',
            M : 'бир ой',
            MM : '%d ой',
            y : 'бир йил',
            yy : '%d йил'
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return uz;

})));


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var uzLatn = moment.defineLocale('uz-latn', {
        months : 'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split('_'),
        monthsShort : 'Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split('_'),
        weekdays : 'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split('_'),
        weekdaysShort : 'Yak_Dush_Sesh_Chor_Pay_Jum_Shan'.split('_'),
        weekdaysMin : 'Ya_Du_Se_Cho_Pa_Ju_Sha'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'D MMMM YYYY, dddd HH:mm'
        },
        calendar : {
            sameDay : '[Bugun soat] LT [da]',
            nextDay : '[Ertaga] LT [da]',
            nextWeek : 'dddd [kuni soat] LT [da]',
            lastDay : '[Kecha soat] LT [da]',
            lastWeek : '[O\'tgan] dddd [kuni soat] LT [da]',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'Yaqin %s ichida',
            past : 'Bir necha %s oldin',
            s : 'soniya',
            ss : '%d soniya',
            m : 'bir daqiqa',
            mm : '%d daqiqa',
            h : 'bir soat',
            hh : '%d soat',
            d : 'bir kun',
            dd : '%d kun',
            M : 'bir oy',
            MM : '%d oy',
            y : 'bir yil',
            yy : '%d yil'
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
        }
    });

    return uzLatn;

})));


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var vi = moment.defineLocale('vi', {
        months : 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
        monthsShort : 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
        monthsParseExact : true,
        weekdays : 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
        weekdaysShort : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
        weekdaysMin : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
        weekdaysParseExact : true,
        meridiemParse: /sa|ch/i,
        isPM : function (input) {
            return /^ch$/i.test(input);
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours < 12) {
                return isLower ? 'sa' : 'SA';
            } else {
                return isLower ? 'ch' : 'CH';
            }
        },
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM [năm] YYYY',
            LLL : 'D MMMM [năm] YYYY HH:mm',
            LLLL : 'dddd, D MMMM [năm] YYYY HH:mm',
            l : 'DD/M/YYYY',
            ll : 'D MMM YYYY',
            lll : 'D MMM YYYY HH:mm',
            llll : 'ddd, D MMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[Hôm nay lúc] LT',
            nextDay: '[Ngày mai lúc] LT',
            nextWeek: 'dddd [tuần tới lúc] LT',
            lastDay: '[Hôm qua lúc] LT',
            lastWeek: 'dddd [tuần rồi lúc] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : '%s tới',
            past : '%s trước',
            s : 'vài giây',
            ss : '%d giây' ,
            m : 'một phút',
            mm : '%d phút',
            h : 'một giờ',
            hh : '%d giờ',
            d : 'một ngày',
            dd : '%d ngày',
            M : 'một tháng',
            MM : '%d tháng',
            y : 'một năm',
            yy : '%d năm'
        },
        dayOfMonthOrdinalParse: /\d{1,2}/,
        ordinal : function (number) {
            return number;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return vi;

})));


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var xPseudo = moment.defineLocale('x-pseudo', {
        months : 'J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér'.split('_'),
        monthsShort : 'J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc'.split('_'),
        monthsParseExact : true,
        weekdays : 'S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý'.split('_'),
        weekdaysShort : 'S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát'.split('_'),
        weekdaysMin : 'S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[T~ódá~ý át] LT',
            nextDay : '[T~ómó~rró~w át] LT',
            nextWeek : 'dddd [át] LT',
            lastDay : '[Ý~ést~érdá~ý át] LT',
            lastWeek : '[L~ást] dddd [át] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'í~ñ %s',
            past : '%s á~gó',
            s : 'á ~féw ~sécó~ñds',
            ss : '%d s~écóñ~ds',
            m : 'á ~míñ~úté',
            mm : '%d m~íñú~tés',
            h : 'á~ñ hó~úr',
            hh : '%d h~óúrs',
            d : 'á ~dáý',
            dd : '%d d~áýs',
            M : 'á ~móñ~th',
            MM : '%d m~óñt~hs',
            y : 'á ~ýéár',
            yy : '%d ý~éárs'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return xPseudo;

})));


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var yo = moment.defineLocale('yo', {
        months : 'Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀'.split('_'),
        monthsShort : 'Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀'.split('_'),
        weekdays : 'Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta'.split('_'),
        weekdaysShort : 'Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá'.split('_'),
        weekdaysMin : 'Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb'.split('_'),
        longDateFormat : {
            LT : 'h:mm A',
            LTS : 'h:mm:ss A',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY h:mm A',
            LLLL : 'dddd, D MMMM YYYY h:mm A'
        },
        calendar : {
            sameDay : '[Ònì ni] LT',
            nextDay : '[Ọ̀la ni] LT',
            nextWeek : 'dddd [Ọsẹ̀ tón\'bọ] [ni] LT',
            lastDay : '[Àna ni] LT',
            lastWeek : 'dddd [Ọsẹ̀ tólọ́] [ni] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'ní %s',
            past : '%s kọjá',
            s : 'ìsẹjú aayá die',
            ss :'aayá %d',
            m : 'ìsẹjú kan',
            mm : 'ìsẹjú %d',
            h : 'wákati kan',
            hh : 'wákati %d',
            d : 'ọjọ́ kan',
            dd : 'ọjọ́ %d',
            M : 'osù kan',
            MM : 'osù %d',
            y : 'ọdún kan',
            yy : 'ọdún %d'
        },
        dayOfMonthOrdinalParse : /ọjọ́\s\d{1,2}/,
        ordinal : 'ọjọ́ %d',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4 // The week that contains Jan 4th is the first week of the year.
        }
    });

    return yo;

})));


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var zhCn = moment.defineLocale('zh-cn', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY/MM/DD',
            LL : 'YYYY年M月D日',
            LLL : 'YYYY年M月D日Ah点mm分',
            LLLL : 'YYYY年M月D日ddddAh点mm分',
            l : 'YYYY/M/D',
            ll : 'YYYY年M月D日',
            lll : 'YYYY年M月D日 HH:mm',
            llll : 'YYYY年M月D日dddd HH:mm'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' ||
                    meridiem === '上午') {
                return hour;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            } else {
                // '中午'
                return hour >= 11 ? hour : hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar : {
            sameDay : '[今天]LT',
            nextDay : '[明天]LT',
            nextWeek : '[下]ddddLT',
            lastDay : '[昨天]LT',
            lastWeek : '[上]ddddLT',
            sameElse : 'L'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
        ordinal : function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'DDD':
                    return number + '日';
                case 'M':
                    return number + '月';
                case 'w':
                case 'W':
                    return number + '周';
                default:
                    return number;
            }
        },
        relativeTime : {
            future : '%s内',
            past : '%s前',
            s : '几秒',
            ss : '%d 秒',
            m : '1 分钟',
            mm : '%d 分钟',
            h : '1 小时',
            hh : '%d 小时',
            d : '1 天',
            dd : '%d 天',
            M : '1 个月',
            MM : '%d 个月',
            y : '1 年',
            yy : '%d 年'
        },
        week : {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return zhCn;

})));


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var zhHk = moment.defineLocale('zh-hk', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY/MM/DD',
            LL : 'YYYY年M月D日',
            LLL : 'YYYY年M月D日 HH:mm',
            LLLL : 'YYYY年M月D日dddd HH:mm',
            l : 'YYYY/M/D',
            ll : 'YYYY年M月D日',
            lll : 'YYYY年M月D日 HH:mm',
            llll : 'YYYY年M月D日dddd HH:mm'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
                return hour;
            } else if (meridiem === '中午') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar : {
            sameDay : '[今天]LT',
            nextDay : '[明天]LT',
            nextWeek : '[下]ddddLT',
            lastDay : '[昨天]LT',
            lastWeek : '[上]ddddLT',
            sameElse : 'L'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
        ordinal : function (number, period) {
            switch (period) {
                case 'd' :
                case 'D' :
                case 'DDD' :
                    return number + '日';
                case 'M' :
                    return number + '月';
                case 'w' :
                case 'W' :
                    return number + '週';
                default :
                    return number;
            }
        },
        relativeTime : {
            future : '%s內',
            past : '%s前',
            s : '幾秒',
            ss : '%d 秒',
            m : '1 分鐘',
            mm : '%d 分鐘',
            h : '1 小時',
            hh : '%d 小時',
            d : '1 天',
            dd : '%d 天',
            M : '1 個月',
            MM : '%d 個月',
            y : '1 年',
            yy : '%d 年'
        }
    });

    return zhHk;

})));


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   undefined
}(this, (function (moment) { 'use strict';


    var zhTw = moment.defineLocale('zh-tw', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'YYYY/MM/DD',
            LL : 'YYYY年M月D日',
            LLL : 'YYYY年M月D日 HH:mm',
            LLLL : 'YYYY年M月D日dddd HH:mm',
            l : 'YYYY/M/D',
            ll : 'YYYY年M月D日',
            lll : 'YYYY年M月D日 HH:mm',
            llll : 'YYYY年M月D日dddd HH:mm'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour : function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
                return hour;
            } else if (meridiem === '中午') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar : {
            sameDay : '[今天] LT',
            nextDay : '[明天] LT',
            nextWeek : '[下]dddd LT',
            lastDay : '[昨天] LT',
            lastWeek : '[上]dddd LT',
            sameElse : 'L'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
        ordinal : function (number, period) {
            switch (period) {
                case 'd' :
                case 'D' :
                case 'DDD' :
                    return number + '日';
                case 'M' :
                    return number + '月';
                case 'w' :
                case 'W' :
                    return number + '週';
                default :
                    return number;
            }
        },
        relativeTime : {
            future : '%s內',
            past : '%s前',
            s : '幾秒',
            ss : '%d 秒',
            m : '1 分鐘',
            mm : '%d 分鐘',
            h : '1 小時',
            hh : '%d 小時',
            d : '1 天',
            dd : '%d 天',
            M : '1 個月',
            MM : '%d 個月',
            y : '1 年',
            yy : '%d 年'
        }
    });

    return zhTw;

})));


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = restmoney;
function restmoney() {
  return {
    "template": {
      "gridrelation": {
        "restmoney": {
          "destBrowseAreaCode": null,
          "destEditAreaCode": null,
          "srcAreaCode": "restmoney",
          "tabRelation": ["restmoney"]
        }
      },
      "restmoney": {
        "clazz": "nc.vo.cmp.settlement.LinkAccountBalanceVO",
        "code": "restmoney",
        "items": [{
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000041'], /* 国际化处理： 账户编码*/
          "attrcode": "accountcode",
          "maxlength": "20",
          "metapath": "accountcode"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000042'], /* 国际化处理： 账户名称*/
          "attrcode": "accountname",
          "maxlength": "20",
          "metapath": "accountname"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000058'], /* 国际化处理： 币种,币种*/
          "attrcode": "currencyname",
          "maxlength": "20",
          "metapath": "currencyname"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": this.state.json['360701OB-000043'], /* 国际化处理： 账户类型*/
          "attrcode": "accounttype",
          "disabled": true,
          "metapath": "accounttype"
        }, {
          "itemtype": "input",
          "visible": false,
          "label": this.state.json['360701OB-000057'], /* 国际化处理： 资金形态,资金形态*/
          "code": "capitaltype",
          "attrcode": "capitaltype",
          "disabled": true,
          "metapath": "capitaltype"
        }, {
          "itemtype": "number",
          "scale": "8",
          "visible": true,
          "label": this.state.json['360701OB-000044'], /* 国际化处理： 账面余额*/
          "attrcode": "currentbalance",
          "maxlength": "28",
          "metapath": "currentbalance"
        }, {
          "itemtype": "number",
          "scale": "8",
          "visible": true,
          "label": this.state.json['360701OB-000045'], /* 国际化处理： 可用余额*/
          "attrcode": "surplusbalance",
          "maxlength": "28",
          "metapath": "surplusbalance"
        }],
        "moduletype": "table",
        "name": this.state.json['360701OB-000046'], /* 国际化处理： 期初余额联查*/
        "pagination": false,
        "vometa": ""
      },
      "code": "restmoney",
      "moduletype": "table",
      "name": this.state.json['360701OB-000046'] /* 国际化处理： 期初余额联查*/
    },
    "code": "360701OB_P01",
    "formrelation": null,
    "name": this.state.json['360701OB-000046'], /* 国际化处理： 期初余额联查*/
    "metapath": "cmp_initdate",
    "clazz": "nc.vo.cmp.settlement.LinkAccountBalanceVO",
    "pagetype": "Nochild"
  };
}

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * 处理Form组织多版本
 * @author tangleic
 * @param {*} props 页面内置对象
 * @param {*} formOrgFieldObj form组织字段对象
 */
var formOrgVersionControl = function formOrgVersionControl(props, formOrgFieldObj) {
    if (!props || Object.keys(formOrgFieldObj).length == 0) {
        return;
    }
    var status = props.getUrlParam("status");
    var show = {};
    var unshow = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(formOrgFieldObj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var areaCode = _step.value;

            var orgFieldArr = formOrgFieldObj[areaCode];
            if (!orgFieldArr || orgFieldArr.length == 0) {
                continue;
            }
            //循环遍历组织字段，先判断组织字段在模板中是否显示，显示则处理组织和组织版本字段的显隐性
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = orgFieldArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var orgField = _step2.value;

                    //拼接组织版本字段名
                    var v_orgField = orgField + '_v';
                    //浏览态，显示版本信息，否则显示非浏览态
                    var visible_org = props.form.getFormItemsVisible(areaCode, orgField);
                    var visible_org_v = props.form.getFormItemsVisible(areaCode, v_orgField);
                    if (status == 'browse') {
                        if (visible_org || visible_org_v) {
                            show[v_orgField] = true;
                            unshow[orgField] = false;
                        } else {
                            unshow[orgField] = false;
                            unshow[v_orgField] = false;
                        }
                    } else {
                        if (visible_org || visible_org_v) {
                            show[orgField] = true;
                            unshow[v_orgField] = false;
                        } else {
                            unshow[orgField] = false;
                            unshow[v_orgField] = false;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            props.form.setFormItemsVisible(areaCode, show);
            props.form.setFormItemsVisible(areaCode, unshow);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

/**
 * 处理grid组织多版本
 * @param {*} props 
 * @param {*} gridOrgFieldObj 
 */
var gridOrgVersionControl = function gridOrgVersionControl(props, gridOrgFieldObj) {
    if (!props || Object.keys(gridOrgFieldObj).length == 0) {
        return;
    }
    var status = props.getUrlParam("status");
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = Object.keys(gridOrgFieldObj)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var areaCode = _step3.value;

            var orgFieldArr = gridOrgFieldObj[areaCode];
            if (!orgFieldArr || orgFieldArr.length == 0) {
                continue;
            }
            //获取版本字段
            var v_orgFieldArr = getOrgVersionFieldArr(orgFieldArr);
            //浏览态显示版本，编辑态显示非版本
            if (status == 'browse') {
                props.cardTable.showColByKey(areaCode, v_orgFieldArr);
                // setTimeout(() => {
                //     debugger
                //     props.cardTable.hideColByKey(areaCode, orgFieldArr)
                // }, 3000)
                props.cardTable.hideColByKey(areaCode, orgFieldArr);
            } else {
                props.cardTable.showColByKey(areaCode, orgFieldArr);
                props.cardTable.hideColByKey(areaCode, v_orgFieldArr);
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }
};

/**
 * 获取版本字段名
 * @param {*} orgFieldArr 组织字段数组 
 */
var getOrgVersionFieldArr = function getOrgVersionFieldArr(orgFieldArr) {
    if (!orgFieldArr || orgFieldArr.length == 0) {
        return [];
    }
    var v_orgArr = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = orgFieldArr[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var orgField = _step4.value;

            //TODO 获取模板该字段是否显示，目前平台无此api 待平台提供后完善
            var v_org = orgField + '_v';
            v_orgArr.push(v_org);
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    return v_orgArr;
};

/**
 * 组织多版本试图
 * @param {*} props 
 * @param {*} headCode 
 * @param {*} orgField (主组织字段名，默认pk_org,可自行注入，非必输)
 * @param {*} orgVField (主组织版本字段名，默认pk_org_v,可自行注入，非必输)
 */
var orgVersionView = exports.orgVersionView = function orgVersionView(props, headcode) {
    var orgField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pk_org';
    var orgVField = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org_v';

    if (!props || !headcode) {
        return;
    }
    var status = props.getUrlParam("status");
    //浏览态显示组织版本，编辑态显示组织
    var showflag = status == 'browse';
    var obj = {};
    obj[orgField] = !showflag;
    obj[orgVField] = showflag;
    props.form.setFormItemsVisible(headcode, obj);
};
/**
 * 组织多版本试图新解决效率问题
 * @param {*} props 
 * @param {*} headCode 
 * @param {*} orgField (主组织字段名，默认pk_org,可自行注入，非必输)
 * @param {*} orgVField (主组织版本字段名，默认pk_org_v,可自行注入，非必输)
 */
var orgVersionViewNew = exports.orgVersionViewNew = function orgVersionViewNew(props, headcode) {
    var orgField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pk_org';
    var orgVField = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'pk_org_v';

    if (!props || !headcode) {
        return;
    }
    var status = props.getUrlParam("status");
    //浏览态显示组织版本，编辑态显示组织
    var showflag = status == 'browse';
    var obj = {};
    obj[orgField] = !showflag;
    obj[orgVField] = showflag;
    props.form.setItemsVisible(headcode, obj);
};

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _ncLightappFront = __webpack_require__(1);

var _buttonClick = __webpack_require__(152);

var _buttonClick2 = _interopRequireDefault(_buttonClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NCModal = _ncLightappFront.base.NCModal,
    NCTooltip = _ncLightappFront.base.NCTooltip,
    NCButton = _ncLightappFront.base.NCButton,
    NCHotKeys = _ncLightappFront.base.NCHotKeys;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */
/**
 * 作废组件
 * @author：gaokung
 */

var DisableCom = function DisableCom(props) {
    var _this = undefined;
    var context = props.context,
        show = props.show,
        title = props.title,
        signCode = props.signCode,
        onSureCallback = props.onSureCallback;
    var createForm = context.props.form.createForm;
    var _context$props$button = context.props.button,
        createButtonApp = _context$props$button.createButtonApp,
        createButton = _context$props$button.createButton;

    return _react2.default.createElement(
        NCModal,
        {
            show: show,
            fieldid: "disablenote",
            backdrop: false,
            className: "senior",
            onHide: _buttonClick2.default.bind(context, signCode, onSureCallback, props, "onCancel"),
            ref: function ref(NCModal) {
                return context.NCModal = NCModal;
            }
        },
        _react2.default.createElement(NCHotKeys, {
            keyMap: {
                sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
                cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
            },
            handlers: {
                sureBtnHandler: function sureBtnHandler() {
                    _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "onSure");
                },
                cancelBtnHandler: function cancelBtnHandler() {
                    _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "onCancel");
                }
            },
            className: "simpleModal-hotkeys-wrapper",
            focused: true,
            attach: document.body,
            display: "inline-block"
        }),
        _react2.default.createElement(
            NCModal.Header,
            { closeButton: "true" },
            _react2.default.createElement(
                NCModal.Title,
                null,
                title
            )
        ),
        _react2.default.createElement(
            NCModal.Body,
            null,
            createForm(signCode, {})
        ),
        _react2.default.createElement(
            NCModal.Footer,
            null,
            createButtonApp({
                area: signCode,
                tipKeybodard: "underline",
                onButtonClick: _buttonClick2.default.bind(context, signCode, onSureCallback)
            })
        )
    );
};

exports.default = DisableCom;

/***/ }),
/* 142 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__142__;

/***/ }),
/* 143 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 144 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* 
    其他节点常量，主要用于联查
*/

//联查凭证跳转路径
var VoucherDataConst = exports.VoucherDataConst = {
    pagecode: '10170410_1017041001',
    appcode: '10170410'
};

//发债申请
var bondApplyConst = exports.bondApplyConst = {
    url: '/bond/bond/apply/main/index.html#/card',
    appcode: '36650BA',
    pagecodeList: '36650BA_LIST',
    pagecodeCard: '36650BAL_CARD' //'36650BA_CARD'


    //债券契约
};var bondContractConst = exports.bondContractConst = {
    url: '/bond/bond/contract/main/index.html#/card',
    appcode: '36650BC',
    pagecodeList: '36650BC_LIST',
    pagecodeCard: '36650BC_CARD'

    //债券发行
};var bondRegisterConst = exports.bondRegisterConst = {
    url: '/bond/bond/register/main/index.html#/card',
    appcode: '36650BIS',
    pagecodeList: '36650BIS_LIST',
    pagecodeCard: '36650BIS_CARD'

    //结息日
};var settledateConst = exports.settledateConst = {
    url: '/tmpub/pub/settledate/main/index.html#/card',
    appcode: '36010ISDC',
    pagecodeList: '36010ISDC_LIST_01',
    pagecodeCard: '36010ISDC_CARD_01'

    //根据利率类型联查利率
};var linkInterestConst = exports.linkInterestConst = {
    //todo 改成联查模板code
    //组织
    '0': {
        url: '/tmpub/pub/interestrate_org/main/index.html#/card',
        appcode: '36010IRCO',
        pagecode: '36010IRCO_card'
    },
    //集团
    '1': {
        url: '/tmpub/pub/interestrate_group/main/index.html#/card',
        appcode: '36010IRCG',
        pagecode: '36010IRCG_card'
    },
    //全局
    '2': {
        url: '/tmpub/pub/interestrate_global/main/index.html#/card',
        appcode: '36010IRC',
        pagecode: '36010IRC_card'
    }

    //利息清单
};var interestListConst = exports.interestListConst = {
    urlList: '/bond/bond/interestlist/main/index.html#/list',
    urlCard: '/bond/bond/interestlist/main/index.html#/card',
    appcode: '36650BCIB',
    pagecodeList: '36650BCIB_LIST',
    pagecodeCard: '36650BCIB_CARD'

    //额度上收
};var upquotaConst = exports.upquotaConst = {
    urlList: '/fbm/pfbm/upquota/main/index.html#/list',
    urlCard: '/fbm/pfbm/upquota/main/index.html#/card',
    appcode: '36185530',
    pagecodeList: '36185530_LIST',
    pagecodeCard: '36185530_CARD'

    //单位下拨可用额度
};var unitquotaConst = exports.unitquotaConst = {
    urlList: '/fbm/pfbm/quotasummary/main/index.html#/list',
    appcode: '36185540',
    pagecodeList: '36185540_LIST'

    //申请单
};var quotaapplyConst = exports.quotaapplyConst = {
    urlCard: '/fbm/pfbm/quotaapply/main/index.html#/list',
    appcode: '36180QA',
    pagecodeCard: '36180QAL_List'

    //应付票据贴现
};var buyerdiscount = exports.buyerdiscount = {
    urlList: '/fbm/fbm/buyerdiscount/main/index.html#/list',
    urlCard: '/fbm/fbm/buyerdiscount/main/index.html#/card',
    appcode: '36180PDT',
    pagecodeList: '36180PDT_LIST',
    pagecodeCard: '36180PDT_CARD'
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = balance;
function balance(json) {
  return {
    "template": {
      "gridrelation": {
        "table_area": {
          "destBrowseAreaCode": null,
          "destEditAreaCode": null,
          "srcAreaCode": "table_area",
          "tabRelation": ["table_area"]
        }
      },
      "table_area": {
        "clazz": "nc.vo.ccc.bankprotocol.ProtocolVO",
        "code": "table_area",
        "items": [{
          "itemtype": "input",
          "visible": true,
          "label": json['36610CCA-000001'], // 授信协议
          "attrcode": "protocolcode",
          "maxlength": "20",
          "metapath": "protocolcode"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": json['36610CCA-000002'], // 币种
          "attrcode": "pk_currtype",
          "maxlength": "20",
          "metapath": "pk_currtype"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": json['36610CCA-000003'], // 授信类别
          "attrcode": "credittype",
          "maxlength": "20",
          "metapath": "credittype"
        }, {
          "itemtype": "input",
          "visible": true,
          "label": json['36610CCA-000004'], // 授信银行
          "attrcode": "pk_bankdoc",
          "maxlength": "20",
          "metapath": "pk_bankdoc"
        }, {
          "itemtype": "number",
          "scale": "8",
          "visible": true,
          "label": json['36610CCA-000005'], // 可用授信额度
          "attrcode": "availcdtlnamt",
          "maxlength": "28",
          "metapath": "availcdtlnamt"
        }, {
          "itemtype": "number",
          "scale": "8",
          "visible": true,
          "label": json['36610CCA-000006'], // 可用授信可用额度
          "attrcode": "olcavailcdtlnamt",
          "maxlength": "28",
          "metapath": "olcavailcdtlnamt"
        }],
        "moduletype": "table",
        "name": "table_area_name",
        "vometa": ""
      },
      "code": "table_area",
      "moduletype": "table",
      "name": "table_area_name"
    },
    "code": "36610CCB",
    "formrelation": null,
    "name": json['36610CCA-000007'], // 授信可用余额联查
    "metapath": "ccc_bankprotocol",
    "clazz": "nc.vo.ccc.bankprotocol.ProtocolVO"
  };
}

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.listSendInstruction = exports.listTransform = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* 
                                                                                                                                                                                                                                                                    列表页按钮操作方法
                                                                                                                                                                                                                                                                    created by: liyaoh 2018-09-06
                                                                                                                                                                                                                                                                  */


/**
 * 冲销
 *
 * @param {*} arg - listOperation的参数
 */
var listTransform = exports.listTransform = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(arg) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        listOperation.call(this, Object.assign({ name: "transform" }, arg));

                    case 1:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function listTransform(_x3) {
        return _ref2.apply(this, arguments);
    };
}();
/**
 * 取消冲销
 *
 * @param {*} arg - listOperation的参数
 */


/**
 * 列表发送指令
 *
 * @param {*} arg - listOperation的参数
 */
var listSendInstruction = exports.listSendInstruction = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(arg) {
        var data, pks, pkMapTs, result, isMulti, userObj;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        data = {};
                        pks = arg.data.pks;
                        pkMapTs = arg.data.pkMapTs;

                        data = {
                            pks: pks,
                            pkMapTs: pkMapTs
                        };
                        // ca框,只弹框不签名
                        _context2.next = 6;
                        return (0, _ca2.default)({
                            isSign: true,
                            isKey: false,
                            data: null,
                            isSave: true,
                            encryptVOClassName: this.encryptVOClassName,
                            primaryId: pks
                        });

                    case 6:
                        result = _context2.sent;

                        if (!result.isStop) {
                            _context2.next = 11;
                            break;
                        }

                        return _context2.abrupt("return");

                    case 11:
                        isMulti = pks.length > 1 ? true : false;
                        userObj = new Map();

                        userObj.set("sign_strSrc", result.data.text);
                        userObj.set("signature", result.data.signText);
                        userObj.set("sing_sn", result.data.userjson);
                        data.userObj = userObj;
                        listOperation.call(this, Object.assign({ name: "sendCommand" }, { data: data, isMulti: isMulti }));

                    case 18:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function listSendInstruction(_x4) {
        return _ref3.apply(this, arguments);
    };
}();
/**
 * 列表取消发送指令
 *
 * @param {*} arg - listOperation的参数
 */


exports.listOperation = listOperation;
exports.checkSelected = checkSelected;
exports.listAdd = listAdd;
exports.listHandle = listHandle;
exports.handleToggleShow = handleToggleShow;
exports.listEdit = listEdit;
exports.toggleShow = toggleShow;
exports.listCommit = listCommit;
exports.listUncommit = listUncommit;
exports.listDelete = listDelete;
exports.listTerminate = listTerminate;
exports.listUnterminate = listUnterminate;
exports.listRefresh = listRefresh;
exports.listPrint = listPrint;
exports.listPrintList = listPrintList;
exports.listOutput = listOutput;
exports.listFileMgr = listFileMgr;
exports.listChange = listChange;
exports.listViewVersion = listViewVersion;
exports.listDeleteVersion = listDeleteVersion;
exports.listDestroy = listDestroy;
exports.listMakeVoucher = listMakeVoucher;
exports.listCancelVoucher = listCancelVoucher;
exports.listCalcInterest = listCalcInterest;
exports.listUnInterest = listUnInterest;
exports.listReturn = listReturn;
exports.listInvalid = listInvalid;
exports.listCancelInvalid = listCancelInvalid;
exports.listConfirmreceipt = listConfirmreceipt;
exports.listUnconfirmreceipt = listUnconfirmreceipt;
exports.listCancelTransform = listCancelTransform;
exports.listTally = listTally;
exports.listCancelTally = listCancelTally;
exports.listCancelInstruction = listCancelInstruction;
exports.listDownquota = listDownquota;
exports.impawnBackInstr = impawnBackInstr;
exports.cancelImpawnBack = cancelImpawnBack;
exports.withdrawImpawn = withdrawImpawn;
exports.impawnBackSign = impawnBackSign;
exports.listAccept = listAccept;
exports.listUnAccept = listUnAccept;
exports.listCommission = listCommission;
exports.listUnCommission = listUnCommission;
exports.doCommission = doCommission;
exports.doUnCommission = doUnCommission;
exports.doBodyCommission = doBodyCommission;
exports.doBodyCommissionCancel = doBodyCommissionCancel;

var _ncLightappFront = __webpack_require__(1);

var _ca = __webpack_require__(11);

var _ca2 = _interopRequireDefault(_ca);

var _common = __webpack_require__(5);

var _page = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;

/**
 * 列表操作列按钮操作
 *
 * @param {*} name - 操作名称
 * @param {*} data - 请求数据
 * @param {*} index - 当前操作行index
 * @param {*} params - 自定义参数
 */

function listBodyBtnOper(name, data, index, params) {
    var _this = this;

    var pdata = _extends({ isListOpt: true }, data);
    var successBefore = params.successBefore,
        successAfter = params.successAfter;

    var langData = this.props.MultiInit.getLangData(_common.MODULE_ID);
    _common.api.call(this, {
        name: name,
        data: pdata,
        success: function success(res) {
            var success = res.success,
                data = res.data;

            if (success) {
                if (successBefore) {
                    successBefore(res);
                } else {
                    var successNum = data.successNum,
                        failNum = data.failNum,
                        total = data.total;
                    //提交即指派

                    if (params.composite && res.data.workflow && (res.data.workflow == "approveflow" || res.data.workflow == "workflow")) {
                        _this.setState({ compositedata: res.data, compositedisplay: true, curPk: pdata.pks });
                    } else {
                        if (successNum == total) {
                            /* 国际化处理： 成功*/
                            (0, _ncLightappFront.toast)({
                                color: "success",
                                content: _this.state.json[_common.OPR_NAME[name]] + _this.state.json["fbmpublic-000020"]
                            });
                            var singleGridData = data && data.grid && data.grid[_this.tableId] && data.grid[_this.tableId].rows && data.grid[_this.tableId].rows[0] && data.grid[_this.tableId].rows[0].values;
                            var singleHeadData = data && data.head && data.head[_this.tableId] && data.head[_this.tableId].rows && data.head[_this.tableId].rows[0] && data.head[_this.tableId].rows[0].values;
                            var billCardsData = data && data.billCards && data.billCards[0] && data.billCards[0].head && data.billCards[0].head[_this.tableId] && data.billCards[0].head[_this.tableId].rows && data.billCards[0].head[_this.tableId].rows[0] && data.billCards[0].head[_this.tableId].rows[0].values;
                            var headData = singleGridData || singleHeadData || billCardsData;
                            var tbbMsg = headData && headData["tbbmessage"] && headData["tbbmessage"].value;
                            if (tbbMsg)
                                //预算提示
                                (0, _ncLightappFront.toast)({ color: "warning", content: tbbMsg });
                            if (!index) {
                                // 此处提交指派确定会调用到listBodyBtnOper里面，缺少index参数，需要获取到才能更新数据

                                //不要通过获取已经勾选的数据的方式去获取index 会引发错误
                                // let checked = this.props.table.getAllTableData(this.tableId);
                                // if (checked && checked[0]) {
                                //     index = checked[0].index;
                                // } else {
                                // 需要找到index才能更新数据
                                var allrows = _this.props.table.getAllTableData(_this.tableId);
                                if (allrows && allrows.rows) {
                                    for (var i = 0; i < allrows.rows.length; i++) {
                                        var ele = allrows.rows[i];
                                        var pk = ele.values[_this.primaryId].value;
                                        if (pdata.pks[0] == pk) {
                                            index = i;
                                            break;
                                        }
                                    }
                                }
                                // }
                            }
                            //删除缓存对应数据
                            if (name === "delete" || name === "return") {
                                var deletePk = [];
                                data.billCards[0] && deletePk.push(data.billCards[0].head[_this.tableId].rows[0].values[_this.primaryId]);
                                _this.props.table.deleteCacheId(_this.tableId, deletePk);
                                _this.props.table.deleteTableRowsByIndex(_this.tableId, index);
                            } else {
                                if (headData) {
                                    var updateDataArr = [{
                                        index: index,
                                        data: { values: headData }
                                    }];
                                    _this.props.table.updateDataByIndexs(_this.tableId, updateDataArr);
                                } else {
                                    _page.getListData.call(_this);
                                }
                            }
                        } else {
                            //失败
                            var tips = "";
                            if (data.msgDetail && data.msgDetail[0]) {
                                tips = data.msgDetail;
                            }
                            /* 国际化处理： 失败*/
                            (0, _ncLightappFront.toast)({
                                color: "danger",
                                content: _this.state.json[_common.OPR_NAME[name]] + _this.state.json["fbmpublic-000052"] + tips
                            });
                        }
                    }
                    successAfter && successAfter(res);
                }
            }
        }
    });
}

/**
 * 列表头部按钮操作
 *
 * @param {*} name - 操作名称
 * @param {*} data - 请求数据
 * @param {*} params - 自定义参数
 */
function listHeadBtnOper(name, data, params) {
    var _this2 = this;

    var pdata = _extends({ isListOpt: true }, data);
    var successBefore = params.successBefore,
        successAfter = params.successAfter;

    var langData = this.props.MultiInit.getLangData(_common.MODULE_ID);
    _common.api.call(this, {
        name: name,
        data: pdata,
        success: function success(res) {
            var success = res.success,
                data = res.data;

            if (success) {
                if (successBefore) {
                    successBefore(res);
                } else if (data) {
                    //提交即指派
                    if (params.composite && res.data.workflow && (res.data.workflow == "approveflow" || res.data.workflow == "workflow")) {
                        _this2.setState({ compositedata: res.data, compositedisplay: true, curPk: pdata.pks });
                    } else {
                        var selectedData = _this2.props.table.getCheckedRows(_this2.tableId);
                        if (typeof data.successNum === "undefined") {
                            /* 国际化处理： 成功*/
                            (0, _ncLightappFront.toast)({
                                color: "success",
                                content: _this2.state.json[_common.OPR_NAME[name]] + _this2.state.json["fbmpublic-000020"]
                            });
                            // 处理按钮操作返回数据，刷新选中记录数据
                            handleListHeadReturnData.call(_this2, selectedData, data, name);
                        } else {
                            //批量操作
                            multiToast.call(_this2, name, _common.OPR_NAME, data); //批量提示
                            //批量删除缓存中数据
                            if (name === "delete" || name === "return") {
                                if (data.pkMapRowIndex) {
                                    var map = data.pkMapRowIndex;
                                    var values = Object.values(map);
                                    _this2.props.table.deleteTableRowsByIndex(_this2.tableId, values);
                                }
                                var returnData = data && data.billCards;
                                if (returnData) {
                                    var deletePks = [];
                                    returnData.forEach(function (bill) {
                                        if (bill && bill.head && bill.head[_this2.tableId] && bill.head[_this2.tableId].rows && bill.head[_this2.tableId].rows[0] && bill.head[_this2.tableId].rows[0].values && bill.head[_this2.tableId].rows[0].values[_this2.primaryId] && bill.head[_this2.tableId].rows[0].values[_this2.primaryId].value) {
                                            var pk = bill.head[_this2.tableId].rows[0].values[_this2.primaryId];
                                            deletePks.push(pk);
                                        }
                                    });
                                    _this2.props.table.deleteCacheId(_this2.tableId, deletePks);
                                }
                                _page.toggleListHeadBtnDisabled.call(_this2);
                            } else {
                                if (_this2.pageId === '36185530_LIST') {
                                    _page.getListDataByLinkPk.call(_this2, _this2.state.linkPks);
                                } else {
                                    // 处理按钮操作返回数据，刷新选中记录数据
                                    handleListHeadReturnData.call(_this2, selectedData, data, name);
                                }
                            }
                        }
                    }
                    successAfter && successAfter(res);
                }
            }
        }
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleListHeadReturnData(selectedData, data, operatName) {
    var _this3 = this;

    var returnData = void 0;
    /**
         * 提交、收回按钮 多条数据结构
         * data.data[i].result[0].parent[this.primaryId].value
         */
    var commitMultipleReturnData = data && data.grid;
    /**
         * 删除，制证，发送指令等通用按钮 数据结构 
         * data.billCards[i].head[this.tableId].rows[0].values
         */
    var commmonReturnData = data && data.billCards;
    if (commitMultipleReturnData || commmonReturnData) {
        /**
         * 提交、收回按钮 多条数据结构
         * data.data[i].result[0].parent[this.primaryId].value
         * returnData[1].result[0].parent
         */
        if (commitMultipleReturnData) {
            returnData = commitMultipleReturnData[this.tableId].rows;
            //处理选择数据
            selectedData.forEach(function (val) {
                var primaryId_check = val.data.values[_this3.primaryId].value;
                returnData.forEach(function (retrunval) {
                    if (retrunval && retrunval.values && retrunval.values[_this3.primaryId] && retrunval.values[_this3.primaryId].value) {
                        if (primaryId_check === retrunval.values[_this3.primaryId].value) {
                            var updateDataArr = [{
                                index: val.index,
                                data: { values: retrunval.values }
                            }];
                            _this3.props.table.updateDataByIndexs(_this3.tableId, updateDataArr);
                        }
                    }
                });
            });
        }
        /**
         * 删除，制证，发送指令等通用按钮 数据结构 
         * data.billCards[i].head[this.tableId].rows[0].values
         */
        if (commmonReturnData) {
            returnData = commmonReturnData;
            //处理选择数据
            var returnPKs = [];
            var returnIndex = [];
            selectedData.forEach(function (val) {
                var primaryId_check = val.data.values[_this3.primaryId].value;
                for (var i = 0; i < returnData.length; i++) {
                    var retrunval = returnData[i];
                    if (retrunval && retrunval.head && retrunval.head[_this3.tableId] && retrunval.head[_this3.tableId].rows && retrunval.head[_this3.tableId].rows[0] && retrunval.head[_this3.tableId].rows[0].values && retrunval.head[_this3.tableId].rows[0].values[_this3.primaryId] && retrunval.head[_this3.tableId].rows[0].values[_this3.primaryId].value) {
                        var primaryId_ret = retrunval.head[_this3.tableId].rows[0].values[_this3.primaryId].value;
                        if (primaryId_check === primaryId_ret) {
                            var updateDataArr = [{
                                index: val.index,
                                data: { values: retrunval.head[_this3.tableId].rows[0].values }
                            }];
                            _this3.props.table.updateDataByIndexs(_this3.tableId, updateDataArr);
                            if (operatName === 'return') {
                                returnPKs.push(retrunval.head[_this3.tableId].rows[0].values[_this3.primaryId]);
                                returnIndex.push(val.index);
                            }
                            break;
                        }
                    }
                }
            });
            if (operatName === 'return') {
                this.props.table.deleteCacheId(this.tableId, returnPKs);
                this.props.table.deleteTableRowsByIndex(this.tableId, returnIndex);
            }
        }
    }
}

/**
 * 接口返回批量提示
 *
 * @param {*} name - 操作名称（与OPR_NAME的键对应）
 * @param {*} OPR_NAME - 操作名称对应的文本 
 * OPR_NAME示例
 * {
        commit: '提交',
        uncommit: '收回',
        delete: '删除'
    }
 * @param {*} data - 接口返回数据
 */
function multiToast(name, OPR_NAME) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    //这里换成自己接口返回的字段名
    var langData = this.props.MultiInit.getLangData(_common.MODULE_ID);
    var successNum = data.successNum,
        failNum = data.failNum,
        total = data.total,
        msg = data.msg,
        msgDetail = data.msgDetail,
        errorNum = data.errorNum;

    if (typeof failNum == "undefined") {
        failNum = errorNum;
    }
    var content = this.state.json["fbmpublic-000053"] + this.state.json[OPR_NAME[name]] + total + this.state.json["fbmpublic-000054"] + "，" + this.state.json["fbmpublic-000020"] + successNum + this.state.json["fbmpublic-000054"] + "，" + this.state.json["fbmpublic-000052"] + failNum + this.state.json["fbmpublic-000054"]; /* 国际化处理： 共,条,成功,条,失败,条*/ /* 国际化处理： 共,条,成功,条,失败,条*/
    if (successNum == total) {
        //全部成功
        (0, _ncLightappFront.toast)({
            duration: 5,
            color: "success",
            title: this.state.json[OPR_NAME[name]] + this.state.json["fbmpublic-000055"] + "，" + msg /* 国际化处理： 完毕*/ /* 国际化处理： 完毕*/
            , content: content,
            groupOperation: true
        });
    } else if (failNum == total) {
        //全部失败
        (0, _ncLightappFront.toast)({
            duration: "infinity",
            color: "danger",
            title: this.state.json[OPR_NAME[name]] + this.state.json["fbmpublic-000055"] + "，" + msg /* 国际化处理： 完毕*/ /* 国际化处理： 完毕*/
            , content: content,
            groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: [this.state.json["fbmpublic-000056"], this.state.json["fbmpublic-000057"], this.state.json["fbmpublic-000058"]] /* 国际化处理： 展开,收起,关闭*/ /* 国际化处理： 展开,收起,关闭*/
            , groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
        });
    } else if (+successNum < +total) {
        //部分失败
        (0, _ncLightappFront.toast)({
            duration: "infinity",
            color: "danger",
            title: this.state.json[OPR_NAME[name]] + this.state.json["fbmpublic-000055"] + "，" + msg /* 国际化处理： 完毕*/ /* 国际化处理： 完毕*/
            , content: content,
            groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: [this.state.json["fbmpublic-000056"], this.state.json["fbmpublic-000057"], this.state.json["fbmpublic-000058"]] /* 国际化处理： 展开,收起,关闭*/ /* 国际化处理： 展开,收起,关闭*/
            , groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
        });
    }
}

/**
 * 列表页按钮操作
 *
 * @param {*} {
 *     name, - 操作名称
 *     isMulti - 是否批量操作，默认false
 *     data - 请求数据
 *     checkOne - 判断是否只能选中一条数据，默认false
 *     successBefore - 成功回调前操作（阻断性）
 *     successAfter - 成功回调后操作（非阻断）
 * }
 */
function listOperation(_ref) {
    var name = _ref.name,
        _ref$isMulti = _ref.isMulti,
        isMulti = _ref$isMulti === undefined ? false : _ref$isMulti,
        data = _ref.data,
        _ref$checkOne = _ref.checkOne,
        checkOne = _ref$checkOne === undefined ? false : _ref$checkOne,
        other = _objectWithoutProperties(_ref, ["name", "isMulti", "data", "checkOne"]);

    data = _extends({ pageCode: this.pageId }, data);
    if (isMulti) {
        //批量操作
        if (checkSelected.call(this, checkOne)) {
            listHeadBtnOper.call(this, name, data, other);
        }
    } else {
        listBodyBtnOper.call(this, name, data, other.index, other);
    }
    /* 国际化处理： 操作成功*/
    console.log(name + this.state.json["fbmpublic-000059"]);
}

/**
 * 是否选中数据
 *
 * @param {*} checkOne 是否选中一条数据，默认false
 * @returns 返回是否校验成功
 */
function checkSelected() {
    var checkOne = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var valid = true;
    var selectDatas = this.props.table.getCheckedRows(this.tableId);
    if (checkOne && selectDatas.length > 1) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.state.json["fbmpublic-000060"] /* 国际化处理： 请选中一行数据！*/ /* 国际化处理： 请选中一行数据！*/
        });
        valid = false;
    } else if (selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.state.json["fbmpublic-000061"] /* 国际化处理： 请选择数据操作！*/ /* 国际化处理： 请选择数据操作！*/
        });
        valid = false;
    }
    return valid;
}

/**
 * 列表新增
 *
 */
function listAdd() {
    this.props.pushTo("/card", {
        status: "add",
        pagecode: this.cardPageCode
    });
}

/**
 * 列表经办
 *
 * @param {*} pk - 主键
 */
function listHandle(pk) {
    this.props.pushTo("/card", {
        status: "handle",
        id: pk,
        pagecode: this.cardPageCode
    });
}
function handleToggleShow() {
    //经办切换页面状态
    var status = this.props.getUrlParam("status");
    if (status === "handle") {
        this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
    }
}
/**
 * 列表修改
 *
 * @param {*} pk - 主键
 */
function listEdit(pk) {
    var _this4 = this;

    var data = { pk: pk, fieldPK: this.primaryId, tableName: this.tableName };
    _common.apiSaga.call(this, {
        data: data,
        success: function success(res) {
            _this4.props.pushTo("/card", {
                status: "edit",
                id: pk,
                pagecode: _this4.cardPageCode
            });
        }
    });
}
function toggleShow() {
    //切换页面状态
    var status = this.props.getUrlParam("status");
    if (status === "edit") {
        this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
    }
}
/**
 * 列表提交
 *
 * @param {*} arg - listOperation的参数
 */
function listCommit(arg) {
    listOperation.call(this, Object.assign({
        name: "commit",
        composite: true //提交即指派
    }, arg));
}

/**
 * 列表收回
 *
 * @param {*} arg - listOperation的参数
 */
function listUncommit(arg) {
    listOperation.call(this, Object.assign({ name: "uncommit" }, arg));
}

/**
 * 列表删除
 *
 * @param {*} arg - listOperation的参数
 */
function listDelete(arg) {
    listOperation.call(this, Object.assign({ name: "delete" }, arg));
}

/**
 * 列表终止
 *
 * @param {*} arg - listOperation的参数
 */
function listTerminate(arg) {
    listOperation.call(this, Object.assign({ name: "terminate" }, arg));
}

/**
 * 列表取消终止
 *
 * @param {*} arg - listOperation的参数
 */
function listUnterminate(arg) {
    listOperation.call(this, Object.assign({ name: "unterminate" }, arg));
}

/**
 * 列表刷新
 *
 */
function listRefresh() {
    var searchCache = getDefData(this.searchCache.key, this.searchCache.dataSource);
    if (searchCache) {
        searchCache && _page.getListData.call(this);
        (0, _ncLightappFront.toast)({
            color: "success",
            content: this.state.json["fbmpublic-000062"] /* 国际化处理： 刷新成功！*/
        });
    } else {
        (0, _ncLightappFront.toast)({
            color: "success",
            content: this.state.json["fbmpublic-000062"] /* 国际化处理： 您有必输项未填写*/
        });
    }
}

/**
 * 列表打印
 *
 * @param {*} pks - 主键数组
 */
function listPrint(pks) {
    if (checkSelected.call(this)) {
        _common.printFn.call(this, pks);
    }
}

/**
 * 列表打印清单
 *
 * @param {*} pks - 主键数组
 */
function listPrintList(pks) {
    if (checkSelected.call(this)) {
        _common.printFnList.call(this, pks);
    }
}

/**
 * 列表输出
 *
 * @param {*} pks - 主键数组
 */
function listOutput(pks) {
    if (checkSelected.call(this, false)) {
        _common.output.call(this, pks);
    }
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
function listFileMgr(billId, billNo) {
    if (checkSelected.call(this, false)) {
        _common.fileMgr.call(this, billId, billNo);
    }
}

/**
 * 列表变更
 *
 * @param {*} pk - 主键
 */
function listChange(pk) {
    this.props.pushTo("/card", {
        status: "edit",
        pageType: "change",
        id: pk,
        pagecode: this.cardPageCode
    });
}

/**
 * 列表查看版本
 *
 * @param {*} pk - 主键
 */
function listViewVersion(pk) {
    this.props.pushTo("/card", {
        status: "browse",
        pageType: "version",
        id: pk,
        pagecode: this.cardPageCode
    });
}

/**
 * 列表删除版本
 *
 * @param {*} arg - listOperation的参数
 */
function listDeleteVersion(arg) {
    listOperation.call(this, Object.assign({ name: "deleteVersion" }, arg));
}

/**
 * 列表核销
 *
 * @param {*} arg - listOperation的参数
 */
function listDestroy(arg) {
    listOperation.call(this, Object.assign({ name: "destroy" }, arg));
}
/**
 * 列表制证
 *
 * @param {*} arg - listOperation的参数
 */
function listMakeVoucher(arg) {
    listOperation.call(this, Object.assign({ name: "makeVoucher" }, arg));
}

/**
 * 列表取消制证
 *
 * @param {*} arg - listOperation的参数
 */
function listCancelVoucher(arg) {
    listOperation.call(this, Object.assign({ name: "cancelVoucher" }, arg));
}

/**
 * 列表计息
 *
 * @param {*} arg - listOperation的参数
 */
function listCalcInterest(arg) {
    listOperation.call(this, Object.assign({ name: "interest" }, arg));
}

/**
 * 列表取消计息
 *
 * @param {*} arg - listOperation的参数
 */
function listUnInterest(arg) {
    listOperation.call(this, Object.assign({ name: "uninterest" }, arg));
}

/**
 * 列表退回
 * 是从退回组件调过来的
 * @param {*} arg - listOperation的参数
 */
function listReturn(arg) {
    var _this5 = this;

    var data = this.state.disabledData;
    if (!data) {
        var selectDatas = this.props.table.getCheckedRows(this.tableId);
        var pks = selectDatas && selectDatas.map(function (item) {
            return item.data.values[_this5.primaryId].value;
        });
        var pkMapTs = new Map();
        selectDatas && selectDatas.map(function (item) {
            var pk = item.data.values[_this5.primaryId].value;
            var ts = item.data.values["ts"] && item.data.values["ts"].value;
            //主键与tsMap
            if (pk && ts) {
                pkMapTs.set(pk, ts);
            }
        });
        data = {
            pks: pks,
            pkMapTs: pkMapTs
        };
    }
    var isMulti = data.pks.length > 1 ? true : false;
    // data = Object.assign(data,arg);
    data["extParam"] = arg;
    var index = data.index;
    listOperation.call(this, Object.assign({ name: "return" }, { data: data, isMulti: isMulti, index: index }));
}

/**
 * 列表作废
 * 是从作废组件调过来的
 * @param {*} arg - listOperation的参数
 */
function listInvalid(arg) {
    var _this6 = this;

    var data = this.state.disabledData;
    if (!data) {
        var selectDatas = this.props.table.getCheckedRows(this.tableId);
        var pks = selectDatas && selectDatas.map(function (item) {
            return item.data.values[_this6.primaryId].value;
        });
        var pkMapTs = new Map();
        selectDatas && selectDatas.map(function (item) {
            var pk = item.data.values[_this6.primaryId].value;
            var ts = item.data.values["ts"] && item.data.values["ts"].value;
            //主键与tsMap
            if (pk && ts) {
                pkMapTs.set(pk, ts);
            }
        });
        data = {
            pks: pks,
            pkMapTs: pkMapTs
        };
    }
    var isMulti = data.pks.length > 1 ? true : false;
    // data = Object.assign(data,arg);
    data["extParam"] = arg;
    listOperation.call(this, Object.assign({ name: "disable" }, { data: data, isMulti: isMulti }));
}
/**
 * 列表取消作废
 *
 * @param {*} arg - listOperation的参数
 */
function listCancelInvalid(arg) {
    listOperation.call(this, Object.assign({ name: "cancelDisable" }, arg));
}
/**
 * 列表确认
 * @param {*} arg - listOperation的参数
 */
function listConfirmreceipt(arg) {
    var _this7 = this;

    var data = this.state.confirmreceiptData;
    if (!data) {
        var selectDatas = this.props.table.getCheckedRows(this.tableId);
        var pks = selectDatas && selectDatas.map(function (item) {
            return item.data.values[_this7.primaryId].value;
        });
        var pkMapTs = new Map();
        selectDatas && selectDatas.map(function (item) {
            var pk = item.data.values[_this7.primaryId].value;
            var ts = item.data.values["ts"] && item.data.values["ts"].value;
            //主键与tsMap
            if (pk && ts) {
                pkMapTs.set(pk, ts);
            }
        });
        data = {
            pks: pks,
            pkMapTs: pkMapTs
        };
    }
    var isMulti = data.pks.length > 1 ? true : false;
    data["extParam"] = arg;
    listOperation.call(this, Object.assign({ name: "confirmreceipt" }, { data: data, isMulti: isMulti }));
}
/**
 * 列表取消确认
 *
 * @param {*} arg - listOperation的参数
 */
function listUnconfirmreceipt(arg) {
    listOperation.call(this, Object.assign({ name: "unconfirmreceipt" }, arg));
}function listCancelTransform(arg) {
    listOperation.call(this, Object.assign({ name: "cancelTransform" }, arg));
}

/**
 * 记账
 *
 * @param {*} arg - listOperation的参数
 */
function listTally(arg) {
    var _this8 = this;

    var data = this.state.disabledData;
    if (!data) {
        var selectDatas = this.props.table.getCheckedRows(this.tableId);
        var pks = selectDatas && selectDatas.map(function (item) {
            return item.data.values[_this8.primaryId].value;
        });
        var pkMapTs = new Map();
        selectDatas && selectDatas.map(function (item) {
            var pk = item.data.values[_this8.primaryId].value;
            var ts = item.data.values["ts"] && item.data.values["ts"].value;
            //主键与tsMap
            if (pk && ts) {
                pkMapTs.set(pk, ts);
            }
        });
        data = {
            pks: pks,
            pkMapTs: pkMapTs
        };
    }
    var isMulti = data.pks.length > 1 ? true : false;
    // data = Object.assign(data,arg);
    data["extParam"] = arg;
    var index = data.index;
    listOperation.call(this, Object.assign({ name: "tally" }, { data: data, isMulti: isMulti, index: index }));
}
/**
 * 取消记账
 *
 * @param {*} arg - listOperation的参数
 */
function listCancelTally(arg) {
    listOperation.call(this, Object.assign({ name: "cancelTally" }, arg));
}function listCancelInstruction(arg) {
    listOperation.call(this, Object.assign({ name: "counterCommand" }, arg));
}

//额度管理的方法
/**
 * 额度下拨
 */
function listDownquota(arg) {
    listOperation.call(this, Object.assign({ name: "downquota" }, arg));
}

//票据质押、池内质押的方法
/**
 * 解除质押
 */
function impawnBackInstr(arg) {
    var data = this.state.disabledData;
    var index = void 0;
    if (!data) {
        // let selectDatas = this.props.table.getCheckedRows(this.tableId);
        // let pks =
        //     selectDatas &&
        //     selectDatas.map(
        //         item => item.data.values[this.primaryId].value
        //     );
        // let pkMapTs = new Map();
        // selectDatas &&
        //     selectDatas.map(item => {
        //         let pk = item.data.values[this.primaryId].value;
        //         let ts =
        //             item.data.values["ts"] &&
        //             item.data.values["ts"].value;
        //         //主键与tsMap
        //         if (pk && ts) {
        //             pkMapTs.set(pk, ts);
        //         }
        //     });
        //因为需要根据选中行进行参照过滤解除质押人所以此操作必然是只能单条操作 根据UE只选取第一条数据进行解除质押
        var selectDatas = this.props.table.getCheckedRows(this.tableId)[0];
        var ts = selectDatas.data.values["ts"] && selectDatas.data.values["ts"].value;
        var pk = selectDatas && selectDatas.data.values[this.primaryId].value;
        var pkMapTs = new Map();
        //主键与tsMap
        if (pk && ts) {
            pkMapTs.set(pk, ts);
        }
        data = {
            pks: [pk],
            pkMapTs: pkMapTs
        };
        index = selectDatas.index;
    } else {
        index = data.index;
    }
    var isMulti = data.pks.length > 1 ? true : false;
    // data = Object.assign(data,arg);
    data["extParam"] = arg;
    listOperation.call(this, Object.assign({ name: "withdrawInstruction" }, { data: data, isMulti: isMulti, index: index }));
}
/**
 * 取消收回
 */
function cancelImpawnBack(arg) {
    listOperation.call(this, Object.assign({ name: "cancelImpawnBack" }, arg));
}
/**
 * 质押/质押收回撤回
 */
function withdrawImpawn(arg) {
    listOperation.call(this, Object.assign({ name: "withdrawImpawn" }, arg));
}
/**
 * 解除质押签收
 */
function impawnBackSign(arg) {
    listOperation.call(this, Object.assign({ name: "impawnBackSign" }, arg));
}

/**
 * 受理
 */
function listAccept(arg) {
    var _this9 = this;

    _common.api.call(this, {
        name: "accept",
        data: _extends({ pageCode: this.pageId }, arg["data"]),
        success: function success(res) {
            var data = res["data"];
            if (data == "view") {
                _this9.setState({
                    acceptModalShow: true
                });
                _this9.acceptData = arg;
            } else {
                var name = "accept";
                if (data.successNum == data.total) {
                    (0, _ncLightappFront.toast)({
                        color: "success",
                        content: _this9.state.json[_common.OPR_NAME[name]] + _this9.state.json["fbmpublic-000020"]
                    }); /* 国际化处理： 受理*/ /* 国际化处理： 成功*/
                    if (arg["isMulti"]) {
                        //如果是头部按钮则刷新列表
                        _page.getListData.call(_this9);
                    } else {
                        //如果是操作栏按钮则刷新局部
                        var updateDataArr = [{
                            index: arg.index,
                            data: {
                                values: data.billCards[0].head.table.rows[0].values
                            }
                        }];
                        _this9.props.table.updateDataByIndexs(_this9.tableId, updateDataArr);
                    }
                } else {
                    //这里有失败的，包含一个和多个两种情况
                    if (data.total == "1") {
                        //单个失败弹框
                        var tips = "";
                        if (data.msgDetail && data.msgDetail[0]) {
                            tips = data.msgDetail;
                        }
                        (0, _ncLightappFront.toast)({
                            color: "danger",
                            content: _this9.state.json[_common.OPR_NAME[name]] + _this9.state.json["fbmpublic-000052"] + tips
                        }); /* 国际化处理： 失败*/ /* 国际化处理： 失败*/
                    } else {
                        multiToast.call(_this9, name, _common.OPR_NAME, data); //批量提示
                        _page.getListData.call(_this9);
                    }
                }
            }
        }
    });
}

/**
 * 取消受理
 */
function listUnAccept(arg) {
    listOperation.call(this, Object.assign({ name: "unaccept" }, arg));
}

/**
 * 列表委托办理
 *
 * @param {*} arg - listOperation的参数
 */
function listCommission(arg) {
    listOperation.call(this, Object.assign({ name: "commission" }, arg));
}

/**
 * 列表取消委托办理
 *
 * @param {*} arg - listOperation的参数
 */
function listUnCommission(arg) {
    listOperation.call(this, Object.assign({ name: "uncommission" }, arg));
}
/**
 * 委托办理
 * @param {*} props
 */
function doCommission(props) {
    var _this10 = this;

    var selectDatas = props.table.getCheckedRows(this.tableId);
    if (!selectDatas || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.state.json["fbmpublic-000064"] /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    var that = this;

    var pks = selectDatas && selectDatas.map(function (item) {
        return item.data.values["pk_quotaapply"].value;
    });

    var sendData = {
        pks: pks,
        pagecode: this.pageId,
        isCardOpt: false
    };

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.commission,
        data: sendData,
        success: function success(res) {
            var data = res.data;

            if (data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: "error",
                    content: data.errMsg
                });
            } else if (data.grid) {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: _this10.state.json["fbmpublic-000065"] /* 国际化处理： 委托办理成功！*/
                });

                var returnData = data.grid[that.tableId].rows;
                //处理选择数据
                selectDatas.forEach(function (val) {
                    var pk_quotaapply_h_check = val.data.values.pk_quotaapply.value;
                    returnData.forEach(function (retrunval) {
                        if (pk_quotaapply_h_check === retrunval.values.pk_quotaapply.value) {
                            var updateDataArr = [{
                                index: val.index,
                                data: { values: retrunval.values }
                            }];
                            that.props.table.updateDataByIndexs(that.tableId, updateDataArr);
                        }
                    });
                });
            }
        }
    });
}

/**
 * 取消委托办理
 */
function doUnCommission(props) {
    var _this11 = this;

    var selectDatas = props.table.getCheckedRows(this.tableId);
    if (!selectDatas || selectDatas.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "warning",
            content: this.state.json["fbmpublic-000064"] /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    var that = this;

    var pks = selectDatas && selectDatas.map(function (item) {
        return item.data.values["pk_quotaapply"].value;
    });

    var sendData = {
        pks: pks,
        pagecode: this.pageId,
        isCardOpt: false
    };

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.uncommission,
        data: sendData,
        success: function success(res) {
            var data = res.data;

            if (data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: "error",
                    content: data.errMsg
                });
            } else if (data.grid) {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: _this11.state.json["fbmpublic-000066"] /* 国际化处理： 取消委托办理成功！*/
                });

                var returnData = data.grid[that.tableId].rows;
                //处理选择数据
                selectDatas.forEach(function (val) {
                    var pk_quotaapply_h_check = val.data.values.pk_quotaapply.value;
                    returnData.forEach(function (retrunval) {
                        if (pk_quotaapply_h_check === retrunval.values.pk_quotaapply.value) {
                            var updateDataArr = [{
                                index: val.index,
                                data: { values: retrunval.values }
                            }];
                            that.props.table.updateDataByIndexs(that.tableId, updateDataArr);
                        }
                    });
                });
            }
        }
    });
}

/**
 * 列表表体行 委托办理
 * @param {*} props
 */
function doBodyCommission(props, record, index) {
    var _this12 = this;

    var that = this;
    var pk = record.pk_quotaapply.value;

    var sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: false
    };

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.commission,
        data: sendData,
        success: function success(res) {
            var data = res.data;

            if (data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: "error",
                    content: data.errMsg
                });
            } else if (data.grid) {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: _this12.state.json["fbmpublic-000065"] /* 国际化处理： 委托办理成功！*/
                });
                handleReturnData(that, record, res.data.grid, index);
            }
        }
    });
}

/**
 * 列表表体行 取消委托办理
 */
function doBodyCommissionCancel(props, record, index) {
    var _this13 = this;

    var that = this;
    var pk = record.pk_quotaapply.value;

    var sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: false
    };

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.uncommission,
        data: sendData,
        success: function success(res) {
            var data = res.data;

            if (data.errMsg) {
                (0, _ncLightappFront.toast)({
                    color: "error",
                    content: data.errMsg
                });
            } else if (data.grid) {
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: _this13.state.json["fbmpublic-000066"] /* 国际化处理： 取消委托办理成功！*/
                });
                handleReturnData(that, record, res.data.grid, index);
            }
        }
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, record, data, index) {
    var returnData = data[that.tableId].rows;
    //处理选择数据
    var pk_quotaapply_h_check = record.pk_quotaapply.value;
    returnData.forEach(function (retrunval) {
        if (pk_quotaapply_h_check === retrunval.values.pk_quotaapply.value) {
            var updateDataArr = [{
                index: index,
                data: { values: retrunval.values }
            }];
            that.props.table.updateDataByIndexs(that.tableId, updateDataArr);
        }
    });
}

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* 工具类函数
    Created by: liyaoh 2018-09-17
 */
/*
 * @method 浮点数减法运算
 * @param 
 *     num1 num2  scale //精度 默认3       {num}     数字   signal 加法或减法运算 默认为加法 减法传false 
 * @return   number 差值或者和
 * @demo     AccSum(20.1,20,3)
 */

var AccSum = exports.AccSum = function AccSum(num1, num2) {
  var signal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var r1 = void 0,
      r2 = void 0,
      m = void 0,
      n = void 0;
  try {
    r1 = num1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  var type = signal ? 1 : -1;
  return (num1 * m + type * num2 * m) / m;
};

/**
* 判断传入值是否为空
*
* @param {*} value - 需要判断的值
*/
var isEmpty = exports.isEmpty = function isEmpty(value) {
  return [null, undefined, ''].includes(value);
};

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cardSendCommand = exports.cardTally = exports.cardTransfrom = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 保存前事件
 *
 * @param {*} callback - 保存之前进行的操作
 */
var saveBefore = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(callback) {
        var _this7 = this;

        var data, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        data = this.tabOrder ? this.props.createTabsCardData(this.pageId, this.formId, this.tabOrder) : this.props.createExtCardData(this.pageId, this.formId, this.tabOrder);

                        if (!(this.cafalg === 'true')) {
                            _context2.next = 8;
                            break;
                        }

                        _context2.next = 4;
                        return (0, _ca2.default)({
                            isSign: true,
                            isKey: false,
                            data: data,
                            isSave: true,
                            encryptVOClassName: this.encryptVOClassName
                        });

                    case 4:
                        result = _context2.sent;

                        if (!result.isStop) {
                            _context2.next = 7;
                            break;
                        }

                        return _context2.abrupt("return");

                    case 7:
                        data = result.data;

                    case 8:

                        if (typeof this.saveBefore === "function") {
                            this.saveBefore(function () {
                                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(newData) {
                                    var _result;

                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    data = newData || data;

                                                    if (!(_this7.cafalg === 'true')) {
                                                        _context.next = 8;
                                                        break;
                                                    }

                                                    _context.next = 4;
                                                    return (0, _ca2.default)({
                                                        isSign: true,
                                                        isKey: false,
                                                        data: data,
                                                        isSave: true,
                                                        encryptVOClassName: _this7.encryptVOClassName
                                                    });

                                                case 4:
                                                    _result = _context.sent;

                                                    if (!_result.isStop) {
                                                        _context.next = 7;
                                                        break;
                                                    }

                                                    return _context.abrupt("return");

                                                case 7:
                                                    data = _result.data;

                                                case 8:
                                                    _this7.tabOrder && _this7.props.validateToTabSave ? _this7.props.validateToTabSave(data, callback, _this7.tableTypeObj, "") : _this7.props.validateToSave(data, callback, _this7.tableTypeObj, "");

                                                case 9:
                                                case "end":
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, _this7);
                                }));

                                return function (_x5) {
                                    return _ref3.apply(this, arguments);
                                };
                            }(), data);
                        } else {
                            this.tabOrder && this.props.validateToTabSave ? this.props.validateToTabSave(data, callback, this.tableTypeObj, "") : this.props.validateToSave(data, callback, this.tableTypeObj, "");
                        }

                    case 9:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function saveBefore(_x4) {
        return _ref2.apply(this, arguments);
    };
}();

/**
 * 保存操作
 *
 */


/**
 * 冲销操作
 *
 */
var cardTransfrom = exports.cardTransfrom = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        baseOperation.call(this, { name: "transform" });

                    case 1:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function cardTransfrom() {
        return _ref4.apply(this, arguments);
    };
}();
/**
 *取消冲销操作
 *
 */


/**
 * 记账
 *
 */
var cardTally = exports.cardTally = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(extParam) {
        var data;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        data = { 'extParam': extParam };

                        baseOperation.call(this, { name: "tally", data: data });

                    case 2:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function cardTally(_x6) {
        return _ref5.apply(this, arguments);
    };
}();
/**
 *取消记账
 *
 */


/**
 * 发送指令操作
 *
 */
var cardSendCommand = exports.cardSendCommand = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(pk) {
        var data, result, userObj;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        data = {};
                        _context5.next = 3;
                        return (0, _ca2.default)({
                            isSign: true,
                            isKey: false,
                            data: null,
                            isSave: true,
                            encryptVOClassName: this.encryptVOClassName,
                            primaryId: [pk]
                        });

                    case 3:
                        result = _context5.sent;

                        if (!result.isStop) {
                            _context5.next = 8;
                            break;
                        }

                        return _context5.abrupt("return");

                    case 8:
                        userObj = new Map();

                        userObj.set("sign_strSrc", result.data.text);
                        userObj.set("signature", result.data.signText);
                        userObj.set("sing_sn", result.data.userjson);
                        data.userObj = userObj;
                        baseOperation.call(this, { name: "sendCommand", data: data });

                    case 14:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function cardSendCommand(_x7) {
        return _ref6.apply(this, arguments);
    };
}();
/**
 *收回指令操作
 *
 */


exports.baseOperation = baseOperation;
exports.cardDelete = cardDelete;
exports.cardAdd = cardAdd;
exports.cardEdit = cardEdit;
exports.cardSave = cardSave;
exports.cardSaveAdd = cardSaveAdd;
exports.cardSaveCommit = cardSaveCommit;
exports.cardSaveSplitCommit = cardSaveSplitCommit;
exports.cardSaveOneCommit = cardSaveOneCommit;
exports.cardCancel = cardCancel;
exports.cardCommit = cardCommit;
exports.cardReturn = cardReturn;
exports.cardInvalid = cardInvalid;
exports.cardCancelDisable = cardCancelDisable;
exports.cardAccept = cardAccept;
exports.cardUnAccept = cardUnAccept;
exports.cardCancelTransform = cardCancelTransform;
exports.cardCancelTally = cardCancelTally;
exports.cardTakeCommand = cardTakeCommand;
exports.cardMainten = cardMainten;
exports.cardHandle = cardHandle;
exports.cardUpquota = cardUpquota;
exports.cardDownquota = cardDownquota;
exports.impawnBackInstr = impawnBackInstr;
exports.cancelImpawnBack = cancelImpawnBack;
exports.withdrawImpawn = withdrawImpawn;
exports.impawnBackSign = impawnBackSign;
exports.cardUncommit = cardUncommit;
exports.cardTerminate = cardTerminate;
exports.cardUnterminate = cardUnterminate;
exports.cardChange = cardChange;
exports.cardViewVersion = cardViewVersion;
exports.cardDeleteVersion = cardDeleteVersion;
exports.cardRefresh = cardRefresh;
exports.cardPrint = cardPrint;
exports.cardOutput = cardOutput;
exports.cardFileMgr = cardFileMgr;
exports.cardDestroy = cardDestroy;
exports.cardMakeVoucher = cardMakeVoucher;
exports.cardCancelVoucher = cardCancelVoucher;
exports.cardConfirmreceipt = cardConfirmreceipt;
exports.cardUnconfirmreceipt = cardUnconfirmreceipt;
exports.cardCommission = cardCommission;
exports.cardUnCommission = cardUnCommission;
exports.addRow = addRow;
exports.deleteRow = deleteRow;
exports.copyRow = copyRow;
exports.toggleRowView = toggleRowView;
exports.openTabModal = openTabModal;
exports.insertRow = insertRow;
exports.delRow = delRow;
exports.pasteRow = pasteRow;

var _ncLightappFront = __webpack_require__(1);

var _common = __webpack_require__(5);

var _page = __webpack_require__(3);

var _ca = __webpack_require__(11);

var _ca2 = _interopRequireDefault(_ca);

var _constant = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* 
                                                                                                                                                                                                                               卡片页按钮操作方法
                                                                                                                                                                                                                               created by: liyaoh 2018-09-08
                                                                                                                                                                                                                             */


var getCacheById = _ncLightappFront.cardCache.getCacheById,
    updateCache = _ncLightappFront.cardCache.updateCache,
    getCurrentLastId = _ncLightappFront.cardCache.getCurrentLastId,
    getNextId = _ncLightappFront.cardCache.getNextId,
    deleteCacheById = _ncLightappFront.cardCache.deleteCacheById,
    addCache = _ncLightappFront.cardCache.addCache;
/**
 * 卡片页按钮操作
 *
 * @param {*} name - 操作名称
 * @param {*} data - 可选。不传默认为{pks: [pk]}
 * @param {*} callback - -操作成功的回调函数
 * @param {*} successBefore - 成功回调前操作（阻断性）
 * @param {*} successAfter - 成功回调后操作（非阻断）
 * @param {*} setTransferFlag - 改变转单的处理状态（已处理/未处理
 */

function baseOperation(_ref) {
    var _this = this;

    var name = _ref.name,
        data = _ref.data,
        callback = _ref.callback,
        successBefore = _ref.successBefore,
        successAfter = _ref.successAfter,
        setTransferFlag = _ref.setTransferFlag,
        other = _objectWithoutProperties(_ref, ["name", "data", "callback", "successBefore", "successAfter", "setTransferFlag"]);

    var langData = this.props.MultiInit.getLangData(_common.MODULE_ID);
    var pk = this.props.form.getFormItemsValue(this.formId, this.primaryId).value || this.props.getUrlParam("id");
    var ts = this.props.form.getFormItemsValue(this.formId, "ts") && this.props.form.getFormItemsValue(this.formId, "ts").value;
    var pkMapTs = new Map();
    //主键与tsMap
    if (pk && ts) {
        pkMapTs.set(pk, ts);
    }
    // data = data || {
    //     pks: [pk],
    //     pkMapTs,
    //     pageCode: this.pageId
    // };
    if (!data) {
        data = {};
    }
    data = Object.assign(data, {
        pks: [pk],
        pkMapTs: pkMapTs,
        pageCode: this.pageId
    });
    _common.api.call(this, {
        name: name,
        data: data,
        success: function success(res) {
            var success = res.success,
                data = res.data;

            if (success) {
                if (typeof successBefore === "function") {
                    successBefore(res);
                } else {
                    if (typeof callback === "function") {
                        callback && callback(res, pk);
                    } else {
                        //提交即指派
                        if (other.composite && res.data.workflow && (res.data.workflow == "approveflow" || res.data.workflow == "workflow")) {
                            _this.setState({
                                compositedata: res.data,
                                compositedisplay: true
                            });
                        } else {
                            if (name === 'return') {
                                //删除缓存
                                deleteCacheById(_this.primaryId, pk, _this.dataSource);
                            }
                            (0, _ncLightappFront.toast)({
                                color: "success",
                                content: _this.state.json[_common.OPR_NAME[name]] + _this.state.json['fbmpublic-000020'] /* 国际化处理： 成功*/
                            }); /* 国际化处理： 成功*/
                            //更新缓存数据
                            updateCache(_this.primaryId, pk, data, _this.formId, _this.dataSource, data && data.head && data.head[_this.formId].rows[0].values);
                            var singleHeadData = data && data.head && data.head[_this.formId] && data.head[_this.formId].rows && data.head[_this.formId].rows[0] && data.head[_this.formId].rows[0].values;
                            var billCardsData = data && data.billCards && data.billCards[0] && data.billCards[0].head && data.billCards[0].head[_this.formId] && data.billCards[0].head[_this.formId].rows && data.billCards[0].head[_this.formId].rows[0] && data.billCards[0].head[_this.formId].rows[0].values;
                            var headData = singleHeadData || billCardsData;
                            var id = headData && headData[_this.primaryId].value;
                            var tbbMsg = headData && headData["tbbmessage"] && headData["tbbmessage"].value;
                            if (tbbMsg) (0, _ncLightappFront.toast)({ color: "warning", content: tbbMsg }); //预算提示
                            if (!_this.transferCard) {
                                _page.getCardData.call(_this, pk);
                                _this.buttonVisible && _this.buttonVisible(_this.props);
                            } else {
                                //更新拉单缓存
                                updateCache(_this.primaryId, id, data, _this.formId, _this.ldataSource);

                                if (callback && typeof callback == 'function') {
                                    callback(props, data);
                                } else {
                                    var num = _this.props.transferTable.getTransformFormAmount(_this.transferListId);
                                    if (num == 1) {
                                        _this.props.setUrlParam({
                                            status: 'browse',
                                            id: id
                                        });
                                        _page.getCardData.call(_this, pk);
                                    } else {
                                        _this.props.transferTable.setTransformFormStatus(_this.transferListId, {
                                            status: true,
                                            isNext: false, //除保存外，其他操作默认不跳转下一条
                                            isTriggerSelected: false, //不触发onTransferItemSelected
                                            onChange: function onChange(current, next, currentIndex) {
                                                _this.props.transferTable.setTransferListValueByIndex(_this.transferListId, res.data, currentIndex);
                                                _this.props.setUrlParam({
                                                    status: 'browse',
                                                    id: id
                                                });
                                                _page.getCardData.call(_this, pk);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                    successAfter && successAfter(res);
                }
            }
        }
    });
}

/* 
    ==================头部按钮操作==================
*/
/**
 * 保存提交单据
 * @param {*} name - 保存类型 save:保存 saveCommit:保存提交saveCommitBill
 * 
 */
function saveCommitBill() {
    var _this2 = this;

    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "saveCommmit";
    var saveData = arguments[1];

    return new Promise(function (resolve) {
        if (!(typeof saveData === "undefined" ? "undefined" : _typeof(saveData)) === "undefined") {
            saveData = _this2.tabOrder ? _this2.props.createTabsCardData(_this2.pageId, _this2.formId, _this2.tabOrder) : _this2.props.createExtCardData(_this2.pageId, _this2.formId, _this2.tabOrder);
        }
        var status = _this2.props.getUrlParam("status");
        var pkMapTs = new Map();
        var pk = _this2.props.form.getFormItemsValue(_this2.formId, _this2.primaryId).value || _this2.props.getUrlParam("id");
        var ts = _this2.props.form.getFormItemsValue(_this2.formId, "ts") && _this2.props.form.getFormItemsValue(_this2.formId, "ts").value;
        //主键与tsMap
        if (pk && ts) {
            pkMapTs.set(pk, ts);
        }
        if (!saveData) {
            saveData = {};
        }
        saveData = Object.assign(saveData, {
            pks: [pk],
            pkMapTs: pkMapTs,
            pageCode: _this2.pageId
        });
        //必输项校验
        if (_this2.props.form.isCheckNow(_this2.formId)) {
            _common.api.call(_this2, {
                name: name,
                data: saveData,
                success: function success(res) {
                    resolve(res);
                    var success = res.success,
                        data = res.data;

                    if (success) {
                        // 如果有审批流 更新ApprovalTrans组件信息
                        if (res.data.workflow && (res.data.workflow == "approveflow" || res.data.workflow == "workflow")) {
                            _this2.setState({
                                compositedata: res.data,
                                compositedisplay: true
                            });
                        } else {
                            /* 更新数据*/
                            var headData = data.head && data.head[_this2.formId] && data.head[_this2.formId].rows && data.head[_this2.formId].rows[0] && data.head[_this2.formId].rows[0].values;
                            var id = headData && headData[_this2.primaryId].value;
                            (0, _ncLightappFront.toast)({
                                color: "success",
                                content: _this2.state.json[_common.OPR_NAME[name]] + _this2.state.json['fbmpublic-000020'] /* 国际化处理： 成功*/
                            }); /* 国际化处理： 成功*/
                            //更新缓存数据
                            // addCache(id, data, this.formId, this.dataSource);  
                            updateCache(_this2.primaryId, pk, data, _this2.formId, _this2.dataSource, data && data.head && data.head[_this2.formId].rows[0].values);
                            _page.getCardData.call(_this2, pk);
                            _this2.props.setUrlParam({
                                id: id,
                                status: "browse"
                            });
                            _page.setEditStatus.call(_this2, "browse");
                            _this2.buttonVisible && _this2.buttonVisible(_this2.props);
                        }
                    }
                }
            });
        }
    });
}
/**
 * 保存单据
 * @param {*} name - 保存类型 save:保存 saveCommit:保存提交
 * intoNextLate:表示保存成功后暂时不跳转到下一条，只会在多条拉单时使用
 */
function saveBill() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "save";

    var _this3 = this;

    var saveData = arguments[1];
    var intoNext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    return new Promise(function (resolve) {
        if (!(typeof saveData === "undefined" ? "undefined" : _typeof(saveData)) === "undefined") {
            saveData = _this3.tabOrder ? _this3.props.createTabsCardData(_this3.pageId, _this3.formId, _this3.tabOrder) : _this3.props.createExtCardData(_this3.pageId, _this3.formId, _this3.tabOrder);
        }
        var langData = _this3.props.MultiInit.getLangData(_common.MODULE_ID);
        var status = _this3.props.getUrlParam("status");
        var pkMapTs = new Map();
        var pk = _this3.props.form.getFormItemsValue(_this3.formId, _this3.primaryId).value || _this3.props.getUrlParam("id");
        var ts = _this3.props.form.getFormItemsValue(_this3.formId, "ts") && _this3.props.form.getFormItemsValue(_this3.formId, "ts").value;
        //主键与tsMap
        if (pk && ts) {
            pkMapTs.set(pk, ts);
        }
        saveData.pkMapTs = pkMapTs;
        if (_this3.props.form.isCheckNow(_this3.formId)) {
            _common.api.call(_this3, {
                name: name,
                data: saveData,
                success: function success(res) {
                    var success = res.success,
                        data = res.data;

                    if (success) {
                        var headData = data.head && data.head[_this3.formId] && data.head[_this3.formId].rows && data.head[_this3.formId].rows[0] && data.head[_this3.formId].rows[0].values;
                        var id = headData && headData[_this3.primaryId].value;
                        var contractCreditMsg = headData && headData["creditmessage"] && headData["creditmessage"].value;
                        var applyCreditMsg = headData && headData["ccmessage"] && headData["ccmessage"].value;
                        var tbbMsg = headData && headData["tbbmessage"] && headData["tbbmessage"].value;
                        if (contractCreditMsg) (0, _ncLightappFront.toast)({
                            color: "warning",
                            content: contractCreditMsg
                        }); //契约-授信额度超出提示
                        if (applyCreditMsg) (0, _ncLightappFront.toast)({
                            color: "warning",
                            content: applyCreditMsg
                        }); //申请-授信提示
                        if (tbbMsg) (0, _ncLightappFront.toast)({ color: "warning", content: tbbMsg }); //预算提示
                        // let mess = this.state.json['fbmpublic-000020'];
                        (0, _ncLightappFront.toast)({
                            color: "success",
                            content: _this3.state.json[_common.OPR_NAME[name]] + _this3.state.json['fbmpublic-000020'] /* 国际化处理： 成功*/
                        }); /* 国际化处理： 成功*/
                        resolve(id, res);
                        // 缓存
                        if (_this3.transferCard) {
                            if (status === "add" || status === "copy") {
                                addCache(id, data, _this3.formId, _this3.ldataSource);
                            } else {
                                updateCache(_this3.primaryId, id, data, _this3.formId, _this3.ldataSource);
                            }
                            //保存完之后删除已选缓存
                            var srcbillpk = headData && headData[_this3.srcbillpk] && headData[_this3.srcbillpk].value || headData['pk_register'].value;
                            var pkvalues = [srcbillpk];
                            _this3.props.transferTable.savePk(_this3.dataSource, pkvalues);
                            var num = _this3.props.transferTable.getTransformFormAmount(_this3.transferListId);
                            if (num == 1) {
                                _this3.props.setUrlParam({
                                    status: 'browse',
                                    id: id
                                });
                                _this3.repaintView(_this3.props);
                            } else {
                                if (intoNext) {
                                    //只有保存操作
                                    //判断是否还有未处理的单据，需要继续调用onTransferItemSelected
                                    var oldbillPkArr = [].concat(_toConsumableArray(_this3.state.transferFinishedBillPkArr));
                                    if (num - oldbillPkArr.length > 1) {
                                        //未处理的单据多余1，说明是不最后一个，继续调用onTransferItemSelected
                                        _this3.props.transferTable.setTransformFormStatus(_this3.transferListId, {
                                            status: true,
                                            onChange: function onChange(current, next, currentIndex) {
                                                _this3.props.transferTable.setTransferListValueByIndex(_this3.transferListId, res.data, currentIndex);
                                                _this3.props.setUrlParam({
                                                    status: 'add',
                                                    id: id
                                                });
                                                var newbillPkArr = [].concat(_toConsumableArray(_this3.state.transferFinishedBillPkArr));
                                                if (newbillPkArr.indexOf(id) <= -1) {
                                                    newbillPkArr.push(id);
                                                    _this3.setState({
                                                        transferFinishedBillPkArr: newbillPkArr
                                                    });
                                                }
                                                _this3.repaintView(_this3.props);
                                            }
                                        });
                                    } else {
                                        //拉单多个，当前为最后一个处理的单据，需要单独处理，加载画面数据
                                        _this3.props.transferTable.setTransformFormStatus(_this3.transferListId, {
                                            status: true,
                                            isNext: false,
                                            isTriggerSelected: false,
                                            onChange: function onChange(current, next, currentIndex) {
                                                _this3.props.transferTable.setTransferListValueByIndex(_this3.transferListId, res.data, currentIndex);
                                                var newbillPkArr = [].concat(_toConsumableArray(_this3.state.transferFinishedBillPkArr));
                                                if (newbillPkArr.indexOf(id) <= -1) {
                                                    newbillPkArr.push(id);
                                                    _this3.setState({
                                                        transferFinishedBillPkArr: newbillPkArr
                                                    });
                                                }
                                                _this3.props.setUrlParam({
                                                    status: 'browse',
                                                    id: id
                                                });
                                                _page.getCardData.call(_this3, id);
                                            }
                                        });
                                    }
                                } else {
                                    //保存提交操作
                                    _this3.props.transferTable.setTransformFormStatus(_this3.transferListId, {
                                        status: true,
                                        isNext: false,
                                        isTriggerSelected: false,
                                        onChange: function onChange(current, next, currentIndex) {
                                            _this3.props.transferTable.setTransferListValueByIndex(_this3.transferListId, res.data, currentIndex);
                                            _this3.props.setUrlParam({
                                                status: 'browse',
                                                id: id
                                            });
                                            var newbillPkArr = [].concat(_toConsumableArray(_this3.state.transferFinishedBillPkArr));
                                            if (newbillPkArr.indexOf(id) <= -1) {
                                                newbillPkArr.push(id);
                                                _this3.setState({
                                                    transferFinishedBillPkArr: newbillPkArr
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        } else {
                            if (status === "add" || status === "copy") {
                                addCache(id, data, _this3.formId, _this3.dataSource);
                            } else {
                                updateCache(_this3.primaryId, id, data, _this3.formId, _this3.dataSource);
                            }
                        }
                        _this3.props.cardTable.closeModel(_this3.tabCode); //关闭展开侧拉框
                    }
                }
            });
        }
    });
}

/**
 * 删除操作
 *
 * @param {*} params
 */
function cardDelete() {
    var _this4 = this;

    baseOperation.call(this, {
        name: "delete",
        callback: function callback(res, pk) {
            // 提示删除成功
            (0, _ncLightappFront.toast)({
                color: "success",
                content: _this4.state.json['fbmpublic-000000'] + _this4.state.json['fbmpublic-000020'] /* 国际化处理： 删除成功*/
            });
            // 获取下一条数据的id
            var nextId = getNextId(pk, _this4.dataSource);
            //删除缓存
            deleteCacheById(_this4.primaryId, pk, _this4.dataSource);
            if (_this4.transferCard) {
                //删除拉单的缓存
                deleteCacheById(_this4.primaryId, pk, _this4.ldataSource);
                //改变转单的处理状态（已处理/未处理
                if (_this4.props.transferTable.getTransformFormAmount(_this4.transferListId) == 1) {
                    _this4.props.pushTo(_this4.TRAN_LIST_PAGE_URL);
                } else {
                    _this4.props.transferTable.setTransformFormStatus(_this4.transferListId, {
                        status: false,
                        onChange: function onChange(current, next, currentIndex) {
                            // toast({ color: 'success', content: props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000014') });/* 国际化处理： 删除成功*/
                        }
                    });
                    var oldbillPkArr = [].concat(_toConsumableArray(_this4.state.transferFinishedBillPkArr));
                    var index = oldbillPkArr.indexOf(pk);
                    if (index > -1) {
                        oldbillPkArr.splice(index, 1);
                    }
                    _this4.setState({
                        transferFinishedBillPkArr: oldbillPkArr
                    });
                }
            } else {
                _this4.props.setUrlParam({ id: nextId });
                if (nextId) {
                    _page.getCardData.call(_this4, nextId);
                } else {
                    // 删除的是最后一个的操作
                    var allBtn = _this4.props.button.getButtons().map(function (item) {
                        return item.key;
                    });
                    _this4.props.setUrlParam("");
                    _this4.props.button.setButtonVisible(allBtn, false);
                    _this4.props.button.setButtonVisible({
                        add_group: true,
                        Add: true,
                        Edit: false,
                        Delete: false,
                        Copy: false
                    }); //只保留新增按钮
                    _this4.props.BillHeadInfo.setBillHeadInfoVisible({
                        showBillCode: false
                    });
                    _page.clearAll.call(_this4);
                }
            }
        }
    });
}

/**
 * 新增操作
 *
 */
function cardAdd() {
    var _this5 = this;

    this.props.setUrlParam({ status: "add" });
    // 云原生事务异常时会有叹号，新增的时候这里清空一下
    this.props.button.toggleErrorStatus(this.props.headBtnArea, { isError: false });
    this.props._initTemplate.call(this, this.props, function () {
        _page.initForm.call(_this5, "add");
        _this5.buttonVisible && _this5.buttonVisible(_this5.props);
    }); //这里又调一遍initTemplate目的是取context中的默认财务组织
}

/**
 * 修改操作
 *
 */

function cardEdit() {
    var _this6 = this;

    //特殊处理 设置票据签发和期初应付票据按钮为true
    if (this.saveCommitFlag) {
        this.saveOneCommit = true;
    }
    var pk = this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    var data = { pk: pk, fieldPK: this.primaryId, tableName: this.tableName };
    if (this.billtype === "36HA") {
        //票据质押 修改时根据票据类型设置网银字段编辑性
        var fbmbilltype = this.props.form.getFormItemsValue(this.formId, "pk_register.fbmbilltype").value;
        if (null != fbmbilltype && fbmbilltype.length > 0 && fbmbilltype.indexOf("电子") < 0) {
            this.props.form.setFormItemsDisabled(this.formId, {
                onlinebankflag: true
            });
        }
    } else if (this.billtype === "36H7") {
        //贴现办理 根据票据类别设置清算内容以及编辑性
        var opbilltype = this.props.form.getFormItemsValue(this.formId, "opbilltype").value;
        if (opbilltype == "bill_privacy") {
            this.props.form.setFormItemsValue("form_browser", {
                transactorgpay: { value: null, display: null },
                pk_outorg: { value: null, display: null },
                pk_outorg_inneracc: { value: null, display: null },
                pk_outorg_fbacc: { value: null, display: null },
                pk_outpayorg: { value: null, display: null },
                pk_outpayorg_inneracc: { value: null, display: null },
                reckonamount: { value: null, display: null },
                olcreckonamount: { value: null, display: null },
                glcreckonamount: { value: null, display: null },
                gllcreckonamount: { value: null, display: null },
                reckoninterest: { value: null, display: null },
                olcreckoninterest: { value: null, display: null },
                glcreckoninterest: { value: null, display: null },
                gllcreckoninterest: { value: null, display: null }
            });
            this.props.form.setFormItemsDisabled("form_browser", {
                transactorgpay: true,
                pk_outorg: true,
                pk_outorg_inneracc: true,
                pk_outorg_fbacc: true,
                pk_outpayorg: true,
                pk_outpayorg_inneracc: true
            });
            this.props.form.closeArea("reckoninfo");
        } else {
            this.props.form.setFormItemsDisabled("form_browser", {
                transactorgpay: false,
                pk_outorg: false,
                pk_outorg_inneracc: false,
                pk_outorg_fbacc: false,
                pk_outpayorg: false,
                pk_outpayorg_inneracc: false
            });
            this.props.form.openArea("reckoninfo");
        }
    } else if (this.billtype === "36H2") {
        var isagent = this.props.form.getFormItemsValue(this.formId, 'isagent') && this.props.form.getFormItemsValue(this.formId, 'isagent').value;
        if (isagent) {
            //可以编辑
            this.props.form.setFormItemsDisabled(this.formId, {
                pk_inbalaacc: false,
                pk_payfundorg: false,
                pk_usebillorg: false,
                innerpoundageamount: false,
                pk_outfundorg: false,
                pk_outreckonacc: false,
                planpaydate: false,
                orgcountpay: false
                // pk_insecurityacc:false,
            });
        } else {
            this.props.form.setFormItemsDisabled(this.formId, {
                pk_inbalaacc: true,
                pk_payfundorg: true,
                pk_usebillorg: true,
                innerpoundageamount: true,
                pk_outfundorg: true,
                pk_outreckonacc: true,
                planpaydate: true,
                orgcountpay: true,
                pk_insecurityacc: true
            });
        }
    }
    _common.apiSaga.call(this, {
        data: data,
        success: function success(res) {
            _this6.props.setUrlParam({ status: "edit" });
            _page.setEditStatus.call(_this6, "edit", function () {
                _this6.props.form.setFormItemsDisabled(_this6.formId, {
                    pk_org: true //组织
                });
            });
            _this6.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
            //成功进入编辑态，说明事务已经解冻，需要将saga_frozen和saga_status设置为0
            if (_this6.props.form.getFormItemsValue(_this6.formId, 'saga_frozen')) {
                _this6.props.form.setFormItemsValue(_this6.formId, { 'saga_frozen': { value: '0' } });
            }
            if (_this6.props.form.getFormItemsValue(_this6.formId, 'saga_status')) {
                _this6.props.form.setFormItemsValue(_this6.formId, { 'saga_status': { value: '0' } });
            }
        }
    });
}function cardSave() {
    var _this8 = this;

    saveBefore.call(this, function (data) {
        saveBill.call(_this8, "save", data).then(function (id) {
            //非拉单情况，正常刷新数据，更新页面编辑性和按钮显隐性
            if (!_this8.transferCard) {
                _this8.props.setUrlParam({
                    id: id,
                    status: "browse"
                });
                _page.setEditStatus.call(_this8, "browse");
                // 加载数据渲染到界面，用于按钮显隐性判断
                _page.getCardData.call(_this8, id);
            } else {
                var num = _this8.props.transferTable.getTransformFormAmount(_this8.transferListId);
                if (num == 1) {
                    _this8.props.setUrlParam({
                        id: id,
                        status: "browse"
                    });
                    //拉单单个情况，正常刷新数据，更新页面编辑性和按钮显隐性
                    _page.setEditStatus.call(_this8, "browse");
                    // 加载数据渲染到界面，用于按钮显隐性判断
                    _page.getCardData.call(_this8, id);
                } else {
                    //拉单多个情况不需要更新页面编辑性和获取当前编辑的最新返回数据 因为直接就跳转下一条数据啦
                }
            }
        });
    });
}

/**
 * 保存新增操作
 *
 */
function cardSaveAdd() {
    var _this9 = this;

    saveBefore.call(this, function (data) {
        saveBill.call(_this9, "save", data).then(function () {
            _this9.props.setUrlParam({ status: "add" });
            _page.clearAll.call(_this9, _this9.props);
            _page.initForm.call(_this9, "add");
            cardAdd.call(_this9);
        });
    });
}

/**
 * 保存提交操作
 *
 */
function cardSaveCommit() {
    if (this.saveOneCommit) {
        cardSaveOneCommit.call(this);
    } else {
        cardSaveSplitCommit.call(this);
    }
}
/**
 * 保存分开提交操作
 *
 */
function cardSaveSplitCommit() {
    var _this10 = this;

    saveBefore.call(this, function (data) {
        // 因为保存分开提交操作，所以会有两次请求。如果是拉单多个的情况，需要等两次请求都完成后再跳转下一条数据
        // 如果是拉单多个的情况，保存成功后不要马上跳转到下一条
        var intoNext = void 0;
        if (_this10.transferCard) {
            var num = _this10.props.transferTable.getTransformFormAmount(_this10.transferListId);
            if (num > 1) {
                intoNext = false;
            }
        }
        saveBill.call(_this10, "save", data, intoNext).then(function (id) {
            _this10.props.setUrlParam({
                id: id,
                status: "browse"
            });
            _page.setEditStatus.call(_this10, "browse");
            _page.getCardData.call(_this10, id, true, function () {
                cardCommit.call(_this10);
            });
        });
    });
}
/**
 * 保存一次提交操作
 *
 */
function cardSaveOneCommit() {
    var _this11 = this;

    saveBefore.call(this, function (data) {
        saveCommitBill.call(_this11, "saveCommit", data).then(function (res) {
            console.log(res);
            // this.props.setUrlParam({
            //     id,
            //     status: "browse"
            // });
            // setEditStatus.call(this, "browse");
        });
    });
}

/**
 * 取消操作
 *
 */
function cardCancel() {
    var id = this.props.getUrlParam("id");
    this.props.setUrlParam({ status: "browse" });
    var pk_billtypecode = this.props.form.getFormItemsValue(this.formId, 'pk_billtypecode') && this.props.form.getFormItemsValue(this.formId, 'pk_billtypecode').value;
    if (pk_billtypecode == "36H7" || pk_billtypecode == "36HJ") {
        var pk_discount_app = this.props.form.getFormItemsValue(this.formId, 'pk_discount_app') && this.props.form.getFormItemsValue(this.formId, 'pk_discount_app').value;
        if (pk_discount_app != null && id == pk_discount_app) {
            id = "";
        }
    }
    if (id) {
        //有id切换编辑态
        this.props.form.cancel(this.formId);
        this.tabCode && this.props.cardTable.resetTableData(this.tabCode);
        _page.setEditStatus.call(this, "browse");
        _page.getCardData.call(this, id);
    } else {
        //没有id查缓存中最后一条数据
        var currentLastId = getCurrentLastId(this.dataSource);
        var lastId = currentLastId ? currentLastId : "";
        this.props.setUrlParam({ id: lastId });
        if (lastId) {
            _page.getCardData.call(this, lastId);
        } else {
            _page.setEditStatus.call(this, "browse");
            _page.clearAll.call(this);
            //清空单据编号
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBillCode: false
            });
        }
        if (this.transferCard) {
            if (this.props.transferTable.getTransformFormAmount(this.transferListId) == 1) {
                this.props.pushTo(this.TRAN_LIST_PAGE_URL);
            } else {
                this.props.transferTable.setTransformFormStatus(this.transferListId, {
                    status: false,
                    onChange: function onChange(current, next, currentIndex) {
                        // toast({ color: 'success', content: props.MutiInit.getIntl("36070APM") && props.MutiInit.getIntl("36070APM").get('36070APM--000014') });/* 国际化处理： 删除成功*/
                    }
                });
            }
        }
    }
}

/**
 * 提交操作
 *
 */
function cardCommit(params) {
    var _this12 = this;

    var name = params && params.data && params.data.name;
    if (typeof name === "undefined") {
        name = 'commit';
        //设置常量值为false;
        this.saveOneCommit = false;
    }
    if ('saveCommit' === name) {
        saveBefore.call(this, function (data) {
            //指派信息和保存信息合并处理
            data = Object.assign(data, params.data);
            saveCommitBill.call(_this12, "saveCommit", data).then(function (res) {
                _this12.compositeTurnOff();
                _page.setEditStatus.call(_this12, "browse");
            });
        });
        return;
    };
    baseOperation.call(this, _extends({
        name: "commit",
        composite: true }, params), null, null, null, true);
}

/**
 * 退回操作
 *
 */
function cardReturn(extParam) {
    var _this13 = this;

    var data = { 'extParam': extParam
        //判断退回后是否删除单据
    };if (this.returnWithDeleteSwitch) {
        baseOperation.call(this, {
            name: "return",
            data: data,
            callback: function callback(res, pk) {
                // 提示退回成功
                (0, _ncLightappFront.toast)({
                    color: "success",
                    content: _this13.state.json['fbmpublic-000042'] + _this13.state.json['fbmpublic-000020'] /* 国际化处理： 退回成功*/
                });
                // 获取下一条数据的id
                var nextId = getNextId(pk, _this13.dataSource);
                //删除缓存
                deleteCacheById(_this13.primaryId, pk, _this13.dataSource);
                _this13.props.setUrlParam({ id: nextId });
                if (nextId) {
                    _page.getCardData.call(_this13, nextId);
                } else {
                    // 退回的是最后一个的操作
                    var allBtn = _this13.props.button.getButtons().map(function (item) {
                        return item.key;
                    });
                    _this13.props.setUrlParam("");
                    _this13.props.button.setButtonVisible(allBtn, false);
                    _this13.props.BillHeadInfo.setBillHeadInfoVisible({
                        showBillCode: false
                    });
                    _page.clearAll.call(_this13);
                }
            }
        });
    } else {
        baseOperation.call(this, { name: "return", data: data });
    }
}

/**
 * 作废操作
 *
 */
function cardInvalid(extParam) {
    var data = { 'extParam': extParam };
    baseOperation.call(this, { name: "disable", data: data });
}
/**
 * 取消作废操作
 *
 */
function cardCancelDisable() {
    baseOperation.call(this, { name: "cancelDisable" });
}

/**
 * 受理操作     2019-11-27 开票申请受理添加
 *
 */
function cardAccept() {
    var _this14 = this;

    var pk = this.props.form.getFormItemsValue(this.formId, this.primaryId).value || this.props.getUrlParam("id");
    var ts = this.props.form.getFormItemsValue(this.formId, "ts") && this.props.form.getFormItemsValue(this.formId, "ts").value;
    var pkMapTs = new Map();
    //主键与tsMap
    if (pk && ts) {
        pkMapTs.set(pk, ts);
    }
    _common.api.call(this, {
        name: "accept",
        data: {
            pks: [pk],
            pkMapTs: pkMapTs,
            pageCode: this.pageId
        },
        success: function success(res) {
            var data = res["data"];
            if (data == "view") {
                _this14.setState({
                    acceptModalShow: true
                });
                _this14.acceptData = { pks: [pk] };
            } else {
                // 受理成功 刷新卡片数据
                var name = "accept";
                if (data.successNum == data.total) {
                    (0, _ncLightappFront.toast)({
                        color: "success",
                        content: _this14.state.json[_common.OPR_NAME[name]] + _this14.state.json["fbmpublic-000020"]
                    }); /* 国际化处理： 受理*/ /* 国际化处理： 成功*/

                    //更新缓存数据
                    updateCache(_this14.primaryId, pk, data, _this14.formId, _this14.dataSource, data && data.head && data.head[_this14.formId].rows[0].values);

                    _page.getCardData.call(_this14, pk);
                    _this14.buttonVisible && _this14.buttonVisible(_this14.props);
                } else {
                    //受理失败，提示信息
                    var tips = "";
                    if (data.msgDetail && data.msgDetail[0]) {
                        tips = data.msgDetail;
                    }
                    (0, _ncLightappFront.toast)({
                        color: "danger",
                        content: _this14.state.json[_common.OPR_NAME[name]] + _this14.state.json["fbmpublic-000052"] + tips
                    }); /* 国际化处理： 失败*/ /* 国际化处理： 失败*/
                }
            }
        }
    });
}

/**
 * 取消受理操作     2019-11-27 开票申请受理添加
 *
 */
function cardUnAccept() {
    baseOperation.call(this, { name: "unaccept" });
}function cardCancelTransform() {
    baseOperation.call(this, { name: "cancelTransform" });
}function cardCancelTally() {
    baseOperation.call(this, { name: "cancelTally" });
}function cardTakeCommand() {
    baseOperation.call(this, { name: "counterCommand" });
}
//额度管理的方法
/**
 * 维护操作
 *
 */
function cardMainten() {
    var _this15 = this;

    this.props.setUrlParam({ status: "mainten" });
    _page.setEditStatus.call(this, "mainten", function () {
        _this15.props.form.setFormItemsDisabled(_this15.formId, {
            'pk_org': true,
            'handledate': true
        });
        //清空上收指令状态、上收银行返回信息、上收额度等
        _this15.props.form.setFormItemsValue(_this15.formId, {
            uppaystatus: { value: null, display: null },
            upbankretinfo: { value: null, display: null },
            upquota: { value: null, display: null }
        });
    });
}
/**
 * 经办操作
 *
 */
function cardHandle() {
    var _this16 = this;

    this.props.setUrlParam({ status: "handle" });
    _page.setEditStatus.call(this, "handle", function () {
        _this16.props.form.setFormItemsDisabled(_this16.formId, {
            'pk_org': true,
            'handledate': true
        });
    });
}
/**
 * 额度上收
 */
function cardUpquota() {
    baseOperation.call(this, { name: "upquota" });
}
/**
 * 额度下拨
 */
function cardDownquota() {
    baseOperation.call(this, { name: "downquota" });
}
//票据质押和池内质押的方法
/**
 * 解除质押
 */
function impawnBackInstr(extParam) {
    var data = { 'extParam': extParam };
    baseOperation.call(this, { name: "withdrawInstruction", data: data });
}
/**
 * 取消解押
 */
function cancelImpawnBack() {
    baseOperation.call(this, { name: "cancelImpawnBack" });
}
/**
 * 质押/解押撤回
 */
function withdrawImpawn() {
    baseOperation.call(this, { name: "withdrawImpawn" });
}

/**
 * 解除质押签收
 */
function impawnBackSign() {
    baseOperation.call(this, { name: "impawnBackSign" });
}

/**
 * 收回操作
 *
 */
function cardUncommit() {
    baseOperation.call(this, { name: "uncommit" }, null, null, null, true);
}

/**
 * 终止操作
 *
 */
function cardTerminate() {
    baseOperation.call(this, { name: "terminate" });
}

/**
 * 取消终止操作
 *
 */
function cardUnterminate() {
    baseOperation.call(this, { name: "unterminate" });
}

/**
 * 变更操作
 *
 */
function cardChange() {
    this.props.setUrlParam({
        status: "edit",
        pageType: "change"
    });
    _page.initChangeForm.call(this);
}

/**
 * 查看版本操作
 *
 */
function cardViewVersion() {
    _page.initVersionTree.call(this);
    this.setState({ cardVersion: true });
}

/**
 * 删除版本操作
 *
 */
function cardDeleteVersion() {
    baseOperation.call(this, { name: "deleteVersion" });
}

/**
 * 刷新操作
 *
 */
function cardRefresh(id, isRefresh) {
    //删除操作之后需要重新获取页面上主键pk的值 否则会取已经被删除的pk值 查不到对应的数据会报错
    var newPk = this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    _page.getCardData.call(this, newPk, isRefresh);
    (0, _ncLightappFront.toast)({
        color: "success",
        content: this.state.json['fbmpublic-000021'] /* 国际化处理： 刷新成功*/
    });
}

/**
 * 打印操作
 *
 * @param {*} pks - 主键数组
 */
function cardPrint(pks) {
    _common.printFn.call(this, pks);
}

/**
 * 输出操作
 *
 * @param {*} pks - 主键数组
 */
function cardOutput(pks) {
    _common.output.call(this, pks);
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
function cardFileMgr(billId, billNo) {
    _common.fileMgr.call(this, billId, billNo);
}
/**
 * 核销操作
 *
 */
function cardDestroy() {
    baseOperation.call(this, { name: "destroy" });
}

/**
 * 制证操作
 *
 */
function cardMakeVoucher() {
    baseOperation.call(this, { name: "makeVoucher" });
}

/**
 * 取消制证操作
 *
 */
function cardCancelVoucher() {
    baseOperation.call(this, { name: "cancelVoucher" });
}
/**
 * 确认收妥
 *
 */
function cardConfirmreceipt(extParam) {
    var data = { 'extParam': extParam };
    baseOperation.call(this, { name: "confirmreceipt", data: data });
    //baseOperation.call(this, { name: "confirmreceipt" });
}
/**
 * 取消确认
 *
 */
function cardUnconfirmreceipt() {
    baseOperation.call(this, { name: "unconfirmreceipt" }, null, null, null, true);
}

/**
 * 委托辦理
 *
 */
function cardCommission() {
    baseOperation.call(this, { name: "commission" });
}
/**
 *  取消委托辦理
 *
 */
function cardUnCommission() {
    baseOperation.call(this, { name: "uncommission" });
}

/* 
    ==================肩部按钮操作==================
*/

/**
 * 增行
 *
 */
function addRow() {
    this.props.cardTable.addRow(this.tabCode, undefined, {}, true);
}

/**
 * 删行
 *
 */
function deleteRow() {
    var checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    var chceckedIndex = checkedRows && checkedRows.map(function (item) {
        return item.index;
    });
    if (checkedRows.length > 0) {
        this.props.cardTable.delTabRowsByIndex(this.props.cardTable.getCurTabKey(), chceckedIndex);
    }
    _page.disabledBodyButton.call(this);
}

/**
 * 复制行
 *
 * @param {*} index - 要复制的行号
 */
function copyRow(index) {
    this.props.cardTable.pasteRow(this.tabCode, index);
}

/* 
    ==================表体行操作==================
*/

/**
 * 展开
 *
 * @param {*} record - 行数据
 */
function toggleRowView(record) {
    this.props.cardTable.toggleTabRowView(this.tabCode, record);
}

/**
 * 打开侧拉框
 *
 * @param {*} record - 行数据
 * @param {*} index - 行序号
 */
function openTabModal(record, index) {
    this.props.cardTable.openTabModel(this.tabCode, "edit", record, index);
}

/**
 * 插行
 *
 * @param {*} index - 要插入的行号
 */
function insertRow(index) {
    this.props.cardTable.addRow(this.tabCode, index);
}

/**
 * 删行
 *
 * @param {*} index - 要删除的行号
 */
function delRow(index) {
    this.props.cardTable.delTabRowsByIndex(this.props.cardTable.getCurTabKey(), index);
    _page.disabledBodyButton.call(this);
}

/**
 * 对复制行的数据进行粘贴处理
 * @param {*} index          行下标
 * 其中： tabs.tabId[currTableId]代表当前table的主键id的可以
 */
function pasteRow(index) {
    var _this17 = this;

    var currTableId = this.tabCode;
    var selectArr = getPasteRows.call(this);
    this.props.cardTable.insertRowsAfterIndex(currTableId, selectArr, index);
    this.props.cardTable.setValByKeyAndIndex(currTableId, index, this.tabId[currTableId], { value: null });

    this.setState({ isPaste: false }, function () {
        _this17.buttonVisible && _this17.buttonVisible(_this17.props);
        _this17.props.cardTable.setStatus(currTableId, "edit");
    });
}

/**
 * 获取粘贴行数据
 *
 * @returns 返回粘贴行数据
 */
function getPasteRows() {
    var checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    var selectRowCopy = (0, _ncLightappFront.deepClone)(checkedRows);
    var selectArr = selectRowCopy.map(function (item) {
        item.data.selected = false;
        return item.data;
    });
    return selectArr;
}

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAfterEventData = getAfterEventData;
exports.getBeforeEventCurrtype = getBeforeEventCurrtype;
exports.setFormAfterEventItem = setFormAfterEventItem;
exports.setBodyAfterEventData = setBodyAfterEventData;
exports.changeOrg = changeOrg;
exports.getEndDate = getEndDate;
exports.getBondPeriod = getBondPeriod;
exports.getAmountAndPercent = getAmountAndPercent;
exports.guaranteeAfterEvent = guaranteeAfterEvent;
exports.creditAfterEvent = creditAfterEvent;
exports.getRandom = getRandom;

var _ncLightappFront = __webpack_require__(1);

var _page = __webpack_require__(3);

var _moment = __webpack_require__(0);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* 
                                                                                                                                                                                                                      卡片页编辑后事件公共函数
                                                                                                                                                                                                                      Created by:liyaoh 2018-09-12
                                                                                                                                                                                                                  */


var dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
var dateFormat = 'YYYY-MM-DD';

/**
 * 获取编辑后事件接口数据
 *
 * @param {*} data - 必传。整单数据
 */
function getAfterEventData(data) {
    var _this = this;

    return new Promise(function (resolve, reject) {
        (0, _ncLightappFront.ajax)({
            url: _this.API_URL.afterEvent,
            async: false,
            data: data,
            success: function success(res) {
                resolve(res);
            },
            error: function error(res) {
                (0, _ncLightappFront.toast)({ color: 'danger', content: res.message });
                reject(res);
            }
        });
    });
}
/**
 * 获取编辑前事件接口
 *
 * @param {*} data - 必传。
 */
function getBeforeEventCurrtype(data) {
    return new Promise(function (resolve, reject) {
        (0, _ncLightappFront.ajax)({
            url: '/nccloud/bond/common/currtype.do',
            async: false,
            data: data,
            success: function success(res) {
                resolve(res);
            },
            error: function error(res) {
                (0, _ncLightappFront.toast)({ color: 'danger', content: res.message });
                reject(res);
            }
        });
    });
}
/**
 * 设置表头编辑后事件字段值
 *
 * @param {*} eventData - 整单数据
 * @param {*} args - 要设置的key
 */
function setFormAfterEventItem(eventData) {
    var _this2 = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return new Promise(function (resolve) {
        getAfterEventData.call(_this2, eventData).then(function (res) {
            var obj = {};
            var headData = res.data && res.data.head && res.data.head[_this2.formId].rows[0].values;
            if (headData) {
                args.forEach(function (key) {
                    obj[key] = headData[key];
                });
                _this2.props.form.setFormItemsValue(_this2.formId, obj);
                resolve(res.data);
            }
        });
    });
}

/**
 * 设置子表编辑后事件数据
 *
 * @param {*} eventData - 整单数据
 */
function setBodyAfterEventData(eventData) {
    var _this3 = this;

    return new Promise(function (resolve) {
        getAfterEventData.call(_this3, eventData).then(function (res) {
            _this3.props.cardTable.setAllTabsData(res.data.bodys, _this3.tabOrder);
            resolve(res);
        });
    });
}

/**
 * 切换财务组织
 *
 * @param {*} value - 财务组织的value
 * @param {*} callback - 选择财务组织后的回调函数
 */
function changeOrg(value, callback) {
    var _this4 = this;

    return new Promise(function (resolve) {
        if (typeof callback === 'function') {
            callback();
        } else {
            _this4.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
            _this4.props.button.setButtonDisabled('addRow', false); //恢复增行编辑性
        }
        if (!value.value) {
            _page.clearAll.call(_this4);
            _this4.props.initMetaByPkorg();
            _this4.props.button.setButtonDisabled('addRow', true); //禁用增行
        }
        resolve();
    });
}
/**
 * 根据期间获取结束日期
 *
 * @param {*} begin - 开始日期
 * @param {*} period - 期间
 * @param {*} periodUnit - 期间单位
 */
function getEndDate(begin, period, periodUnit) {
    if (!begin || !period || !periodUnit) return;
    var transUnit = {
        1: "d", //日
        2: "M", //月
        3: "Q", //季
        4: "y" //年
    };
    return (0, _moment2.default)(begin).add(+period, transUnit[periodUnit]).format(dateTimeFormat);
}

/**
 * 根据开始结束日期计算发债期间
 *
 * @param {*} begin
 * @param {*} end
 * @returns
 */
function getBondPeriod(begin, end) {
    if (!begin || !end) return;
    begin = (0, _moment2.default)(begin).format(dateFormat);
    end = (0, _moment2.default)(end).format(dateFormat);
    var result = void 0;
    var periodloan = (0, _moment2.default)(end).diff((0, _moment2.default)(begin), 'years', true);
    if (periodloan >= 0 && periodloan <= 1) {
        //短期
        result = '1';
    } else if (periodloan >= 1 && periodloan <= 5) {
        //中期
        result = '2';
    } else {
        //长期
        result = '3';
    }
    return { value: result };
}

/**
 * 根据来源金额计算目标金额与比例
 *
 * @param {*} type - 输入的数据类型 amount：金额 proportion：比例
 * @param {*} source - 来源金额
 * @param {*} current - 输入的数据 金额/比例
 * @returns
 */
function getAmountAndPercent(type, source, current) {
    if (!source || !current) return {};
    var result = {
        amount: current,
        proportion: current
    };
    if (type === 'amount') {
        //金额
        result.proportion = current / source * 100;
    } else if (type === 'proportion') {
        //比例
        result.amount = source * current / 100;
    }
    return result;
}

//走编辑后事件接口所以不需要前端计算了，先留着，万一有用 by:liyaoh
// /**
//  * 供销商子表编辑后事件，需要使用call调用
//  *
//  * @param {*} current - 当前操作字段对象，与cardTable的编辑后事件参数一致
//  * @param {*} registmny - 注册金额，需要传进来是因为其他节点字段名可能不同
//  * @param {*} keys - 承销商对应的字段名
//  */
// export function underwriterAfterEvent(current, registmny, { 
//     agreeRatio,     //约定承销比例
//     agreeAmount,    //约定承销金额
//     olcAgreeAmount, //约定承销本币金额
//     actualRatio,    //实际承销比例
//     actualAmount,   //实际承销金额
//     olcActualAmount //实际承销本币金额
// }) {
//     if(!registmny) return;
//     const olcrate = this.props.form.getFormItemsValue(this.formId, 'olcrate').value;//组织本币汇率
//     const eventData = this.props.createTabsBodyAfterEventData(this.pageId, this.formId, this.tabOrder, current.moduleId, current.key, current.value);//编辑后事件整单数据
//     if (current.key === agreeRatio) {
//         //约定承销比例
//         let aggredissuancemny = getAmountAndPercent('proportion', registmny, current.value).amount;
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, agreeAmount, { value: aggredissuancemny });
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcAgreeAmount, { value: aggredissuancemny * +olcrate });//计算约定承销本币金额
//         // getAfterEventData.call(this, eventData).then(res => {
//         //     this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
//         // });
//     } else if (current.key === agreeAmount) {
//         //约定承销金额
//         let aggredratio = getAmountAndPercent('amount', registmny, current.value).proportion;
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, agreeRatio, { value: aggredratio });
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcAgreeAmount, { value: aggredissuancemny * +olcrate });//计算约定承销本币金额
//         getAfterEventData.call(this, eventData).then(res => {
//             console.log(res.data)
//             // let bodyData = res.data.bodys && res.data.bodys.rows[current.index].values;
//             // this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcAgreeAmount, { value: bodyData[olcAgreeAmount] });//计算约定承销本币金额
//             this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
//         });
//     } else if (current.key === actualRatio) {
//         //实际承销比例
//         let issuancemny = getAmountAndPercent('proportion', registmny, current.value).amount;
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, actualAmount, { value: issuancemny });
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcActualAmount, { value: issuancemny * +olcrate });//计算约定承销本币金额

//     } else if (current.key === actualAmount) {
//         //实际承销金额
//         let ratio = getAmountAndPercent('amount', registmny, current.value).proportion;
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, actualRatio, { value: ratio });
//         this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, olcActualAmount, { value: current.value * +olcrate });//计算约定承销本币金额
//     }

// }

/**
 * 担保信息编辑后事件，需要使用call调用
 *
 * @param {*} current - 当前操作字段对象，与cardTable的编辑后事件参数一致
 * @param {*} keys - 对应的字段名
 * @param {*} eventData - 编辑后整单数据
 */
function guaranteeAfterEvent(current, _ref) {
    var oAmount = _ref.oAmount;

    var registmny = this.props.form.getFormItemsValue(this.formId, oAmount).value; //注册金额
    var olcrate = this.props.form.getFormItemsValue(this.formId, 'olcrate').value; //组织本币汇率
    var referVals = current.value.values;
    var guatypeMap = {
        '0': this.state.json['fbmpublic-000022'], /* 国际化处理： 信用*/ /* 国际化处理： 信用*/
        '1': this.state.json['fbmpublic-000023'], /* 国际化处理： 保证*/ /* 国际化处理： 保证*/
        '2': this.state.json['fbmpublic-000024'], /* 国际化处理： 抵押*/ /* 国际化处理： 抵押*/
        '3': this.state.json['fbmpublic-000025'], /* 国际化处理： 质押*/ /* 国际化处理： 质押*/
        '4': this.state.json['fbmpublic-000026'] /* 国际化处理： 混合*/ /* 国际化处理： 混合*/
    };
    if (current.key === 'guaranteeid') {
        //担保合同
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'guaranteetype', {
            display: guatypeMap[referVals.guatype.value],
            value: referVals ? referVals.guatype.value : ''
        }); //担保方式
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'pk_currtype', {
            display: referVals ? referVals.currname.value : '',
            value: referVals ? referVals.pk_currtype.value : ''
        }); //币种
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'contractbegindate', {
            value: referVals ? referVals.guastartdate.value : ''
        }); //开始日期
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'contractenddate', {
            value: referVals ? referVals.guaenddate.value : ''
        }); //结束日期
    } else if (current.key === 'guaranteeproportion') {
        //担保比例
        var occupymny = getAmountAndPercent('proportion', registmny, current.value).amount;
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'occupymny', { value: occupymny });
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'localoccupymny', { value: occupymny * +olcrate }); //计算占用担保本币金额
    } else if (current.key === 'occupymny') {
        //占用担保金额
        var guaranteeproportion = getAmountAndPercent('amount', registmny, current.value).proportion;
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'guaranteeproportion', { value: guaranteeproportion });
        this.props.cardTable.setValByKeyAndIndex(current.moduleId, current.index, 'localoccupymny', { value: current.value * +olcrate }); //计算占用担保本币金额
    }
}

/**
 * 授信信息编辑后事件，需要使用call调用
 *
 * @param {*} current - 当前操作字段对象，与cardTable的编辑后事件参数一致
 * @param {*} keys - 对应的字段名
 */
function creditAfterEvent(current, _ref2) {
    var _ref2$creditNo = _ref2.creditNo,
        creditNo = _ref2$creditNo === undefined ? 'creditagreementid' : _ref2$creditNo,
        creditBank = _ref2.creditBank,
        creditCurrency = _ref2.creditCurrency,
        creditOccupy = _ref2.creditOccupy,
        creditOlcOccupy = _ref2.creditOlcOccupy,
        _ref2$creditType = _ref2.creditType,
        creditType = _ref2$creditType === undefined ? 'credittype' : _ref2$creditType;

    var eventData = this.tabOrder ? this.props.createTabsAfterEventData(this.pageId, this.formId, '', current.moduleId, current.key, current.value) : this.props.createHeadAfterEventData(this.pageId, this.formId, '', current.moduleId, current.key, current.value);
    if (current.key === creditNo) {
        var _props$form$setFormIt;

        //授信协议编号
        var creditRefVal = current.value.values;
        this.props.form.setFormItemsValue(this.formId, (_props$form$setFormIt = {}, _defineProperty(_props$form$setFormIt, creditBank, {
            display: creditRefVal ? creditRefVal.bankdocname.value : '',
            value: creditRefVal ? creditRefVal.pk_creditbank.value : ''
        }), _defineProperty(_props$form$setFormIt, creditCurrency, {
            display: creditRefVal ? creditRefVal.currname.value : '',
            value: creditRefVal ? creditRefVal.pk_currtype.value : ''
        }), _defineProperty(_props$form$setFormIt, creditType, { display: '', value: '' }), _props$form$setFormIt));

        //清空授信协议时清空占用额度
        if (!creditRefVal) {
            var _props$form$setFormIt2;

            this.props.form.setFormItemsValue(this.formId, (_props$form$setFormIt2 = {}, _defineProperty(_props$form$setFormIt2, creditOccupy, { display: '', value: '' }), _defineProperty(_props$form$setFormIt2, creditOlcOccupy, { display: '', value: '' }), _props$form$setFormIt2));
        }
        _page.setHeadItemsDisabled.call(this, creditType);
    } else if (current.key === creditOccupy) {
        //授信占用额度
        setFormAfterEventItem.call(this, eventData, creditOccupy, creditOlcOccupy);
    }
}

//获取随机字符串 用于rowid
function getRandom() {
    return String(new Date().getTime()).slice(-5) + Math.random().toString(12);
}

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 12,
	"./af.js": 12,
	"./ar": 13,
	"./ar-dz": 14,
	"./ar-dz.js": 14,
	"./ar-kw": 15,
	"./ar-kw.js": 15,
	"./ar-ly": 16,
	"./ar-ly.js": 16,
	"./ar-ma": 17,
	"./ar-ma.js": 17,
	"./ar-sa": 18,
	"./ar-sa.js": 18,
	"./ar-tn": 19,
	"./ar-tn.js": 19,
	"./ar.js": 13,
	"./az": 20,
	"./az.js": 20,
	"./be": 21,
	"./be.js": 21,
	"./bg": 22,
	"./bg.js": 22,
	"./bm": 23,
	"./bm.js": 23,
	"./bn": 24,
	"./bn.js": 24,
	"./bo": 25,
	"./bo.js": 25,
	"./br": 26,
	"./br.js": 26,
	"./bs": 27,
	"./bs.js": 27,
	"./ca": 28,
	"./ca.js": 28,
	"./cs": 29,
	"./cs.js": 29,
	"./cv": 30,
	"./cv.js": 30,
	"./cy": 31,
	"./cy.js": 31,
	"./da": 32,
	"./da.js": 32,
	"./de": 33,
	"./de-at": 34,
	"./de-at.js": 34,
	"./de-ch": 35,
	"./de-ch.js": 35,
	"./de.js": 33,
	"./dv": 36,
	"./dv.js": 36,
	"./el": 37,
	"./el.js": 37,
	"./en-SG": 38,
	"./en-SG.js": 38,
	"./en-au": 39,
	"./en-au.js": 39,
	"./en-ca": 40,
	"./en-ca.js": 40,
	"./en-gb": 41,
	"./en-gb.js": 41,
	"./en-ie": 42,
	"./en-ie.js": 42,
	"./en-il": 43,
	"./en-il.js": 43,
	"./en-nz": 44,
	"./en-nz.js": 44,
	"./eo": 45,
	"./eo.js": 45,
	"./es": 46,
	"./es-do": 47,
	"./es-do.js": 47,
	"./es-us": 48,
	"./es-us.js": 48,
	"./es.js": 46,
	"./et": 49,
	"./et.js": 49,
	"./eu": 50,
	"./eu.js": 50,
	"./fa": 51,
	"./fa.js": 51,
	"./fi": 52,
	"./fi.js": 52,
	"./fo": 53,
	"./fo.js": 53,
	"./fr": 54,
	"./fr-ca": 55,
	"./fr-ca.js": 55,
	"./fr-ch": 56,
	"./fr-ch.js": 56,
	"./fr.js": 54,
	"./fy": 57,
	"./fy.js": 57,
	"./ga": 58,
	"./ga.js": 58,
	"./gd": 59,
	"./gd.js": 59,
	"./gl": 60,
	"./gl.js": 60,
	"./gom-latn": 61,
	"./gom-latn.js": 61,
	"./gu": 62,
	"./gu.js": 62,
	"./he": 63,
	"./he.js": 63,
	"./hi": 64,
	"./hi.js": 64,
	"./hr": 65,
	"./hr.js": 65,
	"./hu": 66,
	"./hu.js": 66,
	"./hy-am": 67,
	"./hy-am.js": 67,
	"./id": 68,
	"./id.js": 68,
	"./is": 69,
	"./is.js": 69,
	"./it": 70,
	"./it-ch": 71,
	"./it-ch.js": 71,
	"./it.js": 70,
	"./ja": 72,
	"./ja.js": 72,
	"./jv": 73,
	"./jv.js": 73,
	"./ka": 74,
	"./ka.js": 74,
	"./kk": 75,
	"./kk.js": 75,
	"./km": 76,
	"./km.js": 76,
	"./kn": 77,
	"./kn.js": 77,
	"./ko": 78,
	"./ko.js": 78,
	"./ku": 79,
	"./ku.js": 79,
	"./ky": 80,
	"./ky.js": 80,
	"./lb": 81,
	"./lb.js": 81,
	"./lo": 82,
	"./lo.js": 82,
	"./lt": 83,
	"./lt.js": 83,
	"./lv": 84,
	"./lv.js": 84,
	"./me": 85,
	"./me.js": 85,
	"./mi": 86,
	"./mi.js": 86,
	"./mk": 87,
	"./mk.js": 87,
	"./ml": 88,
	"./ml.js": 88,
	"./mn": 89,
	"./mn.js": 89,
	"./mr": 90,
	"./mr.js": 90,
	"./ms": 91,
	"./ms-my": 92,
	"./ms-my.js": 92,
	"./ms.js": 91,
	"./mt": 93,
	"./mt.js": 93,
	"./my": 94,
	"./my.js": 94,
	"./nb": 95,
	"./nb.js": 95,
	"./ne": 96,
	"./ne.js": 96,
	"./nl": 97,
	"./nl-be": 98,
	"./nl-be.js": 98,
	"./nl.js": 97,
	"./nn": 99,
	"./nn.js": 99,
	"./pa-in": 100,
	"./pa-in.js": 100,
	"./pl": 101,
	"./pl.js": 101,
	"./pt": 102,
	"./pt-br": 103,
	"./pt-br.js": 103,
	"./pt.js": 102,
	"./ro": 104,
	"./ro.js": 104,
	"./ru": 105,
	"./ru.js": 105,
	"./sd": 106,
	"./sd.js": 106,
	"./se": 107,
	"./se.js": 107,
	"./si": 108,
	"./si.js": 108,
	"./sk": 109,
	"./sk.js": 109,
	"./sl": 110,
	"./sl.js": 110,
	"./sq": 111,
	"./sq.js": 111,
	"./sr": 112,
	"./sr-cyrl": 113,
	"./sr-cyrl.js": 113,
	"./sr.js": 112,
	"./ss": 114,
	"./ss.js": 114,
	"./sv": 115,
	"./sv.js": 115,
	"./sw": 116,
	"./sw.js": 116,
	"./ta": 117,
	"./ta.js": 117,
	"./te": 118,
	"./te.js": 118,
	"./tet": 119,
	"./tet.js": 119,
	"./tg": 120,
	"./tg.js": 120,
	"./th": 121,
	"./th.js": 121,
	"./tl-ph": 122,
	"./tl-ph.js": 122,
	"./tlh": 123,
	"./tlh.js": 123,
	"./tr": 124,
	"./tr.js": 124,
	"./tzl": 125,
	"./tzl.js": 125,
	"./tzm": 126,
	"./tzm-latn": 127,
	"./tzm-latn.js": 127,
	"./tzm.js": 126,
	"./ug-cn": 128,
	"./ug-cn.js": 128,
	"./uk": 129,
	"./uk.js": 129,
	"./ur": 130,
	"./ur.js": 130,
	"./uz": 131,
	"./uz-latn": 132,
	"./uz-latn.js": 132,
	"./uz.js": 131,
	"./vi": 133,
	"./vi.js": 133,
	"./x-pseudo": 134,
	"./x-pseudo.js": 134,
	"./yo": 135,
	"./yo.js": 135,
	"./zh-cn": 136,
	"./zh-cn.js": 136,
	"./zh-hk": 137,
	"./zh-hk.js": 137,
	"./zh-tw": 138,
	"./zh-tw.js": 138
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 151;

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _container = __webpack_require__(4);

/**
 * 作废组件 按钮事件
 * @author：gaokung
 * @param {*} props
 * @param {*} key
 * @param {String} type list 列表页 card 卡片页 
 */
function buttonClick(signCode, onSureCallback, props, key) {
    var _this = this;
    switch (key) {
        case "onSure":
            // 确定按钮
            return onOKClick.call(this, signCode, onSureCallback);
        case "onCancel":
            // 取消按钮
            return onCancelClick.call(this, signCode);
        default:
            break;
    }
}
// 查询弹窗 确定按钮 点击事件
var onOKClick = function onOKClick(signCode, onSureCallback) {
    this.setState({
        disabledComShow: !this.state.disabledComShow
    });
    // let pks = this.state.curPk;
    var reason = this.props.form.getFormItemsValue(signCode, signCode).value;
    var failreason = {};
    var position = this.failreasonPosition ? this.failreasonPosition : 'head';
    // failreason['position'] = position
    failreason[signCode] = reason;

    if (typeof onSureCallback == 'function') {
        onSureCallback.call(this, failreason);
    }
    // if (type && type=='list') {
    //     // 列表页
    //     let data = this.state.disabledData;
    //     data['extParam'] = failreason;
    //     // 位置
    //     list.listInvalid.call(this, data);
    // }else{
    //     card.cardInvalid.call(this,failreason);
    // }
};

// 查询弹窗 确定按钮 点击事件
var onCancelClick = function onCancelClick() {
    this.setState({
        disabledComShow: !this.state.disabledComShow
    });
};

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ncLightappFront = __webpack_require__(1);

var _axios = __webpack_require__(142);

var _axios2 = _interopRequireDefault(_axios);

var _events = __webpack_require__(155);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//主子表列表

var NCModal = _ncLightappFront.base.NCModal;

var NCCOriginalBalance = function (_Component) {
	_inherits(NCCOriginalBalance, _Component);

	function NCCOriginalBalance(props) {
		_classCallCheck(this, NCCOriginalBalance);

		var _this = _possibleConstructorReturn(this, (NCCOriginalBalance.__proto__ || Object.getPrototypeOf(NCCOriginalBalance)).call(this, props));

		_this.getLangCode = function (key) {
			var multiLang = _this.props.MutiInit.getIntl(_this.moduleId);
			return multiLang && multiLang.get(_this.moduleId + '-' + key);
		};

		_this.initMultiLang = function () {
			var moduleid = _this.moduleId;
			(0, _ncLightappFront.getMultiLang)({
				moduleId: moduleid,
				currentLocale: _this.state.currentLocale,
				domainName: 'cmp',
				callback: _this.setMultiLang
			});
		};

		_this.setMultiLang = function (json) {
			_this.setState({
				json: json
			}, function () {
				_events.initTemplate.call(_this, _this.props);
			});
		};

		_this.getData = function (searchData) {
			//let pageInfo = this.props.table.getTablePageInfo(this.tableId);
			//let searchVal = this.props.search.getAllSearchData(this.searchId);
			var data = {
				pubsearch: searchData,
				//pageInfo:pageInfo,
				pagecode: "360701OB_P01",
				queryAreaCode: '', //查询区编码
				oid: '', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				queryType: 'simple'
			};
			(0, _ncLightappFront.ajax)({
				url: '/nccloud/cmp/bankaccountbook/initrestmoneypub.do',
				data: data,
				success: function success(res) {
					var success = res.success,
					    data = res.data;

					if (success && data != undefined && data) {
						var tablearea = {};
						var rows = [];
						if (data.message) {
							// message有值，表示有错误信息
							(0, _ncLightappFront.toast)({ color: 'warning', content: data.message });
							_this.props.table.setAllTableData(_this.tableId, { rows: [] });
							return;
						}
						// 后台传过来的精度
						var scale = data.scale;
						if (!scale) {
							// 如果没传，默认3
							scale = '3';
						}
						var val = data.vos;
						var values = {};
						var value = {};
						var accountCode = val.accountCode;
						var accountName = val.accountName;
						var accountType = val.accountType;
						var capitalType = val.capitalType;
						var currencyName = val.currencyName;
						var currentBalance = val.currentBalance;
						var surplusBalance = val.surplusBalance;
						value.accountcode = { value: accountCode, display: accountCode };
						value.accountname = { value: accountName, display: accountName };
						value.accounttype = { value: accountType, display: accountType };
						value.capitaltype = { value: capitalType, display: capitalType };
						value.currencyname = { value: currencyName, display: currencyName };
						value.currentbalance = { value: currentBalance, display: currentBalance, scale: scale };
						value.surplusbalance = { value: surplusBalance, display: surplusBalance, scale: scale };
						values.values = value;
						values.status = '0';
						values.rowid = null;
						rows.push(values);
						tablearea['rows'] = rows;
						tablearea['areacode'] = _this.tableId;
						_this.props.table.setAllTableData(_this.tableId, tablearea);
					} else {
						_this.props.table.setAllTableData(_this.tableId, { rows: [] });
					}
				}
			});
		};

		_this.close = function () {
			_this.setState({
				showOriginalData: []
			}, function () {
				_this.props.onCloseClick();
			});
		};

		_this.moduleId = '360701OB';
		// this.searchId = 'search_area';
		_this.tableId = 'restmoney';
		_this.state = {
			currentLocale: 'zh-CN',
			showOriginalData: [],
			json: {}
		};
		// initTemplate.call(this,props);

		return _this;
	}
	/**获取多语方法 */


	_createClass(NCCOriginalBalance, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.initMultiLang();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
			// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
			// 需要每次都重新加载
			this.props.table.setAllTableData(this.tableId, { rows: [] });
			this.setState({
				showOriginalData: this.props.showOriginalData
			}, function () {
				_this2.initData();
			});
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var _this3 = this;

			if (nextProps.showmodal && nextProps.showmodal !== this.props.showmodal) {
				// 
				var need = true;
				// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
				// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
				// if (this.state.showOriginalData) {
				// 	// 判断本次和上次加载的数据是否一致，如果一致则不重新加载
				// 	let nextshowOriginalData = nextProps.showOriginalData;
				// 	let thisshowOriginalData = this.state.showOriginalData;
				// 	if (nextshowOriginalData && nextshowOriginalData.length==thisshowOriginalData.length) {
				// 		let nextSet = new Set();
				// 		let thisSet = new Set();
				// 		nextshowOriginalData.forEach((val,index) => {
				// 			let pk_account = val.pk_account;
				// 			nextSet.add(pk_account);
				// 		});

				// 		thisshowOriginalData.forEach((val,index) => {
				// 			let thispk_account = val.pk_account;
				// 			thisSet.add(thispk_account);
				// 		})
				// 		if (nextSet.toString() == thisSet.toString()) {
				// 			need = false;
				// 		}
				// 	}
				// }
				// 需要每次都重新加载
				if (need) {
					this.props.table.setAllTableData(this.tableId, { rows: [] });
					this.setState({
						showOriginalData: nextProps.showOriginalData
					}, function () {
						_this3.initData();
					});
				}
			}
		}
	}, {
		key: 'initData',
		value: function initData() {
			// 在didMount里初始化数据
			var data = this.state.showOriginalData;
			if (Array.isArray(data)) {
				if (!data || data.length == 0) {
					//toast({ color: 'warning', content: '未接收到您需要查询的数据' });
					// console.log(this.props.MutiInit.getIntl("360701OB") && this.props.MutiInit.getIntl("360701OB").get('360701OB-000047'));/* 国际化处理： 未传入需要查询的余额数据*/
					return;
				}
				for (var index = 0; index < data.length; index++) {
					var val = data[index];
					if (!val.pk_account && !val.pk_cashaccount) {
						data.splice(index, 1);
					}
				}
				if (data.length == 0) {
					// 没有有效的查询数据直接弹空
					return;
				}
				this.getData(data);
			} else {
				//处理单条查询
				var searchData = [];
				if (!data.pk_account && !data.pk_cashaccount) {
					return;
				}
				searchData.push(data);
				this.getData(searchData);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props,
			    table = _props.table,
			    button = _props.button,
			    search = _props.search,
			    modal = _props.modal;
			var createSimpleTable = table.createSimpleTable;
			var createButton = button.createButton;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					NCModal,
					{
						fieldid: 'accbalance',
						show: this.props.showmodal,
						style: { width: '1100px' },
						size: 'lg',
						onHide: this.close
					},
					_react2.default.createElement(
						NCModal.Header,
						{ closeButton: 'true' },
						_react2.default.createElement(
							NCModal.Title,
							null,
							this.state.json['360701OB-000056']
						)
					),
					_react2.default.createElement(
						NCModal.Body,
						{ size: 'sm', className: 'body-resize-icon' },
						_react2.default.createElement(
							'div',
							null,
							createSimpleTable(this.tableId, {
								height: '158px',
								showIndex: true,
								//取消保存列宽功能
								cancelCustomRightMenu: true
							})
						)
					)
				)
			);
		}
	}]);

	return NCCOriginalBalance;
}(_react.Component);

exports.default = (0, _ncLightappFront.createPage)({
	// mutiLangCode: '360701OB'
	// initTemplate: initTemplate
})(NCCOriginalBalance);

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.InnerAccoutDialog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ncLightappFront = __webpack_require__(1);

__webpack_require__(158);

var _meta = __webpack_require__(160);

var _meta2 = _interopRequireDefault(_meta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NCModal = _ncLightappFront.base.NCModal;

/**
 * 内部账户余额弹框
 */
var Dialog = function (_Component) {
	_inherits(Dialog, _Component);

	function Dialog(props) {
		_classCallCheck(this, Dialog);

		var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, props));

		_this.tableCode = 'inneraccbalance';
		_this.init(props);
		_this.state = {
			json: {}
		};
		return _this;
	}

	_createClass(Dialog, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			this.init(nextProps);
			this.queryAccBalance(this.props.accpk);
		}
	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			var _this2 = this;

			(0, _ncLightappFront.getMultiLang)({
				moduleId: "3601Inner",
				domainName: "tmpub",
				callback: function callback(json, status, inlt) {
					if (status) {
						_this2.setState({ json: json }, function () {
							_this2.initTemplate();
						});
					}
				}
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var table = this.props.table;
			var createSimpleTable = table.createSimpleTable;

			return _react2.default.createElement(
				NCModal,
				{
					fieldid: 'inneraccbalance',
					className: 'InnerAccoutModal_class',
					show: this.show,
					onHide: this.close,
					style: { width: '700px' }
				},
				_react2.default.createElement(
					NCModal.Header,
					{ closeButton: true },
					_react2.default.createElement(
						NCModal.Title,
						null,
						this.state.json["3601Inner-000005"]
					)
				),
				_react2.default.createElement(
					NCModal.Body,
					{ className: 'body-resize-icon' },
					createSimpleTable && _react2.default.createElement(
						'div',
						null,
						createSimpleTable(this.tableCode, {
							height: '158px',
							showIndex: true,
							//隐藏保存列宽功能
							cancelCustomRightMenu: true
						})
					)
				)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.queryAccBalance();
		}
	}, {
		key: 'init',
		value: function init(props) {
			//内部账户主键
			this.pk_accid = props.accpk;
			//是否显示
			this.show = props.showModal;
			//关闭弹框逻辑
			this.close = props.closeModal;
		}
	}, {
		key: 'queryAccBalance',
		value: function queryAccBalance() {
			var _this3 = this;

			(0, _ncLightappFront.ajax)({
				url: '/nccloud/tmpub/pub/inneraccbalance.do',
				async: true,
				data: { 'accid': this.pk_accid },
				success: function success(res) {
					var data = res.data;

					var tabledata = {
						areacode: _this3.tableCode,
						rows: [{
							status: 0,
							rowid: null,
							values: {
								name: { display: data.accName, value: data.accName, scale: -1 },
								bookbalance: { display: null, value: data.bookBalance, scale: 3 },
								realbalance: { display: null, value: data.realBalance, scale: 3 },
								realbalancewithoutover: { display: null, value: data.realBalanceNoOverFraft, scale: 3 }
							}
						}]
					};
					_this3.props.table.setAllTableData(_this3.tableCode, tabledata);
				},
				error: function error(data) {
					_this3.props.table.setAllTableData(_this3.tableCode, { rows: [] });
				}
			});
		}
	}, {
		key: 'initTemplate',
		value: function initTemplate() {
			var data = _meta2.default.call(this);
			if (data.template) {
				var meta = data.template;
				meta = this.modifierMeta.call(this, meta);
				this.props.meta.setMeta(meta);
			}
		}
	}, {
		key: 'modifierMeta',
		value: function modifierMeta(meta) {
			return meta;
		}
	}]);

	return Dialog;
}(_react.Component);

var InnerAccoutDialog = exports.InnerAccoutDialog = (0, _ncLightappFront.createPage)({})(Dialog);

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.restmoney = exports.initTemplate = undefined;

var _initTemplate = __webpack_require__(156);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

var _restmoney = __webpack_require__(139);

var _restmoney2 = _interopRequireDefault(_restmoney);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.initTemplate = _initTemplate2.default;
exports.restmoney = _restmoney2.default;

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (props) {
	var data = _restmoney2.default.call(this);
	if (data.template) {
		var meta = data.template;
		meta = modifierMeta(props, meta);
		props.meta.setMeta(meta);
	}
	// props.createUIDom(
	// 	{
	// 		pagecode: pageId,//页面id
	// 		appcode: '360701OB'//注册按钮的id  0001Z31000000000YCY2 0001Z31000000002QMYF
	// 	},
	// 	function (data) {
	// 		console.log('templet:  ', data)
	// 		if (data) {
	// 			if (data.template) {
	// 				let meta = data.template;
	// 				meta = modifierMeta(props, meta)
	// 				props.meta.setMeta(meta);
	// 			}
	// 			if (data.button) {
	// 				let button = data.button;
	// 				props.button.setButtons(button);
	// 			}
	// 		}
	// 	}
	// )
};

var _ncLightappFront = __webpack_require__(1);

var _restmoney = __webpack_require__(139);

var _restmoney2 = _interopRequireDefault(_restmoney);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import intl from 'react-intl-universal';
// import refer from './refer.js';
//import AccountDefaultModelTreeRef from '../../../../../uapbd/refer/fiacc/AccountDefaultModelTreeRef';
// let { NCPopconfirm, NCIcon } = base;
// let searchId = 'search_area';
var tableId = 'restmoney';
// let pageId = '360701OBP_L01';
//let refPath = '../../../../uapbd/refer/org/FinanceOrgTreeRef/index.js'

// import data from '../restmoney.json';


function modifierMeta(props, meta) {

	meta[tableId].items = meta[tableId].items.map(function (item, key) {
		item.width = 150;
		return item;
	});

	meta[tableId].showcheck = true;
	meta[tableId].pagination = false;
	return meta;
}

/***/ }),
/* 157 */,
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(159);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(false);
// imports


// module
exports.push([module.i, ".InnerAccoutModal_class .u-modal-content {\n  max-height: 300px !important;\n}\n", ""]);

// exports


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buildMeta;
function buildMeta() {
    return {
        "template": {
            "gridrelation": {
                "inneraccbalance": {
                    "destBrowseAreaCode": null,
                    "destEditAreaCode": null,
                    "srcAreaCode": "inneraccbalance",
                    "tabRelation": ["inneraccbalance"]
                }
            },
            "inneraccbalance": {
                "clazz": null,
                "code": "inneraccbalance",
                "items": [{
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000000'], /* 国际化处理： 账户名称*/
                    "attrcode": "name",
                    "maxlength": "20",
                    "metapath": null
                }, {
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000001'], /* 国际化处理： 账面余额*/
                    "attrcode": "bookbalance",
                    "maxlength": "20",
                    "metapath": null
                }, {
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000002'], /* 国际化处理： 实时余额*/
                    "attrcode": "realbalance",
                    "maxlength": "20",
                    "metapath": null
                }, {
                    "itemtype": "input",
                    "visible": true,
                    "label": this.state.json['3601Inner-000003'], /* 国际化处理： 实时余额(不含透支)*/
                    "attrcode": "realbalancewithoutover",
                    "maxlength": "20",
                    "metapath": null
                }],
                "moduletype": "table",
                "name": this.state.json['3601Inner-000005'],
                "pagination": false,
                "vometa": ""
            },
            "code": "inneraccbalancedialog",
            "moduletype": "table",
            "name": this.state.json['3601Inner-000005']
        },
        "code": "inneraccbalancedialog",
        "formrelation": null,
        "name": this.state.json['3601Inner-000005'],
        "metapath": null,
        "clazz": null,
        "pagetype": "Nochild"
    };
}

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ncLightappFront = __webpack_require__(1);

var _axios = __webpack_require__(142);

var _axios2 = _interopRequireDefault(_axios);

var _events = __webpack_require__(168);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NCModal = _ncLightappFront.base.NCModal;

var NCCCCCBalance = function (_Component) {
	_inherits(NCCCCCBalance, _Component);

	function NCCCCCBalance(props) {
		_classCallCheck(this, NCCCCCBalance);

		var _this = _possibleConstructorReturn(this, (NCCCCCBalance.__proto__ || Object.getPrototypeOf(NCCCCCBalance)).call(this, props));

		_this.getData = function (searchData) {
			var data = {
				pk: searchData.pk_protocol,
				pk_currtype: searchData.pk_currtype,
				credittype: searchData.credittype,
				pk_bankdoc: searchData.pk_bankdoc,
				pk_org: searchData.pk_org
			};
			(0, _ncLightappFront.ajax)({
				url: '/nccloud/ccc/bankprotocol/balance.do',
				data: data,
				success: function success(res) {
					var success = res.success,
					    data = res.data;

					if (success && data != undefined && data) {
						if (data) {
							var tablearea = {};
							// 后台传过来的精度
							var scale = '2';
							var values = {};
							var value = {};
							var rows = [];
							var protocolcode = data.protocolcode;
							var pk_currtype = data.displaycurr;
							var credittype = data.displaytype;
							var pk_bankdoc = data.displaybankdoc;
							var availcdtlnamt = data.availcdtlnamt;
							var olcavailcdtlnamt = data.olcavailcdtlnamt;
							value.protocolcode = { value: protocolcode, display: protocolcode };
							value.pk_currtype = { value: pk_currtype, display: pk_currtype };
							value.credittype = { value: credittype, display: credittype };
							value.pk_bankdoc = { value: pk_bankdoc, display: pk_bankdoc };
							value.availcdtlnamt = { value: availcdtlnamt, display: availcdtlnamt, scale: data.scale };
							value.olcavailcdtlnamt = { value: olcavailcdtlnamt, display: olcavailcdtlnamt, scale: data.olcscale };
							values.values = value;
							values.status = '0';
							values.rowid = null;
							rows.push(values);
							tablearea['rows'] = rows;
							tablearea['areacode'] = _this.tableId;
							_this.props.table.setAllTableData(_this.tableId, tablearea);
						}
					} else {
						_this.props.table.setAllTableData(_this.tableId, { rows: [] });
					}
				}
			});
		};

		_this.close = function () {
			_this.setState({
				showCCCBalance: null
			}, function () {
				_this.props.onCloseClick();
			});
		};

		_this.tableId = 'table_area';
		_this.state = {
			showCCCBalance: null
		};
		return _this;
	}

	_createClass(NCCCCCBalance, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var _this2 = this;

			var callback = function callback(json, status, inlt) {
				if (status) {
					_this2.setState({ json: json, inlt: inlt }, function () {
						_events.initTemplate.call(_this2, json, _this2.props);
					});
				} else {
					console.log('未加载到多语资源');
				}
			};
			this.props.MultiInit.getMultiLang({ moduleId: '36610CCBalance', domainName: 'ccc', callback: callback });
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this3 = this;

			// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
			// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
			// 需要每次都重新加载
			this.props.table.setAllTableData(this.tableId, { rows: [] });
			this.setState({
				showCCCBalance: this.props.showCCCBalance
			}, function () {
				_this3.initData();
			});
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var _this4 = this;

			if (nextProps.showmodal && nextProps.showmodal !== this.props.showmodal) {
				// 
				var need = true;
				// 需要每次都重新加载
				if (need) {
					this.props.form.EmptyAllFormValue(this.formId);
					this.setState({
						showCCCBalance: nextProps.showCCCBalance
					}, function () {
						_this4.initData();
					});
				}
			}
		}
	}, {
		key: 'initData',
		value: function initData() {
			// 在didMount里初始化数据
			var data = this.state.showCCCBalance;
			if (data) {
				this.getData(data);
			} else {
				return;
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props,
			    table = _props.table,
			    modal = _props.modal;
			var createSimpleTable = table.createSimpleTable;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					NCModal,
					{
						show: this.props.showmodal,
						style: { width: '1020px', height: '300px' },
						size: 'lg',
						onHide: this.close
					},
					_react2.default.createElement(
						NCModal.Header,
						{ closeButton: 'true' },
						_react2.default.createElement(
							NCModal.Title,
							null,
							this.state.json && this.state.json['36610CCA-000000']
						)
					),
					_react2.default.createElement(
						NCModal.Body,
						{ size: 'sm' },
						_react2.default.createElement(
							'div',
							null,
							createSimpleTable(this.tableId, {
								showIndex: true
							})
						)
					)
				)
			);
		}
	}]);

	return NCCCCCBalance;
}(_react.Component);

exports.default = (0, _ncLightappFront.createPage)({
	// initTemplate: initTemplate
})(NCCCCCBalance);

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _ncLightappFront = __webpack_require__(1);

var _buttonClick = __webpack_require__(170);

var _buttonClick2 = _interopRequireDefault(_buttonClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NCModal = _ncLightappFront.base.NCModal,
    NCTooltip = _ncLightappFront.base.NCTooltip,
    NCButton = _ncLightappFront.base.NCButton,
    NCHotKeys = _ncLightappFront.base.NCHotKeys;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */
/**
 * 作废组件
 * @author：gaokung
 */

var ConfirmreceiptCom = function ConfirmreceiptCom(props) {
    var _this = undefined;
    var context = props.context,
        show = props.show,
        title = props.title,
        signCode = props.signCode,
        onSureCallback = props.onSureCallback;
    var createForm = context.props.form.createForm;
    var _context$props$button = context.props.button,
        createButtonApp = _context$props$button.createButtonApp,
        createButton = _context$props$button.createButton;

    return _react2.default.createElement(
        NCModal,
        {
            show: show,
            backdrop: false,
            fieldid: "confirmreceipt",
            className: "senior",
            onHide: _buttonClick2.default.bind(context, signCode, onSureCallback, props, "onCancelConfirm"),
            ref: function ref(NCModal) {
                return context.NCModal = NCModal;
            }
        },
        _react2.default.createElement(NCHotKeys, {
            keyMap: {
                sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
                cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
            },
            handlers: {
                sureBtnHandler: function sureBtnHandler() {
                    _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "onSureConfirm");
                },
                cancelBtnHandler: function cancelBtnHandler() {
                    _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "onCancelConfirm");
                }
            },
            className: "simpleModal-hotkeys-wrapper",
            focused: true,
            attach: document.body,
            display: "inline-block"
        }),
        _react2.default.createElement(
            NCModal.Header,
            { closeButton: "true" },
            _react2.default.createElement(
                NCModal.Title,
                null,
                title
            )
        ),
        _react2.default.createElement(
            NCModal.Body,
            null,
            createForm(signCode, {})
        ),
        _react2.default.createElement(
            NCModal.Footer,
            null,
            createButtonApp({
                area: signCode,
                tipKeybodard: "underline",
                onButtonClick: _buttonClick2.default.bind(context, signCode, onSureCallback)
            })
        )
    );
};

exports.default = ConfirmreceiptCom;

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _ncLightappFront = __webpack_require__(1);

var _buttonClick = __webpack_require__(171);

var _buttonClick2 = _interopRequireDefault(_buttonClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NCModal = _ncLightappFront.base.NCModal,
    NCHotKeys = _ncLightappFront.base.NCHotKeys;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */
/**
 * 解除质押组件
 * @author：gaokung
 */

var ImpawnBackCom = function ImpawnBackCom(props) {
    var context = props.context,
        show = props.show,
        title = props.title,
        signCode = props.signCode,
        onSureCallback = props.onSureCallback;
    var createForm = context.props.form.createForm;
    var createButtonApp = context.props.button.createButtonApp;

    return _react2.default.createElement(
        NCModal,
        {
            show: show,
            backdrop: false,
            fieldid: "impawnBack",
            className: "senior",
            onHide: _buttonClick2.default.bind(context, signCode, onSureCallback, props, "ImpawnbackCancel"),
            ref: function ref(NCModal) {
                return context.NCModal = NCModal;
            }
        },
        _react2.default.createElement(NCHotKeys, {
            keyMap: {
                sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
                cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
            },
            handlers: {
                sureBtnHandler: function sureBtnHandler() {
                    _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "ImpawnbackOK");
                },
                cancelBtnHandler: function cancelBtnHandler() {
                    _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "ImpawnbackCancel");
                }
            },
            className: "simpleModal-hotkeys-wrapper",
            focused: true,
            attach: document.body,
            display: "inline-block"
        }),
        _react2.default.createElement(
            NCModal.Header,
            { closeButton: "true" },
            _react2.default.createElement(
                NCModal.Title,
                null,
                title
            )
        ),
        _react2.default.createElement(
            NCModal.Body,
            null,
            createForm(signCode, {})
        ),
        _react2.default.createElement(
            NCModal.Footer,
            null,
            createButtonApp({
                area: signCode,
                tipKeybodard: "underline",
                onButtonClick: _buttonClick2.default.bind(context, signCode, onSureCallback)
            })
        )
    );
};

exports.default = ImpawnBackCom;

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _ncLightappFront = __webpack_require__(1);

var _buttonClick = __webpack_require__(172);

var _buttonClick2 = _interopRequireDefault(_buttonClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NCModal = _ncLightappFront.base.NCModal,
    NCHotKeys = _ncLightappFront.base.NCHotKeys;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */

/**
 * 退回组件
 * @author：gaokung
 */

var ReturnCom = function ReturnCom(props) {
  var context = props.context,
      show = props.show,
      title = props.title,
      signCode = props.signCode,
      onSureCallback = props.onSureCallback;
  var _context$props$form = context.props.form,
      createForm = _context$props$form.createForm,
      setFormItemFocus = _context$props$form.setFormItemFocus;
  var createButtonApp = context.props.button.createButtonApp;

  return _react2.default.createElement(
    NCModal,
    {
      show: show,
      backdrop: false,
      fieldid: "returnreason",
      className: "senior",
      onHide: _buttonClick2.default.bind(context, signCode, onSureCallback, context.props, "onCancel"),
      onEntered: function onEntered() {
        // 等待 dom 创建成功之后再执行获取焦点的代码
        setTimeout(function () {
          // 打开弹框并激活退回原因字段光标
          setFormItemFocus(signCode, "returnreason");
        }, 100);
      },
      ref: function ref(NCModal) {
        return context.NCModal = NCModal;
      }
    },
    _react2.default.createElement(NCHotKeys, {
      keyMap: {
        sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
        cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
      },
      handlers: {
        sureBtnHandler: function sureBtnHandler() {
          _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "onSure");
        },
        cancelBtnHandler: function cancelBtnHandler() {
          _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "onCancel");
        }
      },
      className: "simpleModal-hotkeys-wrapper",
      focused: true,
      attach: document.body,
      display: "inline-block"
    }),
    _react2.default.createElement(
      NCModal.Header,
      { closeButton: "true" },
      _react2.default.createElement(
        NCModal.Title,
        null,
        title
      )
    ),
    _react2.default.createElement(
      NCModal.Body,
      null,
      createForm(signCode, {})
    ),
    _react2.default.createElement(
      NCModal.Footer,
      null,
      createButtonApp({
        area: signCode,
        tipKeybodard: "underline",
        onButtonClick: _buttonClick2.default.bind(context, signCode, onSureCallback)
      })
    )
  );
};
exports.default = ReturnCom;

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _ncLightappFront = __webpack_require__(1);

var _buttonClick = __webpack_require__(173);

var _buttonClick2 = _interopRequireDefault(_buttonClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NCModal = _ncLightappFront.base.NCModal,
    NCTooltip = _ncLightappFront.base.NCTooltip,
    NCButton = _ncLightappFront.base.NCButton,
    NCHotKeys = _ncLightappFront.base.NCHotKeys;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */
/**
 * 记账组件
 * @author：jiangpk
 */

var TallyCom = function TallyCom(props) {
    var _this = undefined;
    var context = props.context,
        show = props.show,
        title = props.title,
        signCode = props.signCode,
        onSureCallback = props.onSureCallback;
    var createForm = context.props.form.createForm;
    var _context$props$button = context.props.button,
        createButtonApp = _context$props$button.createButtonApp,
        createButton = _context$props$button.createButton;

    return _react2.default.createElement(
        NCModal,
        {
            show: show,
            backdrop: false,
            fieldid: "disable",
            className: "senior",
            onHide: _buttonClick2.default.bind(context, signCode, onSureCallback, props, "onCancel"),
            ref: function ref(NCModal) {
                return context.NCModal = NCModal;
            }
        },
        _react2.default.createElement(NCHotKeys, {
            keyMap: {
                sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
                cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
            },
            handlers: {
                sureBtnHandler: function sureBtnHandler() {
                    _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "onSure");
                },
                cancelBtnHandler: function cancelBtnHandler() {
                    _buttonClick2.default.call(context, signCode, onSureCallback, context.props, "onCancel");
                }
            },
            className: "simpleModal-hotkeys-wrapper",
            focused: true,
            attach: document.body,
            display: "inline-block"
        }),
        _react2.default.createElement(
            NCModal.Header,
            { closeButton: "true" },
            _react2.default.createElement(
                NCModal.Title,
                null,
                title
            )
        ),
        _react2.default.createElement(
            NCModal.Body,
            null,
            createForm(signCode, {})
        ),
        _react2.default.createElement(
            NCModal.Footer,
            null,
            createButtonApp({
                area: signCode,
                tipKeybodard: "underline",
                onButtonClick: _buttonClick2.default.bind(context, signCode, onSureCallback)
            })
        )
    );
};

exports.default = TallyCom;

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _ncLightappFront = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NCModal = _ncLightappFront.base.NCModal,
    NCButton = _ncLightappFront.base.NCButton;

var AcceptModal = function AcceptModal(props) {
  return _react2.default.createElement(
    "div",
    { className: "accept-modal" },
    _react2.default.createElement(
      NCModal,
      { fieldid: "accept", show: props.show },
      _react2.default.createElement(
        NCModal.Header,
        { closeButton: true, onClick: props.onClose },
        _react2.default.createElement(
          NCModal.Title,
          null,
          props.title
        )
      ),
      _react2.default.createElement(
        NCModal.Body,
        null,
        props.content
      ),
      _react2.default.createElement(
        NCModal.Footer,
        null,
        _react2.default.createElement(
          NCButton,
          { fieldid: "sure", onClick: props.onSure },
          props.sureButtonText
        ),
        _react2.default.createElement(
          NCButton,
          { fieldid: "deny", onClick: props.onDeny },
          props.denyButtonText
        ),
        _react2.default.createElement(
          NCButton,
          { fieldid: "cancel", onClick: props.onCancel },
          props.cancelButtonText
        )
      )
    )
  );
};
exports.default = AcceptModal;

/***/ }),
/* 167 */,
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.balance = exports.initTemplate = undefined;

var _initTemplate = __webpack_require__(169);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

var _balance = __webpack_require__(146);

var _balance2 = _interopRequireDefault(_balance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.initTemplate = _initTemplate2.default;
exports.balance = _balance2.default;

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (json, props) {
	var data = _balance2.default.call(this, json);
	if (data.template) {
		var meta = data.template;
		meta = modifierMeta(props, meta);
		props.meta.setMeta(meta);
	}
};

var _ncLightappFront = __webpack_require__(1);

var _balance = __webpack_require__(146);

var _balance2 = _interopRequireDefault(_balance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tableId = 'table_area';
var pageId = '36610CCB';

function modifierMeta(props, meta) {
	meta[tableId].items = meta[tableId].items.map(function (item, key) {
		return item;
	});
	return meta;
}

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _container = __webpack_require__(4);

/**
 * 作废组件 按钮事件
 * @author：gaokung
 * @param {*} props
 * @param {*} key
 * @param {String} type list 列表页 card 卡片页 
 */
function buttonClick(signCode, onSureCallback, props, key) {
    var _this = this;
    switch (key) {
        case "onSureConfirm":
            // 确定按钮
            return onOKClick.call(this, signCode, onSureCallback);
        case "onCancelConfirm":
            // 取消按钮
            return onCancelClick.call(this, signCode);
        default:
            break;
    }
}
// 查询弹窗 确定按钮 点击事件
var onOKClick = function onOKClick(signCode, onSureCallback) {
    this.setState({
        confirmreceiptComShow: !this.state.confirmreceiptComShow
    });
    // let pks = this.state.curPk;
    var reason = this.props.form.getFormItemsValue(signCode, signCode).value;
    var failreason = {};
    var position = this.failreasonPosition ? this.failreasonPosition : 'head';
    // failreason['position'] = position
    failreason[signCode] = reason;

    if (typeof onSureCallback == 'function') {
        onSureCallback.call(this, failreason);
    }
};

// 查询弹窗 确定按钮 点击事件
var onCancelClick = function onCancelClick() {
    this.setState({
        confirmreceiptComShow: !this.state.confirmreceiptComShow
    });
};

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buttonClick;
/**
 * 解除质押组件 按钮事件
 * @param {*} props
 * @param {*} key 按钮code
 */
function buttonClick(signCode, onSureCallback, props, key) {
    switch (key) {
        case "ImpawnbackOK":
            // 确定按钮
            return onOKClick.call(this, signCode, onSureCallback);
        case "ImpawnbackCancel":
            // 取消按钮
            return onCancelClick.call(this, signCode);
        default:
            break;
    }
}
// 查询弹窗 确定按钮 点击事件
var onOKClick = function onOKClick(signCode, onSureCallback) {
    var check = this.props.form.isCheckNow([signCode], "warning");
    if (!check) {
        return false;
    }
    this.setState({
        impawnbackComShow: !this.state.impawnbackComShow
    });
    var impawnbackpersonid = this.props.form.getFormItemsValue(signCode, 'impawnbackpersonid').value;
    var impawnbackdate = this.props.form.getFormItemsValue(signCode, 'impawnbackdate').value;

    var backInfo = {};
    backInfo['impawnbackpersonid'] = impawnbackpersonid;
    backInfo['impawnbackdate'] = impawnbackdate;

    if (typeof onSureCallback == "function") {
        onSureCallback.call(this, backInfo);
    }
};

// 查询弹窗 确定按钮 点击事件
var onCancelClick = function onCancelClick() {
    this.setState({
        impawnbackComShow: !this.state.impawnbackComShow
    });
};

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _container = __webpack_require__(4);

/**
 * 作废组件 按钮事件
 * @author：gaokung
 * @param {*} props
 * @param {*} key
 * @param {String} type list 列表页 card 卡片页 
 */
function buttonClick(signCode, onSureCallback, props, key) {
    var _this = this;
    switch (key) {
        case "onSure":
            // 确定按钮
            return onOKClick.call(this, signCode, onSureCallback);
        case "onCancel":
            // 取消按钮
            return onCancelClick.call(this, signCode);
        default:
            break;
    }
}
// 查询弹窗 确定按钮 点击事件
var onOKClick = function onOKClick(signCode, onSureCallback) {
    this.setState({
        returnComShow: !this.state.returnComShow
    });
    // let pks = this.state.curPk;
    var reason = this.props.form.getFormItemsValue(signCode, signCode).value;
    var failreason = {};
    var position = this.failreasonPosition ? this.failreasonPosition : 'head';
    // failreason['position'] = position
    failreason[signCode] = reason;

    if (typeof onSureCallback == 'function') {
        onSureCallback.call(this, failreason);
    }
    // if (type && type=='list') {
    //     // 列表页
    //     let data = this.state.disabledData;
    //     data['extParam'] = failreason;
    //     // 位置
    //     list.listInvalid.call(this, data);
    // }else{
    //     card.cardInvalid.call(this,failreason);
    // }
};

// 查询弹窗 确定按钮 点击事件
var onCancelClick = function onCancelClick() {
    this.setState({
        returnComShow: !this.state.returnComShow
    });
};

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _container = __webpack_require__(4);

/**
 * 记账组件 按钮事件
 * @    jiangpk
 * @param {*} props
 * @param {*} key
 * @param {String} type list 列表页 card 卡片页 
 */
function buttonClick(signCode, onSureCallback, props, key) {
    var _this = this;
    switch (key) {
        case "onSure":
            // 确定按钮
            return onOKClick.call(this, signCode, onSureCallback);
        case "onCancel":
            // 取消按钮
            return onCancelClick.call(this, signCode);
        default:
            break;
    }
}

// 查询弹窗 确定按钮 点击事件
var onOKClick = function onOKClick(signCode, onSureCallback) {
    this.setState({
        tallyComShow: !this.state.tallyComShow
    });

    var formData = this.props.form.getAllFormValue(signCode);
    formData = formData["rows"][0]["values"];
    var newData = {};
    for (var key in formData) {
        if (formData.hasOwnProperty(key)) {
            newData[key] = formData[key].value;
        }
    }
    if (typeof onSureCallback == 'function') {
        onSureCallback.call(this, newData);
    }
};

// 查询弹窗 确定按钮 点击事件
var onCancelClick = function onCancelClick() {
    this.setState({
        tallyComShow: !this.state.tallyComShow
    });
};

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ncLightappFront = __webpack_require__(1);

__webpack_require__(175);

var NCTabs = _ncLightappFront.base.NCTabs;
exports.default = NCTabs;

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(176);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(false);
// imports


// module
exports.push([module.i, ".u-tabs-top .u-tabs-bar {\n  margin-bottom: 0px;\n}\n", ""]);

// exports


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListData = exports.selectedEvent = exports.pageInfoClick = exports.buttonClick = exports.searchBtnClick = exports.bodyButtonClick = undefined;

var _searchBtnClick = __webpack_require__(188);

var _buttonClick = __webpack_require__(189);

var _selectedEvent = __webpack_require__(190);

var _bodyButtonClick = __webpack_require__(191);

var _page = __webpack_require__(3);

exports.bodyButtonClick = _bodyButtonClick.bodyButtonClick;
exports.searchBtnClick = _searchBtnClick.searchBtnClick;
exports.buttonClick = _buttonClick.buttonClick;
exports.pageInfoClick = _searchBtnClick.pageInfoClick;
exports.selectedEvent = _selectedEvent.selectedEvent;
exports.getListData = _page.getListData;

/***/ }),
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps; /* 
                                      列表页组件
                                      created by：liyaoh 2018-09-30
                                     */


var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _index = __webpack_require__(161);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(153);

var _index4 = _interopRequireDefault(_index3);

var _index5 = __webpack_require__(154);

var _index6 = __webpack_require__(174);

var _index7 = _interopRequireDefault(_index6);

var _container = __webpack_require__(4);

var _common = __webpack_require__(5);

var _page = __webpack_require__(3);

var _AcceptModal = __webpack_require__(166);

var _AcceptModal2 = _interopRequireDefault(_AcceptModal);

var _ConfirmreceiptCom = __webpack_require__(162);

var _ConfirmreceiptCom2 = _interopRequireDefault(_ConfirmreceiptCom);

var _DisabledCom = __webpack_require__(141);

var _DisabledCom2 = _interopRequireDefault(_DisabledCom);

var _impawnbackcom = __webpack_require__(163);

var _impawnbackcom2 = _interopRequireDefault(_impawnbackcom);

var _ReturnCom = __webpack_require__(164);

var _ReturnCom2 = _interopRequireDefault(_ReturnCom);

var _TallyCom = __webpack_require__(165);

var _TallyCom2 = _interopRequireDefault(_TallyCom);

var _events = __webpack_require__(177);

__webpack_require__(192);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExcelImport = _ncLightappFront.high.ExcelImport;
var NCAffix = _ncLightappFront.base.NCAffix,
    NCTabsControl = _ncLightappFront.base.NCTabsControl,
    NCDiv = _ncLightappFront.base.NCDiv;
var NCTabPane = _index7.default.NCTabPane;
var NCUploader = _ncLightappFront.high.NCUploader,
    PrintOutput = _ncLightappFront.high.PrintOutput,
    ApprovalTrans = _ncLightappFront.high.ApprovalTrans,
    ApproveDetail = _ncLightappFront.high.ApproveDetail,
    Inspection = _ncLightappFront.high.Inspection;
var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
var BaseList = (_temp = _class = function (_Component) {
  _inherits(BaseList, _Component);

  function BaseList(props) {
    _classCallCheck(this, BaseList);

    var _this = _possibleConstructorReturn(this, (BaseList.__proto__ || Object.getPrototypeOf(BaseList)).call(this, props));

    _initialiseProps.call(_this);

    for (var k in props.constant) {
      _this[k] = props.constant[k];
    }

    _this.selectedPKS = [];
    _this.state = {
      json: {},
      inlt: null,
      tabNum: {}, //tab页签显示数量
      //输出用
      outputData: {
        funcode: "", //功能节点编码，即模板编码
        nodekey: "", //模板节点标识
        outputType: "output"
      },
      activeTab: props.listTabs && props.listTabs.defaultKey,
      showUploader: false, //是否显示附件上传
      billInfo: {}, //附件上传信息
      showApproveDetail: false, //是否显示审批详情
      showCCC: false, //显示联查授信额度
      showCCCBalance: null, //授信pk
      compositedata: null, //指派信息
      compositedisplay: false, //是否显示指派
      showOriginalBalance: false, //显示联查余额
      showOriginalData: "", //联查余额数据
      showNtbDetail: false, //显示预算计划
      showInneraccpk: null, //内部结算账户pk
      showInnerAccount: false, //显示内部结算账户
      ntbdata: null, //预算计划数据
      curPk: "", //当前选中数据的pk
      linkPks: "", //备份联查时传入的pk
      acceptModalShow: false // 是否显示受理Modal框
    };
    var app_code = props.getSearchParam("c");
    if (app_code) {
      _this.appcode = app_code;
    }
    return _this;
  }

  _createClass(BaseList, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      var callback = function callback(json, status, inlt) {
        // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        if (status) {
          _this2.setState({ json: json, inlt: inlt }); // 保存json和inlt到页面state中并刷新页面
        } else {
          console.log("未加载到多语资源"); // 未请求到多语资源的后续操作
        }
      };
      this.props.MultiInit.getMultiLang({
        moduleId: "fbmpublic",
        domainName: "fbm",
        callback: callback
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      //凭证联查单据
      var scene = this.props.getUrlParam("scene");
      var pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
      // let callback = (json, status, inlt) => {
      //     // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
      //     if (status) {
      //         this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
      //     } else {
      //         console.log(未加载到多语资源); // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源,未加载到多语资源,未请求到多语资源的后续操作*//* 国际化处理： 未加载到多语资源*/
      //     }
      // };
      this.props._initTemplate.call(this, this.props); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
      this.props.listDidMount && this.props.listDidMount.call(this);
      if (scene && scene === "fip") {
        //fip代表会计平台
        _common.voucherLinkBill.call(this);
      } else if (scene && scene === "linksce") {
        // 联查场景
        var pk = this.props.getUrlParam("id");
        this.setState({ linkPks: pk });
        _common.SDBookLinkBill.call(this, pk);
      } else if (pk_ntbparadimvo) {
        //预算反联查
        this.ntbLinkBill.call(this);
      }
      this.setCacheTabNum();

      // this.props.MultiInit.getMultiLang({
      //     moduleId: MODULE_ID,
      //     domainName: "bond",
      //     callback
      // });
    }

    //设置选中页签和页签数字

    // 查询区渲染完成回调函数

    //初始化四状态默认值的时候的回调函数

    //列表查询成功后的回调函数


    //页签筛选


    //提交即指派


    //取消提交即指派


    //预算反联查单据

  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          table = _props.table,
          button = _props.button,
          search = _props.search,
          ncmodal = _props.ncmodal,
          BillHeadInfo = _props.BillHeadInfo,
          cardTable = _props.cardTable,
          form = _props.form,
          modal = _props.modal,
          cardPagination = _props.cardPagination,
          transferTable = _props.transferTable,
          socket = _props.socket;
      var createTransferList = transferTable.createTransferList;
      var _props2 = this.props,
          showSearch = _props2.showSearch,
          listTabs = _props2.listTabs,
          linkItems = _props2.linkItems,
          _buttonClick = _props2._buttonClick,
          _bodyButtonClick = _props2._bodyButtonClick,
          _searchBtnClick = _props2._searchBtnClick,
          _selectedEvent = _props2._selectedEvent,
          _componentInitFinished = _props2._componentInitFinished,
          initImport = _props2.initImport,
          _renderCompleteEvent = _props2._renderCompleteEvent;
      var _state = this.state,
          showUploader = _state.showUploader,
          billInfo = _state.billInfo,
          outputData = _state.outputData,
          tabNum = _state.tabNum,
          showApproveDetail = _state.showApproveDetail,
          compositedata = _state.compositedata,
          compositedisplay = _state.compositedisplay;
      var createSimpleTable = table.createSimpleTable,
          getTablePageInfo = table.getTablePageInfo;
      var NCCreateSearch = search.NCCreateSearch;
      var createButtonApp = button.createButtonApp;
      var createModal = ncmodal.createModal;
      var createBillHeadInfo = BillHeadInfo.createBillHeadInfo;

      var scene = this.props.getUrlParam("scene");
      return _react2.default.createElement(
        "div",
        { className: "nc-bill-list" },
        socket.connectMesg({
          tableAreaCode: this.tableId,
          billpkname: this.primaryId,
          billtype: this.billtype
        }),
        _react2.default.createElement(
          NCAffix,
          null,
          _react2.default.createElement(
            NCDiv,
            { areaCode: NCDiv.config.HEADER, className: "nc-bill-header-area" },
            _react2.default.createElement(
              "div",
              { className: "header-title-search-area" },
              createBillHeadInfo({
                title: this.props.pageTitle,
                initShowBackBtn: false
              })
            ),
            _react2.default.createElement(
              "div",
              { className: "header-button-area" },
              createButtonApp({
                area: this.props.headBtnArea,
                onButtonClick: _buttonClick ? _buttonClick.bind(this) : _events.buttonClick.bind(this)
              })
            )
          )
        ),
        !scene && showSearch && _react2.default.createElement(
          "div",
          { className: "nc-bill-search-area" },
          NCCreateSearch(this.searchId, {
            clickSearchBtn: _searchBtnClick ? _searchBtnClick.bind(this) : _events.searchBtnClick.bind(this),
            showAdvBtn: true, //  显示高级按钮
            renderCompleteEvent: _renderCompleteEvent ? _renderCompleteEvent.bind(this) : this.renderCompleteEvent // 查询区渲染完成回调函数  //初始化状态默认值的时候的回调函数
          })
        ),
        !scene && listTabs && _react2.default.createElement(
          _index7.default,
          {
            activeKey: this.state.activeTab,
            onChange: function onChange(val) {
              return _this3.handleTabChange.call(_this3, val);
            }
          },
          listTabs.items.map(function (item) {
            var num = listTabs.allKey != item.key ? " (" + (item.name && tabNum[item.name] || 0) + ")" : "";
            var tabText = listTabs.allKey != item.key ? item.title + num : item.title;
            return _react2.default.createElement(NCTabPane, { key: item.key, tab: tabText });
          })
        ),
        _react2.default.createElement(
          "div",
          { className: "nc-bill-table-area" },
          createSimpleTable(this.tableId, {
            handlePageInfoChange: _events.pageInfoClick.bind(this),
            showCheck: true,
            showIndex: this.showIndex ? this.showIndex : true,
            dataSource: this.dataSource,
            pkname: this.primaryId,
            onRowDoubleClick: this.handleDoubleClick.bind(this),
            onSelected: _selectedEvent ? _selectedEvent.bind(this) : _events.selectedEvent.bind(this),
            onSelectedAll: _selectedEvent ? _selectedEvent.bind(this) : _events.selectedEvent.bind(this),
            componentInitFinished: _componentInitFinished ? _componentInitFinished.bind(this) : _page.initList.bind(this)
          })
        ),
        _react2.default.createElement(PrintOutput, {
          ref: "printOutput",
          url: this.API_URL.print,
          data: outputData
        }),
        showUploader && _react2.default.createElement(NCUploader, _extends({
          placement: "bottom"
        }, billInfo, {
          onHide: function onHide() {
            _this3.setState({
              showUploader: false
            });
          }
          // 用于判断，是否属于上游单据，上游单据只能使用附件的下载功能，不可上传
          , disableButton: this.state.disableButton ? this.state.disableButton : false
        })),
        linkItems.includes("approveDetail") && _react2.default.createElement(ApproveDetail, {
          show: showApproveDetail,
          billtype: this.billtype,
          billid: billInfo.billId,
          close: function close() {
            _this3.setState({
              showApproveDetail: false
            });
          }
        }),
        compositedisplay && _react2.default.createElement(ApprovalTrans, {
          title: this.state.json["fbmpublic-000009"] /* 国际化处理： 指派*/ /* 国际化处理： 指派*/
          , data: compositedata,
          display: compositedisplay,
          getResult: this.getAssginUsedr,
          cancel: this.compositeTurnOff
        }),
        linkItems.includes("creditBalance") && _react2.default.createElement(_index2.default, {
          showmodal: this.state.showCCC,
          showCCCBalance: this.state.showCCCBalance
          // 点击确定按钮的回调函数
          , onSureClick: function onSureClick() {
            //关闭对话框
            _this3.setState({
              showCCC: false
            });
          },
          onCloseClick: function onCloseClick() {
            //关闭对话框
            _this3.setState({
              showCCC: false
            });
          }
        }),
        this.state.showInnerAccount && _react2.default.createElement(_index5.InnerAccoutDialog, {
          showModal: this.state.showInnerAccount,
          accpk: this.state.showInneraccpk,
          closeModal: function closeModal() {
            //关闭对话框
            _this3.setState({
              accpk: null,
              showInnerAccount: false
            });
          }
        }),
        linkItems.includes("bankBalance") && _react2.default.createElement(_index4.default, {
          showmodal: this.state.showOriginalBalance,
          showOriginalData: this.state.showOriginalData
          // 点击确定按钮的回调函数
          , onSureClick: function onSureClick() {
            //关闭对话框
            _this3.setState({
              showOriginalBalance: false
            });
          },
          onCloseClick: function onCloseClick() {
            //关闭对话框
            _this3.setState({
              showOriginalBalance: false
            });
          }
        }),
        linkItems.includes("ntb") && _react2.default.createElement(Inspection, {
          show: this.state.showNtbDetail,
          sourceData: this.state.ntbdata,
          cancel: function cancel() {
            _this3.setState({ showNtbDetail: false });
          },
          affirm: function affirm() {
            _this3.setState({ showNtbDetail: false });
          }
        }),
        _react2.default.createElement(_DisabledCom2.default, {
          context: this,
          show: this.state.disabledComShow,
          title: this.state.json["fbmpublic-000010"] /* 国际化处理： 作废原因*/
          , signCode: this.disableReason,
          onSureCallback: _container.list.listInvalid.bind(this)
        }),
        _react2.default.createElement(_ConfirmreceiptCom2.default, {
          context: this,
          show: this.state.confirmreceiptComShow,
          title: this.state.json["fbmpublic-000011"] /* 国际化处理： 确认收妥*/
          , signCode: this.confirmreceipt,
          onSureCallback: _container.list.listConfirmreceipt.bind(this)
        }),
        _react2.default.createElement(_ReturnCom2.default, {
          context: this,
          show: this.state.returnComShow,
          title: this.state.json["fbmpublic-000012"] /* 国际化处理： 退回原因*/
          , signCode: this.returnReason,
          onSureCallback: _container.list.listReturn.bind(this)
        }),
        _react2.default.createElement(_TallyCom2.default, {
          context: this,
          show: this.state.tallyComShow,
          title: this.state.json["fbmpublic-000089"] /* 国际化处理： 记账-计划*/
          , signCode: this.tallyPlan,
          onSureCallback: _container.list.listTally.bind(this)
        }),
        _react2.default.createElement(_impawnbackcom2.default, {
          context: this,
          show: this.state.impawnbackComShow,
          title: this.state.json["fbmpublic-000018"] /* 国际化处理： 解除质押*/
          , signCode: this.impawnbackAreaCode,
          impawnbackpersonid: this.impawnbackpersonid,
          impawnbackdate: this.impawnbackdate,
          onSureCallback: _container.list.impawnBackInstr.bind(this)
        }),
        _react2.default.createElement(_AcceptModal2.default, {
          show: this.state.acceptModalShow,
          title: this.state.json["fbmpublic-000091"],
          content: this.state.json["fbmpublic-000091"],
          sureButtonText: this.state.json["fbmpublic-000094"],
          denyButtonText: this.state.json["fbmpublic-000095"],
          cancelButtonText: this.state.json["fbmpublic-000004"],
          onSure: function onSure() {
            // 是
            _this3.acceptData.data = Object.assign({ extParam: { isacceptednow: "Y" } }, _this3.acceptData.data);
            _container.list.listOperation.call(_this3, Object.assign({ name: "accept" }, _this3.acceptData));
            _this3.setState({
              acceptModalShow: false
            });
          },
          onDeny: function onDeny() {
            // 否
            _this3.acceptData.data = Object.assign({ extParam: { isacceptednow: "N" } }, _this3.acceptData.data);
            _container.list.listOperation.call(_this3, Object.assign({ name: "accept" }, _this3.acceptData));
            _this3.setState({
              acceptModalShow: false
            });
          },
          onCancel: function onCancel() {
            _this3.setState({
              acceptModalShow: false
            });
          } // 取消
          , onClose: function onClose() {
            _this3.setState({
              acceptModalShow: false
            });
          }
        }),
        createModal("importModal", {
          noFooter: true,
          className: "import-modal",
          hasBackDrop: false
        }),
        initImport && _react2.default.createElement(ExcelImport, _extends({}, this.props, {
          moduleName: this.modelname //模块名
          , billType: this.billtype //单据类型
          , pagecode: this.cardPageCode,
          appcode: this.appcode,
          selectedPKS: this.selectedPKS
        }))
      );
    }
  }]);

  return BaseList;
}(_react.Component), _class.defaultProps = {
  showSearch: true, //默认显示查询区
  linkItems: [] //需要显示的联查组件
}, _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.setCacheTabNum = function () {
    var numvalues = getDefData("numvalues", "tabCache");
    var selectedGroup = getDefData("selectedGroup", "tabCache");
    numvalues && _this4.setState({ tabNum: numvalues });
    selectedGroup && _this4.setState({ activeTab: selectedGroup });
  };

  this.renderCompleteEvent = function () {
    _this4.initOid();
    // 默认先查询
    // this.queryFirst();
  };

  this.initOid = function () {
    var queryInfo = _this4.props.search.getQueryInfo(_this4.searchId, false);
    if (queryInfo && queryInfo.oid) {
      var oid = queryInfo.oid;
      _this4.oid = oid;
    }
  };

  this.setInitValueEvent = function () {
    _this4.queryFirst();
  };

  this.queryFirst = function () {
    var searchdata = _this4.props.search.getQueryInfo(_this4.searchId);
    if (searchdata && JSON.stringify(searchdata) != "{}") {
      // 去查询
      var allData = _this4.props.table.getAllTableData(_this4.tableId);
      if (allData && allData.rows.length == 0) {
        // 未查询过
        _events.searchBtnClick.call(_this4, _this4.props, searchdata.querycondition);
      }
    }
  };

  this.queryListCallback = function (res) {
    if (!_this4.props.listTabs) return;
    //设置tab页签显示的数字
    var numsObj = {};
    if (res.data) {
      var resNums = res.data.groupData;
      _this4.props.listTabs.items.map(function (item) {
        if (item.name) {
          numsObj[item.name] = resNums[item.name];
        }
      });
      console.log("tabnums", numsObj);
      setDefData("numvalues", "tabCache", numsObj); //页签数字放到缓存中
      _this4.setState({
        tabNum: numsObj
      });
    }
  };

  this.handleDoubleClick = function (record, index, props) {
    props.pushTo("/card", {
      status: "browse",
      id: record[_this4.primaryId].value,
      pagecode: _this4.pageId,
      scene: _this4.props.getUrlParam("scene")
    });
  };

  this.handleTabChange = function (status) {
    _this4.props.listTabs.tabChangeServal.call(_this4, status, function (serval) {
      var searchCache = getDefData(_this4.searchCache.key, _this4.searchCache.dataSource);
      setDefData("selectedGroup", "tabCache", status);
      _this4.setState({ activeTab: status }, function () {
        searchCache && _events.getListData.call(_this4, [serval]);
      });
    });
  };

  this.getAssginUsedr = function (value) {
    _container.list.listCommit.call(_this4, {
      data: {
        pks: _this4.state.curPk,
        userObj: value
      },
      successAfter: function successAfter() {
        _this4.compositeTurnOff();
      }
    });
  };

  this.compositeTurnOff = function () {
    _this4.setState({
      compositedata: null,
      compositedisplay: false
    });
  };

  this.ntbLinkBill = function () {
    var pk_ntbparadimvo = _this4.props.getUrlParam("pk_ntbparadimvo");
    if (!pk_ntbparadimvo) return;
    var data = {
      pageCode: _this4.pageId,
      pk: pk_ntbparadimvo,
      modulecode: _this4.modulecode,
      extParam: {
        pk_ntbparadimvo: pk_ntbparadimvo
      }
    };
    (0, _ncLightappFront.ajax)({
      url: _this4.API_URL.ntbLink,
      data: data,
      success: function success(res) {
        var data = res.data;

        if (data) {
          var grid = data.grid,
              head = data.head;

          var gridRow = grid && grid[_this4.tableId].rows;
          if (gridRow.length > 1) {
            _this4.props.table.setAllTableData(_this4.tableId, data.grid[_this4.tableId]);
            // 显示全部页签
            _this4.setState({
              activeTab: _this4.props.listTabs
            });
          } else if (gridRow.length == 1) {
            var pk = grid[_this4.tableId].rows[0].values[_this4.primaryId].value;
            _this4.props.pushTo("/card", {
              status: "browse",
              id: pk,
              scene: "linksce",
              showBackBtn: false
            });
          }
        }
      }
    });
  };
}, _temp);
exports.default = BaseList;

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.searchBtnClick = searchBtnClick;
exports.pageInfoClick = pageInfoClick;

var _ncLightappFront = __webpack_require__(1);

var _page = __webpack_require__(3);

var setDefData = _ncLightappFront.cardCache.setDefData,
    getDefData = _ncLightappFront.cardCache.getDefData;
//点击查询，获取查询区数据

function searchBtnClick(props, condition, type, querycondition) {
    var _this = this;

    if (condition) {
        //将查询条件放入缓存中
        setDefData(this.searchCache.key, this.searchCache.dataSource, condition);
        var pageInfo = this.props.table.getTablePageInfo(this.tableId);
        var searchdata = this.props.search.getQueryInfo(this.searchId);
        pageInfo.pageIndex = 0;
        searchdata.pageCode = this.pageId;
        searchdata.pageInfo = pageInfo;
        //根据页签状态添加自定义查询条件
        if (this.state.activeTab && this.state.activeTab !== "all") {
            var key = this.state.activeTab;
            var tabs = this.tabStatus;
            var conditions = [];
            if (tabs && tabs[key]) {
                var tabfield = tabs[key];
                if (tabfield) {
                    // 是否多字段
                    var fields = tabfield.split(",");
                    for (var index = 0; index < fields.length; index++) {
                        var field = fields[index];
                        var fieldvalue = this[field];
                        var opr = "=";
                        if (fieldvalue && fieldvalue.split(",").length > 1) {
                            // 代表是多个数，需要in
                            opr = "in";
                        }
                        var cuscondition = {
                            field: field,
                            oprtype: opr,
                            value: {
                                firstvalue: fieldvalue,
                                secondvalue: null
                            }
                        };
                        conditions.push(cuscondition);
                    }
                }
            } else {
                var _tabfield = this.billstatus;
                var value = this.state.activeTab;
                var _cuscondition = {
                    field: _tabfield,
                    oprtype: "=",
                    value: {
                        firstvalue: value,
                        secondvalue: null
                    }
                };
                conditions.push(_cuscondition);
            }
            searchdata.custcondition = {
                logic: "and",
                conditions: conditions
            };
            //额度管理待提交去除经办
            if (this.state.activeTab && this.state.activeTab === "-1" && this.pageId === "36185515_LIST") {
                searchdata.custcondition = {
                    logic: "and",
                    conditions: [{
                        field: "vbillstatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "-1"
                            //secondvalue: null
                        }
                    }, {
                        field: "busistatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "1"
                            //secondvalue: null
                        }
                    }]
                };
            }
            // 池内质押页签包含发送指令和解除质押指令状态为不明或失败且未作废的
            if (this.state.activeTab.indexOf("cmd") >= 0) {
                var querystatus = this.state.activeTab.substring(3);
                searchdata.custcondition = {
                    logic: "and",
                    conditions: [{
                        field: "disableflag",
                        value: {
                            firstvalue: "N",
                            secondvalue: null
                        },
                        oprtype: "=",
                        display: '',
                        datatype: '1'
                    }, {
                        field: "paymentstatus",
                        oprtype: "in",
                        value: {
                            firstvalue: querystatus,
                            secondvalue: null
                        },
                        logic: "or",
                        conditions: [{
                            field: "backimpawnstatus",
                            oprtype: "in",
                            value: {
                                firstvalue: querystatus,
                                secondvalue: null
                            }
                        }]
                    }]
                };
            }

            //额度申请的待委托办理页签需要是审批通过(vbillstatus=1)的，并且是待委托办理(busistatus=1)
            if (this.state.activeTab.indexOf("36180QADWT") >= 0) {
                searchdata.custcondition = {
                    logic: "and",
                    conditions: [{
                        field: "vbillstatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "1"
                            //secondvalue: null
                        }
                    }, {
                        field: "busistatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "1"
                            //secondvalue: null
                        }
                    }]
                };
                var IS36180QADWT = { 'IS36180QADWT': true };
                searchdata.userdefObj = IS36180QADWT;
            }
            //待委托办理页签需要是审批通过(vbillstatus=1)的，并且是待委托办理(busistatus=1)
            if (this.state.activeTab.indexOf("sub") >= 0) {
                searchdata.custcondition = {
                    logic: "and",
                    conditions: [{
                        field: "vbillstatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "1"
                            //secondvalue: null
                        }
                    }, {
                        field: "busistatus",
                        oprtype: "=",
                        value: {
                            firstvalue: "1"
                            //secondvalue: null
                        }
                    }]
                };
                var sub = { 'sub': true };
                searchdata.userdefObj = sub;
            }
        }

        console.log("searchdata", searchdata);
        (0, _ncLightappFront.ajax)({
            url: this.API_URL.queryList,
            data: searchdata,
            success: function success(res) {
                var success = res.success,
                    data = res.data;

                if (success) {
                    if (data && data.grid && data.grid[_this.tableId].pageInfo.total > 0) {
                        (0, _ncLightappFront.toast)({
                            color: "success",
                            content: _this.state.json["fbmpublic-000016"]

                        }); /* 国际化处理： 查询成功*/
                        _this.props.table.setAllTableData(_this.tableId, data.grid[_this.tableId]);
                    } else {
                        // 提示语需要查询一下全部页签有没有
                        var has = false;
                        if (data.groupData && JSON.stringify(data.groupData) != "{}") {
                            Object.keys(data.groupData).forEach(function (key) {
                                if (data.groupData[key] !== "0") {
                                    has = true;
                                    return;
                                }
                            });
                        }
                        if (has) {
                            (0, _ncLightappFront.toast)({
                                color: "success",
                                content: _this.state.json["fbmpublic-000016"]
                            }); /* 国际化处理： 查询成功*/
                        } else {
                            (0, _ncLightappFront.toast)({
                                color: "warning",
                                content: _this.state.json["fbmpublic-000017"]
                            }); /* 国际化处理： 未查询出符合条件的数据！*/
                        }
                        _this.props.table.setAllTableData(_this.tableId, {
                            rows: []
                        });
                    }
                    _this.queryListCallback && _this.queryListCallback(res);
                    _page.toggleListHeadBtnDisabled.call(_this);
                }
            }
        });
    }
}

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
function pageInfoClick(props, config, pks) {
    var _this2 = this;

    (0, _ncLightappFront.ajax)({
        url: this.API_URL.queryListPks,
        data: { pks: pks, pageCode: this.pageId },
        success: function success(res) {
            _page.listRender.call(_this2, res);
        },
        error: function error(res) {
            (0, _ncLightappFront.toast)({ color: "danger", content: res.message });
            _page.listRender.call(_this2, { success: false });
        }
    });
}

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonClick = buttonClick;

var _ncLightappFront = __webpack_require__(1);

var _container = __webpack_require__(4);

var _index = __webpack_require__(10);

function buttonClick(props, id) {
    var _this = this;

    // const langData = this.props.MultiInit.getLangData(MODULE_ID);
    var selectDatas = props.table.getCheckedRows(this.tableId);
    var pks = selectDatas && selectDatas.map(function (item) {
        return item.data.values[_this.primaryId].value;
    });
    var pkMapTs = new Map();
    var pkMapRowIndex = new Map();
    selectDatas && selectDatas.map(function (item) {
        var pk = item.data.values[_this.primaryId].value;
        var ts = item.data.values["ts"] && item.data.values["ts"].value;
        var index = item.index;
        //主键与tsMap
        if (pk && ts) {
            pkMapTs.set(pk, ts);
        }
        pkMapRowIndex.set(pk, index);
    });
    switch (id) {
        //头部 新增
        case "Add":
            _container.list.listAdd.call(this);
            break;
        //头部 参照上游生成
        case 'AddFrom':
            var deleteCache = this.props.transferTable.deleteCache;

            deleteCache(this.tdataSource);
            props.pushTo('/ref21', {
                pagecode: this.pageId,
                destTradetype: this.billtype
            });
            break;
        //头部 删除
        case "Delete":
            var deleteMsg = this.state.json["fbmpublic-000013"]; //统一用13号提示语，付利利定的，不管选择几条
            // selectDatas.length > 1
            //     ? this.state.json["fbmpublic-000013"]
            //     : this.state.json[
            //           "fbmpublic-000001"
            //       ]; /* 国际化处理： 确定要删除所选数据吗？,确定删除吗？*/ /* 国际化处理： 确定要删除所选数据吗？,确定删除吗？*/
            (0, _ncLightappFront.promptBox)({
                color: "warning",
                title: this.state.json["fbmpublic-000000"] /* 国际化处理： 删除*/ /* 国际化处理： 删除*/
                , content: deleteMsg,
                beSureBtnClick: function beSureBtnClick() {
                    _container.list.listDelete.call(_this, {
                        isMulti: true,
                        data: { pks: pks, pkMapTs: pkMapTs, pkMapRowIndex: pkMapRowIndex }
                    });
                }
            });
            break;
        //经办
        case "Handle":
            if (_container.list.checkSelected.call(this, "one")) {
                var info = window.parent.GETBUSINESSINFO();
                props.pushTo("/card", {
                    status: "handle",
                    id: pks[0],
                    // pagecode: this.pageId,
                    context: info,
                    pagecode: this.cardPageCode
                });
            }
            break;
        //维护
        case "Mainten":
            if (_container.list.checkSelected.call(this, "one")) {
                props.pushTo("/card", {
                    status: "mainten",
                    id: pks[0],
                    pagecode: this.cardPageCode
                });
            }
            break;
        //复制
        case "Copy":
            // if (list.checkSelected.call(this, 'one')) {
            props.pushTo("/card", {
                status: "copy",
                id: pks[0],
                pagecode: this.cardPageCode
            });
            // }
            break;
        //提交
        case "Commit":
            _container.list.listCommit.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        //收回
        case "Uncommit":
            _container.list.listUncommit.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        //头部 打印
        case "Print":
            _container.list.listPrint.call(this, pks);
            break;
        //头部 打印清单
        case "PrintList":
            _container.list.listPrintList.call(this, pks);
            break;
        // 正式打印
        case 'OffiPrint':
            (0, _index.elecSignListPrint)(this.props, {
                url: this.props.constant.API_URL.elecsignprint,
                offical: true,
                appCode: this.props.constant.appcode,
                nodeKey: 'OFFICIAL', //打印模板
                tableCode: 'table', //区域
                field_id: this.primaryId, //主键
                field_billno: 'vbillno', //由列表跳转到卡片的字段
                getOrgFunc: function getOrgFunc() {
                    var pk_org = selectDatas[0].data.values["pk_org"] && selectDatas[0].data.values["pk_org"].value;
                    return pk_org;
                }
            });
            break;
        // 补充打印
        case 'InOffiPrint':
            (0, _index.elecSignListPrint)(this.props, {
                url: this.props.constant.API_URL.elecsignprint,
                offical: false,
                appCode: this.props.constant.appcode,
                nodeKey: 'INOFFICIAL', //打印模板
                tableCode: 'table', //区域
                field_id: this.primaryId, //主键
                field_billno: 'vbillno', //由列表跳转到卡片的字段
                getOrgFunc: function getOrgFunc() {
                    var pk_org = selectDatas[0].data.values["pk_org"] && selectDatas[0].data.values["pk_org"].value;
                    return pk_org;
                }
            });
            break;
        //头部 输出
        case "Output":
            _container.list.listOutput.call(this, pks);
            break;
        //导出数据
        case "ExportData":
            doDataExport.call(this, props);
            break;
        // 导出模板
        case "ExportExcel":
            doExcelExport.call(this, props);
            break;
        //头部 附件
        case "Attachment":
            var billId = selectDatas[0] && selectDatas[0].data.values[this.primaryId].value;
            var billNo = selectDatas[0] && selectDatas[0].data.values[this.billNo].value;
            _container.list.listFileMgr.call(this, billId, billNo);
            break;
        //头部 刷新
        case "Refresh":
            _container.list.listRefresh.call(this);
            break;
        //联查 授信额度
        case "CreditAmount":
            if (_container.list.checkSelected.call(this, false)) {
                var balanceinfo = {
                    pk_protocol: selectDatas[0] && selectDatas[0].data.values["ccno"] && selectDatas[0].data.values["ccno"].value,
                    pk_currtype: selectDatas[0] && selectDatas[0].data.values["pk_cccurrtype"] && selectDatas[0].data.values["pk_cccurrtype"].value,
                    pk_org: selectDatas[0] && selectDatas[0].data.values["pk_org"] && selectDatas[0].data.values["pk_org"].value,
                    credittype: selectDatas[0] && selectDatas[0].data.values["pk_cctype"] && selectDatas[0].data.values["pk_cctype"].value,
                    pk_bankdoc: selectDatas[0] && selectDatas[0].data.values["ccbank"] && selectDatas[0].data.values["ccbank"].value
                };
                _container.common.linkCredit.call(this, balanceinfo);
            }
            break;
        //联查 审批详情
        case "ApproveDetail":
            if (_container.list.checkSelected.call(this, false)) {
                // 控制联查第一条，不控制选择一条
                _container.common.linkApproveDetail.call(this, pks[0]);
            }
            break;
        //联查 资金计划
        case "FundPlan":
            if (_container.list.checkSelected.call(this, false)) {
                _container.common.linkNtb.call(this, pks[0]);
            }
            break;
        //联查 凭证
        case "Voucher":
            var voucherArr = [];
            if (_container.list.checkSelected.call(this)) {
                if (!selectDatas[0].data.values["voucher"].value) {
                    (0, _ncLightappFront.toast)({
                        color: "warning",
                        content: this.state.json["fbmpublic-000050"] /* 国际化处理： 未查到凭证*/
                    });
                    return;
                }
                // 其他单据的联查凭证，与上面隔离，不知道上面的为什么这么做
                //selectDatas.map(val => { 只联查一个凭证
                var Values = selectDatas[0].data.values;
                voucherArr.push({
                    pk_billtype: this.billtype,
                    pk_group: Values.pk_group && Values.pk_group.value,
                    pk_org: Values.pk_org && Values.pk_org.value,
                    relationID: Values[this.primaryId] && Values[this.primaryId].value
                });
                // });
                _container.common.linkVoucher.call(this, voucherArr);
            }
            break;
        //联查 账户余额
        case "Balance":
            var balanceData = [{
                pk_org: selectDatas[0].data.values["pk_org"] && selectDatas[0].data.values["pk_org"].value,
                pk_account: selectDatas[0].data.values[this.fields.issueAccount] && selectDatas[0].data.values[this.fields.issueAccount].value
            }];
            if (_container.list.checkSelected.call(this, false)) {
                _container.common.linkBankBalance.call(this, balanceData);
            }
            break;
        // 联查计划预算
        case "LinkBudgetPlan":
            if (!this.fullAggClassName) {
                /* 国际化处理： 全路径类名错误，请检查！*/
                (0, _ncLightappFront.toast)({
                    color: "warning",
                    content: this.state.json["fbmpublic-000014"] + this.fullAggClassName
                });
                return;
            }
            if (_container.list.checkSelected.call(this, false)) {
                _container.common.linkNtb.call(this, pks[0]);
            }
            break;
        // 联查票据台账
        case "LinkSDBook":
            if (_container.list.checkSelected.call(this, false)) {
                var pk_register = selectDatas[0].data.values["pk_register"].value;
                _container.common.linkLinkSDBook.call(this, pk_register);
            }
            break;
        // 联查 担保合同
        case "Guarantee":
            if (_container.list.checkSelected.call(this, false)) {
                var impawnmode = selectDatas[0].data.values["impawnmode"] && selectDatas[0].data.values["impawnmode"].value;
                // 票据池或信用
                if (impawnmode === "BILLPOOL" || impawnmode === "CREDIT") {
                    /* 国际化处理：单据没有使用担保合同，无法联查担保*/
                    (0, _ncLightappFront.toast)({
                        color: "warning",
                        content: this.state.json["fbmpublic-000081"]
                    });
                    return;
                }
                var _pk_register = selectDatas[0].data.values["pk_register"] && selectDatas[0].data.values["pk_register"].value;
                props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/list", {
                    billtype: "36W2",
                    pagecode: "36620GCL_LIST",
                    scene: "linksce",
                    sence: "4",
                    id: _pk_register
                });
            }
            break;
        // 核销
        case "Destroy":
            /* 国际化处理： 核销为不可逆操作，是否核销？*/
            var destroyMsg = this.state.json["fbmpublic-000078"];
            (0, _ncLightappFront.promptBox)({
                color: "warning",
                /* 国际化处理：核销*/
                title: this.state.json["fbmpublic-000077"],
                content: destroyMsg,
                beSureBtnClick: function beSureBtnClick() {
                    _container.list.listDestroy.call(_this, {
                        isMulti: true,
                        data: { pks: pks, pkMapTs: pkMapTs }
                    });
                }
            });

            break;
        //制证
        case "MakeVoucher":
            if (selectDatas && selectDatas.length > 1 && this.pageId == "36180PDT_LIST") {
                (0, _ncLightappFront.toast)({
                    color: "info",
                    content: this.state.json["fbmpublic-000085"] /* 国际化处理： 请选择一条数据*/
                });
                return;
            }
            _container.list.listMakeVoucher.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        //取消制证
        case "CancelVoucher":
            if (selectDatas && selectDatas.length > 1 && this.pageId == "36180PDT_LIST") {
                (0, _ncLightappFront.toast)({
                    color: "info",
                    content: this.state.json["fbmpublic-000085"] /* 国际化处理： 请选择一条数据*/
                });
                return;
            }
            _container.list.listCancelVoucher.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        // 取消作废
        case "CancelInvalid":
            _container.list.listCancelInvalid.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        // 退回
        case "Return":
            this.setState({
                returnComShow: !this.state.returnComShow,
                disabledData: {
                    pks: pks,
                    pkMapTs: pkMapTs,
                    pkMapRowIndex: pkMapRowIndex
                }
            }, function () {
                _this.props.form.setFormStatus(_this.returnReason, "edit");
            });
            break;
        // 作废
        case "Disabled":
        case "consignBankDisable":
            this.setState({
                disabledComShow: !this.state.disabledComShow,
                disabledData: {
                    pks: pks,
                    pkMapTs: pkMapTs
                }
            }, function () {
                _this.props.form.setFormStatus(_this.disableReason, "edit");
            });
            break;
        case "Invalid":
            this.setState({
                disabledComShow: !this.state.disabledComShow,
                disabledData: {
                    pks: pks,
                    pkMapTs: pkMapTs
                }
            }, function () {
                _this.props.form.setFormStatus(_this.disableReason, "edit");
            });
            break;
        // 取消作废
        case "CancelDisabled":
        case "consignCancelDisable":
            _container.list.listCancelInvalid.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        // 发送指令
        case "SendInstruction":
            _container.list.listSendInstruction.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        // 收回指令
        case "CancelInstruction":
            _container.list.listCancelInstruction.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        //下面两个是额度管理的指令
        // 额度申请
        case "RequestList":
            if (_container.list.checkSelected.call(this, false)) {
                var pk_srcbill = selectDatas && selectDatas.map(function (item) {
                    return item.data.values["pk_srcbill"].value;
                });
                _container.common.linkQuotaApply.call(this, pk_srcbill[0]);
            }
            break;
        // 单位下拨可用额度
        case "UnitQuota":
            if (_container.list.checkSelected.call(this, false)) {
                var unitQuotapk = selectDatas[0].data.values[this.primaryId].value;
                _container.common.linkUnitQuota.call(this, unitQuotapk);
            }
            break;
        // 额度上收
        case "Upquota":
            if (_container.list.checkSelected.call(this, false)) {
                _container.common.linkUpquota.call(this, pks);
            }
            break;
        // 额度下拨
        case "Downquota":
            _container.list.listDownquota.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        //下面三个是票据退票操作
        // 冲销
        case "Transform":
            _container.list.listTransform.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        // 取消冲销
        case "CancelTransform":
            _container.list.listCancelTransform.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        //下面三个是票据质押、池内质押的指令
        // 解除质押
        case "ImpawnBackInstr":
            (0, _ncLightappFront.promptBox)({
                color: "warning",
                title: this.state.json["fbmpublic-000082"] /* 国际化处理： 确定要解除质押吗*/
                , beSureBtnClick: function beSureBtnClick() {
                    _this.setState({
                        impawnbackComShow: !_this.state.impawnbackComShow
                    }, function () {
                        _this.props.form.setFormStatus(_this.impawnbackAreaCode, "edit");
                        // 获取第一条选中行 pk_org
                        var selectDataPk_org = selectDatas[0].data.values.pk_org.value;
                        // 设置质押回收人参照按财务组织过滤
                        var meta = _this.props.meta.getMeta();
                        meta[_this.impawnbackAreaCode].items = meta[_this.impawnbackAreaCode].items.map(function (item) {
                            if (item.attrcode === "impawnbackpersonid") {
                                item.queryCondition = function () {
                                    return {
                                        pk_org: selectDataPk_org
                                    };
                                };
                            }
                            return item;
                        });
                        _this.props.meta.setMeta(meta);
                    });
                }
            });
            break;
        // 取消收回
        case "CancelImpawnBack":
            _container.list.cancelImpawnBack.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        //质押/质押收回撤回
        case "WithdrawImpawn":
            _container.list.withdrawImpawn.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        //解除质押签收
        case "ImpawnBackSign":
            _container.list.impawnBackSign.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;

        // 受理
        case "Accept":
            _container.list.listAccept.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;

        // 取消受理
        case "UnAccept":
            _container.list.listUnAccept.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        // 委托办理
        case "Commission":
            _container.list.listCommission.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        // 跳转到票据签发
        case "SignLink":
            if (selectDatas.length > 1) {
                /* 国际化处理： 请选择单条数据操作！*/
                (0, _ncLightappFront.toast)({
                    color: "warning",
                    content: this.state.json["fbmpublic-000092"]
                });
                return;
            }
            _container.common.signLink.call(this, pks[0]);
            break;
        // 联查开票申请单
        case "SignApplyLink":
            if (_container.list.checkSelected.call(this, false)) {
                var signApplyPk = selectDatas[0].data.values["pk_signapply"] && selectDatas[0].data.values["pk_signapply"].value;
                _container.common.signApplyLink.call(this, signApplyPk);
            }
            break;

        // 联查票据签发单
        case "SignBillLink":
            if (_container.list.checkSelected.call(this, false)) {
                _container.common.SignBillLink.call(this, pks[0]);
            }
            break;

        // 联查票据付款单
        case "AcceptBillLink":
            if (_container.list.checkSelected.call(this, false)) {
                var pk_accept = selectDatas[0].data.values["pk_srcbill"] && selectDatas[0].data.values["pk_srcbill"].value;
                _container.common.acceptLink.call(this, pk_accept);
            }
            break;

        // 联查应付票据贴现单
        case "BuyerDiscountBillLink":
            if (_container.list.checkSelected.call(this, false)) {
                var pk_buyerdiscount = selectDatas[0].data.values["pk_srcbill"] && selectDatas[0].data.values["pk_srcbill"].value;
                _container.common.buyerDiscountLink.call(this, pk_buyerdiscount);
            }
            break;

        // 联查票据签发单
        case "RegisterBillLink":
            if (_container.list.checkSelected.call(this, false)) {
                var registerPK = selectDatas[0].data.values["pk_parent"] && selectDatas[0].data.values["pk_parent"].value;
                _container.common.registerLink.call(this, registerPK);
            }
            break;

        // 取消委托办理
        case "CommissionCancel":
            _container.list.listUnCommission.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        // 贴现办理
        case "discountTransact":
            if (selectDatas && selectDatas.length > 1) {
                (0, _ncLightappFront.toast)({
                    color: "info",
                    content: this.state.json["fbmpublic-000015"] /* 国际化处理： 请选择一条数据*/
                });
                return;
            }
            if (_container.list.checkSelected.call(this, false)) {
                var pk_discount = selectDatas[0].data.values["pk_discount"].value;
                var pk_billtypecode = selectDatas[0].data.values["pk_billtypecode"];
                _container.common.discountTransact.call(this, pk_discount, pk_billtypecode);
            }
            break;
        //联查应付票据贴现
        case "BuyerDiscount":
            if (_container.list.checkSelected.call(this, false)) {
                var returnpk = selectDatas[0].data.values[this.primaryId].value;
                _container.common.linkBuyerDiscount.call(this, returnpk);
            }
            break;
        //联查内部结算账户
        case "LinkInnerAccount":
            if (_container.list.checkSelected.call(this, false)) {
                var accpk = selectDatas[0].data.values[this.pk_inbalaacc] && selectDatas[0].data.values[this.pk_inbalaacc].value;
                _container.common.linkInnerAccount.call(this, accpk);
            }
            break;
        //联查内部保证金账户
        case "LQueryInSecurityAcc":
            if (_container.list.checkSelected.call(this, false)) {
                var _accpk = selectDatas[0].data.values[this.pk_insecurityacc] && selectDatas[0].data.values[this.pk_insecurityacc].value;
                _container.common.linkInnerAccount.call(this, _accpk);
            }
            break;
        // 记账
        case "Tally":
            this.setState({
                tallyComShow: !this.state.tallyComShow,
                disabledData: {
                    pks: pks,
                    pkMapTs: pkMapTs
                }
            }, function () {
                _this.props.form.setFormStatus(_this.tallyPlan, "edit");
            });
            break;
        // 取消记账
        case "CancelTally":
            _container.list.listCancelTally.call(this, {
                isMulti: true,
                data: { pks: pks, pkMapTs: pkMapTs }
            });
            break;
        //联查收付单据
        case "LinkReceAndPaybill":
            if (_container.list.checkSelected.call(this, false)) {
                var primaryId = selectDatas[0].data.values[this.primaryId];
                var vbillno = selectDatas[0].data.values["vbillno"];
                var _pk_register2 = selectDatas[0].data.values["pk_register"];
                var pk_group = selectDatas[0].data.values["pk_group"];
                _container.common.linkReceAndPaybill.call(this, primaryId && primaryId.value, vbillno && vbillno.value, _pk_register2 && _pk_register2.value, pk_group && pk_group.value);
            }
            break;
        default:
            break;
    }
}

/**
 * 数据导出
 * @param {} props
 */
//列表头部按钮操作
function doDataExport(props) {
    var _this2 = this;

    var selectData = props.editTable.getCheckedRows(this.tableId);
    if (selectData && selectData.length == 0) {
        (0, _ncLightappFront.toast)({
            color: "info",
            content: this.state.json["fbmpublic-000015"] /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    var seleckpks = [];
    selectData.forEach(function (e) {
        seleckpks.push(e.data.values[_this2.primaryId].value);
    });

    if (seleckpks.length > 0) {
        this.selectedPKS = seleckpks;
    }
    props.modal.show("exportFileModal"); //不需要导出的只执行这行代码
}

/**
 * 模板导出
 * @param {} props
 */
function doExcelExport(props) {
    this.selectedPKS = [];
    props.modal.show("exportFileModal"); //不需要导出的只执行这行代码
}

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectedEvent = selectedEvent;

var _page = __webpack_require__(3);

//单选
function selectedEvent(props, moduleId, record, index, status) {
    _page.toggleListHeadBtnDisabled.call(this);
}

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bodyButtonClick = bodyButtonClick;

var _container = __webpack_require__(4);

var _ncLightappFront = __webpack_require__(1);

//列表操作列按钮操作
function bodyButtonClick(key, record, index) {
  var _this = this;

  var pk = record[this.primaryId] && record[this.primaryId].value;
  var ts = record["ts"] && record["ts"].value;
  var pkMapTs = new Map();
  //主键与tsMap
  if (pk && ts) {
    pkMapTs.set(pk, ts);
  }
  switch (key) {
    //经办
    case "HandleInner":
      _container.list.listHandle.call(this, pk);
      break;
    //修改
    case "EditInner":
      _container.list.listEdit.call(this, pk);
      break;
    //删除
    case "DeleteInner":
      _container.list.listDelete.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //提交
    case "CommitInner":
      _container.list.listCommit.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //收回
    case "UnCommitInner":
      _container.list.listUncommit.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //终止
    case "terminate":
      _container.list.listTerminate.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //制证
    case "MakeVoucherInner":
      _container.list.listMakeVoucher.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //取消制证
    case "CancelVoucherInner":
      _container.list.listCancelVoucher.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //作废
    case "DisabledInner":
    case "consignBankDisableInner":
      this.setState({
        disabledComShow: !this.state.disabledComShow,
        disabledData: {
          pks: [pk],
          pkMapTs: pkMapTs
        },
        index: index
      }, function () {
        _this.props.form.setFormStatus(_this.disableReason, "edit");
      });
      break;
    //取消作废
    case "CancelDisabledInner":
    case "consignCancelDisableInner":
      _container.list.listCancelInvalid.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    // 确认收妥
    case "BeSureOrderInner":
      this.setState({
        confirmreceiptComShow: !this.state.confirmreceiptComShow,
        confirmreceiptData: {
          pks: [pk],
          pkMapTs: pkMapTs
        },
        index: index
      }, function () {
        _this.props.form.setFormStatus(_this.confirmreceipt, "edit");
      });
      break;
    // 取消确认
    case "UnBeSureOrderInner":
      _container.list.listUnconfirmreceipt.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    // 发送指令
    case "CommandInner":
      _container.list.listSendInstruction.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    // 收回指令
    case "CancelCommandInner":
      _container.list.listCancelInstruction.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //下面是应收票据退票所属按钮
    // 冲销
    case "Transform":
      _container.list.listTransform.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    // 取消冲销
    case "CancelTransform":
      _container.list.listCancelTransform.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    // 冲销
    case "TransformInner":
      _container.list.listTransform.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    // 取消冲销
    case "CancelTransformInner":
      _container.list.listCancelTransform.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //下面是应付票据贴现回单操作
    // 记账
    case "TallyInner":
      this.setState({
        tallyComShow: !this.state.tallyComShow,
        disabledData: {
          pks: [pk],
          pkMapTs: pkMapTs,
          index: index
        },
        index: index
      }, function () {
        _this.props.form.setFormStatus(_this.tallyPlan, "edit");
        // 开票计划项目按财务组织过滤
        var meta = _this.props.meta.getMeta();
        meta[_this.tallyPlan].items = meta[_this.tallyPlan].items.map(function (item) {
          if (item.attrcode === "invoiceplanitem") {
            item.queryCondition = function () {
              return {
                pk_org: record.pk_org.value
              };
            };
          }
          //记账：利息计划项目，收入项目
          if (item.attrcode == "interestplanitem") {
            item.queryCondition = function () {
              return {
                pk_org: record.pk_org.value
              };
            };
          }
          //记账：手续费计划项目，收入项目
          if (item.attrcode == "chargeplanitem") {
            item.queryCondition = function () {
              return {
                pk_org: record.pk_org.value
              };
            };
          }
          //记账：承兑计划项目
          if (item.attrcode == "acceptplanitem") {
            item.queryCondition = function () {
              return {
                pk_org: record.pk_org.value
              };
            };
          }
          return item;
        });
        _this.props.meta.setMeta(meta);
      });
      break;
    // 取消记账
    case "CancelTallyInner":
      _container.list.listCancelTally.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //下面是票据质押、池内质押的指令
    // 解除质押
    case "ImpawnBackInstrInner":
      (0, _ncLightappFront.promptBox)({
        color: "warning",
        title: this.state.json["fbmpublic-000082"] /* 国际化处理： 确定要解除质押吗*/
        , beSureBtnClick: function beSureBtnClick() {
          _this.setState({
            impawnbackComShow: !_this.state.impawnbackComShow,
            disabledData: {
              pks: [pk],
              pkMapTs: pkMapTs,
              index: index
            },
            index: index
          }, function () {
            // 设置当前区域可编辑
            _this.props.form.setFormStatus(_this.impawnbackAreaCode, "edit");
            // 设置质押回收人参照按财务组织过滤
            var meta = _this.props.meta.getMeta();
            meta[_this.impawnbackAreaCode].items = meta[_this.impawnbackAreaCode].items.map(function (item) {
              if (item.attrcode === "impawnbackpersonid") {
                item.queryCondition = function () {
                  return {
                    pk_org: record.pk_org.value
                  };
                };
              }
              return item;
            });
            _this.props.meta.setMeta(meta);
          });
        }
      });
      break;
    //  取消收回
    case "CancelImpawnBackInner":
      _container.list.cancelImpawnBack.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //质押/质押收回撤回
    case "WithdrawImpawnInner":
      _container.list.withdrawImpawn.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    //解除质押签收
    case "ImpawnBackSignInner":
      _container.list.impawnBackSign.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;

    // 受理
    case "AcceptInner":
      _container.list.listAccept.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;

    // 取消受理
    case "UnAcceptInner":
      _container.list.listUnAccept.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;

    // 跳转到票据签发
    case "SignLinkInner":
      _container.common.signLink.call(this, pk);
      break;

    // 委托办理
    case "CommissionInner":
      // list.doBodyCommission.call(this,this.props,record,index);
      _container.list.listCommission.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    // 取消委托办理
    case "CommissionCancelInner":
      _container.list.listUnCommission.call(this, {
        data: { pks: [pk], pkMapTs: pkMapTs },
        index: index
      });
      break;
    // 退回
    case "ReturnInner":
      this.setState({
        returnComShow: !this.state.returnComShow,
        disabledData: {
          pks: [pk],
          pkMapTs: pkMapTs,
          index: index
        },
        index: index
      }, function () {
        _this.props.form.setFormStatus(_this.returnReason, "edit");
      });
      break;
    // 贴现办理
    case "discountTransactInner":
      var pk_billtypecode = record["pk_billtypecode"];
      _container.common.discountTransact.call(this, pk, pk_billtypecode);
      break;
    default:
      break;
  }
}

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(193);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* 
 应付票据贴现常量
 created by：xiezhp 2019-11-5
 update: 
*/
//模块名称
var modelname = exports.modelname = 'fbm';
//小应用编码
var app_code = exports.app_code = '36180PDT';
//联查小应用编码
var link_app_code = exports.link_app_code = '36180PDT';
//审批小应用编码
var approve_app_code = exports.approve_app_code = '36180PDTA';
//请求基础路径
var base_path = exports.base_path = '/nccloud/fbm/buyerdiscount';
//按钮平铺显示数量
var button_limit = exports.button_limit = 3;
//打印输出编码
var nodekey = exports.nodekey = '36180PDT_02';

var module_id = exports.module_id = '36180PDT';
//单据类型
var billtype = exports.billtype = '36HV';
// 业务对应表名，修改按钮点击时用来saga校验
var tableName = exports.tableName = 'fbm_buyerdiscount';
var fullAggClassName = exports.fullAggClassName = 'nc.vo.fbm.buyerdiscount.AggBuyerDiscountVO';
/**
 * 列表
 */
var LIST = exports.LIST = {
  disabled_btn: ['Delete', 'Copy', 'Commit', 'Uncommit', 'Attachment', 'Print', 'MakeVoucher', 'CancelVoucher', 'ApproveDetail', 'Voucher', 'LinkBudgetPlan', 'LinkInnerAccount', 'LinkVoucher', 'LinkPlan', 'InnerAccount'], //默认禁用按钮
  page_id: '36180PDT_LIST', //页面编码
  page_id_link: '36180PDTL_LIST', //联查页面编码
  app_code: '36180PDT', //应用编码
  search_id: 'search', //查询区域编码
  table_id: 'table', //表格区域编码
  head_btn_code: 'list_head', //表头按钮区域
  search_oid: '1001Z61000000000I9G0', //查询区域oid
  primary_id: 'pk_buyerdiscount', //列表页面主键
  billno: 'vbillno', //单据编号
  billstatus: 'vbillstatus' //审批状态


  /**
   * 卡片
   */
};var CARD = exports.CARD = {
  primary_id: 'pk_buyerdiscount', //表头主键
  billno: 'vbillno', //单据编号
  page_id: '36180PDT_CARD', //页面编码
  page_id_link: '36180PDTL_CARD', //联查页面编码
  page_id_approve: '36180PDTA_CARD', //审批页面编码
  form_id: 'head', //表头表单编码
  head_btn_code: 'card_head', //表头按钮区域
  shoulder_btn_code: 'tabs_head', //tab区域肩部区域按钮code------[好像没有用到]
  body_btn_code: 'tabs_body' //tab区域表格区域按钮code------[好像没有用到]

  //缓存标示
};var DATA_SOURCE = exports.DATA_SOURCE = 'tm.fbm.buyerdiscount.datasource';

//查询区域缓存
var searchCache = exports.searchCache = {
  key: 'fbm.fbm.buyerdiscount.searchCache', //查询区域缓存Key
  dataSource: 'fbm.fbm.buyerdiscount.searchSpace' //查询区域缓存数据的名称空间


  //接口地址
};var API_URL = exports.API_URL = {
  save: base_path + '/save.do', //保存
  delete: base_path + '/delete.do', //删除
  queryCard: base_path + '/querycard.do', //卡片查询
  queryList: base_path + '/querylist.do', //列表查询
  queryListPks: base_path + '/querypage.do', //列表分页查询
  commit: base_path + '/commit.do', //提交
  saveCommit: base_path + '/savecommit.do', //保存提交
  uncommit: base_path + '/uncommit.do', //收回
  print: base_path + '/print.do', //打印
  afterEvent: base_path + '/cardeditafter.do', //卡片编辑后事件
  copyCard: base_path + '/copy.do', //复制
  makeVoucher: base_path + '/makeVoucher.do', //制证
  cancelVoucher: base_path + '/cancelVoucher.do', //取消制证
  linkVoucher: base_path + '/linkVoucher.do', //联查凭证
  ntbLink: base_path + '/ntbLink.do', //预算反联查
  voucherlink: base_path + '/voucherlink.do' //凭证联查单据


  /** 列表 按钮 */
};var BTN_GROUP = exports.BTN_GROUP = {
  // 编辑按钮组
  ADD: "Add",
  DELETE: "Delete",
  COPY: "Copy",

  //提交
  COMMIT: "Commit",
  UNCOMMIT: "Uncommit",

  // 制证
  MAKE_VOUCHER: "MakeVoucher",
  VOUCHER_CANCEL: "CancelVoucher",

  // 联查
  LINKGROUP: "LinkGroup",
  LINK_APPROVE: "ApproveDetail",
  LINK_VOUCHER: "Voucher",
  LINK_INNERACCOUNT: "LinkInnerAccount",
  LINK_PLAN: "LinkBudgetPlan",

  //附件 打印 输出
  ATTACHMENT: "Attachment",
  PRINTGROUP: "PrintGroup",
  PRINT: "Print",
  OUTPUT: "Output",
  REFRESH: "Refresh"
};
/** 卡片 按钮 */
var BTN_CARD = exports.BTN_CARD = {
  // 编辑按钮组
  ADD: "Add",
  EDIT: "Edit",
  DELETE: "Delete",
  COPY: "Copy",

  // 保存按钮组
  SAVE: "Save",
  SAVE_ADD: "SaveAdd",
  SAVE_COMMIT: "SaveCommit",
  CANCEL: "Cancel",

  //提交
  COMMIT: "Commit",
  UNCOMMIT: "Uncommit",

  // 制证
  MAKE_VOUCHER: "MakeVoucher",
  VOUCHER_CANCEL: "CancelVoucher",

  // 联查
  LINKGROUP: "LinkGroup",
  LINK_APPROVE: "ApproveDetail",
  LINK_VOUCHER: "Voucher",
  LINK_INNERACCOUNT: "LinkInnerAccount",
  LINK_PLAN: "LinkBudgetPlan",

  //附件 打印 输出
  ATTACHMENT: "Attachment",
  PRINTGROUP: "PrintGroup",
  PRINT: "Print",
  OUTPUT: "Output",
  REFRESH: "Refresh"
};

/***/ }),
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListData = exports.selectedEvent = exports.pageInfoClick = exports.bodyBtnOperation = exports.buttonClick = exports.initTemplate1 = exports.initTemplate = exports.searchBtnClick = exports.bodyButtonClick = undefined;

var _initTemplate = __webpack_require__(422);

var _initTemplate2 = _interopRequireDefault(_initTemplate);

var _initTemplate3 = __webpack_require__(423);

var _initTemplate4 = _interopRequireDefault(_initTemplate3);

var _events = __webpack_require__(177);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.bodyButtonClick = _events.bodyButtonClick;
exports.searchBtnClick = _events.searchBtnClick;
exports.initTemplate = _initTemplate2.default;
exports.initTemplate1 = _initTemplate4.default;
exports.buttonClick = _events.buttonClick;
exports.bodyBtnOperation = _events.bodyBtnOperation;
exports.pageInfoClick = _events.pageInfoClick;
exports.selectedEvent = _events.selectedEvent;
exports.getListData = _events.getListData;

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buttonVisiable = buttonVisiable;

var _constant = __webpack_require__(213);

// import { selectedEvent } from "./index";
function buttonVisiable(props) {
  // selectedEvent.call(this);
  var checkRows = props.table.getCheckedRows(_constant.LIST.table_id);

  var allBtn = [];
  for (var value in _constant.BTN_GROUP) {
    allBtn.push(_constant.BTN_GROUP[value]);
  }

  if (!checkRows || checkRows.length == 0) {
    props.button.setButtonDisabled(allBtn, true);
    props.button.setButtonDisabled([_constant.BTN_GROUP.ADD, _constant.BTN_GROUP.REFRESH], false);
    return;
  }
  // 先释放所有字段编辑性 然后根据情况 禁用部分按钮
  props.button.setButtonDisabled(allBtn, false);
  var disableDelete = false;
  var disableCopy = false;
  var disableCommit = false;
  var disableUncommit = false;
  var disableMakeVoucher = false;
  var disableCancelVoucher = false;
  var disableLinkApprove = false;
  var disableLinkVoucher = false;
  if (!checkRows || checkRows.length == 1) {
    checkRows.forEach(function (e) {
      var billstatus = e.data.values.vbillstatus.value;
      var voucher = e.data.values.voucher.value;
      // 不是待提交 则不显示提交和 删除按钮
      if (billstatus != -1) {
        disableDelete = true;
        disableCommit = true;
      }
      // 待提交，则不显示收回、制证、取消制证按钮和联查审批详情按钮
      if (billstatus == -1) {
        disableUncommit = true;
        disableLinkApprove = true;
        disableMakeVoucher = true;
        disableCancelVoucher = true;
      }
      //未制证 则不显示联查凭证按钮
      if (!voucher) {
        disableCancelVoucher = true;
        disableLinkVoucher = true;
      }
      //已制证，制证按钮不显示
      if (voucher) {
        disableMakeVoucher = true;
      }
    });
  }
  props.button.setButtonDisabled(_constant.BTN_GROUP.DELETE, disableDelete);
  props.button.setButtonDisabled(_constant.BTN_GROUP.Copy, disableCopy);
  props.button.setButtonDisabled(_constant.BTN_GROUP.COMMIT, disableCommit);
  props.button.setButtonDisabled(_constant.BTN_GROUP.UNCOMMIT, disableUncommit);
  props.button.setButtonDisabled(_constant.BTN_GROUP.MAKE_VOUCHER, disableMakeVoucher);
  props.button.setButtonDisabled(_constant.BTN_GROUP.VOUCHER_CANCEL, disableCancelVoucher);
  props.button.setButtonDisabled(_constant.BTN_GROUP.LINK_APPROVE, disableLinkApprove);
  props.button.setButtonDisabled(_constant.BTN_GROUP.LINK_VOUCHER, disableLinkVoucher);
} /* 
   应付票据贴现列表头部按钮禁用状态
   created by：xiezhp 2019-11-5
   update: 
  */

/***/ }),
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */,
/* 381 */,
/* 382 */,
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ncLightappFront = __webpack_require__(1);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _BaseList = __webpack_require__(187);

var _BaseList2 = _interopRequireDefault(_BaseList);

var _constant = __webpack_require__(213);

var _events = __webpack_require__(279);

var _buttonVisiable = __webpack_require__(280);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                应付票据贴现列表页
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                created by：xiezhp 2019-11-5
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                update: 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

// import { initList } from "../../../public/container/page";


var List = function (_Component) {
  _inherits(List, _Component);

  function List(props) {
    _classCallCheck(this, List);

    var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

    _this.getInitTemplate = function () {
      var scene = _this.props.getUrlParam("scene");
      var pk_ntbparadimvo = _this.props.getUrlParam("pk_ntbparadimvo");
      if (pk_ntbparadimvo || scene === "linksce" || scene === "fip") {
        return _events.initTemplate1;
      } else {
        //预算反联查单据
        return _events.initTemplate;
      }
    };

    _this.tabChangeServal = function (status, callback) {
      var serval = {
        field: "vbillstatus",
        value: {
          firstvalue: status != "all" ? status : "-1,0,1,2,3",
          secondvalue: null
        },
        oprtype: status != "all" ? "=" : "in"
      };
      callback(serval);
      _buttonVisiable.buttonVisiable.call(_this, _this.props);
      return serval;
    };

    _this.myselectedEvent = function (props, moduleId, record, index, status) {
      _buttonVisiable.buttonVisiable.call(this, this.props);
    };

    _this.componentInitFinished = function () {
      // initList.call(this);
      _buttonVisiable.buttonVisiable.call(this, this.props);
    };

    _this.myRenderCompleteEvent = function () {
      var muti = this.props.MutiInit.getIntl(_constant.module_id); //this.moduleId
      var discountinterest = muti && muti.get("36180PDT-000008"); /* 国际化处理： 贴现利息*/
      var ddiscountdate = muti && muti.get("36180PDT-000011"); /* 国际化处理： 贴现日期*/
      var start = muti && muti.get("36180PDT-000009"); /* 国际化处理： 由*/
      var end = muti && muti.get("36180PDT-000010"); /* 国际化处理： 至*/
      this.props.search.setTemlateByField(this.searchId, "discountinterest", "defaultPlaceholder", { start: discountinterest + start, end: discountinterest + end });
      this.props.search.setTemlateByField(this.searchId, "ddiscountdate", "defaultPlaceholder", { start: ddiscountdate + start, end: ddiscountdate + end });
      this.renderCompleteEvent();
    };

    _this.API_URL = _constant.API_URL;
    _this.state = {
      json: {},
      inlt: null
    };
    return _this;
  }

  _createClass(List, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var callback = function callback(json, status, inlt) {
        // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        if (status) {
          _this2.setState({ json: json, inlt: inlt }); // 保存json和inlt到页面state中并刷新页面
        }
      };
    }

    //根据场景加载相应initTemplate


    //页签切换需要传的条件

    // 设置选中数据按钮的可点击性

    // 缓存回写回调函数

    /**查询区渲染完成回调函数 */

  }, {
    key: "render",
    value: function render() {
      var muti = this.props.MutiInit.getIntl(_constant.module_id); //this.moduleId
      var tabs = {
        defaultKey: "-1",
        allKey: "all",
        items: [{
          key: "-1",
          name: "numZY",
          title: muti && muti.get("36180PDT-000005") /* 国际化处理： 待提交*/
        }, {
          key: "2,3",
          name: "numTJ",
          title: muti && muti.get("36180PDT-000006") /* 国际化处理： 审批中*/
        }, {
          key: "all",
          title: muti && muti.get("36180PDT-000007") /* 国际化处理： 全部*/
        }],
        tabChangeServal: this.tabChangeServal.bind(this)
      };

      var pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
      return _react2.default.createElement(_BaseList2.default, _extends({
        constant: {
          appcode: _constant.app_code,
          moduleId: _constant.module_id,
          searchId: _constant.LIST.search_id,
          cardPageCode: _constant.CARD.page_id,
          tableId: _constant.LIST.table_id,
          pageId: _constant.LIST.page_id,
          apCode: _constant.LIST.app_code,
          nodekey: _constant.nodekey, //打印输出编码
          dataSource: _constant.DATA_SOURCE, //缓存key
          searchCache: _constant.searchCache, //查询区缓存
          // oid: LIST.search_oid, //查询区oid
          primaryId: _constant.LIST.primary_id,
          pk_inbalaacc: "pk_inbalaacc",
          billNo: _constant.LIST.billno, //单据编号
          billstatus: _constant.LIST.billstatus, //单据编号
          API_URL: _constant.API_URL, //接口地址
          disabledBtn: _constant.LIST.disabled_btn, //默认禁用按钮
          billtype: _constant.billtype, //单据类型，联查审批详情需要
          modelname: _constant.modelname, //模块名称
          cardpageId: _constant.CARD.page_id,
          modulecode: "3618",
          fullAggClassName: _constant.fullAggClassName,
          tableName: _constant.tableName
        },
        _initTemplate: this.getInitTemplate.call(this),
        _selectedEvent: this.myselectedEvent,
        _renderCompleteEvent: this.myRenderCompleteEvent,
        _componentInitFinished: this.componentInitFinished,
        pageTitle: this.props.MutiInit.getIntl("36180PDT") && this.props.MutiInit.getIntl("36180PDT").get("36180PDT-000002") //页面标题/* 国际化处理： 应付票据贴现*/
        , headBtnArea: _constant.LIST.head_btn_code //表头按钮区域
        , showSearch: !pk_ntbparadimvo,
        listTabs: !pk_ntbparadimvo ? tabs : undefined //反联查不显示tab页签
        , initImport: false //导入导出
        , linkItems: ["approveDetail", "ntb"] //联查显示的组件
      }, this.props));
    }
  }]);

  return List;
}(_react.Component);

List = (0, _ncLightappFront.createPage)({
  mutiLangCode: "36180PDT"
})(List);
exports.default = List;

/***/ }),
/* 422 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (props) {
  var _this = this;

  var appcode = props.getSearchParam("c") || props.getUrlParam("c");
  var scene = this.props.getUrlParam("scene");
  var pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
  if (scene && scene === "linksce" || pk_ntbparadimvo) {
    pagecode = _constant.LIST.page_id_link;
  }
  props.createUIDom({
    pagecode: _constant.LIST.page_id, //页面code
    appcode: appcode
  }, function (data) {
    if (data) {
      if (data.button) {
        /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
        var button = data.button;
        props.button.setButtons(button);
        props.button.setPopContent("DeleteInner", _this.props.MutiInit.getIntl("36180PDT").get("36180PDT-000003")); /* 国际化处理： 确认要删除吗?*/
        _buttonVisiable.buttonVisiable.call(_this, props);
      }
      if (data.template) {
        var meta = data.template;
        meta = modifierMeta.call(_this, props, meta);
        //给高级查询区域赋默认业务单元(在setMeta之前使用)
        (0, _index2.setDefOrg2AdvanceSrchArea)(props, _constant.LIST.search_id, data);
        props.meta.setMeta(meta);
        //给列表查询区域赋默认业务单元(在setMeta之后使用)
        (0, _index2.setDefOrg2ListSrchArea)(props, _constant.LIST.search_id, data);
        templateCallback.call(_this, meta);
      }
    }
  });
};

var _ncLightappFront = __webpack_require__(1);

var _index = __webpack_require__(279);

var _buttonVisiable = __webpack_require__(280);

var _constant = __webpack_require__(213);

var _page = __webpack_require__(3);

var _index2 = __webpack_require__(10);

function modifierMeta(props, meta) {
  var _this2 = this;

  meta[this.tableId].pagination = true;
  meta[this.searchId].items.map(function (item) {
    if (item.attrcode === "pk_org") {
      //财务组织过滤
      item.isMultiSelectedEnabled = true; //财务组织多选
      item.queryCondition = function () {
        return {
          funcode: _this2.props.getSearchParam("c"), //appcode获取
          TreeRefActionExt: "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }

    // 自定义项过滤
    if (item.attrcode.indexOf("def") > -1) {
      //自定义档案按照组织或者集团过滤
      item.queryCondition = function (p) {
        var pk_org = _this2.props.search.getSearchValByField(_this2.searchId, "pk_org");
        if (pk_org && pk_org.value && pk_org.value.firstvalue) {
          return {
            pk_org: pk_org.value.firstvalue
          };
        }
      };
    }
  });
  meta[this.tableId].pagination = true;
  //列表栏中的单据编号，点击进入到卡片页
  meta[this.tableId].items = meta[this.tableId].items.map(function (item, key) {
    // item.width = 150;
    if (item.attrcode == _this2.billNo) {
      item.render = function (text, record, index) {
        return React.createElement(
          "a",
          {
            style: { cursor: "pointer" },
            onClick: function onClick() {
              props.pushTo("/card", {
                status: "browse",
                id: record[_this2.primaryId].value,
                pagecode: _constant.LIST.page_id
              });
            }
          },
          record[_this2.billNo] && record[_this2.billNo].value
        );
      };
    }
    return item;
  });

  //添加操作列
  meta[this.tableId].items.push({
    itemtype: "customer",
    attrcode: "opr",
    label: this.props.MutiInit.getIntl("36180PDT") && this.props.MutiInit.getIntl("36180PDT").get("36180PDT-000004"), //显示名称/* 国际化处理： 操作*/
    width: 200,
    fixed: "right", //存放位置
    className: "table-opr",
    visible: true,
    render: function render(text, record, index) {
      return props.button.createErrorButton({
        record: record,
        //showBack: false,  //不显示回退，默认显示
        sucessCallBack: function sucessCallBack() {
          var buttonAry = [];
          var vbillstatus = record.vbillstatus && record.vbillstatus.value;
          var voucher = record.voucher && record.voucher.value; // true or false
          switch (vbillstatus) {
            case "-1":
              //待提交
              buttonAry = ["CommitInner", "EditInner", "DeleteInner"];
              break;
            case "2":
              //审批中
              buttonAry = ["UnCommitInner"];
              break;
            case "3":
              //审批中
              buttonAry = ["UnCommitInner"];
              break;
            case "1":
              //审批通过
              if (voucher) {
                // 已制证
                buttonAry = ["CancelVoucherInner"];
              } else {
                buttonAry = ["UnCommitInner", "MakeVoucherInner"];
              }
              break;
            default:
              break;
          }

          return props.button.createOprationButton(buttonAry, {
            area: "list_inner",
            buttonLimit: _constant.button_limit,
            onButtonClick: function onButtonClick(props, key) {
              return _index.bodyButtonClick.call(_this2, key, record, index);
            }
          });
        }
      });
    }
  });
  return meta;
}

//模板加载后的回调函数
/* 
 应付票据贴现列表模板
 created by：xiezhp 2019-11-5
 update: 
*/
function templateCallback(meta) {
  _page.initList.call(this);
}

/***/ }),
/* 423 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (props) {
	var _this = this;

	var appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom({
		pagecode: _constant.LIST.page_id_link, //页面code
		appcode: appcode //link_app_code
	}, function (data) {
		if (data) {
			if (data.button) {
				/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
				var button = data.button;
				props.button.setButtons(button);
				props.button.setButtonDisabled(_constant.LIST.disabled_btn, true);
			}
			if (data.template) {
				var meta = data.template;
				meta = modifierMeta.call(_this, props, meta);
				props.meta.setMeta(meta);
				templateCallback.call(_this, meta);
			}
		}
	});
};

var _ncLightappFront = __webpack_require__(1);

var _constant = __webpack_require__(213);

var _page = __webpack_require__(3);

//应付票据贴现——联查页面
function modifierMeta(props, meta) {
	var _this2 = this;

	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map(function (item, key) {
		// item.width = 150;
		if (item.attrcode == _this2.billNo) {
			item.render = function (text, record, index) {
				return React.createElement(
					'a',
					{
						style: { cursor: 'pointer' },
						onClick: function onClick() {
							props.pushTo('/card', {
								status: 'browse',
								id: record[_constant.LIST.primary_id].value,
								pagecode: _constant.LIST.page_id,
								scene: 'linksce'
							});
						}
					},
					record[_this2.billNo] && record[_this2.billNo].value
				);
			};
		}
		return item;
	});
	return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
	_page.initList.call(this);
}

/***/ }),
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */,
/* 454 */,
/* 455 */,
/* 456 */,
/* 457 */,
/* 458 */,
/* 459 */,
/* 460 */,
/* 461 */,
/* 462 */,
/* 463 */,
/* 464 */,
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */,
/* 469 */,
/* 470 */,
/* 471 */,
/* 472 */,
/* 473 */,
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */,
/* 485 */,
/* 486 */,
/* 487 */,
/* 488 */,
/* 489 */,
/* 490 */,
/* 491 */,
/* 492 */,
/* 493 */,
/* 494 */,
/* 495 */,
/* 496 */,
/* 497 */,
/* 498 */,
/* 499 */,
/* 500 */,
/* 501 */,
/* 502 */,
/* 503 */,
/* 504 */,
/* 505 */,
/* 506 */,
/* 507 */,
/* 508 */,
/* 509 */,
/* 510 */,
/* 511 */,
/* 512 */,
/* 513 */,
/* 514 */,
/* 515 */,
/* 516 */,
/* 517 */,
/* 518 */,
/* 519 */,
/* 520 */,
/* 521 */,
/* 522 */,
/* 523 */,
/* 524 */,
/* 525 */,
/* 526 */,
/* 527 */,
/* 528 */,
/* 529 */,
/* 530 */,
/* 531 */,
/* 532 */,
/* 533 */,
/* 534 */,
/* 535 */,
/* 536 */,
/* 537 */,
/* 538 */,
/* 539 */,
/* 540 */,
/* 541 */,
/* 542 */,
/* 543 */,
/* 544 */,
/* 545 */,
/* 546 */,
/* 547 */,
/* 548 */,
/* 549 */,
/* 550 */,
/* 551 */,
/* 552 */,
/* 553 */,
/* 554 */,
/* 555 */,
/* 556 */,
/* 557 */,
/* 558 */,
/* 559 */,
/* 560 */,
/* 561 */,
/* 562 */,
/* 563 */,
/* 564 */,
/* 565 */,
/* 566 */,
/* 567 */,
/* 568 */,
/* 569 */,
/* 570 */,
/* 571 */,
/* 572 */,
/* 573 */,
/* 574 */,
/* 575 */,
/* 576 */,
/* 577 */,
/* 578 */,
/* 579 */,
/* 580 */,
/* 581 */,
/* 582 */,
/* 583 */,
/* 584 */,
/* 585 */,
/* 586 */,
/* 587 */,
/* 588 */,
/* 589 */,
/* 590 */,
/* 591 */,
/* 592 */,
/* 593 */,
/* 594 */,
/* 595 */,
/* 596 */,
/* 597 */,
/* 598 */,
/* 599 */,
/* 600 */,
/* 601 */,
/* 602 */,
/* 603 */,
/* 604 */,
/* 605 */,
/* 606 */,
/* 607 */,
/* 608 */,
/* 609 */,
/* 610 */,
/* 611 */,
/* 612 */,
/* 613 */,
/* 614 */,
/* 615 */,
/* 616 */,
/* 617 */,
/* 618 */,
/* 619 */,
/* 620 */,
/* 621 */,
/* 622 */,
/* 623 */,
/* 624 */,
/* 625 */,
/* 626 */,
/* 627 */,
/* 628 */,
/* 629 */,
/* 630 */,
/* 631 */,
/* 632 */,
/* 633 */,
/* 634 */,
/* 635 */,
/* 636 */,
/* 637 */,
/* 638 */,
/* 639 */,
/* 640 */,
/* 641 */,
/* 642 */,
/* 643 */,
/* 644 */,
/* 645 */,
/* 646 */,
/* 647 */,
/* 648 */,
/* 649 */,
/* 650 */,
/* 651 */,
/* 652 */,
/* 653 */,
/* 654 */,
/* 655 */,
/* 656 */,
/* 657 */,
/* 658 */,
/* 659 */,
/* 660 */,
/* 661 */,
/* 662 */,
/* 663 */,
/* 664 */,
/* 665 */,
/* 666 */,
/* 667 */,
/* 668 */,
/* 669 */,
/* 670 */,
/* 671 */,
/* 672 */,
/* 673 */,
/* 674 */,
/* 675 */,
/* 676 */,
/* 677 */,
/* 678 */,
/* 679 */,
/* 680 */,
/* 681 */,
/* 682 */,
/* 683 */,
/* 684 */,
/* 685 */,
/* 686 */,
/* 687 */,
/* 688 */,
/* 689 */,
/* 690 */,
/* 691 */,
/* 692 */,
/* 693 */,
/* 694 */,
/* 695 */,
/* 696 */,
/* 697 */,
/* 698 */,
/* 699 */,
/* 700 */,
/* 701 */,
/* 702 */,
/* 703 */,
/* 704 */,
/* 705 */,
/* 706 */,
/* 707 */,
/* 708 */,
/* 709 */,
/* 710 */,
/* 711 */,
/* 712 */,
/* 713 */,
/* 714 */,
/* 715 */,
/* 716 */,
/* 717 */,
/* 718 */,
/* 719 */,
/* 720 */,
/* 721 */,
/* 722 */,
/* 723 */,
/* 724 */,
/* 725 */,
/* 726 */,
/* 727 */,
/* 728 */,
/* 729 */,
/* 730 */,
/* 731 */,
/* 732 */,
/* 733 */,
/* 734 */,
/* 735 */,
/* 736 */,
/* 737 */,
/* 738 */,
/* 739 */,
/* 740 */,
/* 741 */,
/* 742 */,
/* 743 */,
/* 744 */,
/* 745 */,
/* 746 */,
/* 747 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(421);


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.e14e4c1b.js.map
/*XhOL7Tpk7dw6f0g5dItF30c1Dh1c871ozP87sbFllWzBJaKOFBOwLvpFySl9JVc8*/