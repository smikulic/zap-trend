const axios = require("axios");
const cheerio = require("cheerio");

let dailyTopData = {};
let dailyBottomData = {};

const total = 20;
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
  const prices = [];

  $html(apartmentsDomQuery).each(function () {
    const priceRaw = $html(this)
      .find(".entity-prices .price-items .price--eur")
      .text();
    const price = priceRaw.match(numberPattern)
      ? priceRaw.match(numberPattern).join("")
      : null;

    if (price) {
      prices.push({
        price,
      });
    }
  });

  return prices.slice(0, total);
};

axios(topApartmentsUrl)
  .then((response) => {
    const $html = cheerio.load(response.data);

    dailyTopData = {
      day: Date(),
      apartments: getApartments($html),
      total,
    };
    console.log(dailyTopData);
  })
  .catch(console.error);

axios(bottomApartmentsUrl)
  .then((response) => {
    const $html = cheerio.load(response.data);

    dailyBottomData = {
      day: Date(),
      apartments: getApartments($html),
      total,
    };
    console.log(dailyBottomData);
  })
  .catch(console.error);
