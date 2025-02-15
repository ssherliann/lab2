import { Router } from 'express';
import {
    getAllTasksSummaryController,
    getTasksByDayController,
    getTasksByWeekController,
    getTasksByMonthController,
    getTasksByHalfYearController,
    getTasksByYearController,
} from '../controllers/reports.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get('/report/summary', checkRoles(ROLES.ADMIN, ROLES.EMPLOYEE), ctrlWrapper(getAllTasksSummaryController));
router.get('/report/day', checkRoles(ROLES.ADMIN), ctrlWrapper(getTasksByDayController));
router.get('/report/week', checkRoles(ROLES.ADMIN), ctrlWrapper(getTasksByWeekController));
router.get('/report/month', checkRoles(ROLES.ADMIN), ctrlWrapper(getTasksByMonthController));
router.get('/report/halfyear', checkRoles(ROLES.ADMIN), ctrlWrapper(getTasksByHalfYearController));
router.get('/report/year', checkRoles(ROLES.ADMIN), ctrlWrapper(getTasksByYearController));

export default router;