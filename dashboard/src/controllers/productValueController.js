const { baseApiUri } = require("./constants");

class ProductValueController {
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
    await fetch(baseApiUri + "/pvalue/list", requestOptions)
      .then((response) => response.text())
      .then((result) => (response = JSON.parse(result)))
      .catch((error) => {
        response = error;
        console.error(error);
      });
    return response;
  };
  static add = async (inputModel) => {
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
    await fetch(baseApiUri + "/pvalue/add", requestOptions)
      .then((response) => response.text())
      .then((result) => (response = JSON.parse(result)))
      .catch((error) => {
        response = error;
        console.error(error);
      });
    return response;
  };

  static update = async (inputModel) => {
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
    await fetch(baseApiUri + "/pvalue/update", requestOptions)
      .then((response) => response.text())
      .then((result) => (response = JSON.parse(result)))
      .catch((error) => {
        response = error;
        console.error(error);
      });
    return response;
  };

  static delete = async (inputModel) => {
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
    await fetch(baseApiUri + "/pvalue/delete", requestOptions)
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
  ProductValueController,
};
