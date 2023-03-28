import {body} from "express-validator";
const emailPattern = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');

const loginValidation = body('login')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 3, max: 10}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')
const passwordValidation = body('password')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 6, max: 20}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')
const emailValidation = body('email')
    .isString().withMessage('Invalid type')
    .trim()
    .custom(value => emailPattern.test(value)).withMessage('Is not email!')
    .notEmpty().withMessage('Field must not be empty')


export const userValidation = [loginValidation,passwordValidation,emailValidation ]