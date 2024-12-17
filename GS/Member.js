const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
const GAMESERVICEURL = process.env.GAMESERVICEURL;
const Gameid = require("../Schema/GameidSchema");

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


router.post("/member/gameid", async (req, res) => {
  const { Account, GameID, Character } = req.body;

  try {
    if (!Account || !GameID || !Character) {
      return res.status(400).json({
        message: "All fields (Account, GameID, Character) are required",
      });
    }
    const existingGameid = await Gameid.findOne({ GameID });
    if (existingGameid) {
      return res.status(400).json({
        message: "GameID đã được liên kết",
      });
    }
    const newGameid = new Gameid({
      Account,
      GameID,
      Character,
    });
    await newGameid.save();
    res.status(201).json({
      message: "GameID created successfully",
      gameId: newGameid,
    });
  } catch (error) {
    console.error("Error creating GameID:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/member/gameid/:gameId", async (req, res) => {
  const { gameId } = req.params;

  try {
    const gameid = await Gameid.findOne({ GameID: gameId });

    if (gameid) {
      return res.status(400).json({
        message: "GameID đã được liên kết",
      });
    } else {
      return res.status(200).json({
        message: "GameID not linked",
      });
    }
  } catch (error) {
    console.error("Error fetching GameID:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.patch("/member/gameid/:id", async (req, res) => {
  const gameIdParam = req.params.id;
  const { Account, GameID, Character } = req.body;

  try {
    const gameid = await Gameid.findOne({ GameID: gameIdParam });
    if (!gameid) {
      return res.status(404).json({ message: "GameID not found" });
    }
    if (Account) gameid.Account = Account;
    if (Character) gameid.Character = Character;
    await gameid.save();
    res.json({
      message: "GameID updated successfully",
      gameId: gameid,
    });
  } catch (error) {
    console.error("Error updating GameID:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
