const Article = require("../models/Article");
const { validateArticle } = require("../utils/utils");
const fs = require("fs");
const path = require("path");

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

const uploadFile = async (req, res) => {
  //configurar multer
  //recoger fichero de imagen
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "Error",
      message: "Peticion invalida",
    });
  } //nombre del archivo
  let nameFile = req.file.originalname;
  //extension archivo
  let fileSplit = nameFile.split(".");
  let fileExtension = fileSplit[1];

  try {
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "gif"
    ) {
      fs.unlink(req.file.path, (error) => {
        return res.status(400).json({
          status: "Error",
          message: "Invalid image",
        });
      });
    } else {
      let id = req.params.id;
      let article = await Article.findOneAndUpdate(
        { _id: id },
        { image: req.file.filename },
        {
          new: true,
        }
      );

      if (article) {
        return res.status(200).json({
          status: "success",
          article,
          message: "Article Image updated succesfully",
          file: req.file,
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error updating the article image",
    });
  }
};

const getImage = async (req, res) => {
  let file = req.params.file;
  let dir = "./images/articles/" + file;
  fs.access(dir, (error) => {
    if (!error) {
      return res.sendFile(path.resolve(dir));
    } else {
      return res.status(404).jsdon({
        status: "error",
        messsage: "Image does not exist",
      });
    }
  });
};

const search = async (req, res) => {

    let query = req.params.query
try{
    let articles = await Article.find({"$or": [
        {title:{"$regex": query, "$options": "i"}},
        {content:{"$regex": query, "$options": "i"}}
    ]})
    .sort({ date: -1 })
    .exec();

    
    if (articles.length === 0) {
        return res.status(404).json({
            status: "error",
            message: "No articles found matching the query",
        });
    }

    return res.status(200).json({
      status: "success",
      counter: articles.length,
      articles,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error fetching articles",
    });
  }
};


module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  deleteArticle,
  editArticle,
  uploadFile,
  getImage,
  search
};
