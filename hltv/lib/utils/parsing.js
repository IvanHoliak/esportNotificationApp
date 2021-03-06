"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percentageToDecimalOdd = exports.popSlashSource = exports.hasNoChild = exports.hasChild = exports.prev = exports.text = void 0;
exports.text = function (el) { return el.text(); };
exports.prev = function (el) { return el.prev(); };
exports.hasChild = function (childSelector) { return function (el) {
    return el.find(childSelector).length !== 0;
}; };
exports.hasNoChild = function (childSelector) { return function (el) {
    return el.find(childSelector).length === 0;
}; };
exports.popSlashSource = function (el) {
    return el.attr('src').split('/').pop();
};
exports.percentageToDecimalOdd = function (odd) {
    return parseFloat(((1 / odd) * 100).toFixed(2));
};
