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
exports.Query = void 0;
var dgram_1 = require("dgram");
var Query = /** @class */ (function () {
    function Query() {
    }
    Query.serverInfo = function (hostname, port) {
        return __awaiter(this, void 0, void 0, function () {
            var socket, packet, object, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (port === undefined) {
                            port = 7777;
                        }
                        socket = dgram_1.createSocket("udp4");
                        packet = Buffer.alloc(11);
                        object = {};
                        packet.write('SAMP');
                        for (i = 0; i < 4; ++i) {
                            packet[i + 4] = hostname.split('.')[i];
                        }
                        packet[8] = port & 0xFF;
                        packet[9] = port >> 8 & 0xFF;
                        packet[10] = 105;
                        try {
                            socket.send(packet, 0, packet.length, port, hostname);
                        }
                        catch (error) {
                            console.log(error);
                        }
                        socket.on('message', function (message) {
                            socket.close();
                            var offset = 0;
                            if (message.length < 11) {
                                console.log("[error] invalid socket");
                                return;
                            }
                            message = message.slice(11);
                            object.havePassword = message.readUInt8(offset);
                            object.players = message.readUInt16LE(offset += 1);
                            object.maxplayers = message.readUInt16LE(offset += 2);
                            var num = message.readUInt16LE(offset += 2);
                            object.hostname = message.slice(offset += 4, offset += num).toString();
                            num = message.readUInt16LE(offset);
                            object.gamemode = message.slice(offset += 4, offset += num).toString();
                            num = message.readUInt16LE(offset);
                            object.lang = message.slice(offset += 4, offset += num).toString();
                        });
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, object];
                }
            });
        });
    };
    return Query;
}());
exports.Query = Query;
