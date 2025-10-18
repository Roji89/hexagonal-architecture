// src/config/validation.ts
import Joi from 'joi';
import { appConfig as config } from './environment';

const configSchema = Joi.object({
  server: Joi.object({
    port: Joi.number().port().required(),
    host: Joi.string().required(),
    env: Joi.string().valid('development', 'test', 'production').required()
  }),
  database: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().port().required(),
    username: Joi.string().required(),
    password: Joi.string().min(1).required(),
    name: Joi.string().required()
  }),
  jwt: Joi.object({
    secret: Joi.string().min(32).required(),
    expiresIn: Joi.string().required()
  })
});

const { error } = configSchema.validate(config);
if (error) {
  throw new Error(`Configuration validation failed: ${error.message}`);
}

export { config as validatedConfig };
