const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "items.json");
const PUBLIC_DIR = path.join(__dirname, "public");

app.use(express.json({ limit: "2mb" }));
app.use(express.static(PUBLIC_DIR));

// Always return a JSON error for malformed/oversized API requests.
app.use((error, req, res, next) => {
  if (req.path.startsWith("/api/")) {
    const status = error.status || error.statusCode || 400;
    return res.status(status).json({
      success: false,
      message: status === 413
        ? "Request is too large. Please choose a smaller photo."
        : "The server could not read this request. Please restart the app and try again."
    });
  }
  next(error);
});

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const sampleItems = [
      {
        id: crypto.randomUUID(),
        type: "lost",
        name: "Blue Water Bottle",
        category: "Bottle",
        description: "A blue reusable bottle with a small sticker on the side.",
        location: "Library",
        date: new Date().toISOString().slice(0, 10),
        contact: "student@example.com",
        image: "",
        status: "open",
        createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        type: "found",
        name: "Black Umbrella",
        category: "Accessories",
        description: "Black folding umbrella found near the main entrance.",
        location: "Main Gate",
        date: new Date().toISOString().slice(0, 10),
        contact: "security@example.com",
        image: "",
        status: "open",
        createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        type: "lost",
        name: "Student ID Card",
        category: "ID Card",
        description: "Student ID card. Please verify the owner before handing it over.",
        location: "Canteen",
        date: new Date().toISOString().slice(0, 10),
        contact: "student@example.com",
        image: "",
        status: "open",
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(sampleItems, null, 2));
  }
}

function readItems() {
  ensureDataFile();
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    throw new Error("Item storage could not be read. Check data/items.json.");
  }
}

function writeItems(items) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

function clean(value, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

app.get("/api/items", (req, res) => {
  try {
    let items = readItems();
    const q = clean(req.query.q, 100).toLowerCase();
    const type = clean(req.query.type, 10).toLowerCase();
    const category = clean(req.query.category, 60).toLowerCase();
    const status = clean(req.query.status, 20).toLowerCase();

    if (q) {
      items = items.filter(item =>
        [item.name, item.category, item.description, item.location]
          .some(value => String(value || "").toLowerCase().includes(q))
      );
    }
    if (type === "lost" || type === "found") items = items.filter(item => item.type === type);
    if (category && category !== "all") {
      items = items.filter(item => String(item.category).toLowerCase() === category);
    }
    if (status === "open" || status === "resolved") items = items.filter(item => item.status === status);

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/items", (req, res) => {
  const body = req.body || {};
  const type = clean(body.type, 10).toLowerCase();
  const name = clean(body.name, 100);
  const category = clean(body.category, 60);
  const description = clean(body.description, 1000);
  const location = clean(body.location, 100);
  const date = clean(body.date, 10);
  const contact = clean(body.contact, 120);
  const image = clean(body.image, 100000);

  if (!["lost", "found"].includes(type)) {
    return res.status(400).json({ success: false, message: "Choose Lost or Found." });
  }
  if (!name || !category || !description || !location || !date || !contact) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }
  if (image && !/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(image)) {
    return res.status(400).json({ success: false, message: "Please use a valid image file." });
  }
  if (image.length > 90000) {
    return res.status(413).json({ success: false, message: "Image is too large. Choose an image under about 65 KB." });
  }

  try {
    const items = readItems();
    const item = {
      id: crypto.randomUUID(),
      type, name, category, description, location, date, contact, image,
      status: "open",
      createdAt: new Date().toISOString()
    };
    items.push(item);
    writeItems(items);
    res.status(201).json({ success: true, item, message: "Your report was added successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch("/api/items/:id/resolve", (req, res) => {
  try {
    const items = readItems();
    const item = items.find(entry => entry.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found." });
    item.status = item.status === "resolved" ? "open" : "resolved";
    writeItems(items);
    res.json({ success: true, item, message: item.status === "resolved" ? "Item marked as resolved." : "Item reopened." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

ensureDataFile();
app.listen(PORT, () => {
  console.log(`Campus Lost & Found is running at http://localhost:${PORT}`);
});
