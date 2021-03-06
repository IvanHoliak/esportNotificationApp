"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
var mappers_1 = require("../utils/mappers");
var EventSize_1 = require("../enums/EventSize");
var EventType_1 = require("../enums/EventType");
var parsing_1 = require("../utils/parsing");
exports.getEvents = function (config) { return function (_a) {
    var _b = _a === void 0 ? {} : _a, size = _b.size, month = _b.month;
    return __awaiter(void 0, void 0, void 0, function () {
        var $, events;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4, mappers_1.fetchPage(config.hltvUrl + "/events", config.loadPage)];
                case 1:
                    $ = _c.sent();
                    events = mappers_1.toArray($('.events-month'))
                        .map(function (eventEl) {
                        var checkMonth = new Date(eventEl.find('.standard-headline').text()).getMonth();
                        if (typeof month === 'undefined' ||
                            (typeof month !== 'undefined' && month == checkMonth)) {
                            switch (size) {
                                case EventSize_1.EventSize.Small:
                                    return {
                                        month: checkMonth,
                                        events: parseEvents(mappers_1.toArray(eventEl.find('a.small-event')), EventSize_1.EventSize.Small)
                                    };
                                case EventSize_1.EventSize.Big:
                                    return {
                                        month: checkMonth,
                                        events: parseEvents(mappers_1.toArray(eventEl.find('a.big-event')), EventSize_1.EventSize.Big)
                                    };
                                default:
                                    return {
                                        month: checkMonth,
                                        events: parseEvents(mappers_1.toArray(eventEl.find('a.big-event')), EventSize_1.EventSize.Big).concat(parseEvents(mappers_1.toArray(eventEl.find('a.small-event')), EventSize_1.EventSize.Small))
                                    };
                            }
                        }
                        return null;
                    })
                        .filter(function (x) { return !!x; });
                    return [2, events];
            }
        });
    });
}; };
var parseEvents = function (eventsToParse, size) {
    var dateSelector, nameSelector, locationSelector;
    if (size == EventSize_1.EventSize.Small) {
        dateSelector = '.eventDetails .col-desc span[data-unix]';
        nameSelector = '.col-value .text-ellipsis';
        locationSelector = '.smallCountry img';
    }
    else {
        dateSelector = 'span[data-unix]';
        nameSelector = '.big-event-name';
        locationSelector = '.location-top-teams img';
    }
    var events = eventsToParse.map(function (eventEl) {
        var _a;
        var dateStart = eventEl.find(dateSelector).eq(0).data('unix');
        var dateEnd = eventEl.find(dateSelector).eq(1).data('unix');
        var teams;
        var prizePool;
        if (size == EventSize_1.EventSize.Small) {
            teams = eventEl.find('.col-value').eq(1).text();
            prizePool = eventEl.find('.prizePoolEllipsis').text();
        }
        else {
            teams = eventEl.find('.additional-info tr').eq(0).find('td').eq(2).text();
            prizePool = eventEl
                .find('.additional-info tr')
                .eq(0)
                .find('td')
                .eq(1)
                .text();
        }
        var eventName = eventEl.find(nameSelector).text();
        var rawType = eventEl.find('table tr').eq(0).find('td').eq(3).text() || undefined;
        var eventType = (_a = Object.entries({
            major: EventType_1.EventType.Major,
            online: EventType_1.EventType.Online,
            intl: EventType_1.EventType.InternationalLan,
            local: EventType_1.EventType.LocalLan,
            reg: EventType_1.EventType.RegionalLan
        }).find(function (_a) {
            var needle = _a[0];
            return rawType ? rawType.toLowerCase().includes(needle) : false;
        })) === null || _a === void 0 ? void 0 : _a[1];
        return {
            id: Number(eventEl.attr('href').split('/')[2]),
            name: eventName,
            dateStart: dateStart ? Number(dateStart) : undefined,
            dateEnd: dateEnd ? Number(dateEnd) : undefined,
            prizePool: prizePool,
            teams: teams.length ? Number(teams) : undefined,
            location: {
                name: eventEl.find(locationSelector).prop('title'),
                code: parsing_1.popSlashSource(eventEl.find(locationSelector)).split('.')[0]
            },
            type: eventType || EventType_1.EventType.Other
        };
    });
    return events;
};
