
// todo create error log function //

const fs = require('fs');
const got = require('got');

const config = {
  siteUrl: 'https://www.lightup.com',
  outFile: 'lightRedirects.json',
};

function openFile(file) {
  return fs.readFileSync(file, 'utf8', (err, data) => (err || data));
}

// todo check if file exists. if not creat file //
async function getResponse(requestedUrl) {
  try {
    console.log(`sending request to ${requestedUrl}`);
    const response = await got(`${requestedUrl}.html`, {
      prefixUrl: config.siteUrl,
      timeout: 5000,
    });
    const redirectUrl = response.redirectUrls.pop();
    if (redirectUrl) {
      fs.readFile(config.outFile, (err, data) => {
        const json = JSON.parse(data);
        json.push({ requestedUrl: `${config.siteUrl}\\${requestedUrl}.html`, redirectUrl });
        fs.writeFileSync(config.outFile, JSON.stringify(json));
      });
    }
  } catch (error) {
    console.log(`Ohhhh nooooo${error}`);
  }
}

const paths = openFile('./redirected_urls.txt').split(',');
paths.forEach((path) => {
  getResponse(path);
});
