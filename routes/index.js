import {Router} from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.render('index', {layout: false});
});
export default router;