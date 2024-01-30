const Article = require("../models/Article");
const {validateArticle} = require("../utils/utils")


const createArticle = async (req, res) => {
  let parameters = req.body;

  try {
    validateArticle(parameters);
    
    const article = new Article(parameters);

    await article.save();

    return res.status(201).json({
      status: "success",
      message: "Article saved successfully",
      article: article,
    });
} catch (error) {
    console.error("Error:", error);
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getArticles = async (req, res) => {
  try {
    let query = Article.find({}).sort({ date: -1 });

    if (req.params.last) {
      const limitNumber = parseInt(req.params.last, 10);
      if (!isNaN(limitNumber)) {
        query = query.limit(limitNumber);
      }
    }

    let articles = await query.exec();

    return res.status(200).json({
      status: "success",
      counter: articles.length,
      articles,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(404).json({
      status: "error",
      message: "Articles not found",
    });
  }
};

const getArticleById = async (req, res) => {
  try {
    let id = req.params.id;

    let article = await Article.findById(id);

    if (article) {
      return res.status(200).json({
        status: "success",
        article,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error retrieving the article",
    });
  }
};

const deleteArticle = async (req, res) => {
  let id = req.params.id;

  let article = await Article.findOneAndDelete({ _id: id });

  try {
    if (article) {
      return res.status(200).json({
        status: "success",
        article,
        message: "Article removed succesfully",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error retrieving the article",
    });
  }
};

const editArticle = async (req, res) => {
  let id = req.params.id;
  let parameters = req.body;


  try {
    validateArticle(parameters);
    let article = await Article.findOneAndUpdate({ _id: id }, parameters, {
      new: true,
    });

    if (article) {
      return res.status(200).json({
        status: "success",
        article,
        message: "Article updated succesfully",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error updating the article",
    });
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  deleteArticle,
  editArticle,
};
