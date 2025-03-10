import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error(
    'api-key not provided, is required to start this server application',
  );
}

export function checkAccessPermission(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.headers['api-key'] !== API_KEY)
    return res.status(401).json({ error: true });

  next();
}
