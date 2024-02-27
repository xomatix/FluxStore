const { DBquery } = require("../database");
const { ResponseModel } = require("../models/responseModel");

class ProductController {
  static list = async (request, response) => {
    try {
      var reqBody = request.body;
      var rowsPageQuery = "";
      if (
        typeof reqBody.page == typeof 0 &&
        reqBody.page > -1 &&
        typeof reqBody.rows == typeof 0 &&
        reqBody.rows > 0
      ) {
        rowsPageQuery = `offset ${reqBody.page * reqBody.rows} limit ${
          reqBody.rows
        }`;
      }
      var data = await DBquery(
        `select pp.pp_id as id, pp.pp_name as name, pp.pp_code as code, pp.pp_price as price, pp.pp_desc as desc , pp.pg_id as group_id, pp.pp_quantity as quantity, pp.pp_flag as flag, ` +
          `json_agg( JSON_BUILD_OBJECT('model_id',pv.pvm_id ,'name',pvm.pvm_name ,'code',pvm.pvm_code ,'desc',pvm.pvm_desc, 'flag',pvm.pvm_flag ,'value',pv.pv_value)) as valueList ` +
          `from p_product pp ` +
          `left join p_value pv on (pp.pp_id=pv.pp_id) ` +
          `left join p_value_model pvm on (pv.pvm_id=pvm.pvm_id) ` +
          `group by pp.pp_id ` +
          `${rowsPageQuery};`
      );
      var m = new ResponseModel(data, data.length, reqBody.page);
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
        reqBody.name == null ||
        reqBody.name == "" ||
        reqBody.code == null ||
        reqBody.code == ""
      ) {
        throw "no name or code provided";
      }
      if (reqBody.desc == null || reqBody.desc == "") {
        throw "no desc provided";
      }
      var exists = await DBquery(
        `SELECT count(*)>0 as exists FROM p_product WHERE pp_code ilike upper('${reqBody.code}');`
      );
      if (exists.length > 1 || exists[0].exists == true) {
        throw `product with code ${reqBody.code} exists`;
      }
      if (
        reqBody.flag == undefined ||
        reqBody.flag == null ||
        typeof reqBody.flag != typeof 0
      ) {
        throw `no flag provided or not correct format (INT)`;
      }
      if (
        reqBody.price == undefined ||
        reqBody.price == null ||
        typeof reqBody.price != typeof 0
      ) {
        throw `no price provided or not correct format (decimal)`;
      }
      if (
        reqBody.group_id == undefined ||
        reqBody.group_id == null ||
        reqBody.group_id == 0 ||
        typeof reqBody.group_id != typeof 0
      ) {
        throw `no group_id provided or not correct format (INT)`;
      }
      var existsGroup = await DBquery(
        `SELECT count(*)>0 as exists FROM p_group WHERE pg_id = ${reqBody.group_id};`
      );
      if (existsGroup.length < 1 || existsGroup[0].exists == false) {
        throw `group with id ${reqBody.group_id} does not exists`;
      }
      var data = await DBquery(
        `insert into p_product (pp_name , pp_code ,pg_id,pp_quantity,pp_flag, pp_desc,pp_price) VALUES ('${reqBody.name}',upper('${reqBody.code}'),${reqBody.group_id},${reqBody.quantity},${reqBody.flag},'${reqBody.desc}', ${reqBody.price}) ` +
          `returning pp_id as id, pp_name as name, pp_code as code, pp_desc as desc, pp_price as price , pg_id as group_id, pp_quantity as quantity, pp_flag as flag;`
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
        reqBody.name == null ||
        reqBody.name == "" ||
        reqBody.code == null ||
        reqBody.code == ""
      ) {
        throw "no name or code provided";
      }
      if (reqBody.id == null || reqBody.id == 0) {
        throw "no id provided";
      }
      var exists = await DBquery(
        `SELECT count(*)>0 as exists FROM p_product WHERE pp_id = ${reqBody.id};`
      );
      if (exists.length < 1 || !exists[0].exists) {
        throw `product with id ${reqBody.id} does not exists`;
      }
      if (
        reqBody.flag == undefined ||
        reqBody.flag == null ||
        typeof reqBody.flag != typeof 0
      ) {
        throw `no flag provided or not correct format (INT)`;
      }
      if (
        reqBody.group_id != undefined &&
        reqBody.group_id != null &&
        reqBody.group_id != 0 &&
        typeof reqBody.group_id == typeof 0
      ) {
        throw `can't change group_id correct request format`;
      }
      var data = await DBquery(
        `update p_product set pp_name = '${reqBody.name}' , pp_code = upper('${reqBody.code}') , pp_quantity = ${reqBody.quantity},pp_flag = ${reqBody.flag}, pp_desc = '${reqBody.desc}', pp_price = ${reqBody.price} where pp_id = ${reqBody.id} ` +
          `returning pp_id as id, pp_name as name, pp_code as code, pp_desc as desc, pp_price as price , pg_id as group_id, pp_quantity as quantity, pp_flag as flag;`
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
        `SELECT count(*)>0 as exists FROM p_product WHERE pp_id = ${reqBody.id};`
      );
      if (exists.length < 1 || !exists[0].exists) {
        throw `product with id ${reqBody.id} does not exists`;
      }
      var data = await DBquery(
        `delete from p_product where pp_id = ${reqBody.id} `
      );
      response.status(200).send(`product with id = ${reqBody.id} deleted`);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };
}

module.exports = {
  ProductController,
};
