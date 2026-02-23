import { Request, Response, NextFunction } from 'express';
import { createUserClient } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; org_id: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const client = createUserClient(token);
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = {
    id: data.user.id,
    email: data.user.email!,
    org_id: data.user.user_metadata?.org_id,
  };

  next();
};
