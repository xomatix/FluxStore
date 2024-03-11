const multer = require("multer");
const path = require("path");
const {
  sendFileToSftp,
  deleteFile,
  deleteFileFromSftp,
} = require("../helpers/fileHelper");
const { DBquery } = require("../database");
const { ResponseModel } = require("../models/responseModel");

class FileController {
  static storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        this.generateRandomString(8) +
          "." +
          file.originalname.split(".")[file.originalname.split(".").length - 1]
      );
    },
  });
  static upload = multer({ storage: this.storage });

  static generateRandomString(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static list = async (request, response) => {
    try {
      var reqBody = request.body;
      var idsWhereQuery = "";
      if (
        typeof reqBody.ids == typeof [] &&
        reqBody.ids.length > 0 &&
        !isNaN(Number(reqBody.ids[0]))
      ) {
        idsWhereQuery = ` where pp_id in (${reqBody.ids.join(",")})`;
      }

      var data = await DBquery(
        `select pf_id as id, pp_id as product_id , pf_path as path,pf_flag as flag , pf_flag&(1)<>0 as is_main from p_file ${idsWhereQuery};`
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
      var pathOnSftpServer = `${request.body.id}/${this.generateRandomString(
        8
      )}.${
        request.file.filename.split(".")[
          request.file.filename.split(".").length - 1
        ]
      }`;
      request.body.id = Number(request.body.id);
      if (
        request.body.id == undefined ||
        request.body.id == null ||
        request.body.id == 0 ||
        typeof request.body.id != typeof 0
      ) {
        throw `no product_id provided or not correct format (INT)`;
      }
      var existsProduct = await DBquery(
        `SELECT count(*)>0 as exists FROM p_product WHERE pp_id = ${request.body.id};`
      );
      if (existsProduct.length < 1 || existsProduct[0].exists == false) {
        throw `product with id ${request.body.id} does not exists`;
      }

      console.log("New path = " + pathOnSftpServer);
      await sendFileToSftp(request.file.path, pathOnSftpServer);
      console.log(request.body.id);

      var insertQuery =
        `insert into p_file (pp_id,pf_path,pf_flag) values (${request.body.id}, '/${pathOnSftpServer}', 0) ` +
        ` returning pf_id as id, pp_id as product_id , pf_path as path,pf_flag as flag;`;
      var data = await DBquery(insertQuery);

      response.status(200).send(data);
      setTimeout(() => {
        deleteFile(request.file.path);
      }, 2500);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };

  static update = async (request, response) => {
    try {
      var reqBody = request.body;

      if (
        reqBody.flag == undefined ||
        reqBody.flag == null ||
        typeof reqBody.flag != typeof 0
      ) {
        throw `no flag provided or not correct format (INT)`;
      }
      if (
        reqBody.id == undefined ||
        reqBody.id == null ||
        reqBody.id == 0 ||
        typeof reqBody.id != typeof 0
      ) {
        throw `no id provided or not correct format (INT)`;
      }
      var existsFile = await DBquery(
        `SELECT count(*)>0 as exists FROM p_file WHERE pf_id = ${reqBody.id};`
      );
      if (existsFile.length < 1 || existsFile[0].exists == false) {
        throw `file with id ${reqBody.id} does not exists`;
      }

      var data = await DBquery(
        `update p_file set pf_flag = ${reqBody.flag} where pf_id = ${reqBody.id} ` +
          `returning pf_id as id, pp_id as product_id , pf_path as path,pf_flag as flag;`
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
      console.log(reqBody);
      if (reqBody.id == null || reqBody.id == undefined || reqBody.id == 0) {
        throw "no id provided";
      }
      var exists = await DBquery(
        `SELECT pf_id<>0 as exists , pf_path as path FROM p_file WHERE pf_id = ${reqBody.id};`
      );
      if (exists.length < 1 || !exists[0].exists) {
        throw `file with id ${reqBody.id} does not exists`;
      }

      //console.log(exists[0].path);
      deleteFileFromSftp(exists[0].path);

      var data = await DBquery(
        `delete from p_file where pf_id = ${reqBody.id} ;`
      );
      response.status(200).send(`file with id ${reqBody.id} deleted`);
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };
}

module.exports = {
  FileController,
};
