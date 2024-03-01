const express = require("express");
const bodyParser = require("body-parser");
const { ApiRouter } = require("./router");
const cors = require("cors");
const {
  sendFileToSftp,
  createUploadsDirectory,
} = require("./helpers/fileHelper");

const app = express();
const port = 8080;

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "This is FluxBaze API" });
});

const router = new ApiRouter(app);
router.initGroupRoutes();
router.initProductRoutes();
router.initProductValueModelRoutes();
router.initProductValueRoutes();
router.initOfferRoutes();
router.initFileRoutes();

createUploadsDirectory();

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
