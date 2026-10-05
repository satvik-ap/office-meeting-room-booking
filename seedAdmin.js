const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Employee = require("./models/Employee");

const createOrUpdateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash(
            "Admin12345",
            10
        );

        const admin = await Employee.findOneAndUpdate(
            { email: "admin@meetingroom.com" },
            {
                name: "System Admin",
                email: "admin@meetingroom.com",
                password: hashedPassword,
                role: "admin"
            },
            {
                new: true,
                upsert: true
            }
        );

        console.log("Admin account ready");
        console.log("Email: admin@meetingroom.com");
        console.log("Password: Admin12345");
        console.log("Role:", admin.role);

        process.exit(0);
    } catch (error) {
        console.log("Admin setup failed:", error.message);
        process.exit(1);
    }
};

createOrUpdateAdmin();