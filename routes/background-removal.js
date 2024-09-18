import fs from 'node:fs';
import path from 'node:path';
import {Router} from 'express';

const router = Router();
router.post('/', (req, res) => {
  console.log('req.body=', req.body);
  const [file] = req.files;
  const filename = path.join(global.APP_DIR, `public/upload/${file.originalname}`);
  fs.writeFileSync(filename, file.buffer, 'binary');
  res.json(true);
});
export default router;