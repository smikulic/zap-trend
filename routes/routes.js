const apartmentRoutes = require("./apartments");

const appRouter = (app, fs) => {
  app.get("/api", (req, res) => {
    res.send("Zagreb Apartments Price Trend API");
  });

  apartmentRoutes(app, fs);
};

module.exports = appRouter;
