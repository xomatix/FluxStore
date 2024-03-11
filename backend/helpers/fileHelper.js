const SFTPClient = require("ssh2-sftp-client");
const fs = require("fs");

const sftp = new SFTPClient();

const baseSftpServerPath = "/home/eaiibgrp/maswierc/public_html";
const sftpConfig = {
  host: "student.agh.edu.pl",
  port: "22",
  username: "maswierc",
  password: "3fiba+fog",
  algorithms: {},
};

const sendFileToSftp = (filePath, fileName) => {
  sftp
    .connect(sftpConfig)
    .then(async () => {
      var remoteDir =
        baseSftpServerPath + `/object_files/${fileName.split("/")[0]}`;
      await sftp.mkdir(remoteDir, true);
      return await sftp._fastPut(
        ".\\" + filePath,
        baseSftpServerPath + `/object_files/${fileName}`
      );
    })
    .then(async (data) => {
      await sftp.end();
      console.log(data, "the data info");
    })
    .catch((err) => {
      console.log(err, "catch error");
    })
    .finally(async () => {
      await sftp.end();
    });
};

const deleteFileFromSftp = (filePath) => {
  sftp
    .connect(sftpConfig)
    .then(async () => {
      var remotePath = baseSftpServerPath + `/object_files${filePath}`;

      return await sftp.delete(remotePath, true);
    })
    .then(async (data) => {
      await sftp.end();
      console.log(data, "the data info");
    })
    .catch((err) => {
      console.log(err, "catch error");
    })
    .finally(async () => {
      await sftp.end();
    });
};

const createUploadsDirectory = () => {
  // Define the directory path
  const dir = "./uploads";

  // Check if the directory exists
  if (!fs.existsSync(dir)) {
    // If the directory does not exist, create it
    fs.mkdirSync(dir);
  }
};

const deleteFile = (filePath) => {
  // Check if the file exists
  console.log(filePath);
  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlinkSync(filePath);
    console.log(`File ${filePath} has been deleted.`);
  } else {
    console.error("File does not exist.");
  }
};

module.exports = {
  sendFileToSftp,
  createUploadsDirectory,
  deleteFile,
  deleteFileFromSftp,
};
