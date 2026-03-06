import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';


const app = express();
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
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        console.log("✅ MongoDB connected successfully!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // stop server if DB connection fails
    }
}

// Connect to DB before starting the server
connectDB();

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
        // Find videos and sort by most recent publish date
        const videos = await Video.find()
            .sort({ publishedAt: -1 })
            .limit(10);

        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
