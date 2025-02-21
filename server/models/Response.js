const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            selectedOption: { type: String, required: true }
        }
    ],
    score: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);
