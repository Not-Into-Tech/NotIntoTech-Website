const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    request_name: {
        type: String,
        required: true,
    },
    request_email: {
        type: String,
        required: true,
    },
    request_text: {
        type: String,
        required: true,
    }
}, {
    collection: 'request_user'
}
);

// Use an explicit model name and avoid OverwriteModelError when code reloads
module.exports = mongoose.models.RequestUser || mongoose.model('RequestUser', requestSchema);