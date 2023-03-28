import {body} from "express-validator";

const urlPattern = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');

const nameValidation = body('name')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 1, max: 15}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')

const descriptionValidation = body('description')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 1, max: 500}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')

const websiteUrlValidation = body('websiteUrl')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 1, max: 100}).withMessage('Not correct length')
    .custom(value => urlPattern.test(value)).withMessage('Is not URL!')
    .notEmpty().withMessage('Field must not be empty')






export const blogValidations = [nameValidation, descriptionValidation, websiteUrlValidation]
