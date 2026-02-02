// //TEST FOR CHECKING THE RETRY LOGIC FOR UNIQUE SHORTCODES
// const mongoose = require("mongoose");
// const crypto = require("crypto");
// const Url = require("./models/urls");

// const makeShortCode = () => crypto.randomBytes(4).toString("hex");

// const createWithRetry = async (payload, maxAttempts = 5) => {
//   for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
//     try {
//       return await Url.create({
//         ...payload,
//         shortCode: payload.shortCode || makeShortCode()
//       });
//     } catch (error) {
//       if (error?.code === 11000 && attempt < maxAttempts) {
//         continue;
//       }
//       throw error;
//     }
//   }
// };

// mongoose
//   .connect("mongodb://localhost:27017/url_shortener")
//   .then(async () => {
//     const testUrl = await createWithRetry({
//       originalUrl: "https://google.com"
//     });

//     console.log("Saved:", testUrl);
//     process.exit();
//   })
//   .catch(err => console.error(err));


//-------------------------***---------------------------//

//test for short code generation logic
const mongoose = require("mongoose");
const { createUrlWithUniqueShortCode } = require("./services/shortCodeService");

mongoose.connect("mongodb://localhost:27017/url_shortener")
  .then(async () => {
    const url = await createUrlWithUniqueShortCode({
        originalUrl: "https://google.com"
        });
        console.log("Created URL:", url);
        process.exit();
  })
  .catch(console.error);
