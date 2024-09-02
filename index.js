"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_router_1 = require("./src/routes/users.router");
const comment_router_1 = require("./src//routes/comment.router");
const db_1 = require("./src/config/db");
const reaction_router_1 = require("./src//routes/reaction.router");
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/users', users_router_1.router);
app.use('/api/comments', comment_router_1.routerComment);
app.use('/api/reactions', reaction_router_1.routerReactions);
app.get('/', (req, res) => {
    res.send('AAAAAAAAAAAAAAAAAAAAa');
});
db_1.db.then(() => app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
}));
