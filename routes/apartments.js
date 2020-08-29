const apartmentRoutes = (app, fs) => {
  const dataPath = "./data/apartments.json";

  // READ
  app.get("/apartments", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });
};

module.exports = apartmentRoutes;
