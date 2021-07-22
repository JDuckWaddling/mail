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
exports.__esModule = true;
var dotenv = require("dotenv");
var rssParser = require("rss-parser");
var thecamp = require("the-camp-lib");
function getNews() {
    return __awaiter(this, void 0, void 0, function () {
        var parser, xml, feed, message_items, sliced_message_items;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parser = new rssParser({
                        headers: {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                        }
                    });
                    xml = 'http://news.sbs.co.kr/news/ReplayRssFeed.do';
                    return [4 /*yield*/, parser.parseURL(xml)];
                case 1:
                    feed = _a.sent();
                    message_items = feed.items.map(function (item) {
                        var title = item.title, content = item.content;
                        return "# " + title + "<br>" + content;
                    });
                    sliced_message_items = message_items.slice(0, message_items.indexOf('# 클로징\n8뉴스 마칩니다. 고맙습니다.'));
                    return [2 /*return*/, [sliced_message_items.join('<br><br>').slice(0, 1500), sliced_message_items.join('<br><br>').slice(1500, 3000)]];
            }
        });
    });
}
function send(_a) {
    var id = _a.id, password = _a.password, name = _a.name, birth = _a.birth, enterDate = _a.enterDate, className = _a.className, groupName = _a.groupName, unitName = _a.unitName;
    return __awaiter(this, void 0, void 0, function () {
        var soldier, cookies, trainee, news, messages;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    soldier = new thecamp.Soldier(name, birth, enterDate, className, groupName, unitName, thecamp.SoldierRelationship.FRIEND);
                    return [4 /*yield*/, thecamp.login(id, password)];
                case 1:
                    cookies = _b.sent();
                    return [4 /*yield*/, thecamp.addSoldier(cookies, soldier)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, thecamp.fetchSoldiers(cookies, soldier)];
                case 3:
                    trainee = (_b.sent())[0];
                    return [4 /*yield*/, getNews()];
                case 4:
                    news = _b.sent();
                    messages = news.map(function (item, i) {
                        return new thecamp.Message("[3\uC18C\uB300/\uAD6C\uC0DD\uD65C\uAD00] SBS\uB274\uC2A4\uD3EC\uACF0\uB3CC! \uD83D\uDC3B " + (new Date().getMonth() + 1) + "\uC6D4 " + new Date().getDate() + "\uC77C (" + new Date().getHours() + "\uC2DC " + new Date().getMinutes() + "\uBD84) - SBS \uB274\uC2A4 \uC885\uD569 (" + (i + 1) + ")", item, trainee);
                    });
                    messages.forEach(function (message) {
                        thecamp.sendMessage(cookies, trainee, message);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var id, password, name_kk, birth_kk, enterDate, className, groupName, unitName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dotenv.config();
                id = process.env.USER_ID || '';
                password = process.env.USER_PWD || '';
                name_kk = process.env.TRAINEE_NAME || '';
                birth_kk = process.env.TRAINEE_BIRTH || '';
                enterDate = process.env.ENTER_DATE || '';
                className = process.env.CLASS_NAME;
                groupName = process.env.GROUP_NAME;
                unitName = process.env.UNIT_NAME;
                return [4 /*yield*/, send({ id: id, password: password, name: name_kk, birth: birth_kk, enterDate: enterDate, className: className, groupName: groupName, unitName: unitName })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
