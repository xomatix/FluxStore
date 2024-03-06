const { DBquery } = require("../database");
const { setNthBit } = require("../helpers/bitOperators");
const { ResponseModel } = require("../models/responseModel");

class ProductValueModelController {
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
      var whereQuery = "";
      if (reqBody.data != null && reqBody.data != undefined)
        if (
          reqBody.data.group_id != null &&
          typeof reqBody.data.group_id == typeof 0
        ) {
          whereQuery = `where pvm.pg_id = ${reqBody.data.group_id} `;
        }
      var data = await DBquery(
        `select pvm.pvm_id as id, pvm.pvm_name as name, pvm.pvm_code as code , pvm.pg_id as group_id, pvm.pvm_desc as desc, pvm.pvm_flag as flag, pvm.pvm_flag&(1) <> 0 as is_number, pvm.pvm_flag&(2) <> 0 as is_dictionary, pvm.pvm_flag&(3) = 0 as is_text
          ` +
          `from p_value_model pvm ` +
          `${whereQuery}` +
          `${rowsPageQuery};`
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
      if (
        reqBody.name == null ||
        reqBody.name == "" ||
        reqBody.code == null ||
        reqBody.code == ""
      ) {
        throw "no name or code provided";
      }
      var exists = await DBquery(
        `select count(*)>0 as exists from p_value_model where pg_id = ${reqBody.group_id} and pvm_code ilike upper('${reqBody.code}');`
      );
      if (exists.length > 1 || exists[0].exists == true) {
        throw `p_value_model with code ${reqBody.code} exists`;
      }
      if (
        reqBody.flag == undefined ||
        reqBody.flag == null ||
        typeof reqBody.flag != typeof 0
      ) {
        throw `no flag provided or not correct format (INT)`;
      }
      var data = await DBquery(
        `insert into p_value_model (pvm_name , pvm_code ,pg_id,pvm_desc,pvm_flag) VALUES ('${reqBody.name}',upper('${reqBody.code}'),${reqBody.group_id},'${reqBody.desc}',${reqBody.flag}) ` +
          `returning pvm_id as id, pvm_name as name, pvm_code as code , pg_id as group_id, pvm_desc as desc, pvm_flag as flag;`
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
        `SELECT count(*)>0 as exists FROM p_value_model pvm where pvm.pvm_id = ${reqBody.id};`
      );
      if (exists.length < 1 || !exists[0].exists) {
        throw `product value model with id ${reqBody.id} does not exists`;
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
      if (
        reqBody.is_number == true &&
        reqBody.is_dictionary == false &&
        reqBody.is_text == false
      ) {
        reqBody.flag = setNthBit(reqBody.flag, 1, 1);
        reqBody.flag = setNthBit(reqBody.flag, 2, 0);
      }
      if (
        reqBody.is_number == false &&
        reqBody.is_dictionary == true &&
        reqBody.is_text == false
      ) {
        reqBody.flag = setNthBit(reqBody.flag, 2, 1);
        reqBody.flag = setNthBit(reqBody.flag, 1, 0);
      }
      if (
        reqBody.is_number == false &&
        reqBody.is_dictionary == false &&
        reqBody.is_text == true
      ) {
        reqBody.flag = setNthBit(reqBody.flag, 1, 0);
        reqBody.flag = setNthBit(reqBody.flag, 2, 0);
      }
      console.log(reqBody);
      var data = await DBquery(
        `update p_value_model set pvm_name = '${reqBody.name}' , pvm_code = upper('${reqBody.code}') , pvm_desc = '${reqBody.desc}',pvm_flag = ${reqBody.flag} where pvm_id = ${reqBody.id} ` +
          `returning pvm_id as id, pvm_name as name, pvm_code as code , pg_id as group_id, pvm_desc as desc, pvm_flag as flag;`
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
        `SELECT count(*)>0 as exists FROM p_value_model WHERE pvm_id = ${reqBody.id};`
      );
      if (exists.length < 1 || !exists[0].exists) {
        throw `p value model with id ${reqBody.id} does not exists`;
      }
      var data = await DBquery(
        `begin;` +
          `delete from p_value where pvm_id = ${reqBody.id};` +
          `delete from p_value_model where pvm_id = ${reqBody.id} ;` +
          `commit;`
      );
      response
        .status(200)
        .send(`product value model with id = ${reqBody.id} deleted`);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };
}

module.exports = {
  ProductValueModelController,
};
