const { baseApiUri } = require("./constants");

class ProductValueModelController {
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
    await fetch(baseApiUri + "/pvaluemodel/list", requestOptions)
      .then((response) => response.text())
      .then((result) => (response = JSON.parse(result)))
      .catch((error) => {
        response = error;
        console.error(error);
      });
    return response;
  };
}

module.exports = {
  ProductValueModelController,
};
