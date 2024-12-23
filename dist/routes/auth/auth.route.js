"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.post('/signup', () => { });
authRouter.post('/signin', () => { });
exports.default = authRouter;
