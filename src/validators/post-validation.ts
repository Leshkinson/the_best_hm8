import {body} from "express-validator";
import {blogService} from "../services/blog-service";

const titleValidation = body('title')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 1, max: 30}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')

const shortDescriptionValidation = body('shortDescription')
    .isString().withMessage('Invalid type')
    .trim().isLength({min: 1, max: 100}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')

const contentValidation = body('content')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 1, max: 1000}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')

const blogIdValidation = body('blogId')
    .isString().withMessage('Invalid type')
    .trim()
    .notEmpty().withMessage('Field must not be empty')
    .custom(async value => {
        const isHaveBlog = await blogService.getBlogById(value)
        if(!isHaveBlog) {
            throw new Error();
        }
        return false
    }).withMessage('No blog!')


export const postValidations = [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation]
export const createPostByBlogValidations = [titleValidation, shortDescriptionValidation, contentValidation]