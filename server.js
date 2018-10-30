require("./config/config");
require("./db/mongoose");

const express = require("express");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use("/api/users", users);

app.listen(port, () => console.log(`Server is up on port ${port}`));
