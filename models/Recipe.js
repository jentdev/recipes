const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({

        title: {
            type: String,
            sparse: true,
            trim: true
        },
        body: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'public',
            enum: ['public', 'private']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        image: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
});

module.exports = mongoose.model('Recipe', RecipeSchema);