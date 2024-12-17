const express = require("express");
const axios = require("axios");
const router = express.Router();
const GAMESERVICEURL = process.env.GAMESERVICEURL;

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

module.exports = router;
