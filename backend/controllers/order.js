const { OfferController } = require("./offer");

class OrderControlller {
  static list = async (request, response) => {
    try {
      var reqBody = request.body;
      var idsWhereQuery = "";
      if (
        typeof reqBody.ids == typeof [] &&
        reqBody.ids.length > 0 &&
        !isNaN(Number(reqBody.ids[0]))
      ) {
        idsWhereQuery = ` where pg_id in (${reqBody.ids.join(",")})`;
      }

      //   var offers = await OfferController.list({ ids: [1] });
      //   offers = offers.data[0];

      var data = await DBquery(
        `select pg_id as id, pg_name as name, pg_code as code,pg_flag as flag from p_group ${idsWhereQuery};`
      );
      var m = new ResponseModel(data, data.length, 0);
      response.status(200).send(m);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };

  static add = async (request, response) => {
    try {
      var reqBody = request.body;

      //implement

      response.status(200).send(m);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };

  static update = async (request, response) => {
    try {
      var reqBody = request.body;

      //implement

      response.status(200).send(m);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };
}

module.exports = {
  OrderControlller,
};
