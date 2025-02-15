import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { ROLES } from '../constants/index.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import {
    getAllUsersController,
    getUserByEmailController,
    addUserController,
    updateUserController,
    deleteUserController
} from '../controllers/users.js';

const router = Router();

router.use(authenticate);


router.get('/', checkRoles(ROLES.ADMIN), ctrlWrapper(getAllUsersController));
router.get('/:email', checkRoles(ROLES.ADMIN), ctrlWrapper(getUserByEmailController));
router.post('/', checkRoles(ROLES.ADMIN), ctrlWrapper(addUserController));
router.put('/:userId', checkRoles(ROLES.ADMIN), ctrlWrapper(updateUserController));
router.delete('/:userId', checkRoles(ROLES.ADMIN), ctrlWrapper(deleteUserController));

export default router;
