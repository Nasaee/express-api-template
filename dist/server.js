"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
require("dotenv/config");
const rootRouter_1 = __importDefault(require("./routes/rootRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS MIDDLEWARE
app.use((0, cors_1.default)({
    origin: ['http://localhost', process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// LOGGING MIDDLEWARE
app.use((0, morgan_1.default)('dev'));
// HIDDEN SENSITIVE HEADER INFO
app.use((0, helmet_1.default)());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/api/v1', rootRouter_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
