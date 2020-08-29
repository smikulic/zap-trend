const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const fs = require("fs");
const { scrapeTopAndBottomApartments } = require("./st-scraper");

const app = express();

const dataPath = "./data/apartments.json";

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes/routes.js")(app, fs);

const server = app.listen(3001, () => {
  console.log("listening on port %s...", server.address().port);
});

// Daily taks runner
cron.schedule("5 7 * * *", function () {
  console.log("running a task every day at 7:05 am");

  const updateDailyData = (result) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      let currentData = JSON.parse(data);
      let updatedData = [...currentData, result];

      fs.writeFile(dataPath, JSON.stringify(updatedData), function (err) {
        if (err) {
          throw err;
        }
        console.log("Daily apartments were saved!");
      });
    });
  };

  scrapeTopAndBottomApartments(updateDailyData);
});

app.listen(3128);
