require("dotenv").config();

const { Redis } = require("@upstash/redis");

const redis = new Redis({
    url: "https://proud-lioness-21016.upstash.io",
    token: process.env.REDIS_PASSWORD,
});

async function getUniqueRandomValue(tables, medium_tables) {
    // Step 1: Get the current list of used values
    const raw = await redis.get(medium_tables);
    const used = raw ? raw : [];

    // Step 2: Reset if all have been used
    if (used.length >= tables.length) {
        await redis.del(medium_tables);
        return getUniqueRandomValue(tables, medium_tables); // Recursive call after reset
    }

    // Step 3: Pick from remaining values
    const remaining = tables.filter((val) => !used.includes(val));
    const selected = remaining[Math.floor(Math.random() * remaining.length)];

    // Step 4: Update the used list in Redis
    await redis.set(medium_tables, JSON.stringify([...used, selected]));

    return selected;
}

module.exports = {
    getUniqueRandomValue,
};
