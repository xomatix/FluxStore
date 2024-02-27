const { DBquery } = require("../database");
const { ResponseModel } = require("../models/responseModel");

class OfferController {
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
      var preWhereQuery = this.generateWithPreQueries(reqBody);
      var postWhereQuery = this.genereateOfferWhereQuery(reqBody);
      var idsWhereQuery = "";
      if (
        typeof reqBody.ids == typeof [] &&
        reqBody.ids.length > 0 &&
        !isNaN(Number(reqBody.ids[0]))
      ) {
        preWhereQuery = "";
        postWhereQuery = "";
        idsWhereQuery = ` where pp.pp_id in (${reqBody.ids.join(",")})`;
      }

      var data = await DBquery(
        ` ${preWhereQuery} ` +
          `select pp.pp_id as id,pp.pp_price as price, ROUND((pp.pp_price*((100-oo.oo_discount)/100)),2) as disc_price,oo_discount as discount, pp.pp_name as name, pp.pp_code as code, pp.pp_desc as desc , pp.pg_id as group_id, pp.pp_quantity as quantity, pp.pp_flag as flag, ` +
          `json_agg( JSON_BUILD_OBJECT('model_id',pv.pvm_id ,'name',pvm.pvm_name ,'code',pvm.pvm_code ,'desc',pvm.pvm_desc, 'flag',pvm.pvm_flag ,'value',pv.pv_value)) as valueList ` +
          `from p_product pp ` +
          `join o_offer oo on (pp.pp_id=oo.pp_id) ` +
          `join p_value pv on (pp.pp_id=pv.pp_id) ` +
          `join p_value_model pvm on (pv.pvm_id=pvm.pvm_id) ` +
          ` ${idsWhereQuery} ` +
          ` ${preWhereQuery != "" || postWhereQuery != "" ? "where" : ""}` +
          ` ${postWhereQuery} ` +
          ` ${postWhereQuery != "" && preWhereQuery != "" ? " and " : ""}` +
          ` ${
            preWhereQuery != ""
              ? "pp.pp_id in (select * from combined_subquery)"
              : ""
          } ` +
          `group by pp.pp_id , oo.oo_discount ` +
          `${rowsPageQuery};`
      );
      var m = new ResponseModel(data, data.length, reqBody.page);
      response.status(200).send(m);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };

  static generateWithPreQueries = (reqBody) => {
    if (typeof reqBody.filter != typeof []) return "";
    var whereQueryElems = [];
    var i = 0;
    reqBody.filter.forEach((filterElement) => {
      var subWithQuery =
        `subquery${i} as (` +
        ` SELECT pp.pp_id FROM p_product pp JOIN p_value pv ON pp.pp_id = pv.pp_id JOIN p_value_model pvm ON pv.pvm_id = pvm.pvm_id `;
      var field = Number(filterElement.field);
      if (typeof field == typeof 0 && !isNaN(field) && field != 0) {
        subWithQuery += `WHERE pvm.pvm_id=${field} and pv.pv_value ${filterElement.comparer} '${filterElement.argument}' )`;
        whereQueryElems.push(subWithQuery);
        i++;
      }
    });

    var combinedSubquery = ` combined_subquery AS (`;
    for (let index = 0; index < whereQueryElems.length; index++) {
      combinedSubquery += ` SELECT pp_id FROM subquery${index} `;
      combinedSubquery += index + 1 < whereQueryElems.length ? " union " : " ";
    }
    combinedSubquery += ")";
    whereQueryElems.push(combinedSubquery);
    return whereQueryElems.length == 0
      ? ""
      : "WITH " + whereQueryElems.join(" , ");
  };

  static genereateOfferWhereQuery = (reqBody) => {
    if (typeof reqBody.filter != typeof []) return "";
    var whereQuery = " ";
    var whereQueryElems = [];

    reqBody.filter.forEach((filterElement) => {
      var subQuery = "";
      var field = this.resolveDBField(filterElement.field);
      var comparer = filterElement.comparer;
      var argument = filterElement.argument;
      subQuery += ` (${field} ${comparer} '${argument}') `;
      if (field != undefined) whereQueryElems.push(subQuery);
    });

    return whereQueryElems.length == 0
      ? ""
      : whereQuery + whereQueryElems.join(" and ");
  };

  static resolveDBField = (fieldName) => {
    switch (fieldName) {
      case "price":
        return "ROUND((pp.pp_price*((100-oo.oo_discount)/100)),2)";
      case "group_id":
        return "pp.pg_id";
      case "name":
        return "pp.pp_name";
      case "quantity":
        return "pp.pp_quantity";
      default:
        break;
    }
  };

  static add = async (request, response) => {
    try {
      var reqBody = request.body;
      if (
        reqBody.discount == undefined ||
        reqBody.discount == null ||
        typeof reqBody.discount != typeof 0
      ) {
        throw `no discount provided or not correct format (DECIMAL(3,2))`;
      }

      if (
        reqBody.flag == undefined ||
        reqBody.flag == null ||
        typeof reqBody.flag != typeof 0
      ) {
        throw `no flag provided or not correct format (INT)`;
      }
      if (
        reqBody.product_id == undefined ||
        reqBody.product_id == null ||
        reqBody.product_id == 0 ||
        typeof reqBody.product_id != typeof 0
      ) {
        throw `no product_id provided or not correct format (INT)`;
      }
      var existsProduct = await DBquery(
        `SELECT count(*)>0 as exists FROM p_product WHERE pp_id = ${reqBody.product_id};`
      );
      if (existsProduct.length < 1 || existsProduct[0].exists == false) {
        throw `product with id ${reqBody.product_id} does not exists`;
      }
      var data = await DBquery(
        `insert into o_offer (pp_id, oo_discount, oo_flag) VALUES (${reqBody.product_id},${reqBody.discount},${reqBody.flag}) ` +
          `returning oo_id as id, pp_id as product_id, oo_discount as discount, oo_flag as flag;`
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
        reqBody.discount == undefined ||
        reqBody.discount == null ||
        typeof reqBody.discount != typeof 0
      ) {
        throw `no discount provided or not correct format (DECIMAL(3,2))`;
      }

      if (
        reqBody.flag == undefined ||
        reqBody.flag == null ||
        typeof reqBody.flag != typeof 0
      ) {
        throw `no flag provided or not correct format (INT)`;
      }
      if (
        reqBody.product_id == undefined ||
        reqBody.product_id == null ||
        reqBody.product_id == 0 ||
        typeof reqBody.product_id != typeof 0
      ) {
        throw `no product_id provided or not correct format (INT)`;
      }
      var existsProduct = await DBquery(
        `SELECT count(*)>0 as exists FROM p_product WHERE pp_id = ${reqBody.product_id};`
      );
      if (existsProduct.length < 1 || existsProduct[0].exists == false) {
        throw `product with id ${reqBody.product_id} does not exists`;
      }
      if (
        reqBody.id == undefined ||
        reqBody.id == null ||
        reqBody.id == 0 ||
        typeof reqBody.id != typeof 0
      ) {
        throw `no id provided or not correct format (INT)`;
      }
      var existsOffer = await DBquery(
        `SELECT count(*)>0 as exists FROM o_offer WHERE oo_id = ${reqBody.id};`
      );
      if (existsOffer.length < 1 || existsOffer[0].exists == false) {
        throw `offer with id ${reqBody.id} does not exists`;
      }
      var data = await DBquery(
        `update o_offer set pp_id = ${reqBody.product_id} , oo_discount = ${reqBody.discount},oo_flag = ${reqBody.flag} where oo_id = ${reqBody.id} ` +
          `returning oo_id as id, pp_id as product_id, oo_discount as discount, oo_flag as flag;`
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
        `SELECT count(*)>0 as exists FROM o_offer WHERE pp_id = ${reqBody.id};`
      );
      if (exists.length < 1 || !exists[0].exists) {
        throw `offer with id ${reqBody.id} does not exists`;
      }
      var data = await DBquery(
        `delete from o_offer where oo_id = ${reqBody.id} `
      );
      response.status(200).send(`product with id = ${reqBody.id} deleted`);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };
}

module.exports = {
  OfferController,
};
