const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { v4: uuid } = require("uuid");
const { readFileSync, createReadStream } = require("fs");
const WebSocket = require("ws");
const currency = require("currency.js");
import AWS from "aws-sdk";

// const ffprobe = require("ffprobe");
// const ffprobeStatic = require("ffprobe-static");
const { getAudioDurationInSeconds } = require("get-audio-duration");

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
    const { orderType } = await req.params;

    if (!file) return res.status(400).send("No file");

    //file params
    const params = {
      Bucket: "elbee-bucket",
      Key: file.name.split("/")[0],
      Body: readFileSync(file.path),
      ACL: "public-read",
      ContentType: file.type,
    };

    // S3.upload(params, async (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     res.sendStatus(400);
    //     return;
    //   }
    //   let uploadedFile;
    //   console.log(data);
    //   let duration = (await getAudioDurationInSeconds(file.path)) / 60;
    //   duration =
    //     duration % 1 > 0
    //       ? (duration > 0 ? Math.floor(duration) : Math.ceil(duration)) + 1
    //       : duration > 0
    //       ? Math.floor(duration)
    //       : Math.ceil(duration);
    //   console.log("duration====>", duration);
    //   uploadedFile = {
    //     id: await data.Key,
    //     name: file.name.split("/")[1],
    //     path: file.path,
    //     size: file.size,
    //     type: file.type,
    //     duration,
    //     cost: currency(orderType === "transcription" ? duration * 1 : 0).value,
    //     location: await data.Location,
    //     express: false,
    //     verbatim: false,
    //     timeStamp: false,
    //     total: currency(orderType === "transcription" ? duration * 1 : 0).value,
    //   };

    //   res.json(uploadedFile);
    // }).on("httpUploadProgress", function (progress) {
    //   let progressPercentage = Math.round(
    //     (progress.loaded / progress.total) * 100
    //   );

    //   console.log("Upload percentage---->", progressPercentage);
    // });

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
    const duration = 30;
    const uploadedFile = {
      id: await file.name.split("/")[0],
      name: await file.name.split("/")[1],
      path: file.path,
      size: file.size,
      type: file.type,
      duration,
      cost: currency(orderType === "transcription" ? duration * 1 : 0).value,
      location: `https\\:${file.name}.com`,
      express: false,
      verbatim: false,
      timeStamp: false,
      total: currency(orderType === "transcription" ? duration * 1 : 0).value,
    };
    res.json(uploadedFile);
  } catch (error) {
    console.log(error);
  }
};

exports.saveOrder = async (req, res) => {
  try {
    const { id, files, type, userId } = await req.body;
    await files.map((file, index) => {
      file.total =
        Number(file.cost) +
        (file.express ? Number(file.duration) * 0.3 : 0) +
        (file.verbatim ? Number(file.duration) * 0.5 : 0) +
        (file.timeStamp ? Number(file.duration) * 0.4 : 0);
    });
    let total = 0;
    if (files && files.length) {
      for (var i in files) {
        total += Number(files[i].total);
      }
    }
    const newOrder = await new Order({
      id,
      files,
      total,
      orderType: type,
      userId: userId && userId,
    }).save();

    res.json(newOrder);
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findOne({ id: cartId }).exec();
    res.json(cart);
  } catch (error) {
    console.log(error);
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ id: orderId }).exec();
    res.json(order);
  } catch (error) {
    console.log(error);
  }
};
