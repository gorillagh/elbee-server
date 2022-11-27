const User = require("../models/User");
const { v4: uuid } = require("uuid");
const { readFileSync, createReadStream } = require("fs");
const currency = require("currency.js");
import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRETE_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

exports.uploadFile = async (req, res) => {
  try {
    const { file } = req.files;
    if (!file) return res.status(400).send("No file");

    //file params
    const params = {
      Bucket: "elbee-bucket",
      Key: `${uuid()}`,
      Body: createReadStream(file.path),
      ACL: "public-read",
      ContentType: file.type,
    };

    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
    });
    // file.total = 50;
    // file.duration = 2;
    // file.amount = 50;
    res.json(file);
  } catch (error) {
    console.log(error);
  }
};
