require("dotenv").config();

const https = require("https");
const fs = require("fs");
const express = require("express");
const route = require("./app/routes/routes.js");
const cors = require("cors");
const db = require("./app/models/index.js");
const app = express();
const Role = db.role;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", route);

var corsOptions = {
	origin: process.env.APP_URL,
};

app.use(cors(corsOptions));
//app.use(cors());

app.use(express.json());

const options = {
	key: fs.readFileSync("private.key"),
	cert: fs.readFileSync("certificate.crt"),
};

db.mongoose.set("strictQuery", true);

db.mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Successfully connect to MongoDB.");
		initial();
	})
	.catch((err) => {
		console.error("Connection error", err);
		process.exit();
	});

function initial() {
	Role.estimatedDocumentCount((err, count) => {
		if (!err && count === 0) {
			["customer", "seller", "admin"].forEach((role) => {
				new Role({ name: role }).save((err) => {
				  if (err) {
					console.log(`Error adding '${role}' to roles collection`, err);
				  } else {
					console.log(`Added '${role}' to roles collection`);
				  }
				});
			  });
		}
	});
}

https.createServer(options, app).listen(process.env.PORT, (e) => {
	console.log("API running on localhost:", process.env.PORT);
});
