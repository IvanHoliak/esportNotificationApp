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
exports.getResults = void 0;
var parsing_1 = require("../utils/parsing");
var mappers_1 = require("../utils/mappers");
exports.getResults = function (config) { return function (_a) {
    var _b = _a.startPage, startPage = _b === void 0 ? 0 : _b, _c = _a.endPage, endPage = _c === void 0 ? 1 : _c, teamID = _a.teamID, eventID = _a.eventID, _d = _a.contentFilters, contentFilters = _d === void 0 ? [] : _d;
    return __awaiter(void 0, void 0, void 0, function () {
        var matches, _loop_1, i;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (startPage < 0) {
                        console.error('getLatestResults: startPage cannot be less than 0');
                        return [2, []];
                    }
                    else if (endPage < 1) {
                        console.error('getLatestResults: endPage cannot be less than 1');
                    }
                    matches = [];
                    _loop_1 = function (i) {
                        var url, _i, contentFilters_1, filter, $;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = config.hltvUrl + "/results?offset=" + i * 100;
                                    if (teamID)
                                        url += "&team=" + teamID;
                                    if (eventID)
                                        url += "&event=" + eventID;
                                    for (_i = 0, contentFilters_1 = contentFilters; _i < contentFilters_1.length; _i++) {
                                        filter = contentFilters_1[_i];
                                        url += "&content=" + filter;
                                    }
                                    return [4, mappers_1.fetchPage(url, config.loadPage)];
                                case 1:
                                    $ = _a.sent();
                                    matches = matches.concat(mappers_1.toArray($('.results-holder > .results-all > .results-sublist .result-con .a-reset')).map(function (matchEl) {
                                        var id = Number(matchEl.attr('href').split('/')[2]);
                                        var stars = matchEl.find('.stars i').length;
                                        var team1 = {
                                            name: matchEl.find('div.team').first().text(),
                                            logo: matchEl.find('img.team-logo').first().attr('src')
                                        };
                                        var team2 = {
                                            name: matchEl.find('div.team').last().text(),
                                            logo: matchEl.find('img.team-logo').last().attr('src')
                                        };
                                        var result = matchEl.find('.result-score').text();
                                        var _a = mappers_1.getMatchFormatAndMap(matchEl.find('.map-text').text()), map = _a.map, format = _a.format;
                                        var idOfEvent = typeof eventID === 'undefined'
                                            ? parsing_1.popSlashSource(matchEl.find('.event-logo')).split('.')[0]
                                            : eventID;
                                        var nameOfEvent = typeof eventID === 'undefined'
                                            ? matchEl.find('.event-logo').attr('alt')
                                            : $('.eventname').text();
                                        var event = {
                                            name: nameOfEvent,
                                            id: Number(idOfEvent)
                                        };
                                        var eventDate = typeof eventID === 'undefined'
                                            ? matchEl.parent().attr('data-zonedgrouping-entry-unix')
                                            : $('.eventdate span').first().data('unix');
                                        var date = Number(eventDate);
                                        return { id: id, team1: team1, team2: team2, result: result, event: event, map: map, format: format, stars: stars, date: date };
                                    }));
                                    return [2];
                            }
                        });
                    };
                    i = startPage;
                    _e.label = 1;
                case 1:
                    if (!(i < endPage)) return [3, 4];
                    return [5, _loop_1(i)];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    i++;
                    return [3, 1];
                case 4: return [2, matches];
            }
        });
    });
}; };
