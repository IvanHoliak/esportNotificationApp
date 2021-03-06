"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentFilter = exports.EventSize = exports.WinType = exports.ThreadCategory = exports.StreamCategory = exports.RankingFilter = exports.MatchType = exports.Map = exports.MapSlug = exports.HLTV = exports.HLTVFactory = void 0;
var config_1 = require("./config");
var connectToScorebot_1 = require("./endpoints/connectToScorebot");
var getMatch_1 = require("./endpoints/getMatch");
var getMatches_1 = require("./endpoints/getMatches");
var getMatchesStats_1 = require("./endpoints/getMatchesStats");
var getMatchMapStats_1 = require("./endpoints/getMatchMapStats");
var getMatchStats_1 = require("./endpoints/getMatchStats");
var getRecentThreads_1 = require("./endpoints/getRecentThreads");
var getResults_1 = require("./endpoints/getResults");
var getStreams_1 = require("./endpoints/getStreams");
var getTeamRanking_1 = require("./endpoints/getTeamRanking");
var getTeam_1 = require("./endpoints/getTeam");
var getTeamStats_1 = require("./endpoints/getTeamStats");
var getPlayer_1 = require("./endpoints/getPlayer");
var getPlayerByName_1 = require("./endpoints/getPlayerByName");
var getEvent_1 = require("./endpoints/getEvent");
var getPlayerStats_1 = require("./endpoints/getPlayerStats");
var getPlayerRanking_1 = require("./endpoints/getPlayerRanking");
var MapSlug_1 = require("./enums/MapSlug");
Object.defineProperty(exports, "MapSlug", { enumerable: true, get: function () { return MapSlug_1.MapSlug; } });
var Map_1 = require("./enums/Map");
Object.defineProperty(exports, "Map", { enumerable: true, get: function () { return Map_1.Map; } });
var MatchType_1 = require("./enums/MatchType");
Object.defineProperty(exports, "MatchType", { enumerable: true, get: function () { return MatchType_1.MatchType; } });
var RankingFilter_1 = require("./enums/RankingFilter");
Object.defineProperty(exports, "RankingFilter", { enumerable: true, get: function () { return RankingFilter_1.RankingFilter; } });
var StreamCategory_1 = require("./enums/StreamCategory");
Object.defineProperty(exports, "StreamCategory", { enumerable: true, get: function () { return StreamCategory_1.StreamCategory; } });
var ThreadCategory_1 = require("./enums/ThreadCategory");
Object.defineProperty(exports, "ThreadCategory", { enumerable: true, get: function () { return ThreadCategory_1.ThreadCategory; } });
var ContentFilter_1 = require("./enums/ContentFilter");
Object.defineProperty(exports, "ContentFilter", { enumerable: true, get: function () { return ContentFilter_1.ContentFilter; } });
var EventSize_1 = require("./enums/EventSize");
Object.defineProperty(exports, "EventSize", { enumerable: true, get: function () { return EventSize_1.EventSize; } });
var WinType_1 = require("./enums/WinType");
Object.defineProperty(exports, "WinType", { enumerable: true, get: function () { return WinType_1.WinType; } });
var getEvents_1 = require("./endpoints/getEvents");
var getOngoingEvents_1 = require("./endpoints/getOngoingEvents");
var mappers_1 = require("./utils/mappers");
var HLTVFactory = (function () {
    function HLTVFactory(config) {
        this.config = config;
        this.connectToScorebot = connectToScorebot_1.connectToScorebot(this.config);
        this.getMatch = getMatch_1.getMatch(this.config);
        this.getMatches = getMatches_1.getMatches(this.config);
        this.getMatchesStats = getMatchesStats_1.getMatchesStats(this.config);
        this.getMatchStats = getMatchStats_1.getMatchStats(this.config);
        this.getMatchMapStats = getMatchMapStats_1.getMatchMapStats(this.config);
        this.getRecentThreads = getRecentThreads_1.getRecentThreads(this.config);
        this.getResults = getResults_1.getResults(this.config);
        this.getStreams = getStreams_1.getStreams(this.config);
        this.getTeamRanking = getTeamRanking_1.getTeamRanking(this.config);
        this.getTeam = getTeam_1.getTeam(this.config);
        this.getTeamStats = getTeamStats_1.getTeamStats(this.config);
        this.getPlayer = getPlayer_1.getPlayer(this.config);
        this.getPlayerByName = getPlayerByName_1.getPlayerByName(this.config);
        this.getEvent = getEvent_1.getEvent(this.config);
        this.getEvents = getEvents_1.getEvents(this.config);
        this.getOngoingEvents = getOngoingEvents_1.getOngoingEvents(this.config);
        this.getPlayerStats = getPlayerStats_1.getPlayerStats(this.config);
        this.getPlayerRanking = getPlayerRanking_1.getPlayerRanking(this.config);
        if (!config.hltvStaticUrl) {
            config.hltvStaticUrl = config_1.defaultConfig.hltvStaticUrl;
        }
        if (!config.hltvUrl) {
            config.hltvUrl = config_1.defaultConfig.hltvUrl;
        }
        if (config.httpAgent && !config.loadPage) {
            config.loadPage = mappers_1.defaultLoadPage(config.httpAgent);
        }
        if (!config.httpAgent) {
            config.httpAgent = config_1.defaultConfig.httpAgent;
        }
        if (!config.loadPage) {
            config.loadPage = config_1.defaultConfig.loadPage;
        }
    }
    HLTVFactory.prototype.createInstance = function (config) {
        return new HLTVFactory(config);
    };
    return HLTVFactory;
}());
exports.HLTVFactory = HLTVFactory;
var hltvInstance = new HLTVFactory(config_1.defaultConfig);
exports.HLTV = hltvInstance;
exports.default = hltvInstance;
