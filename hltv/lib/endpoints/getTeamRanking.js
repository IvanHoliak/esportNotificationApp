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
exports.getTeamRanking = void 0;
var mappers_1 = require("../utils/mappers");
exports.getTeamRanking = function (config) { return function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.year, year = _c === void 0 ? '' : _c, _d = _b.month, month = _d === void 0 ? '' : _d, _e = _b.day, day = _e === void 0 ? '' : _e, _f = _b.country, country = _f === void 0 ? '' : _f;
    return __awaiter(void 0, void 0, void 0, function () {
        var $, redirectedLink, countryRankingLink, teams;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4, mappers_1.fetchPage(config.hltvUrl + "/ranking/teams/" + year + "/" + month + "/" + day, config.loadPage)];
                case 1:
                    $ = _g.sent();
                    if (!((!year || !month || !day) && country)) return [3, 3];
                    redirectedLink = $('.ranking-country > a').first().attr('href');
                    countryRankingLink = redirectedLink
                        .split('/')
                        .slice(0, -1)
                        .concat([country])
                        .join('/');
                    return [4, mappers_1.fetchPage("" + config.hltvUrl + countryRankingLink, config.loadPage)];
                case 2:
                    $ = _g.sent();
                    _g.label = 3;
                case 3:
                    teams = mappers_1.toArray($('.ranked-team')).map(function (teamEl) {
                        var points = Number(teamEl.find('.points').text().replace(/\(|\)/g, '').split(' ')[0]);
                        var place = Number(teamEl.find('.position').text().substring(1));
                        var team = {
                            name: teamEl.find('.name').text(),
                            id: Number(teamEl.find('.moreLink').attr('href').split('/')[2])
                        };
                        var changeText = teamEl.find('.change').text();
                        var isNew = changeText === 'New';
                        var change = changeText === '-' || isNew ? 0 : Number(changeText);
                        return { points: points, place: place, team: team, change: change, isNew: isNew };
                    });
                    return [2, teams];
            }
        });
    });
}; };
