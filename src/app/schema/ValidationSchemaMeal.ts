import * as Joi from '@hapi/joi';

const createMealValidationSchema = Joi.object({
  title: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .required(),

  calorie: Joi.number()
    .min(0)
    .required(),

  date: Joi.string(),
  time: Joi.string(),

  userName: Joi.string()
    .email({ minDomainSegments: 2}),
});

const updateMealValidationSchema = Joi.object({
  id: Joi.number()
    .min(0),

  title: Joi.string()
    .alphanum()
    .min(3)
    .max(20),

  fromCalorie: Joi.number()
    .min(0),

  toCalorie: Joi.number()
    .min(0),

  fromDate: Joi.string(),
  toDate: Joi.string(),

  fromTime: Joi.string(),
  toTime: Joi.string(),

  userName: Joi.string()
    .email({ minDomainSegments: 2}),
});

const filtersValidationSchema = Joi.object({
  id: Joi.number()
    .min(0)
    .required(),

  title: Joi.string()
    .alphanum()
    .min(3)
    .max(20),

  calorie: Joi.number()
    .min(0),

  date: Joi.string(),
  time: Joi.string(),

  userName: Joi.string()
    .email({ minDomainSegments: 2}),
});

export {
  createMealValidationSchema,
  updateMealValidationSchema,
  filtersValidationSchema,
};
