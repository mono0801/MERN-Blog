"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneMonthAgo = exports.randomNicknameTag = exports.randomPassword = void 0;
const randomPassword = () => {
    return (Math.random().toString(36).slice(-6) +
        Math.random().toString(36).slice(-6));
};
exports.randomPassword = randomPassword;
const randomNicknameTag = (nickname) => {
    return (nickname.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4));
};
exports.randomNicknameTag = randomNicknameTag;
const oneMonthAgo = () => {
    const now = new Date();
    const oneMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return oneMonth;
};
exports.oneMonthAgo = oneMonthAgo;
