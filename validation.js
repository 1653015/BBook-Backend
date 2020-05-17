const Joi = require('joi')

const registerValidation = (body) => {
    const registerSchema = {
        login_id: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .required()
            .email(),
    };

    return Joi.validate(body, registerSchema);
};

const signinValidation = (body) => {
    const signinSchema = {
        login_id: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
    };

    return Joi.validate(body, signinSchema);
};

module.exports.registerValidation = registerValidation;
module.exports.signinValidation = signinValidation;