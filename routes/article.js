const ArticleController = require ("../controllers/article");
const multer = require("multer")
const express = require ("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');

const dir = './images/articles/';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, dir);
    },
    filename:(req, files, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedOriginalName = files.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const filename = "article" + uniqueSuffix + "-" + sanitizedOriginalName;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

router.post("/create", ArticleController.createArticle);
router.post("/upload-file/:id", [upload.single("file")],ArticleController.uploadFile);
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/image/:file", ArticleController.getImage);
router.get("/article/:id", ArticleController.getArticleById);
router.get("/search/:query", ArticleController.search);
router.put("/article/:id", ArticleController.editArticle);
router.delete("/article/:id", ArticleController.deleteArticle);






module.exports= router