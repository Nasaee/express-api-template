"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth/auth.route"));
const rootRouter = (0, express_1.Router)();
rootRouter.get('/', (req, res) => {
    res.send('Hello World');
});
//* Auth
rootRouter.use('/auth', auth_route_1.default);
exports.default = rootRouter;
