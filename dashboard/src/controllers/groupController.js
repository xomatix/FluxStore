const { calculateSHA256 } = require("@/logic/hashing");
const { baseApiUri } = require("./constants");

class GroupController {
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
    await fetch(baseApiUri + "/group/list", requestOptions)
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
    await fetch(baseApiUri + "/group/add", requestOptions)
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
    await fetch(baseApiUri + "/group/update", requestOptions)
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
  GroupController,
};
