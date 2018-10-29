require("./config/config");
require("./db/mongoose");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.listen(port, () => console.log(`Server is up on port ${port}`));
