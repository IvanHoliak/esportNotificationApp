"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
var mappers_1 = require("./utils/mappers");
var https_1 = require("https");
var defaultAgent = new https_1.Agent();
exports.defaultConfig = {
    hltvUrl: 'https://www.hltv.org',
    hltvStaticUrl: 'https://static.hltv.org',
    httpAgent: defaultAgent,
    loadPage: mappers_1.defaultLoadPage(defaultAgent)
};
