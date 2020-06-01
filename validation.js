const Joi = require('joi')

const registerValidation = (body) => {
    const registerSchema = {
        email: Joi.string()
            .required()
            .example('example@email.com')
            .email(),
        password: Joi.string()
            .min(6)
            .example('************')
            .required(),
        name: Joi.string()
            .min(6)
            .example('Jane Doe')
            .required(),
        address: Joi.string()
                .min(12),
        phone: Joi.string()
                .min(9),
    };

    return Joi.validate(body, registerSchema);
};

const signinValidation = (body) => {
    const signinSchema = {
        email: Joi.string()
            .min(6)
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
    };

    return Joi.validate(body, signinSchema);
};

module.exports.registerValidation = registerValidation;
module.exports.signinValidation = signinValidation;