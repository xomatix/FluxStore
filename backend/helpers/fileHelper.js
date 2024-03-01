const SFTPClient = require("ssh2-sftp-client");
const fs = require("fs");

const sftp = new SFTPClient();

const baseSftpServerPath = "/home/eaiibgrp/maswierc/public_html";

const sendFileToSftp = (filePath, fileName) => {
  console.log(sftp.stat);
  sftp
    .connect({
      host: "student.agh.edu.pl",
      port: "22",
      username: "maswierc",
      password: "3fiba+fog",
      algorithms: {},
    })
    .then(async () => {
      var remoteDir =
        baseSftpServerPath + `/object_files/${fileName.split("/")[0]}`;

      await sftp.mkdir(remoteDir, true);
      return await sftp._fastPut(
        "C:\\Users\\asus\\Desktop\\code\\software_studio\\backend\\" + filePath,
        baseSftpServerPath + `/object_files/${fileName}`
      );
    })
    .then(async (data) => {
      await sftp.end();
      console.log(data, "the data info");
    })
    .catch((err) => {
      console.log(err, "catch error");
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
};