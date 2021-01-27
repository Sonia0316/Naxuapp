"use strict";
const fs = require("fs");
const exec = require("await-exec");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const deployWebsite = async function (app) {
  try {
    console.log(`APP: ${app.bucket}`);
    await exec(
      `npm run prodm && aws s3 rm s3://${app.bucket} --recursive --profile naxu && aws s3 cp ./dist s3://${app.bucket} --recursive --profile naxu`
    );
    console.log(`APP DESPLEGADA: ${app.bucket}`);
  } catch (e) {
    console.log("ERROR POR AQUI");
    console.log(e);
  }
};
const handler = async (event) => {
  const fileContent = fs.readFileSync("./apps.json");
  const content = JSON.parse(fileContent);
  await asyncForEach(content, async (app) => {
    try {
      const data = {
        url: app.url,
      };
      fs.writeFileSync("./src/environments/url.json", JSON.stringify(data));
      await deployWebsite(app);
    } catch (error) {}
  });
};

module.exports = { handler };

handler()
  .then((e) => {
    console.log("====================================");
    console.log("SUCCESS");
    console.log(e);
    console.log("====================================");
  })
  .catch((e) => {
    console.log("====================================");
    console.log("ERROR");
    console.log(e);
    console.log("====================================");
  });
