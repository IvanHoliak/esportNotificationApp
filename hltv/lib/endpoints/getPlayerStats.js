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
exports.getPlayerStats = void 0;
var querystring_1 = require("querystring");
var mappers_1 = require("../utils/mappers");
var parsing_1 = require("../utils/parsing");
exports.getPlayerStats = function (config) { return function (_a) {
    var id = _a.id, startDate = _a.startDate, endDate = _a.endDate, matchType = _a.matchType, rankingFilter = _a.rankingFilter;
    return __awaiter(void 0, void 0, void 0, function () {
        var query, $, name, ign, imageUrl, image, age, flagEl, country, teamNameEl, team, getStats, statistics;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = querystring_1.stringify({
                        startDate: startDate,
                        endDate: endDate,
                        matchType: matchType,
                        rankingFilter: rankingFilter
                    });
                    return [4, mappers_1.fetchPage(config.hltvUrl + "/stats/players/" + id + "/-?" + query, config.loadPage)];
                case 1:
                    $ = _b.sent();
                    name = $('.summaryRealname div').text() || undefined;
                    ign = $('.context-item-name').text();
                    imageUrl = $('.context-item-image').attr('src');
                    image = imageUrl.includes('blankplayer') ? undefined : imageUrl;
                    age = parseInt($('.summaryPlayerAge').text(), 10) || undefined;
                    flagEl = $('.summaryRealname .flag');
                    country = {
                        name: flagEl.attr('title'),
                        code: parsing_1.popSlashSource(flagEl).split('.')[0]
                    };
                    teamNameEl = $('.SummaryTeamname');
                    team = teamNameEl.text() !== 'No team'
                        ? {
                            name: teamNameEl.text(),
                            id: Number(teamNameEl.find('a').attr('href').split('/')[3])
                        }
                        : undefined;
                    getStats = function (i) {
                        return $($($('.stats-row').get(i)).find('span').get(1)).text();
                    };
                    statistics = {
                        kills: getStats(0),
                        headshots: getStats(1),
                        deaths: getStats(2),
                        kdRatio: getStats(3),
                        damagePerRound: getStats(4),
                        grenadeDamagePerRound: getStats(5),
                        mapsPlayed: getStats(6),
                        roundsPlayed: getStats(7),
                        killsPerRound: getStats(8),
                        assistsPerRound: getStats(9),
                        deathsPerRound: getStats(10),
                        savedByTeammatePerRound: getStats(11),
                        savedTeammatesPerRound: getStats(12),
                        rating: getStats(13)
                    };
                    return [2, { name: name, ign: ign, image: image, age: age, country: country, team: team, statistics: statistics }];
            }
        });
    });
}; };
