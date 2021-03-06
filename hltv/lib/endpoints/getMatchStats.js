"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getMatchStats = void 0;
var mappers_1 = require("../utils/mappers");
exports.getMatchStats = function (config) { return function (_a) {
    var id = _a.id;
    return __awaiter(void 0, void 0, void 0, function () {
        var getMatchInfoRowValues, getPlayerTopStat, $, matchPageID, matchScore, date, team1, team2, event, teamStatProperties, teamStats, mostXProperties, mostX, overview, playerOverviewStats, playerStats;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    getMatchInfoRowValues = function ($, index) {
                        var _a = $($('.match-info-row').get(index))
                            .find('.right')
                            .text()
                            .split(' : ')
                            .map(Number), stat1 = _a[0], stat2 = _a[1];
                        return {
                            team1: stat1,
                            team2: stat2
                        };
                    };
                    getPlayerTopStat = function ($, index) {
                        return {
                            id: Number($($('.most-x-box').get(index))
                                .find('.name > a')
                                .attr('href')
                                .split('/')[3]),
                            name: $($('.most-x-box').get(index)).find('.name > a').text(),
                            value: Number($($('.most-x-box').get(index)).find('.valueName').text())
                        };
                    };
                    return [4, mappers_1.fetchPage(config.hltvUrl + "/stats/matches/" + id + "/-", config.loadPage)];
                case 1:
                    $ = _b.sent();
                    matchPageID = Number($('.match-page-link').attr('href').split('/')[2]);
                    matchScore = [
                        Number($('.team-left .bold').text()),
                        Number($('.team-right .bold').text())
                    ];
                    date = Number($('.match-info-box .small-text span').first().attr('data-unix'));
                    team1 = {
                        id: Number($('.team-left a.block').attr('href').split('/')[3]),
                        name: $('.team-left .team-logo').attr('title'),
                        score: matchScore[0]
                    };
                    team2 = {
                        id: Number($('.team-right a.block').attr('href').split('/')[3]),
                        name: $('.team-right .team-logo').attr('title'),
                        score: matchScore[1]
                    };
                    event = {
                        id: Number($('.match-info-box .text-ellipsis')
                            .first()
                            .attr('href')
                            .split('event=')[1]),
                        name: $('.match-info-box .text-ellipsis').first().text()
                    };
                    teamStatProperties = ['rating', 'firstKills', 'clutchesWon'];
                    teamStats = teamStatProperties.reduce(function (res, prop, i) {
                        var _a;
                        return (__assign(__assign({}, res), (_a = {}, _a[prop] = getMatchInfoRowValues($, i), _a)));
                    }, {});
                    mostXProperties = [
                        'mostKills',
                        'mostDamage',
                        'mostAssists',
                        'mostAWPKills',
                        'mostFirstKills',
                        'bestRating'
                    ];
                    mostX = mostXProperties.reduce(function (res, prop, i) {
                        var _a;
                        return (__assign(__assign({}, res), (_a = {}, _a[prop] = getPlayerTopStat($, i), _a)));
                    }, {});
                    overview = __assign(__assign({}, teamStats), mostX);
                    playerOverviewStats = mappers_1.toArray($('.stats-table tbody tr')).map(function (rowEl) {
                        var id = Number(rowEl.find('.st-player a').attr('href').split('/')[3]);
                        return {
                            id: id,
                            name: rowEl.find('.st-player a').text(),
                            kills: Number(rowEl.find('.st-kills').contents().first().text()),
                            hsKills: Number(rowEl.find('.st-kills .gtSmartphone-only').text().replace(/\(|\)/g, '')),
                            assists: Number(rowEl.find('.st-assists').contents().first().text()),
                            flashAssists: Number(rowEl
                                .find('.st-assists .gtSmartphone-only')
                                .text()
                                .replace(/\(|\)/g, '')),
                            deaths: Number(rowEl.find('.st-deaths').text()),
                            KAST: Number(rowEl.find('.st-kdratio').text().replace('%', '')),
                            killDeathsDifference: Number(rowEl.find('.st-kddiff').text()),
                            ADR: Number(rowEl.find('.st-adr').text()),
                            firstKillsDifference: Number(rowEl.find('.st-fkdiff').text()),
                            rating: Number(rowEl.find('.st-rating').text())
                        };
                    });
                    playerStats = {
                        team1: playerOverviewStats.slice(0, 5),
                        team2: playerOverviewStats.slice(5)
                    };
                    return [2, {
                            matchPageID: matchPageID,
                            date: date,
                            team1: team1,
                            team2: team2,
                            event: event,
                            overview: overview,
                            playerStats: playerStats
                        }];
            }
        });
    });
}; };
