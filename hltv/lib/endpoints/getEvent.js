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
exports.getEvent = void 0;
var mappers_1 = require("../utils/mappers");
var parsing_1 = require("../utils/parsing");
exports.getEvent = function (config) { return function (_a) {
    var id = _a.id;
    return __awaiter(void 0, void 0, void 0, function () {
        var $, name, dateStart, dateEnd, prizePool, location, teams, relatedEvents, prizeDistribution, formats, mapPool;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, mappers_1.fetchPage(config.hltvUrl + "/events/" + id + "/-", config.loadPage)];
                case 1:
                    $ = _b.sent();
                    name = $('.eventname').text();
                    dateStart = Number($('td.eventdate span[data-unix]').first().attr('data-unix')) ||
                        undefined;
                    dateEnd = Number($('td.eventdate span[data-unix]').last().attr('data-unix')) ||
                        undefined;
                    prizePool = $('td.prizepool').text();
                    location = {
                        name: $('img.flag').attr('title'),
                        code: parsing_1.popSlashSource($('img.flag')).split('.')[0]
                    };
                    teams = mappers_1.toArray($('.team-box')).map(function (teamEl) { return ({
                        name: teamEl.find('.logo').attr('title'),
                        id: Number(teamEl.find('.team-name a').attr('href').split('/')[2]) ||
                            undefined,
                        reasonForParticipation: teamEl.find('.sub-text').text().trim() || undefined,
                        rankDuringEvent: Number(teamEl.find('.event-world-rank').text().replace('#', '')) ||
                            undefined
                    }); });
                    relatedEvents = mappers_1.toArray($('.related-event')).map(function (eventEl) { return ({
                        name: eventEl.find('.event-name').text(),
                        id: Number(eventEl.find('a').attr('href').split('/')[2])
                    }); });
                    prizeDistribution = mappers_1.toArray($('.placement')).map(function (placementEl) {
                        var otherPrize = placementEl.find('.prizeMoney').first().next().text() || undefined;
                        var qualifiesFor = !!otherPrize
                            ? relatedEvents.find(function (event) { return event.name === otherPrize; })
                            : undefined;
                        return {
                            place: $(placementEl.children().get(1)).text(),
                            prize: placementEl.find('.prizeMoney').first().text() || undefined,
                            qualifiesFor: qualifiesFor,
                            otherPrize: !qualifiesFor ? otherPrize : undefined,
                            team: placementEl.find('.team').children().length !== 0
                                ? {
                                    name: placementEl.find('.team a').text(),
                                    id: Number(placementEl.find('.team a').attr('href').split('/')[2])
                                }
                                : undefined
                        };
                    });
                    formats = mappers_1.toArray($('.formats tr')).map(function (formatEl) { return ({
                        type: formatEl.find('.format-header').text(),
                        description: formatEl
                            .find('.format-data')
                            .text()
                            .split('\n')
                            .join(' ')
                            .trim()
                    }); });
                    mapPool = mappers_1.toArray($('.map-pool-map-holder')).map(function (mapEl) {
                        return mappers_1.getMapSlug(mapEl.find('.map-pool-map-name').text());
                    });
                    return [2, {
                            id: id,
                            name: name,
                            dateStart: dateStart,
                            dateEnd: dateEnd,
                            prizePool: prizePool,
                            teams: teams,
                            location: location,
                            prizeDistribution: prizeDistribution,
                            formats: formats,
                            relatedEvents: relatedEvents,
                            mapPool: mapPool
                        }];
            }
        });
    });
}; };
