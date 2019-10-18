const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.all("*", (req, res) =>
	res.sendFile(path.join(__dirname, "public", "index.html"))
);
app.listen(3003, () => console.log("Welcome to ContactsBook on the port 3003"));
