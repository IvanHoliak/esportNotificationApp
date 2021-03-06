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
exports.getTeam = void 0;
var mappers_1 = require("../utils/mappers");
exports.getTeam = function (config) { return function (_a) {
    var id = _a.id;
    return __awaiter(void 0, void 0, void 0, function () {
        var t$, e$, name, logo, coverImage, location, facebook, twitter, rank, players, recentResults, rankingDevelopment, rankings, bigAchievements, events;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, mappers_1.fetchPage(config.hltvUrl + "/team/" + id + "/-", config.loadPage)];
                case 1:
                    t$ = _b.sent();
                    return [4, mappers_1.fetchPage(config.hltvUrl + "/stats/teams/events/" + id + "/-", config.loadPage)];
                case 2:
                    e$ = _b.sent();
                    name = t$('.profile-team-name').text();
                    logo = t$('.teamlogo').attr('src'); //config.hltvStaticUrl + "/images/team/logo/" + id;
                    coverImage = t$(".team-country > img").attr("src");
                    location = t$('.team-country .flag').attr('alt');
                    facebook = t$('.facebook').parent().attr('href');
                    twitter = t$('.twitter').parent().attr('href');
                    rank = Number(t$('.profile-team-stat .right').first().text().replace('#', '')) ||
                        undefined;
                    players = mappers_1.toArray(t$('.bodyshot-team .col-custom'))
                        .map(function (playerEl) {
                        var _a;
                        return ({
                            name: playerEl.attr('title'),
                            id: Number((_a = playerEl.attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2]),
                            full_name: playerEl.find("img").attr("title"),
                            urlPhoto: playerEl.find("img").attr("src"),
                            country: playerEl.find(".playerFlagName > span > img").attr("title"),
                            flag_country: playerEl.find(".playerFlagName > span > img").attr("src")
                        });
                    })
                        .filter(function (player) { return player.name; });
                    recentResults = mappers_1.toArray(t$('.team-row')).map(function (matchEl) { return ({
                        matchID: Number((matchEl.find('.matchpage-button').length
                            ? matchEl.find('.matchpage-button')
                            : matchEl.find('.stats-button'))
                            .attr('href')
                            .split('/')[2]),
                        enemyTeam: {
                            id: Number(matchEl.find('.team-2').attr('href')?.split('/')[2]),
                            logo: matchEl.find("a.team-2").parent().find(".team-logo-container > a > img").attr("src"),
                            name: matchEl.find('a.team-2').text() || matchEl.find('span.team-2').text()
                        },
                        result: matchEl.find('.score-cell').text()
                    }); });
                    try {
                        rankings = JSON.parse(t$('.graph').attr('data-fusionchart-config'));
                        rankingDevelopment = rankings.dataSource.dataset[0].data
                            .map(function (x) { return x.value; })
                            .map(Number);
                    }
                    catch (_c) {
                        rankingDevelopment = [];
                    }
                    bigAchievements = mappers_1.toArray(t$('.achievement-table .team')).map(function (achEl) { return ({
                        place: achEl.find('.achievement').text(),
                        event: {
                            name: achEl.find('.tournament-name-cell a').text(),
                            id: Number(achEl.find('.tournament-name-cell a').attr('href').split('/')[2])
                        }
                    }); });
                    events = mappers_1.toArray(t$('#ongoingEvents a.ongoing-event'))
                        .map(function (eventEl) { return ({
                        name: eventEl.find('.eventbox-eventname').text(),
                        id: Number(eventEl.attr('href').split('/')[2])
                    }); })
                        .concat(mappers_1.toArray(e$('.image-and-label[href*="event"]')).map(function (eventEl) { return ({
                        name: eventEl.find('span').text(),
                        id: Number(eventEl.attr('href').split('=').pop())
                    }); }));
                    return [2, {
                            id: id,
                            name: name,
                            logo: logo,
                            coverImage: coverImage,
                            location: location,
                            facebook: facebook,
                            twitter: twitter,
                            rank: rank,
                            players: players,
                            recentResults: recentResults,
                            rankingDevelopment: rankingDevelopment,
                            bigAchievements: bigAchievements,
                            events: events
                        }];
            }
        });
    });
}; };
