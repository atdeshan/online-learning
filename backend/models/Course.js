const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    thumbnail: { type: String, required: true }
});

const Course  = mongoose.model('Course', courseSchema);

module.exports = Course;