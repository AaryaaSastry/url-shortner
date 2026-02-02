const express = require("express");
const router = express.Router();
const { createShortUrl, redirectToOriginalUrl, getAnalytics } = require("../controllers/urlController");

router.get("/:shortCode", redirectToOriginalUrl);
router.post("/shorten", createShortUrl);
router.get("/analytics/:shortCode", getAnalytics);


module.exports = router;
