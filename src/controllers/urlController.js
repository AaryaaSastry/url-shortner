const Url = require("../models/urls");
const redisClient = require("../config/redis");
const { createUrlWithUniqueShortCode } = require("../services/shortCodeService");

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body || {};

    if (!originalUrl) {
      return res.status(400).json({ message: "originalUrl is required" });
    }

    // Create URL with unique short code (lowest latency approach)
    const newUrl = await createUrlWithUniqueShortCode({ originalUrl });

    return res.status(201).json({
      shortUrl: `http://localhost:3000/${newUrl.shortCode}`,
      originalUrl: newUrl.originalUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers['referer'] || 'Direct';

    // 1️⃣ Check Redis cache first
    const cachedUrl = await redisClient.get(shortCode);
    if (cachedUrl) {
      // Increment clicks asynchronously
      Url.updateOne(
        { shortCode },
        { 
          $inc: { clicks: 1 },
          $push: { clickLog: { timestamp: new Date(), userAgent, referer } }
        }
      ).exec();

      return res.redirect(cachedUrl);
    }

    // 2️⃣ Cache miss → query MongoDB
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // 3️⃣ Store in Redis (TTL = 1 hour)
    await redisClient.setEx(shortCode, 3600, url.originalUrl);
    console.log("Saved to Redis:", shortCode);

    // 4️⃣ Increment clicks with metadata
    url.clicks += 1;
    url.clickLog.push({ timestamp: new Date(), userAgent, referer });
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    const clickLog = url.clickLog || [];
    
    // Calculate metrics
    const lastClick = clickLog.length > 0 ? clickLog[clickLog.length - 1].timestamp : null;
    const daysActive = url.createdAt ? Math.floor((Date.now() - new Date(url.createdAt)) / (1000 * 60 * 60 * 24)) + 1 : 1;
    const avgClicksPerDay = Math.round((url.clicks / daysActive) * 100) / 100;
    
    // Device breakdown
    const deviceStats = {};
    clickLog.forEach(log => {
      const ua = log.userAgent || 'Unknown';
      const device = ua.includes('Mobile') ? 'Mobile' : 
                     ua.includes('Tablet') ? 'Tablet' : 
                     ua.includes('Windows') || ua.includes('Mac') || ua.includes('Linux') ? 'Desktop' : 'Other';
      deviceStats[device] = (deviceStats[device] || 0) + 1;
    });

    // Referrer breakdown
    const referrerStats = {};
    clickLog.forEach(log => {
      const referer = log.referer || 'Direct';
      referrerStats[referer] = (referrerStats[referer] || 0) + 1;
    });

    // Clicks by day
    const clicksByDay = {};
    clickLog.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString();
      clicksByDay[date] = (clicksByDay[date] || 0) + 1;
    });

    return res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      totalClicks: url.clicks,
      lastClick: lastClick,
      daysActive: daysActive,
      avgClicksPerDay: avgClicksPerDay,
      deviceBreakdown: deviceStats,
      referrerBreakdown: referrerStats,
      clicksByDay: clicksByDay,
      createdAt: url.createdAt
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createShortUrl, redirectToOriginalUrl, getAnalytics };


