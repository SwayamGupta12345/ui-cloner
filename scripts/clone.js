const https = require("https");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");
const { URL } = require("url");
const { v4: uuidv4 } = require("uuid");

const agent = new https.Agent({ rejectUnauthorized: false });

const downloadFile = async (fileUrl, outputPath) => {
  try {
    const response = await axios.get(fileUrl, {
      httpsAgent: agent,
      responseType: "arraybuffer",
    });

    await fs.outputFile(outputPath, response.data);
    console.log(`Saved: ${outputPath}`);
  } catch (err) {
    console.error(`Failed to download ${fileUrl}: ${err.message}`);
  }
};

const cloneSite = async (url) => {
  const baseUrl = new URL(url);
  const folderName = uuidv4();
  const htmlDir = path.join(__dirname, "../downloads", folderName);
  await fs.ensureDir(htmlDir);

  const { data: html } = await axios.get(url, { httpsAgent: agent });
  const $ = cheerio.load(html);

  const indexPath = path.join(htmlDir, "index.html");
  await fs.outputFile(indexPath, html);
  console.log("Saved HTML: index.html");

  const downloadAndReplace = async (selector, attr, folder) => {
    const elements = $(selector);
    for (const el of elements) {
      const src = $(el).attr(attr);
      if (!src || src.startsWith("data:")) continue;

      try {
        const fullUrl = new URL(src, baseUrl).href;
        const fileName = path.basename(src.split("?")[0]);
        const localPath = path.join("assets", folder, fileName);
        const outputPath = path.join(htmlDir, localPath);

        await downloadFile(fullUrl, outputPath);
        $(el).attr(attr, localPath);
      } catch (e) {
        console.error(`Skipping invalid URL: ${src}`);
      }
    }
  };

  await downloadAndReplace("link[rel='stylesheet']", "href", "css");
  await downloadAndReplace("script[src]", "src", "js");
  await downloadAndReplace("img", "src", "images");

  await fs.outputFile(indexPath, $.html());
  console.log("Updated HTML with local links saved.");

  return folderName;
};

module.exports = cloneSite;
