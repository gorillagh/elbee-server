const User = require("../models/User");
const { v4: uuid } = require("uuid");
const { readFileSync, createReadStream } = require("fs");
const currency = require("currency.js");
import AWS from "aws-sdk";

// const ffprobe = require("ffprobe");
// const ffprobeStatic = require("ffprobe-static");
// const { getAudioDurationInSeconds } = require("get-audio-duration");

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRETE_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

exports.uploadFile = async (req, res) => {
  try {
    const { file } = await req.files;
    console.log("file to upload---->", file.name);
    const { orderType } = await req.params;
    console.log("hel");

    if (!file) return res.status(400).send("No file");

    //file params
    const params = {
      Bucket: "elbee-bucket",
      Key: file.name.split("/")[0],
      Body: readFileSync(file.path),
      ACL: "public-read",
      ContentType: file.type,
    };

    S3.upload(params, async (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
        return;
      }
      let uploadedFile;
      console.log(data);
      // let duration = (await getAudioDurationInSeconds(file.path)) / 60;
      let duration = 100 / 60;
      duration =
        duration % 1 > 0
          ? (duration > 0 ? Math.floor(duration) : Math.ceil(duration)) + 1
          : duration > 0
          ? Math.floor(duration)
          : Math.ceil(duration);
      console.log("duration====>", duration);
      uploadedFile = {
        id: await data.Key,
        name: file.name.split("/")[1],
        path: file.path,
        size: file.size,
        type: file.type,
        duration,
        cost: currency(orderType === "transcription" ? duration * 1 : 0).value,
        location: await data.Location,
        express: false,
        verbatim: false,
        timeStamp: false,
        total: currency(orderType === "transcription" ? duration * 1 : 0).value,
      };

      res.json(uploadedFile);
    });

    // ffprobe(
    //   "https://elbee-bucket.s3.amazonaws.com/367a3d6e-1dc3-41a8-9191-89462b19aa91.x-matroska",
    //   { path: ffprobeStatic.path },
    //   (err, res) => {
    //     if (err) {
    //       console.log();
    //     }
    //     console.log(res);
    //   }
    // );
    // S3.getObject(
    //   { Bucket: "elbee-bucket", Key: "10ff089f-7028-419f-a56b-85cb07497013" },
    //   (err, data) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //     console.log(data);
    //   }
    // );
    // file.total = 50;
    // file.duration = 2;
    // file.amount = 50;
  } catch (error) {
    console.log(error);
  }
};
