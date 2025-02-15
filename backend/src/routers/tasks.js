import { Router } from 'express';
import { 
    getTasksController, 
    getTaskByIdController, 
    createTaskController, 
    patchTaskController, 
    deleteTaskController,
    subscribeToTask,
    updateTaskStatus,
} from '../controllers/tasks.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createTaskSchema, updateTaskSchema } from '../validation/tasks.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';
import { getNotifications } from '../controllers/notifications.js';

const router = Router();

router.use(authenticate);

router.get('/', checkRoles(ROLES.ADMIN, ROLES.EMPLOYEE), ctrlWrapper(getTasksController));
router.get('/:taskId', checkRoles(ROLES.ADMIN, ROLES.EMPLOYEE), ctrlWrapper(getTaskByIdController));
router.post('/', checkRoles(ROLES.ADMIN, ROLES.EMPLOYEE), validateBody(createTaskSchema), ctrlWrapper(createTaskController));
router.patch('/:taskId', checkRoles(ROLES.ADMIN, ROLES.EMPLOYEE), validateBody(updateTaskSchema), ctrlWrapper(patchTaskController));
router.delete('/:taskId', checkRoles(ROLES.ADMIN, ROLES.EMPLOYEE), ctrlWrapper(deleteTaskController));

router.post('/subscribe', checkRoles(ROLES.ADMIN, ROLES.EMPLOYEE), subscribeToTask);
router.post('/update-status', checkRoles(ROLES.ADMIN, ROLES.EMPLOYEE), updateTaskStatus);
router.get('/notifications', checkRoles(ROLES.ADMIN, ROLES.EMPLOYEE), getNotifications);

export default router;
