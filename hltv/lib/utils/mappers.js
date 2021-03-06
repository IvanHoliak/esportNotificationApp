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
exports.getTimestamp = exports.mapRoundElementToModel = exports.getMatchFormatAndMap = exports.getMatchPlayer = exports.mapVetoElementToModel = exports.getMapSlug = exports.toArray = exports.fetchPage = exports.defaultLoadPage = void 0;
var cheerio = require("cheerio");
var request = require("request");
var RoundOutcome_1 = require("../models/RoundOutcome");
var MapSlug_1 = require("../enums/MapSlug");
var parsing_1 = require("../utils/parsing");
var headers = {
    headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "max-age=0",
        "referer": "https://www.hltv.org/",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36"
    }
};
exports.defaultLoadPage = function (httpAgent) { return function (url) {
    return new Promise(function (resolve) {
        request.get(url, { gzip: true, agent: httpAgent, headers }, function (_, __, body) {
            return resolve(body);
        });
    });
}; };
exports.fetchPage = function (url, loadPage) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = cheerio).load;
                return [4, loadPage(url, {headers})];
            case 1: return [2, _b.apply(_a, [_c.sent()])];
        }
    });
}); };
exports.toArray = function (elements) {
    return elements.toArray().map(cheerio);
};
exports.getMapSlug = function (map) { return MapSlug_1.MapSlug[map]; };
exports.mapVetoElementToModel = function (el, team1, team2) {
    var _a = el
        .text()
        .replace(/^\d. /, '')
        .split(/removed|picked/), teamName = _a[0], map = _a[1];
    if (!map || !teamName) {
        return {
            map: exports.getMapSlug(el.text().split(' ')[1]),
            type: 'other'
        };
    }
    return {
        team: [team1, team2].find(function (t) { return t.name === teamName.trim(); }),
        map: exports.getMapSlug(map.trim()),
        type: el.text().includes('picked') ? 'picked' : 'removed'
    };
};
exports.getMatchPlayer = function (playerEl) {
    return {
        name: playerEl.find('.text-ellipsis').text(),
        id: playerEl.data('player-id')
    };
};
exports.getMatchFormatAndMap = function (mapText) {
    if (mapText && !mapText.includes('bo')) {
        return { map: mapText, format: 'bo1' };
    }
    if (!mapText) {
        return {};
    }
    return { format: mapText };
};
exports.mapRoundElementToModel = function (team1Id, team2Id) { return function (el, i, allRoundEls) {
    var getOutcome = function (el) {
        var outcomeString = parsing_1.popSlashSource(el).split('.')[0];
        var outcomeTuple = Object.entries(RoundOutcome_1.Outcome).find(function (_a) {
            var _ = _a[0], v = _a[1];
            return v === outcomeString;
        });
        return outcomeTuple && outcomeTuple[1];
    };
    var extractCTOutcomeSideInfo = function (index) {
        if (index < 15) {
            return {
                firstHalfCt: team1Id,
                secondHalfCt: team2Id,
                firstHalfT: team2Id,
                secondHalfT: team1Id
            };
        }
        return {
            firstHalfCt: team2Id,
            secondHalfCt: team1Id,
            firstHalfT: team1Id,
            secondHalfT: team2Id
        };
    };
    var extractTOutcomeSideInfo = function (index) {
        if (index < 15) {
            return extractCTOutcomeSideInfo(30);
        }
        return extractCTOutcomeSideInfo(0);
    };
    var outcome = getOutcome(el);
    var ctOutcomes = [RoundOutcome_1.Outcome.BombDefused, RoundOutcome_1.Outcome.CTWin, RoundOutcome_1.Outcome.TimeRanOut];
    var tOutcomes = [RoundOutcome_1.Outcome.BombExploded, RoundOutcome_1.Outcome.TWin];
    var ctOutcomeMarker = allRoundEls.findIndex(function (x) {
        return ctOutcomes.includes(getOutcome(x));
    });
    var tOutcomeMarker = allRoundEls.findIndex(function (x) {
        return tOutcomes.includes(getOutcome(x));
    });
    var outcomeSideInfo = ctOutcomeMarker !== -1
        ? extractCTOutcomeSideInfo(ctOutcomeMarker)
        : extractTOutcomeSideInfo(tOutcomeMarker);
    var isFirstHalf = i < 15 || (i >= 30 && i < 45);
    return {
        outcome: outcome,
        score: el.attr('title'),
        ctTeam: isFirstHalf
            ? outcomeSideInfo.firstHalfCt
            : outcomeSideInfo.secondHalfCt,
        tTeam: isFirstHalf
            ? outcomeSideInfo.firstHalfT
            : outcomeSideInfo.secondHalfT
    };
}; };
exports.getTimestamp = function (source) {
    var _a = source.split('/'), day = _a[0], month = _a[1], year = _a[2];
    return new Date([month, day, year].join('/')).getTime();
};
