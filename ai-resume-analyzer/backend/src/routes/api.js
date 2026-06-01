import express from 'express';
import multer from 'multer';
import { analyzeResume, tailorResume, interviewPrep, evaluateAnswer } from '../controllers/aiController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resume'), analyzeResume);
router.post('/tailor', upload.single('resume'), tailorResume);
router.post('/interview', upload.single('resume'), interviewPrep);
router.post('/evaluate', express.json(), evaluateAnswer);

export default router;
