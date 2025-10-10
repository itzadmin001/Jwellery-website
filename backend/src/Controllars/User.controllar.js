const User = require("../Models/User.model");
const redis = require("../../Db/Redis")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



async function registerUser(req, res) {
    try {
        const { name, email, password, phone, gender, role } = req.body;

        const FindUser = await User.findOne({ email });

        if (FindUser) {
            return res.status(400).json({
                message: "User already exists",
            })
        }

        const HashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: HashedPassword,
            phone,
            gender,
            role: role || "user",
        })

        const token = jwt.sign({
            id: newUser._id,
            role: newUser.role,
            email: newUser.email,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });


        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 });

        res.status(201).json({
            message: "User created successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                gender: newUser.gender,
                role: newUser.role,
                address: newUser.address,
            }
        })


    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}


async function getAllusers(req, res) {
    try {

        const FindAll = await User.find();

        if (FindAll) {
            res.status(200).json({
                message: "All User fetched",
                FindAll
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "internal server error"
        })
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const FindUser = await User.findOne({ email }).select("+password");

        if (!FindUser) {
            return res.status(400).json({
                message: "User not found",
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, FindUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid password",
            })
        }

        const token = jwt.sign({
            id: FindUser._id,
            role: FindUser.role,
            email: FindUser.email,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });



        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 });

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                name: FindUser.name,
                email: FindUser.email,
                phone: FindUser.phone,
                gender: FindUser.gender,
                role: FindUser.role,
                address: FindUser.address,
            }
        })
    } catch (error) {
        console.log(error, "error");
        res.status(500).json({
            message: error.message,
        })
    }
}

async function getUser(req, res) {
    try {

        return res.status(200).json({
            message: "User fetched successfully",
            user: {
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                gender: req.user.gender,
                role: req.user.role,
                address: req.user.address,
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

async function logout(req, res) {

    try {
        let token = null;

        // Try to get token from cookie
        if (req.headers.cookie) {
            const cookie = require("cookie");
            const parsedCookie = cookie.parse(req.headers.cookie);
            token = parsedCookie.token;
        }

        if (token) {
            await redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60);
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: true
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function GetuserAddress(req, res) {
    try {

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User address fetched successfully", address: user.address });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

async function AdduserAddress(req, res) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const { street, city, pincode, state } = req.body;
        user.address.push({ street, city, pincode, state });
        await user.save();
        return res.status(200).json({ message: "User address added successfully", address: user.address });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function DeleteuserAddress(req, res) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.address.pull(req.params.id);
        await user.save();
        return res.status(200).json({ message: "User address deleted successfully", address: user.address });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registerUser, getAllusers, loginUser, getUser, logout, GetuserAddress, AdduserAddress, DeleteuserAddress }
