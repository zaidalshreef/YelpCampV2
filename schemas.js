const basejoi = require("joi");
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    'string.escapeHtml': '{{#label}} must not contain HTML',
  },
  rules: {
    escapeHtml: {
      validate: (value, helpers) => {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if(clean === value) {
          return value;
        }
        return helpers.error('string.escapeHtml', { value });
      },
    },
  },
});

const joi = basejoi.extend(extension);


module.exports.campgroundSchema = joi.object({
  campground: joi
    .object({
      title: joi.string().required().escapeHtml(),
      location: joi.string().required().escapeHtml(),
      // image: joi.string().required(),
      price: joi.number().required().min(0),
      description: joi.string().required().escapeHtml(),
    })
    .required(),
    deleteImages: joi.array(),
});

module.exports.reviewSchema = joi.object({
  Review: joi
    .object({
      body: joi.string().required().escapeHtml(),
      rating: joi.number().required().min(0).max(5),
    })
    .required(),
});
