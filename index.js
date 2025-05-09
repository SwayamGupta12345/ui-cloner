const https = require("https");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");
const { URL } = require("url");

const agent = new https.Agent({  
    rejectUnauthorized: false  // Be cautious with this in production; it disables SSL certificate validation
});

const downloadFile = async (fileUrl, outputPath) => {
  try {
    // Send request with axios and use the custom https agent for ignoring SSL verification
    const response = await axios.get(fileUrl, { 
      httpsAgent: agent, 
      // responseType: "arraybuffer" 
    });

    // Ensure the directory exists before saving the file
    await fs.outputFile(outputPath, response.data);
    console.log(`Saved: ${outputPath}`);
  } catch (err) {
    console.error(`Failed to download ${fileUrl}: ${err.message}`);
  }
};

const processPage = async (url) => {
  const baseUrl = new URL(url);
  const htmlDir = path.join(__dirname, "output");
  await fs.ensureDir(htmlDir);

  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  // Save original HTML
  const indexPath = path.join(htmlDir, "index.html");
  await fs.outputFile(indexPath, html);
  console.log("Saved HTML: index.html");

  const downloadAndReplace = async (selector, attr, folder) => {
    const elements = $(selector);
    for (const el of elements) {
      const src = $(el).attr(attr);
      if (!src || src.startsWith("data:")) continue;

      const fullUrl = new URL(src, baseUrl).href;
      const fileName = path.basename(src.split("?")[0]);
      const localPath = path.join("assets", folder, fileName);
      const outputPath = path.join(htmlDir, localPath);

      await downloadFile(fullUrl, outputPath);
      $(el).attr(attr, localPath);
    }
  };

  // Download and replace CSS, JS, and images
  await downloadAndReplace("link[rel='stylesheet']", "href", "css");
  await downloadAndReplace("script[src]", "src", "js");
  await downloadAndReplace("img", "src", "images");

  // Save updated HTML
  await fs.outputFile(indexPath, $.html());
  console.log("Updated HTML with local links saved.");
};

const targetUrl = process.argv[2];
if (!targetUrl) {
  console.error("Usage: node index.js <website-url>");
  process.exit(1);
}

processPage(targetUrl);
