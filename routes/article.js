const ArticleController = require ("../controllers/article");
const multer = require("multer")
const express = require ("express");
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, './images/articles/');
    },
    filename:(req,files, cb) => {
        cb(null, "article" + Date.now() + files.originalname);
    }
})

const uploads = multer({storage: storage});

router.post("/create", ArticleController.createArticle);
router.post("/upload-file/:id", [uploads.single("file")],ArticleController.uploadFile);
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticleById);
router.put("/article/:id", ArticleController.editArticle);
router.delete("/article/:id", ArticleController.deleteArticle);






module.exports= router