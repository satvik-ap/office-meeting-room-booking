const express = require("express");

const Booking = require("../models/Booking");
const MeetingRoom = require("../models/MeetingRoom");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


// Create booking
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            roomId,
            startTime,
            endTime,
            attendees
        } = req.body;

        const room = await MeetingRoom.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({
                message: "End time must be after start time"
            });
        }

        // Check overlapping booking
        const overlappingBooking = await Booking.findOne({
            room: roomId,
            startTime: { $lt: new Date(endTime) },
            endTime: { $gt: new Date(startTime) }
        });

        if (overlappingBooking) {
            return res.status(400).json({
                message: "Room is already booked for this time"
            });
        }

        const capacityExceeded = attendees > room.capacity;

        const booking = await Booking.create({
            room: roomId,
            employee: req.user.id,
            startTime,
            endTime,
            attendees,
            capacityExceeded
        });

        res.status(201).json({
            message: capacityExceeded
                ? "Booking created but capacity is exceeded"
                : "Booking created",
            booking
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// My bookings
router.get("/my", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({
            employee: req.user.id
        })
            .populate("room", "name capacity")
            .populate("employee", "name email");

        res.json(bookings);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;