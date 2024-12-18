const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
const GAMESERVICEURL = process.env.GAMESERVICEURL;
const fetchUser = require("../Settings/FetchUser");
router.get("/member", async (req, res) => {
  try {
    if (!GAMESERVICEURL) {
      throw new Error("GAMESERVICEURL is not defined in .env");
    }
    const response = await axios.get(GAMESERVICEURL);
    if (response.data.status === "success") {
      res.json(response.data.data);
    } else {
      res.status(500).send("Error: Unexpected API response");
    }
  } catch (error) {
    console.error("Error fetching data from the game service:", error);
    res.status(500).send("Error fetching data.");
  }
});

router.get("/member/:id", async (req, res) => {
  const memberId = req.params.id;

  try {
    if (!GAMESERVICEURL) {
      throw new Error("GAMESERVICEURL is not defined in .env");
    }
    const urlWithId = `${GAMESERVICEURL}?ID=${memberId}`;
    const response = await axios.get(urlWithId);
    if (response.data.status === "success") {
      res.json(response.data.data);
    } else {
      res.status(500).send("Error: Unexpected API response");
    }
  } catch (error) {
    console.error("Error fetching data from the game service:", error);
    res.status(500).send("Error fetching data.");
  }
});

// router.post("/member/gameid",fetchUser, async (req, res) => {
//   const { Account, GameID, Character } = req.body;
//   try {
//     if (!Account || !GameID || !Character) {
//       return res.status(400).json({
//         message: "All fields (Account, gameId, Character) are required",
//       });
//     }
//     const existingGameid = await Gameid.findOne({ GameID });
//     if (existingGameid) {
//       return res.status(400).json({
//         message: "GameID đã được liên kết",
//       });
//     }
//     const newGameid = new Gameid({
//       Account,
//       GameID,
//       Character,
//     });
//     await newGameid.save();
//     res.status(201).json({
//       message: "GameID Liên Kết Thành Công",
//       gameId: newGameid,
//     });
//   } catch (error) {
//     console.error("Error creating GameID:", error);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// router.get("/member/gameid/:gameId",fetchUser, async (req, res) => {
//   const { gameId } = req.params;

//   try {
//     const gameid = await Gameid.findOne({ GameID: gameId });

//     if (gameid) {
//       return res.status(400).json({
//         message: "GameID đã được liên kết",
//       });
//     } else {
//       return res.status(200).json({
//         message: "GameID not linked",
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching GameID:", error);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// router.get("/member/account/:account", fetchUser, async (req, res) => {
//     const { account } = req.params;
//     try {
//       const userAccount = await Gameid.findOne({ Account: account });
  
//       if (userAccount) {
//         return res.status(200).json({
//           data: userAccount,
//         });
//       } else {
//         return res.status(404).json({
//           message: "Tài khoản không tồn tại",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching account:", error);
//       res.status(500).json({ success: false, error: "Server error" });
//     }
//   });
  
module.exports = router;
