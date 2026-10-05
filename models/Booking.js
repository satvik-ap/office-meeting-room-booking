const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MeetingRoom",
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    attendees: {
        type: Number,
        required: true
    },
    capacityExceeded: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Booking", bookingSchema);