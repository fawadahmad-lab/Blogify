/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\nconst path = __webpack_require__(/*! path */ \"path\");\nconst express = __webpack_require__(/*! express */ \"express\");\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst cookiePaser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\nconst Blog = __webpack_require__(/*! ./models/blog */ \"./models/blog.js\");\nconst userRoute = __webpack_require__(/*! ./routes/user */ \"./routes/user.js\");\nconst blogRoute = __webpack_require__(/*! ./routes/blog */ \"./routes/blog.js\");\nconst {\n  checkForAuthenticationCookie\n} = __webpack_require__(/*! ./middlewares/authentication */ \"./middlewares/authentication.js\");\nconst app = express();\nconst PORT = process.env.PORT || 8000;\nmongoose.connect(process.env.MONGODB_URI).then(e => console.log(\"MongoDB Connected\")).catch(err => {\n  console.log(err);\n});\napp.set(\"view engine\", \"ejs\");\napp.set(\"views\", path.resolve(\"./views\"));\napp.use(express.urlencoded({\n  extended: false\n}));\napp.use(cookiePaser());\napp.use(checkForAuthenticationCookie(\"token\"));\napp.use(express.static(path.resolve(\"./public\")));\napp.get(\"/\", async (req, res) => {\n  const allBlogs = await Blog.find({});\n  res.render(\"home\", {\n    user: req.user,\n    blogs: allBlogs\n  });\n});\napp.use(\"/user\", userRoute);\napp.use(\"/blog\", blogRoute);\napp.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));\n\n//# sourceURL=webpack://blogify/./app.js?");

/***/ }),

/***/ "./middlewares/authentication.js":
/*!***************************************!*\
  !*** ./middlewares/authentication.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  validateToken\n} = __webpack_require__(/*! ../services/authentication */ \"./services/authentication.js\");\nfunction checkForAuthenticationCookie(cookieName) {\n  return (req, res, next) => {\n    const tokenCookieValue = req.cookies[cookieName];\n    if (!tokenCookieValue) {\n      return next();\n    }\n    try {\n      const userPayload = validateToken(tokenCookieValue);\n      req.user = userPayload;\n    } catch (error) {}\n    return next();\n  };\n}\nmodule.exports = {\n  checkForAuthenticationCookie\n};\n\n//# sourceURL=webpack://blogify/./middlewares/authentication.js?");

/***/ }),

/***/ "./models/blog.js":
/*!************************!*\
  !*** ./models/blog.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  Schema,\n  model\n} = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst blogSchema = new Schema({\n  title: {\n    type: String,\n    required: true\n  },\n  body: {\n    type: String,\n    required: true\n  },\n  coverImageURL: {\n    type: String,\n    required: false\n  },\n  createdBy: {\n    type: Schema.Types.ObjectId,\n    ref: \"user\"\n  }\n}, {\n  timestamps: true\n});\nconst Blog = model(\"blog\", blogSchema);\nmodule.exports = Blog;\n\n//# sourceURL=webpack://blogify/./models/blog.js?");

/***/ }),

/***/ "./models/comment.js":
/*!***************************!*\
  !*** ./models/comment.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  Schema,\n  model\n} = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst commentSchema = new Schema({\n  content: {\n    type: String,\n    required: true\n  },\n  blogId: {\n    type: Schema.Types.ObjectId,\n    ref: \"blog\"\n  },\n  createdBy: {\n    type: Schema.Types.ObjectId,\n    ref: \"user\"\n  }\n}, {\n  timestamps: true\n});\nconst Comment = model(\"comment\", commentSchema);\nmodule.exports = Comment;\n\n//# sourceURL=webpack://blogify/./models/comment.js?");

/***/ }),

/***/ "./models/user.js":
/*!************************!*\
  !*** ./models/user.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  createHmac,\n  randomBytes\n} = __webpack_require__(/*! crypto */ \"crypto\");\nconst {\n  Schema,\n  model\n} = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst {\n  createTokenForUser\n} = __webpack_require__(/*! ../services/authentication */ \"./services/authentication.js\");\nconst userSchema = new Schema({\n  fullName: {\n    type: String,\n    required: true\n  },\n  email: {\n    type: String,\n    required: true,\n    unique: true\n  },\n  salt: {\n    type: String\n  },\n  password: {\n    type: String,\n    required: true\n  },\n  profileImageURL: {\n    type: String,\n    default: \"/images/default.png\"\n  },\n  role: {\n    type: String,\n    enum: [\"USER\", \"ADMIN\"],\n    default: \"USER\"\n  }\n}, {\n  timestamps: true\n});\nuserSchema.pre(\"save\", function (next) {\n  const user = this;\n  if (!user.isModified(\"password\")) return;\n  const salt = randomBytes(16).toString();\n  const hashedPassword = createHmac(\"sha256\", salt).update(user.password).digest(\"hex\");\n  this.salt = salt;\n  this.password = hashedPassword;\n  next();\n});\nuserSchema.static(\"matchPasswordAndGenerateToken\", async function (email, password) {\n  const user = await this.findOne({\n    email\n  });\n  if (!user) throw new Error(\"User not found!\");\n  const salt = user.salt;\n  const hashedPassword = user.password;\n  const userProvidedHash = createHmac(\"sha256\", salt).update(password).digest(\"hex\");\n  if (hashedPassword !== userProvidedHash) throw new Error(\"Incorrect Password\");\n  const token = createTokenForUser(user);\n  return token;\n});\nconst User = model(\"user\", userSchema);\nmodule.exports = User;\n\n//# sourceURL=webpack://blogify/./models/user.js?");

