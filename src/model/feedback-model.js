const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    feedback_name: {
        type: String,
        required: true,
    },
    feedback_email: {
        type: String,
        required: true,
    },
    feedback_text: {
        type: String,
        required: true,
    }
}, {
    collection: 'feedback_user'
}
);

// Use an explicit model name and avoid OverwriteModelError when code reloads
module.exports = mongoose.models.FeedbackUser || mongoose.model('FeedbackUser', feedbackSchema);