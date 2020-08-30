const axios = require("axios");
const cheerio = require("cheerio");

let dailyData = {
  day: Date(),
  highest: [],
  lowest: [],
  highestTotal: 0,
  highestAverage: 0,
  lowestTotal: 0,
  lowestAverage: 0,
};

const numberPattern = /\d+/g;
const apartmentsDomQuery =
  ".EntityList.EntityList--Standard.EntityList--Regular ul.EntityList-items > li";

// 30 highest priced apartments
const topApartmentsUrl =
  "https://www.njuskalo.hr/prodaja-stanova?locationIds=1250%2C1252&includeOtherCategories=1&adsWithImages=1&furnishLevelAndCondition%5Bfurnished%5D=1&sort=expensive";
// 30 lowest priced apartments
const bottomApartmentsUrl =
  "https://www.njuskalo.hr/prodaja-stanova?locationIds=1250%2C1252&price%5Bmin%5D=10000&includeOtherCategories=1&adsWithImages=1&furnishLevelAndCondition%5Bfurnished%5D=1&sort=cheap";

getApartments = ($html) => {
  const apartments = [];
  let totalValue = 0;

  $html(apartmentsDomQuery).each(function () {
    const priceRaw = $html(this)
      .find(".entity-prices .price-items .price--eur")
      .text();
    const price = priceRaw.match(numberPattern)
      ? parseInt(priceRaw.match(numberPattern).join(""), 10)
      : null;

    if (price) {
      totalValue += price;
      apartments.push({
        price,
      });
    }
  });

  return {
    apartments,
    totalValue,
    averageValue: Math.round(totalValue / apartments.length),
  };
};

const scrapeTopAndBottomApartments = async (cb) => {
  try {
    await axios(topApartmentsUrl)
      .then((response) => {
        const $html = cheerio.load(response.data);
        const { apartments, averageValue, totalValue } = getApartments($html);
        dailyData.highest = apartments;
        dailyData.highestTotal = totalValue;
        dailyData.highestAverage = averageValue;
      })
      .catch(console.error);
  } catch (err) {
    console.error(err);
  }
  try {
    await axios(bottomApartmentsUrl)
      .then((response) => {
        const $html = cheerio.load(response.data);
        const { apartments, averageValue, totalValue } = getApartments($html);
        dailyData.lowest = apartments;
        dailyData.lowestTotal = totalValue;
        dailyData.lowestAverage = averageValue;
      })
      .catch(console.error);
  } catch (err) {
    console.error(err);
  }
  cb(dailyData);
};

// Testing locally
// const fillOut = (data) => console.log(data);
// scrapeTopAndBottomApartments(fillOut);

module.exports = {
  scrapeTopAndBottomApartments,
};
