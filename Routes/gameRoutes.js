const itemsRouter = require("../GS/Items");
const charlistRouter = require("../GS/Charlist")
const gameRoutes = [
    { path: "/game", router: itemsRouter },
    { path: "/game", router: charlistRouter }
];

module.exports = gameRoutes;
