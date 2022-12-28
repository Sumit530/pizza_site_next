const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
jsonparser = bodyParser.json();
const multer = require("multer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require('fs');
const session = require('express-session');
const auth = require("../middleware/oath");
const { resolveSoa } = require("dns");
const { json } = require("body-parser");

//connection of sql server