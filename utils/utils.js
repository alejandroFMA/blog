const validator = require("validator");

const validateArticle = (parameters) => {
    let validateTitle =
      !validator.isEmpty(parameters.title) &&
      validator.isLength(parameters.title, { min: 5, max: 255 });
    let validateContent = !validator.isEmpty(parameters.content);

    if (!validateTitle || !validateContent) {
      throw new Error("Must send title and content correctly");
 
    }
};

module.exports = {
validateArticle

}