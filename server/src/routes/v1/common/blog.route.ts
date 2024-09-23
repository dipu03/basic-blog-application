import express from 'express';
import { blogController } from '../../../controllers';
import { blogMiddleware, userAuthMiddleware } from '../../../middlewares';
const router = express.Router();

router.get('/',  blogController.getAllBlog);
router.get('/:blogId', blogController.ViewblogDetails);

router.post('/', [userAuthMiddleware.verifyAuthJWTToken, blogMiddleware.validCreateBlogBody], blogController.createBlog);
router.put('/:blogId', [userAuthMiddleware.verifyAuthJWTToken, blogMiddleware.isBlogOwner], blogController.updateBlog);
router.delete('/:blogId', [userAuthMiddleware.verifyAuthJWTToken, blogMiddleware.isBlogOwner], blogController.deleteBlog);

router.post('/comment', [userAuthMiddleware.verifyAuthJWTToken, blogMiddleware.validateCreateCommentBody], blogController.createCommentInBlog);

export default router;