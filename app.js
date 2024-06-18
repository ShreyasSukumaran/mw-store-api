require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const route = require("./app/routes/routes.js");
const cors = require("cors");
const db = require("./app/models/index.js");
const { TextEncoder, TextDecoder } = require("util");
const encoder = new TextEncoder("utf-8");
const app = express();
const Role = db.role;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", route);

//var corsOptions = {
//	origin: process.env.APP_URL,
//};

//app.use(cors(corsOptions));
app.use(cors());

app.use(express.json());

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
			new Role({
				name: "customer",
			}).save((err) => {
				if (err) {
					console.log("error", err);
				}

				console.log("added 'customer' to roles collection");
			});

			new Role({
				name: "seller",
			}).save((err) => {
				if (err) {
					console.log("error", err);
				}

				console.log("added 'seller' to roles collection");
			});

			new Role({
				name: "admin",
			}).save((err) => {
				if (err) {
					console.log("error", err);
				}

				console.log("added 'admin' to roles collection");
			});
		}
	});
}

app.listen(process.env.PORT, (e) => {
	console.log("API running on localhost:", 8081);
});
