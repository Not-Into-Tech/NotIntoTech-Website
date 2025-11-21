const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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

const User = mongoose.model('User', userSchema);

module.exports = User;