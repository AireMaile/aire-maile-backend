import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = Router();

// GET /api/fbos - list all FBOs for the org
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('fbos')
      .select('*')
      .eq('org_id', req.user!.org_id);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch FBOs' });
  }
});

// POST /api/fbos - register a new FBO
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, email, airport_iata } = req.body;
    const { data, error } = await supabase
      .from('fbos')
      .insert({ name, email, airport_iata, org_id: req.user!.org_id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create FBO' });
  }
});

// DELETE /api/fbos/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { error } = await supabase
      .from('fbos')
      .delete()
      .eq('id', req.params.id)
      .eq('org_id', req.user!.org_id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete FBO' });
  }
});

export default router;
