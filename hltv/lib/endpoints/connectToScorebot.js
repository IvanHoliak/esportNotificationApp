"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToScorebot = void 0;
var io = require("socket.io-client");
var mappers_1 = require("../utils/mappers");
exports.connectToScorebot = function (config) { return function (_a) {
    var id = _a.id, onScoreboardUpdate = _a.onScoreboardUpdate, onLogUpdate = _a.onLogUpdate, onFullLogUpdate = _a.onFullLogUpdate, onConnect = _a.onConnect, onDisconnect = _a.onDisconnect;
    mappers_1.fetchPage(config.hltvUrl + "/matches/" + id + "/-", config.loadPage).then(function ($) {
        var url = $('#scoreboardElement')
            .attr('data-scorebot-url')
            .split(',')
            .pop();
        var matchId = $('#scoreboardElement').attr('data-scorebot-id');
        var socket = io.connect(url, {
            agent: !config.httpAgent
        });
        var initObject = JSON.stringify({
            token: '',
            listId: matchId
        });
        socket.on('connect', function () {
            var done = function () { return socket.close(); };
            if (onConnect) {
                onConnect();
            }
            socket.emit('readyForMatch', initObject);
            socket.on('scoreboard', function (data) {
                if (onScoreboardUpdate) {
                    onScoreboardUpdate(data, done);
                }
            });
            socket.on('log', function (data) {
                if (onLogUpdate) {
                    onLogUpdate(JSON.parse(data), done);
                }
            });
            socket.on('fullLog', function (data) {
                if (onFullLogUpdate) {
                    onFullLogUpdate(JSON.parse(data), done);
                }
            });
        });
        socket.on('reconnect', function () {
            socket.emit('readyForMatch', initObject);
        });
        socket.on('disconnect', function () {
            if (onDisconnect) {
                onDisconnect();
            }
        });
    });
}; };
