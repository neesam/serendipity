import { NextFunction, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

export async function requireUser(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Missing token" });

  // A client that acts as this user, so RLS applies to every query through it
  const db = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ message: "Invalid token" });

  req.user = data.user; // verified identity
  req.db = db;          // queries through this are filtered by RLS
  next();
}