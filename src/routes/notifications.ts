import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sendFboArrivalNotification } from '../services/emailService';

const router = Router();

// POST /api/notifications/send
router.post('/send', authenticate, async (req: AuthRequest, res) => {
  try {
    const payload = req.body;
    await sendFboArrivalNotification(payload);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

export default router;
