const ArticleController = require ("../controllers/article");
const express = require ("express");
const router = express.Router();

router.post("/create", ArticleController.createArticle);
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticleById);
router.delete("/article/:id", ArticleController.deleteArticle);
router.put("/article/:id", ArticleController.editArticle);




module.exports= router