const { response } = require("express");
const { GroupContorller } = require("./controllers/group");
const { OfferController } = require("./controllers/offer");
const { ProductController } = require("./controllers/product");
const { ProductValueController } = require("./controllers/productValue");
const {
  ProductValueModelController,
} = require("./controllers/productValueModel");
const { FileController } = require("./controllers/file");

class ApiRouter {
  app;
  constructor(app) {
    this.app = app;
  }
  initGroupRoutes = () => {
    this.app.post("/group/list", (request, response) => {
      GroupContorller.list(request, response);
    });
    this.app.post("/group/add", (request, response) => {
      GroupContorller.add(request, response);
    });
    this.app.post("/group/update", (request, response) => {
      GroupContorller.update(request, response);
    });
    this.app.post("/group/delete", (request, response) => {
      GroupContorller.delete(request, response);
    });
  };
  initProductRoutes = () => {
    this.app.post("/product/list", (request, response) => {
      ProductController.list(request, response);
    });
    this.app.post("/product/add", (request, response) => {
      ProductController.add(request, response);
    });
    this.app.post("/product/update", (request, response) => {
      ProductController.update(request, response);
    });
    this.app.post("/product/delete", (request, response) => {
      ProductController.delete(request, response);
    });
  };
  initProductValueModelRoutes = () => {
    this.app.post("/pvaluemodel/list", (request, response) => {
      ProductValueModelController.list(request, response);
    });
    this.app.post("/pvaluemodel/add", (request, response) => {
      ProductValueModelController.add(request, response);
    });
    this.app.post("/pvaluemodel/update", (request, response) => {
      ProductValueModelController.update(request, response);
    });
    this.app.post("/pvaluemodel/delete", (request, response) => {
      ProductValueModelController.delete(request, response);
    });
  };
  initProductValueRoutes = () => {
    this.app.post("/pvalue/list", (request, response) => {
      ProductValueController.list(request, response);
    });
    this.app.post("/pvalue/add", (request, response) => {
      ProductValueController.add(request, response);
    });
    this.app.post("/pvalue/update", (request, response) => {
      ProductValueController.update(request, response);
    });
    this.app.post("/pvalue/delete", (request, response) => {
      ProductValueController.delete(request, response);
    });
  };
  initOfferRoutes = () => {
    this.app.post("/offer/list", (request, response) => {
      OfferController.list(request, response);
    });
    this.app.post("/offer/add", (request, response) => {
      OfferController.add(request, response);
    });
    this.app.post("/offer/update", (request, response) => {
      OfferController.update(request, response);
    });
    this.app.post("/offer/delete", (request, response) => {
      OfferController.delete(request, response);
    });
  };
  initFileRoutes = () => {
    this.app.post(
      "/file/add",
      FileController.upload.single("file"),
      (request, response) => {
        FileController.add(request, response);
      }
    );
    this.app.post("/file/list", (request, response) => {
      FileController.list(request, response);
    });
    this.app.post("/file/update", (request, response) => {
      FileController.update(request, response);
    });
    this.app.post("/file/delete", (request, response) => {
      FileController.delete(request, response);
    });
  };
}

module.exports = {
  ApiRouter,
};
