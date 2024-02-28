const { DBquery } = require("../database");
const { ResponseModel } = require("../models/responseModel");

//TODO list adding, list updating, list delete
class ProductValueController {
  static list = async (request, response) => {
    try {
      var reqBody = request.body;

      var whereQuery = "";
      if (reqBody.product_ids != null && reqBody.product_ids != undefined) {
        if (
          reqBody.product_ids != null &&
          typeof reqBody.product_ids != typeof []
        ) {
          whereQuery = `where pv.pp_id in ${reqBody.product_ids} `;
        }
      }
      var data = await DBquery(
        `select pv.pvm_id as model_id, pv.pp_id as product_id , pv.pv_value as value, pvm.pvm_name as name,pvm.pvm_code as code, pvm.pvm_desc as desc, pvm.pvm_flag as flag ` +
          `from p_value pv left join p_value_model pvm on (pvm.pvm_id=pv.pvm_id) ` +
          `${whereQuery};`
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
      if (
        reqBody.model_id == undefined ||
        reqBody.model_id == null ||
        reqBody.model_id == 0 ||
        typeof reqBody.model_id != typeof 0
      ) {
        throw `no model_id provided or not correct format (INT)`;
      }

      if (
        reqBody.product_id == undefined ||
        reqBody.product_id == null ||
        reqBody.product_id == 0 ||
        typeof reqBody.product_id != typeof 0
      ) {
        throw "no product_id provided or not correct format (INT)";
      }
      var existsValue = await DBquery(
        `SELECT count(*)>0 as exists FROM p_value WHERE pp_id = ${reqBody.product_id} and pvm_id = ${reqBody.model_id};`
      );
      if (existsValue.length > 0 && existsValue[0].exists == true) {
        this.update(request, response);
        return;
      }
      var existsModel = await DBquery(
        `select count(*)>0 as exists from p_value_model pvm where pvm.pvm_id = ${reqBody.model_id};`
      );
      if (existsModel.length < 1 || existsModel[0].exists == false) {
        throw `model with id ${reqBody.model_id} does not exists`;
      }
      var exists = await DBquery(
        `select count(*)>0 as exists from p_product where pp_id = ${reqBody.product_id};`
      );
      if (exists.length < 1 || exists[0].exists == false) {
        throw `p_value_model with code ${reqBody.code} does not exists`;
      }

      var data = await DBquery(
        `insert into p_value (pvm_id , pp_id , pv_value) VALUES (${reqBody.model_id},${reqBody.product_id},'${reqBody.value}') ` +
          `returning pvm_id as model_id, pp_id as product_id , pv_value as value;`
      );
      var m = new ResponseModel(data, data.length, 0);
      response.status(200).send(m);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };

  static update = async (request, response) => {
    try {
      var reqBody = request.body;
      if (
        reqBody.model_id == undefined ||
        reqBody.model_id == null ||
        reqBody.model_id == 0 ||
        typeof reqBody.model_id != typeof 0
      ) {
        throw `no model_id provided or not correct format (INT)`;
      }
      var existsModel = await DBquery(
        `select count(*)>0 as exists from p_value_model pvm where pvm.pvm_id = ${reqBody.model_id};`
      );
      if (existsModel.length < 1 || existsModel[0].exists == false) {
        throw `model with id ${reqBody.model_id} does not exists`;
      }
      if (
        reqBody.product_id == undefined ||
        reqBody.product_id == null ||
        reqBody.product_id == 0 ||
        typeof reqBody.product_id != typeof 0
      ) {
        throw "no product_id provided or not correct format (INT)";
      }
      var exists = await DBquery(
        `select count(*)>0 as exists from p_product where pp_id = ${reqBody.product_id};`
      );
      if (exists.length < 1 || exists[0].exists == false) {
        throw `p_value_model with code ${reqBody.code} does not exists`;
      }
      var data = await DBquery(
        `update p_value set pvm_id = '${reqBody.model_id}', pp_id = '${reqBody.product_id}' , pv_value = '${reqBody.value}' ` +
          `returning pvm_id as model_id, pp_id as product_id , pv_value as value;`
      );
      var m = new ResponseModel(data, data.length, 0);
      response.status(200).send(m);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };

  static delete = async (request, response) => {
    try {
      var reqBody = request.body;
      if (reqBody.id == null || reqBody.id == 0) {
        throw "no id provided";
      }
      var exists = await DBquery(
        `SELECT count(*)>0 as exists FROM p_value WHERE pvm_id = ${reqBody.model_id};`
      );
      if (exists.length < 1 || !exists[0].exists) {
        throw `p value with id ${reqBody.id} does not exists`;
      }
      var data = await DBquery(
        `delete from p_value where pvm_id = ${reqBody.model_id} `
      );
      response
        .status(200)
        .send(`product value with id = ${reqBody.id} deleted`);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };
}

module.exports = {
  ProductValueController,
};
