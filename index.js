require("dotenv").config();
const path = require("path");
const express = require("express");
const app = require("./api/server");
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
