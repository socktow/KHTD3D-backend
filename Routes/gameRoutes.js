const itemsRouter = require("../GS/Items");
const MemberRouter = require("../GS/Member")

const gameRoutes = [
    { path: "/game", router: itemsRouter },
    { path: "/game", router: MemberRouter }
];

module.exports = gameRoutes;
