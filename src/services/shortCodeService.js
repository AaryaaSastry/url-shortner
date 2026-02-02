const { nanoid } = require("nanoid");
const Url = require("../models/urls");

const DEFAULT_LENGTH = 7;
const DEFAULT_MAX_ATTEMPTS = 10;

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const generateShortCode = async (length = DEFAULT_LENGTH, maxAttempts = DEFAULT_MAX_ATTEMPTS) => {
  const safeLength = toPositiveInt(length, DEFAULT_LENGTH);
  const safeMaxAttempts = toPositiveInt(maxAttempts, DEFAULT_MAX_ATTEMPTS);

  for (let attempt = 1; attempt <= safeMaxAttempts; attempt += 1) {
    const shortCode = nanoid(safeLength);
    const exists = await Url.exists({ shortCode });
    if (!exists) {
      return shortCode;
    }
  }

  throw new Error("Failed to generate a unique short code. Try again.");
};

const createUrlWithUniqueShortCode = async (
  payload,
  length = DEFAULT_LENGTH,
  maxAttempts = DEFAULT_MAX_ATTEMPTS
) => {
  if (!payload || typeof payload !== "object") {
    throw new TypeError("Payload must be an object.");
  }

  const safeLength = toPositiveInt(length, DEFAULT_LENGTH);
  const safeMaxAttempts = toPositiveInt(maxAttempts, DEFAULT_MAX_ATTEMPTS);

  for (let attempt = 1; attempt <= safeMaxAttempts; attempt += 1) {
    try {
      return await Url.create({
        ...payload,
        shortCode: payload.shortCode || nanoid(safeLength)
      });
    } catch (error) {
      if (error?.code === 11000 && attempt < safeMaxAttempts) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Failed to create URL with a unique short code. Try again.");
};

module.exports = generateShortCode;
module.exports.createUrlWithUniqueShortCode = createUrlWithUniqueShortCode;
