const express = require("express");

const app = express();

app.use(express.static("public"));
app.listen(3003, () => console.log("Welcome to ContactsBook on the port 3003"));
