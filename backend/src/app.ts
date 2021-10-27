import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import * as C from "./config/db.config";
import * as dictRoutes from "./routes/dict.routes"
import * as recordRoutes from "./routes/record.routes"
import * as freezeRoutes from "./routes/freeze.routes";
import path from "path";
import cors from "cors";

export const app = express();

const url = "mongodb://" + C.dbConfig.HOST + ":" + C.dbConfig.PORT + "/" + C.dbConfig.DB;

mongoose.connect(url,
    {useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Connected to db");
    })
    .catch(() => {
      console.log("Connection lost");
    });


app.use(cors({
    origin: "*"
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/freezes", express.static(path.join(__dirname, "../data/freezes")));
app.use("/", express.static(path.join(__dirname, "../dist/endoassist")));
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token, Origin, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE');
    next();
});

app.use("/endo/dict", dictRoutes.router);
app.use("/endo/record", recordRoutes.router);
app.use("/endo/freeze", freezeRoutes.router);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/endoassist/index.html"));
});
