const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const wallSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
    },
    comments: [
        {
            creator: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            message: { type: String, required: true },
        }
    ],
    wishlist: [
        {
            title: { type: String, required: true },
            pictureUrl: String,
            description: String,
            price: Number
        }
    ]
})


const Wall = mongoose.model("Wall", wallSchema);

module.exports = Wall;