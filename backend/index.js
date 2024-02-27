const express = require("express");
const bodyParser = require("body-parser");
const { getProducts } = require("./controllers/product");
const { ApiRouter } = require("./router");
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "This is FluxBaze API" });
});
//
const router = new ApiRouter(app);
router.initGroupRoutes();
router.initProductRoutes();
router.initProductValueModelRoutes();
router.initProductValueRoutes();

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
