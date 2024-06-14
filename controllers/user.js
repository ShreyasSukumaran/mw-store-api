const db = require("../app/models");
const asyncHandler = require("express-async-handler");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	let { firstName, lastName, email, password, role } = req.body;

	console.log(req.body);

	password = await bcrypt.hash(password, salt);

	const userExists = await User.findOne({ email });

	if (userExists) {
		res
			.status(400)
			.send({ message: "Email is already associated with another account" });
	}

	const user = new User({
		firstName,
		lastName,
		email,
		password,
		isAdmin: role == "admin" ? true : false,
	});

	user.save((err, user) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
			return;
		}

		if (req.body.roles) {
			Role.find(
				{
					name: { $in: req.body.roles },
				},
				(err, roles) => {
					if (err) {
						res.status(500).send({ message: err });
						return;
					}

					user.roles = roles.map((role) => role._id);
					user.save((err) => {
						if (err) {
							res.status(500).send({ message: err });
							return;
						}

						res.json({
							_id: user._id,
							firstName: user.firstName,
							lastName: user.lastName,
							isAdmin: user.isAdmin,
							token: genToken(user._id),
							message: "User was registered successfully!",
						});
					});
				}
			);
		} else {
			Role.findOne({ name: "customer" }, (err, role) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}

				user.roles = [role._id];
				user.save((err) => {
					if (err) {
						res.status(500).send({ message: err });
						return;
					}

					res.json({
						_id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
						isAdmin: user.isAdmin,
						token: genToken(user._id),
						message: "User was registered successfully!",
					});
				});
			});
		}
	});
});

const loginUser = (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email })
		.populate("roles", "-__v")
		.exec((err, user) => {
			if (err) {
				res.status(500).send({ message: err });
				return;
			}

			if (!user) {
				return res.status(404).send({ message: "User Not found." });
			}

			var passwordIsValid = bcrypt.compareSync(password, user.password);

			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: "Invalid Password!",
				});
			}

			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				algorithm: "HS256",
				allowInsecureKeySizes: true,
				expiresIn: 86400, // 24 hours
			});

			var authorities = [];

			for (let i = 0; i < user.roles.length; i++) {
				authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
			}
			res.status(200).send({
				id: user._id,
				username: user.username,
				email: user.email,
				roles: authorities,
				accessToken: token,
			});
		});
};

const getUsers = async (req, res, next) => {
	try {
		const result = await User.find();

		res.status(200).setHeader("Content-Type", "application/json").json(result);
	} catch (err) {
		throw new Error(`Error retrieving users: ${err.message}`);
	}
};

const postUser = async (req, res, next) => {
	try {
		const result = await User.create(req.body);

		res.status(201).setHeader("Content-Type", "application/json").json(result);
	} catch (err) {
		throw new Error(`Error displaying a new user: ${err.message}`);
	}
};

const deleteUsers = asyncHandler(async (req, res, next) => {
	try {
		await User.deleteMany({});
		res.status(200).json({
			success: true,
			msg: "All users were deleted",
		});
	} catch (err) {
		throw new Error(`Error deleting users: ${err.message}`);
	}
});

const getUser = asyncHandler(async (req, res, next) => {
	try {
		const result = await User.findById(req.params.id);
		if (!result) {
			res.status(404);
			throw new Error("User not found.");
		}

		res.status(200).setHeader("Content-Type", "application/json").json(result);
	} catch (err) {
		throw new Error(`Error retrieving user: ${err.message}`);
	}
});

const putUser = asyncHandler(async (req, res, next) => {
	try {
		const result = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!result) {
			res.status(404);
			throw new Error("User not found.");
		}

		res.status(200).setHeader("Content-Type", "application/json").json(result);
	} catch (err) {
		throw new Error(`Error updating user: ${err.message}`);
	}
});

const deleteUser = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;

	const user = await User.findById(userId);
	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	await user.remove();

	res.json({ success: true, message: "User deleted successfully" });
});

const genToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3600s" });
};

module.exports = {
	getUsers,
	postUser,
	deleteUsers,
	getUser,
	putUser,
	deleteUser,
	loginUser,
	registerUser,
};
