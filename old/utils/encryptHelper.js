const validator = require('validator');

module.exports = {
    isValidEmail: (email) => {
        return validator.isEmail(email);
    }
};
