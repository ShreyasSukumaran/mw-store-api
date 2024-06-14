const fs = require("fs");
const outputLog = fs.createWriteStream("./Log/error.log");
const errorsLog = fs.createWriteStream("./Log/output.log");

const consoler = new console.Console(outputLog, errorsLog);

setInterval(function () {
	consoler.log(new Date());
	consoler.error(new Error("Hey Nope"));
}, 10000);
