import { query } from '../config/db.js';
export async function listCategories(req,res){const result=await query('SELECT id,name,slug,description,image_url AS image FROM categories WHERE is_active=true ORDER BY sort_order');res.json({categories:result.rows});}
export async function listCollections(req,res){const result=await query('SELECT id,title,slug,description,image_url AS image FROM collections WHERE is_active=true ORDER BY created_at DESC');res.json({collections:result.rows});}
