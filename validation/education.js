const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateExperienceInput(data) {
    let errors = {};


    data.school = !isEmpty(data.school) ? data.school : "";
    data.degree = !isEmpty(data.degree) ? data.degree : "";
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
    data.from = !isEmpty(data.from) ? data.from : "";

    if (Validator.isEmpty(data.school)) {
        errors.school = "job school field is required";
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = "degree field is required";
    }
    if (Validator.isEmpty(data.from)) {
        errors.from = "from date field is required";
    }
    if (Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = "fieldofstudy date field is required";
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }

};