const { DBquery } = require("../database");
const { ResponseModel } = require("../models/responseModel");

class GroupContorller {
  static list = async (request, response) => {
    try {
      var data = await DBquery(
        `select pg_id as id, pg_name as name, pg_code as code,pg_flag as flag from p_group;`
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
        reqBody.name == null ||
        reqBody.name == "" ||
        reqBody.code == null ||
        reqBody.code == ""
      ) {
        throw "no name or code provided";
      }
      var exists = await DBquery(
        `SELECT count(*)>0 as exists FROM p_group WHERE pg_code ilike upper('%${reqBody.code}%')`
      );
      if (exists.length < 1 || exists[0].exists) {
        throw `group with code ${reqBody.code} exists`;
      }
      if (
        reqBody.flag == undefined ||
        reqBody.flag == null ||
        typeof reqBody.flag != typeof 0
      ) {
        throw `no flag provided or not correct format (INT)`;
      }
      var data = await DBquery(
        `insert into p_group (pg_name , pg_code,pg_flag) VALUES ('${reqBody.name}',upper('${reqBody.code}'),${reqBody.flag}) ` +
          `returning pg_id as id, pg_name as name, pg_code as code, pg_flag as flag;`
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
        `SELECT count(*)>0 as exists FROM p_group WHERE pg_id = ${reqBody.id};`
      );
      if (exists.length < 1 || !exists[0].exists) {
        throw `group with id ${reqBody.id} does not exists`;
      }
      if (
        reqBody.flag == undefined ||
        reqBody.flag == null ||
        typeof reqBody.flag != typeof 0
      ) {
        throw `no flag provided or not correct format (INT)`;
      }
      var data = await DBquery(
        `update p_group set pg_name = '${reqBody.name}', pg_code = upper('${reqBody.code}'), pg_flag = ${reqBody.flag} where pg_id = ${reqBody.id} ` +
          `returning pg_id as id, pg_name as name, pg_code as code, pg_flag as flag;`
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
        `SELECT count(*)>0 as exists FROM p_group WHERE pg_id = ${reqBody.id};`
      );
      if (exists.length < 1 || !exists[0].exists) {
        throw `group with id ${reqBody.id} does not exists`;
      }
      var data = await DBquery(
        `delete from p_group where pg_id = ${reqBody.id} `
      );
      response.status(200).send(`group with id = ${reqBody.id} deleted`);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };
}

module.exports = {
  GroupContorller,
};
