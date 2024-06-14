const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("../../model/user.model");
db.role = require("../../model/role.model");

db.ROLES = ["admin", "customer", "seller"];

module.exports = db;