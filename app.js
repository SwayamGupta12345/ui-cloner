const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const archiver = require('archiver');
const cloneSite = require('./scripts/clone');
const app = express();
const PORT = 3000;

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
const SAVED_DIR = path.join(__dirname, 'saved');
const HISTORY_FILE = path.join(__dirname, 'clone-history.json');

app.use(express.static('public'));
app.use('/downloads', express.static(DOWNLOAD_DIR));
app.use('/saved', express.static(SAVED_DIR));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Load and save history
const loadHistory = () => fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE)) : [];
const saveHistory = (history) => fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

// Clean up downloads dir on startup
fs.emptyDirSync(DOWNLOAD_DIR);

// Show main page
app.get('/', (req, res) => {
  const history = loadHistory();
  res.render('index', { result: null, error: null, history });
});

// Handle clone
app.post('/clone', async (req, res) => {
  const { url, name } = req.body;

  if (!url || !name) {
    return res.render('index', {
      result: null,
      error: 'Both URL and name are required.',
      history: loadHistory()
    });
  }

  try {
    const folder = await cloneSite(url);
    const sourceFolder = path.join(DOWNLOAD_DIR, folder);
    const savedFolder = path.join(SAVED_DIR, folder);

    await fs.copy(sourceFolder, savedFolder);
    await fs.remove(sourceFolder);

    const history = loadHistory();
    history.push({ name, folder });
    saveHistory(history);

    return res.render('index', {
      result: `/saved/${folder}/index.html`,
      folder,
      error: null,
      history
    });
  } catch (err) {
    return res.render('index', {
      result: null,
      error: `Clone failed: ${err.message}`,
      history: loadHistory()
    });
  }
});

// Zip and send for download
app.get('/download/:folder', async (req, res) => {
  const folder = req.params.folder;
  const folderPath = path.join(SAVED_DIR, folder);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).send('Folder not found');
  }

  res.setHeader('Content-Disposition', `attachment; filename="${folder}.zip"`);
  res.setHeader('Content-Type', 'application/zip');

  const archive = archiver('zip');
  archive.directory(folderPath, false);
  archive.pipe(res);
  archive.finalize();
});

app.delete("/delete/:folder", (req, res) => {
  const folder = req.params.folder;
  const folderPath = path.join(__dirname, "saved", folder);

  try {
    // 1. Delete folder recursively
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log("✅ Deleted folder:", folderPath);
    } else {
      return res.status(404).json({ error: "Folder not found" });
    }

    // 2. Update clone-history.json
    const historyPath = path.join(__dirname, "clone-history.json");
    if (fs.existsSync(historyPath)) {
      const history = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
      const updatedHistory = history.filter(item => item.folder !== folder);
      fs.writeFileSync(historyPath, JSON.stringify(updatedHistory, null, 2));
      console.log("✅ Updated clone-history.json");
    }

    res.json({ success: true, message: "Cloned project deleted" });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
