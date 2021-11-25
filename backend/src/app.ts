import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from "path";
import cors from "cors";

import * as C from "./config/db.config";
import * as dictRoutes from "./routes/dict.routes"
import * as recordRoutes from "./routes/record.routes"
import * as freezeRoutes from "./routes/freeze.routes";
import { initDirectories } from "./middleware";


export const app = express();

let url: string;
if (process.env.NODE_ENV === "development") {
    console.log("dev");
    url = "mongodb://" + C.dbConfigDev.HOST + ":" + C.dbConfigDev.PORT + "/" + C.dbConfigDev.DB;
} else {
    url = "mongodb://" + C.dbConfig.user + ":" + C.dbConfig.password + "@" +
        C.dbConfig.HOST + ":" + C.dbConfig.PORT + "/" + C.dbConfig.DB;
}

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

if (process.env.NODE_ENV === "development") {
    app.use("/freezes", express.static(path.join(__dirname, "../data/freezes/")));
} else {
    app.use("/freezes", express.static(path.join(process.cwd(), "data/freezes/")));
}
app.use("/", express.static(path.join(__dirname, "../dist/endoassist")));
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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

initDirectories();

