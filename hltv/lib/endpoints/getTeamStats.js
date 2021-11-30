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
exports.getTeamStats = void 0;
var mappers_1 = require("../utils/mappers");
var parsing_1 = require("../utils/parsing");
exports.getTeamStats = function (config) { return function (_a) {
    var id = _a.id, currentRosterOnly = _a.currentRosterOnly;
    return __awaiter(void 0, void 0, void 0, function () {
        var currentRosterURL, matchesURL, eventsURL, mapsURL, $, getContainerByText, getPlayersByContainer, currentLineup, historicPlayers, standins, m$, e$, mp$, overviewStats, getOverviewStatByIndex, _b, wins, draws, losses, overview, matches, events, getMapStat, mapStats;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    currentRosterURL = '';
                    mapsURL = '';
                    return [4, mappers_1.fetchPage(config.hltvUrl + "/stats/teams/" + id + "/-", config.loadPage)];
                case 1:
                    $ = _c.sent();
                    getContainerByText = function (text) {
                        return $('.standard-headline')
                            .filter(function (_, el) { return $(el).text() === text; })
                            .parent()
                            .next();
                    };
                    getPlayersByContainer = function (container) {
                        return mappers_1.toArray(container.find('.image-and-label')).map(function (playerEl) { return ({
                            id: Number(playerEl.attr('href').split('/')[3]),
                            name: playerEl.find('.text-ellipsis').text()
                        }); });
                    };
                    if (!currentRosterOnly) return [3, 3];
                    currentRosterURL = "lineup=" + currentLineup
                        .map(function (x) { return x.id; })
                        .join('&lineup=') + "&minLineupMatch=0";
                    mapsURL = config.hltvUrl + "/stats/lineup/maps?" + currentRosterURL;
                    return [4, mappers_1.fetchPage(config.hltvUrl + "/stats/lineup?" + currentRosterURL, config.loadPage)];
                case 2:
                    $ = _c.sent();
                    return [3, 4];
                case 3:
                    mapsURL = config.hltvUrl + "/stats/teams/maps/" + id + "/-";
                    _c.label = 4;
                case 4: return [4];
                case 5:
                    m$ = _c.sent();
                    return [4];
                case 6:
                    e$ = _c.sent();
                    return [4, mappers_1.fetchPage("" + mapsURL, config.loadPage)];
                case 7:
                    mp$ = _c.sent();
                    overviewStats = $('.standard-box .large-strong');
                    getOverviewStatByIndex = function (i) { return Number(overviewStats.eq(i).text()); };
                    _b = overviewStats
                        .eq(1)
                        .text()
                        .split('/')
                        .map(Number), wins = _b[0], draws = _b[1], losses = _b[2];
                    overview = {
                        mapsPlayed: getOverviewStatByIndex(0),
                        totalKills: getOverviewStatByIndex(2),
                        totalDeaths: getOverviewStatByIndex(3),
                        roundsPlayed: getOverviewStatByIndex(4),
                        kdRatio: getOverviewStatByIndex(5),
                        wins: wins,
                        draws: draws,
                        losses: losses
                    };
                    getMapStat = function (mapEl, i) {
                        return mapEl.find('.stats-row').eq(i).children().last().text();
                    };
                    mapStats = mappers_1.toArray(mp$('.two-grid .col .stats-rows')).reduce(function (stats, mapEl) {
                        var mapName = mappers_1.getMapSlug(mapEl.prev().find('.map-pool-map-name').text());
                        stats[mapName] = {
                            wins: Number(getMapStat(mapEl, 0).split(' / ')[0]),
                            draws: Number(getMapStat(mapEl, 0).split(' / ')[1]),
                            losses: Number(getMapStat(mapEl, 0).split(' / ')[2]),
                            winRate: Number(getMapStat(mapEl, 1).split('%')[0]),
                            totalRounds: Number(getMapStat(mapEl, 2)),
                            roundWinPAfterFirstKill: Number(getMapStat(mapEl, 3).split('%')[0]),
                            roundWinPAfterFirstDeath: Number(getMapStat(mapEl, 4).split('%')[0])
                        };
                        return stats;
                    }, {});
                    return [2, {
                            overview: overview,
                            mapStats: mapStats
                        }];
            }
        });
    });
}; };
