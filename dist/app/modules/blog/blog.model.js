"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Blog title is required."],
    },
    content: {
        type: String,
        required: [true, "Blog content is required"],
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Blog author is required."],
        ref: "User",
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
exports.BlogModel = (0, mongoose_1.model)("Blog", blogSchema);
