const { baseApiUri } = require("./constants");

class FileController {
  /**
   * List of files
   * @param {object} inputModel - { "ids": [int] }
   * @returns {object} Standard response model 
   {
        "data": [
            {
                "id": 2,
                "product_id": 8,
                "path": "/8/Cts24XAU.jpg",
                "flag": 0,
                "is_main": false
            }]
        "rows": 4,
        "page": 0
    }
   */
  static list = async (inputModel) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(inputModel);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    var response = {};
    var hash = calculateSHA256(raw);
    await fetch(baseApiUri + "/file/list", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        localStorage.setItem(hash, result);
        response = JSON.parse(result);
      })
      .catch((error) => {
        response = error;
        console.error(error);
      });

    return response;
  };

  /**
   * Adds one photo file .webp is blocked to 
   * @param {object} inputModel - { "ids": [int] }
   * @returns {object} Standard response model 
   {
        "data": [
            {
                "id": 2,
                "product_id": 8,
                "path": "/8/Cts24XAU.jpg",
                "flag": 0,
                "is_main": false
            }]
        "rows": 4,
        "page": 0
    }
   */
  static add = async (inputFile, productId) => {
    const formdata = new FormData();
    formdata.append("file", inputFile, inputFile.name);
    if (typeof productId != typeof 0 || Number(productId) == NaN) {
      throw "Wrong format of productId: " + productId;
    }

    formdata.append("id", productId);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    console.log(formdata);

    var response = {};
    await fetch(baseApiUri + "/file/add", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        response = JSON.parse(result);
      })
      .catch((error) => {
        response = error;
        console.error(error);
      });

    return response;
  };
}

module.exports = {
  FileController,
};
