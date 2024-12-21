"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogServices = void 0;
const blog_constants_1 = require("./blog.constants");
const blog_model_1 = require("./blog.model");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createBlogIntoDB = (decodedUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = decodedUser;
    const author = yield user_model_1.UserModel.findOne({ email });
    if (!author) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Author not found");
    }
    const authorId = author === null || author === void 0 ? void 0 : author._id;
    payload.author = authorId;
    const result = yield blog_model_1.BlogModel.create(payload);
    return result;
    // return null;
});
const getAllBlogsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // search: Filters blogs containing the term "technology" in the title or content.
    const search = (query === null || query === void 0 ? void 0 : query.search) || "";
    const searchQuery = blog_model_1.BlogModel.find({
        $or: blog_constants_1.blogSearchTerms.map((term) => {
            return {
                [term]: { $regex: search, $options: "i" },
            };
        }),
    }).populate("author");
    // filter: Filters blogs authored by the user with the given authorId.
    const filter = (query === null || query === void 0 ? void 0 : query.filter) ? { author: query.filter } : {};
    const filterQuery = searchQuery.find(filter);
    // sortOrder: Defines the sorting order. Accepts values asc (ascending) or desc (descending). (e.g., sortOrder=desc).
    let sortStr = "";
    if ((query === null || query === void 0 ? void 0 : query.sortBy) && (query === null || query === void 0 ? void 0 : query.sortOrder)) {
        const sortBy = query === null || query === void 0 ? void 0 : query.sortBy;
        const sortOrder = query === null || query === void 0 ? void 0 : query.sortOrder;
        sortStr = `${sortOrder === "desc" ? "-" : ""}${sortBy}`;
    }
    const sortQuery = yield filterQuery.sort(sortStr);
    return sortQuery;
});
const getSingleBlogFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.BlogModel.findById(id).populate("author");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "There is no blog under this Id");
    }
    return result;
});
const updateBlogIntoDB = (decodedUser, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // the blog to be updated
    const blog = yield blog_model_1.BlogModel.findById(id);
    if (!blog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "The blog you are trying to update, does not exist");
    }
    // check if the id found in decoded user matches with the id to be edited
    const user = yield user_model_1.UserModel.findOne({ email: decodedUser.email });
    const userId = user === null || user === void 0 ? void 0 : user._id;
    // Allows a logged-in user to update their own blog by its ID.
    const authorId = blog.author;
    const matchedUserAndAuthor = userId === null || userId === void 0 ? void 0 : userId.equals(authorId);
    if (!matchedUserAndAuthor) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are trying to update another user's blog");
    }
    const result = yield blog_model_1.BlogModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteBlogFromDB = (decodedUser, id) => __awaiter(void 0, void 0, void 0, function* () {
    // the blog to be deleted
    const blog = yield blog_model_1.BlogModel.findById(id);
    if (!blog) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "The blog you are trying to delete, does not exist");
    }
    // check if the id found in decoded user matches with the id to be deleted
    const user = yield user_model_1.UserModel.findOne({ email: decodedUser.email });
    const userId = user === null || user === void 0 ? void 0 : user._id;
    // if the role is user, check if the right user is deleting their blog
    const authorId = blog.author;
    const matchedUserAndAuthor = userId === null || userId === void 0 ? void 0 : userId.equals(authorId);
    if (!matchedUserAndAuthor) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are trying to delete another user's blog");
    }
    // Allows a logged-in user to delete their own blog by its ID.
    const result = yield blog_model_1.BlogModel.findByIdAndDelete(id);
    return result;
    // return null;
});
exports.BlogServices = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    getSingleBlogFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB,
};
