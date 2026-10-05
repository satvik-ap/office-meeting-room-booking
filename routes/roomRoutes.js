const express = require("express");

const MeetingRoom = require("../models/MeetingRoom");
const Booking = require("../models/Booking");

const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/authMiddleware");

const router = express.Router();


// GET all rooms
router.get("/", authMiddleware, async (req, res) => {
    try {
        const rooms = await MeetingRoom.find();

        res.json(rooms);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// GET available rooms
router.get("/available", authMiddleware, async (req, res) => {
    try {
        const { date, time } = req.query;

        if (!date || !time) {
            return res.status(400).json({
                message: "Date and time are required"
            });
        }

        const startTime = new Date(`${date}T${time}`);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        const bookings = await Booking.find({
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        const bookedRoomIds = bookings.map(
            (booking) => booking.room.toString()
        );

        const rooms = await MeetingRoom.find({
            _id: { $nin: bookedRoomIds }
        });

        res.json(rooms);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// CREATE room - admin only
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const { name, capacity } = req.body;

            const room = await MeetingRoom.create({
                name,
                capacity
            });

            res.status(201).json(room);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);


// UPDATE room - admin only
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const room = await MeetingRoom.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!room) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            res.json(room);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);


// DELETE room - admin only
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const room = await MeetingRoom.findByIdAndDelete(
                req.params.id
            );

            if (!room) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            res.json({
                message: "Room deleted"
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

module.exports = router;