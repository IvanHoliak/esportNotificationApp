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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchesStats = void 0;
var mappers_1 = require("../utils/mappers");
exports.getMatchesStats = function (config) { return function (_a) {
    var _b = _a === void 0 ? {} : _a, startDate = _b.startDate, endDate = _b.endDate, matchType = _b.matchType, _c = _b.maps, maps = _c === void 0 ? [] : _c;
    return __awaiter(void 0, void 0, void 0, function () {
        var query, page, $, matches;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    query = "startDate=" + startDate + "&endDate=" + endDate + "&matchtype=" + matchType + __spreadArrays([
                        ''
                    ], maps).join('&maps=');
                    page = 0;
                    matches = [];
                    _d.label = 1;
                case 1: return [4, mappers_1.fetchPage(config.hltvUrl + "/stats/matches?" + query + "&offset=" + page * 50, config.loadPage)];
                case 2:
                    $ = _d.sent();
                    page++;
                    matches = matches.concat(mappers_1.toArray($('.matches-table tbody tr')).map(function (matchEl) {
                        var id = Number(matchEl.find('.date-col a').attr('href').split('/')[4]);
                        var date = Number(matchEl.find('.time').attr('data-unix'));
                        var map = matchEl.find('.dynamic-map-name-short').text();
                        var team1 = {
                            id: Number(matchEl.find('.team-col a').first().attr('href').split('/')[3]),
                            name: matchEl.find('.team-col a').first().text()
                        };
                        var team2 = {
                            id: Number(matchEl.find('.team-col a').last().attr('href').split('/')[3]),
                            name: matchEl.find('.team-col a').last().text()
                        };
                        var event = {
                            id: Number(matchEl
                                .find('.event-col a')
                                .attr('href')
                                .split('event=')[1]
                                .split('&')[0]),
                            name: matchEl.find('.event-col a').text()
                        };
                        var result = {
                            team1: Number(matchEl
                                .find('.team-col .score')
                                .first()
                                .text()
                                .trim()
                                .replace(/\(|\)/g, '')),
                            team2: Number(matchEl
                                .find('.team-col .score')
                                .last()
                                .text()
                                .trim()
                                .replace(/\(|\)/g, ''))
                        };
                        return { id: id, date: date, map: map, team1: team1, team2: team2, event: event, result: result };
                    }));
                    _d.label = 3;
                case 3:
                    if ($('.matches-table tbody tr').length !== 0) return [3, 1];
                    _d.label = 4;
                case 4: return [2, matches];
            }
        });
    });
}; };
