import cors from "cors";
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
// app.use(cors({
//     origin: "http://127.0.0.1:5173"
// }));
app.use(cors());
const port = process.env.PORT || 3000;
const uri = process.env.URI || ""

const settingsSchema = new mongoose.Schema({
    last_sync: String,
    webhooks: {
        status: String,
        electronics: String,
        entertainment: String,
        technology: String,
        science: String,
        gaming: String,
        minecraft: String,
        podcasts: String,
        coding: String,
        doctrzombie: String
    }
});

const channelSchema = new mongoose.Schema({
    "category": String,
    "name": String,
    "username": String,
    "channel_id": String,
    "configuration": Object
});
const videoSchema = new mongoose.Schema({
    "publishedAt": Date,
    "channelId": String,
    "title": String,
    "thumbnails": {
        "url": String,
        "width": Number,
        "height": Number
    },
    "url": String,
    "type": String
});

const Channel = mongoose.model('Channel', channelSchema, 'youtube_channels');
const Video = mongoose.model('Video', videoSchema, 'youtube_data');
const Setting = mongoose.model('Setting', settingsSchema, 'settings');
async function connectDB() {
    try {
        await mongoose.connect(uri);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("✅ MongoDB connected successfully!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // stop server if DB connection fails
    }
}


app.get("/test", async (req, res) => {
    try {
        // Ping the database to make sure it's reachable
        await mongoose.connection.db.admin().command({ ping: 1 });
        res.send("Ping successful! Database is connected.");
    } catch (err) {
        res.status(500).send("Database ping failed: " + err.message);
    }
});

app.get("/get-settings", async (req, res) => {
    try {
        // Find the single document in the collection
        const settings = await Setting.findOne();

        if (!settings) {
            return res.status(404).json({ message: "No settings found" });
        }

        // Example: Accessing a specific webhook in your code
        const gamingWebhook = settings.webhooks.gaming;
        console.log("Gaming Webhook URL:", gamingWebhook);

        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/get-channels", async (req, res) => {
    try {
        // Find the single document in the collection
        const channels = await Channel.findOne();

        if (!channels) {
            return res.status(404).json({ message: "No channels found" });
        }

        res.json(channels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/get-videos", async (req, res) => {
    try {
        const limit = req.query;
        const limitNumber = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 10));
        const videos = await Video.aggregate([
            {
                $lookup: {
                    from: "youtube_channels",
                    localField: "channelId",
                    foreignField: "channel_id",
                    as: "channelInfo"
                }
            },
            {
                $unwind: {
                    path: "$channelInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            { $sort: { publishedAt: -1 } },
            { $limit: limitNumber }
        ]);

        res.json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

async function startServer() {
    try {
        await mongoose.connect(uri);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("✅ MongoDB connected successfully!");

        // Start server AFTER DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}

startServer();