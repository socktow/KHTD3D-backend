const itemsRouter = require("../GS/Items");
const MemberRouter = require("../GS/Member")

const gameRoutes = [
    { path: "/game/items", router: itemsRouter },
    { path: "/game/member", router: MemberRouter }
];

module.exports = gameRoutes;
