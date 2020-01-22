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

  date: Joi.string()
    .allow(''),
  time: Joi.string()
    .allow(''),

  userName: Joi.string()
    .email({ minDomainSegments: 2})
    .allow(''),
}).unknown();

const filtersValidationSchema = Joi.object({
  id: Joi.number()
    .min(0),

  title: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .allow(''),

  fromCalorie: Joi.number()
    .min(0),

  toCalorie: Joi.number()
    .min(0),

  fromDate: Joi.string()
    .allow(''),
  toDate: Joi.string()
    .allow(''),

  fromTime: Joi.string()
    .allow(''),
  toTime: Joi.string()
    .allow(''),

  userName: Joi.string()
    .email({ minDomainSegments: 2 })
    .allow(''),

  page: Joi.number()
    .allow(''),
  limit: Joi.number()
    .allow(''),
}).unknown();

const updateMealValidationSchema = Joi.object({
  id: Joi.number()
    .min(0)
    .required(),

  title: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .allow(''),

  calorie: Joi.number()
    .min(0),

  date: Joi.string()
    .allow(''),
  time: Joi.string()
    .allow(''),

  userName: Joi.string()
    .email({ minDomainSegments: 2})
    .allow(''),
}).unknown();

export {
  createMealValidationSchema,
  updateMealValidationSchema,
  filtersValidationSchema,
};
