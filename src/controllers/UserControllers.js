const userModel = require('../models/UserModel')
const bcrypt = require('bcrypt')
const mailUtil = require('../utils/MailUtils')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const foundUser = await userModel.findOne({ email });
        console.log("Found User:", foundUser);

        if (!foundUser) {
            return res.status(404).json({ message: "Email not found." });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Map role number to role name
        const roleNames = {
            1: "user",
            2: "parking_owner",
            3: "admin"
        };
        const roleName = roleNames[foundUser.role] || "user";

        const token = jwt.sign(
            { email: foundUser.email, role: foundUser.role, id: foundUser._id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );
        // Return only necessary user data (Exclude password)
        return res.status(200).json({
            message: "Login success",
            data: {
                _id: foundUser._id,
                email: foundUser.email,
                role: foundUser.role,
                roleName: roleName,
                firstname: foundUser.firstname,
                lastname: foundUser.lastname,
                businessName: foundUser.businessName,
                token
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

module.exports = { loginUser };


const signUp = async (req, res) => {
    try {
        const { role, businessName, phonenumber, age } = req.body;
        
        // Role-based validation
        if (role === 2) { // parking_owner
            if (!businessName) {
                return res.status(400).json({
                    message: "Business name is required for parking owners",
                    error: "missing_business_name"
                });
            }
            // Remove user-specific fields for owners
            delete req.body.phonenumber;
            delete req.body.age;
        } else if (role === 1) { // user
            if (!phonenumber) {
                return res.status(400).json({
                    message: "Phone number is required for users",
                    error: "missing_phonenumber"
                });
            }
            if (!age) {
                return res.status(400).json({
                    message: "Age is required for users",
                    error: "missing_age"
                });
            }
            // Remove owner-specific fields for users
            delete req.body.businessName;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedpassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashedpassword;

        console.log(req.body);
        const createUser = await userModel.create(req.body);
        
        // Send welcome email (non-blocking - if email fails, signup still succeeds)
        mailUtil.sendingmail(createUser.email, "welcome to My parking", `Hello ${createUser.firstname}`)
            .then(() => console.log("Welcome email sent to user"))
            .catch((emailErr) => console.error("Failed to send welcome email:", emailErr.message));

        res.status(201).json({
            message: "Account created successfully",
            data: createUser
        });
    } catch (err) {
        console.log(err);
        
        // Handle duplicate email error specifically
        if (err.code === 11000 && err.keyPattern?.email) {
            return res.status(409).json({
                message: "Email already registered. Please use a different email or login.",
                error: "duplicate_email"
            });
        }
        
        res.status(500).json({
            message: "Error creating account",
            error: err
        });
    }
}



const getAllUsers = async (req, res) => {
    console.log('Fetching all users..')
    try {

        const users = await userModel.find().populate("roleId");
        console.log(users);
        res.json({
            message: "User fetched successfully",
            data: users
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err })
    }
}

const addUser = async (req, res) => {

    const savedUser = await userModel.create(req.body)

    res.json({
        message: 'User created... Post is called',
        data: savedUser
    });
}
const deleteUser = async (req, res) => {

    const deletedUser = await userModel.findByIdAndDelete(req.params.id)

    res.json({
        message: 'User deleted successfully...',
        data: deletedUser
    });
}
const getUserById = async (req, res) => {
    try {
        const foundUser = await userModel.findById(req.params.id);

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User fetched successfully',
            data: foundUser
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error while fetching user' });
    }
};

const forgotPassword = async (req, res) => {
    const email = req.body.email;
    const foundUser = await userModel.findOne({ email: email });

    if (foundUser) {
        const token = jwt.sign(foundUser.toObject(), process.env.JWT_SECRET);
        console.log(token);
        const url = `http://localhost:3000/resetpassword/${token}`;
        const mailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hello ${foundUser.firstname},</p>
                <p>We received a request to reset your password for your My Parking account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="margin: 25px 0;">
                    <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>If you didn't request this password reset, you can safely ignore this email.</p>
                <p>This link will expire in 1 hour for security reasons.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
            </div>
        `;

        await mailUtil.sendingmail(foundUser.email, "Reset Your My Parking Password", mailContent);
        res.json({
            message: "Reset password link sent to your email.",
        });
    } else {
        res.json({
            message: "user not found register first..",
        });
    }
};

const resetpassword = async (req, res) => {
    const token = req.body.token;
    const newPassword = req.body.password;

    const userFromToken = jwt.verify(token, secret);
    //object -->email,id..
    //password encrypt...
    const salt = bcrypt.genSaltSync(10);
    const hashedPasseord = bcrypt.hashSync(newPassword, salt);

    const updatedUser = await userModel.findByIdAndUpdate(userFromToken._id, {
        password: hashedPasseord,
    });
    res.json({
        message: "password updated successfully..",
    });
};

module.exports = {
    getAllUsers, addUser, deleteUser, getUserById, loginUser, signUp, forgotPassword, resetpassword
}