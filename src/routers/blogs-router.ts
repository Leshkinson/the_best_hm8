import {Router} from "express";
import { checkBlogId} from "../validators/generalValidation";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {authorizationGuard} from "../middleware/authorization-guard";
import {blogController} from "../controllers/blog-controller";
import {createPostByBlogValidations} from "../validators/post-validation";
import {blogValidations} from "../validators/blog-validation";
import {authMiddleware} from "../middleware/authMiddleware";

export const blogsRouter = Router({})

//-------------------GET---------------//
blogsRouter.get('/', blogController.getAllBlogs)
blogsRouter.get('/:id', blogController.getBlogById)
blogsRouter.get('/:id/posts',checkBlogId ,blogController.getAllBlogPosts)
//-------------------POST---------------//
blogsRouter.post('/', authorizationGuard, blogValidations, inputValidationMiddleware, blogController.createBlog)
blogsRouter.post('/:id/posts', authorizationGuard, checkBlogId, createPostByBlogValidations, inputValidationMiddleware, blogController.createPostInBlog)
//-------------------PUT---------------//
blogsRouter.put('/:id', authorizationGuard, blogValidations, inputValidationMiddleware, blogController.changeBlog)
//-------------------DELETE---------------//
blogsRouter.delete('/:id', authorizationGuard, blogController.deleteBlog)