/***/ }),

/***/ "./routes/blog.js":
/*!************************!*\
  !*** ./routes/blog.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  Router\n} = __webpack_require__(/*! express */ \"express\");\nconst multer = __webpack_require__(/*! multer */ \"multer\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst Blog = __webpack_require__(/*! ../models/blog */ \"./models/blog.js\");\nconst Comment = __webpack_require__(/*! ../models/comment */ \"./models/comment.js\");\nconst router = Router();\nconst storage = multer.diskStorage({\n  destination: function (req, file, cb) {\n    cb(null, path.resolve(`./public/uploads/`));\n  },\n  filename: function (req, file, cb) {\n    const fileName = `${Date.now()}-${file.originalname}`;\n    cb(null, fileName);\n  }\n});\nconst upload = multer({\n  storage: storage\n});\nrouter.get(\"/add-new\", (req, res) => {\n  return res.render(\"addBlog\", {\n    user: req.user\n  });\n});\nrouter.get(\"/:id\", async (req, res) => {\n  const blog = await Blog.findById(req.params.id).populate(\"createdBy\");\n  const comments = await Comment.find({\n    blogId: req.params.id\n  }).populate(\"createdBy\");\n  return res.render(\"blog\", {\n    user: req.user,\n    blog,\n    comments\n  });\n});\nrouter.post(\"/comment/:blogId\", async (req, res) => {\n  await Comment.create({\n    content: req.body.content,\n    blogId: req.params.blogId,\n    createdBy: req.user._id\n  });\n  return res.redirect(`/blog/${req.params.blogId}`);\n});\nrouter.post(\"/\", upload.single(\"coverImage\"), async (req, res) => {\n  const {\n    title,\n    body\n  } = req.body;\n  const blog = await Blog.create({\n    body,\n    title,\n    createdBy: req.user._id,\n    coverImageURL: `/uploads/${req.file.filename}`\n  });\n  return res.redirect(`/blog/${blog._id}`);\n});\nmodule.exports = router;\n\n//# sourceURL=webpack://blogify/./routes/blog.js?");

/***/ }),

/***/ "./routes/user.js":
/*!************************!*\
  !*** ./routes/user.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  Router\n} = __webpack_require__(/*! express */ \"express\");\nconst User = __webpack_require__(/*! ../models/user */ \"./models/user.js\");\nconst router = Router();\nrouter.get('/home', (req, res) => {\n  const user = req.user;\n  return res.render('home', {\n    user\n  });\n});\nrouter.get(\"/signin\", async (req, res) => {\n  return res.render(\"signin\");\n});\nrouter.get(\"/signup\", (req, res) => {\n  return res.render(\"signup\");\n});\nrouter.post(\"/signin\", async (req, res) => {\n  const {\n    email,\n    password\n  } = req.body;\n  try {\n    const token = await User.matchPasswordAndGenerateToken(email, password);\n    return res.cookie(\"token\", token).redirect(\"/\");\n  } catch (error) {\n    return res.render(\"signin\", {\n      error: \"Incorrect Email or Password\"\n    });\n  }\n});\nrouter.get(\"/logout\", (req, res) => {\n  res.clearCookie(\"token\").redirect(\"/\");\n});\nrouter.post(\"/signup\", async (req, res) => {\n  const {\n    fullName,\n    email,\n    password\n  } = req.body;\n  await User.create({\n    fullName,\n    email,\n    password\n  });\n  return res.redirect(\"/\");\n});\nmodule.exports = router;\n\n//# sourceURL=webpack://blogify/./routes/user.js?");

/***/ }),

/***/ "./services/authentication.js":
/*!************************************!*\
  !*** ./services/authentication.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const JWT = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst secret = \"$uperMan@123\";\nfunction createTokenForUser(user) {\n  const payload = {\n    _id: user._id,\n    email: user.email,\n    profileImageURL: user.profileImageURL,\n    role: user.role,\n    fullName: user.fullName\n  };\n  const token = JWT.sign(payload, secret);\n  return token;\n}\nfunction validateToken(token) {\n  const payload = JWT.verify(token, secret);\n  return payload;\n}\nmodule.exports = {\n  createTokenForUser,\n  validateToken\n};\n\n//# sourceURL=webpack://blogify/./services/authentication.js?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("cookie-parser");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("multer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./app.js");
/******/ 	
/******/ })()
;