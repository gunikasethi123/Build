import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import path from 'node:path';
import { getPool } from '../db.js';
import { upload } from '../middleware/upload.js';

const router = Router();
const activity = async (message, type = 'workspace', id = null) => {
  try {
    await getPool().execute(
      'INSERT INTO activity_log (id,message,entity_type,entity_id) VALUES (?,?,?,?)',
      [uuid(), message, type, id]
    );
  } catch (error) { console.error('Activity log:', error.message); }
};

router.get('/health', (_req, res) => res.json({ ok: true, service: 'BuildSphere API' }));

router.get('/projects', async (_req, res, next) => {
  try { const [rows] = await getPool().query('SELECT * FROM projects ORDER BY created_at DESC'); res.json(rows); }
  catch (e) { next(e); }
});
router.post('/projects', async (req, res, next) => {
  try {
    const p = req.body;
    const id = uuid();
    await getPool().execute(
      'INSERT INTO projects (id,name,description,status,priority,start_date,due_date,progress) VALUES (?,?,?,?,?,?,?,?)',
      [id, p.name, p.description || '', p.status || 'Planning', p.priority || 'Medium', p.start_date || null, p.due_date || null, Number(p.progress || 0)]
    );
    await activity(`Created project: ${p.name}`, 'project', id);
    res.status(201).json({ id, ...p });
  } catch (e) { next(e); }
});
router.patch('/projects/:id', async (req, res, next) => {
  try {
    const p = req.body;
    await getPool().execute(
      'UPDATE projects SET name=?,description=?,status=?,priority=?,start_date=?,due_date=?,progress=? WHERE id=?',
      [p.name, p.description || '', p.status, p.priority, p.start_date || null, p.due_date || null, Number(p.progress || 0), req.params.id]
    );
    await activity(`Updated project: ${p.name}`, 'project', req.params.id);
    res.json({ id: req.params.id, ...p });
  } catch (e) { next(e); }
});
router.delete('/projects/:id', async (req, res, next) => {
  try { await getPool().execute('DELETE FROM projects WHERE id=?', [req.params.id]); await activity('Deleted a project','project',req.params.id); res.json({ ok: true }); }
  catch (e) { next(e); }
});

router.get('/tasks', async (_req, res, next) => {
  try { const [rows] = await getPool().query('SELECT * FROM tasks ORDER BY created_at DESC'); res.json(rows); }
  catch (e) { next(e); }
});
router.post('/tasks', async (req, res, next) => {
  try {
    const t = req.body, id = uuid();
    await getPool().execute(
      'INSERT INTO tasks (id,title,description,project_id,assignee_id,status,priority,due_date) VALUES (?,?,?,?,?,?,?,?)',
      [id,t.title,t.description||'',t.project_id||null,t.assignee_id||null,t.status||'To Do',t.priority||'Medium',t.due_date||null]
    );
    await activity(`Created task: ${t.title}`,'task',id);
    res.status(201).json({id,...t});
  } catch (e) { next(e); }
});
router.patch('/tasks/:id', async (req, res, next) => {
  try {
    const t = req.body;
    await getPool().execute(
      'UPDATE tasks SET title=?,description=?,project_id=?,assignee_id=?,status=?,priority=?,due_date=? WHERE id=?',
      [t.title,t.description||'',t.project_id||null,t.assignee_id||null,t.status,t.priority,t.due_date||null,req.params.id]
    );
    await activity(`Updated task: ${t.title}`,'task',req.params.id);
    res.json({id:req.params.id,...t});
  } catch (e) { next(e); }
});
router.delete('/tasks/:id', async (req,res,next) => {
  try { await getPool().execute('DELETE FROM tasks WHERE id=?',[req.params.id]); res.json({ok:true}); }
  catch(e) { next(e); }
});

router.get('/team', async (_req,res,next) => {
  try { const [rows] = await getPool().query('SELECT * FROM team_members ORDER BY created_at DESC'); res.json(rows); }
  catch(e) { next(e); }
});
router.post('/team', async (req,res,next) => {
  try {
    const m=req.body,id=uuid();
    await getPool().execute('INSERT INTO team_members (id,name,email,role) VALUES (?,?,?,?)',[id,m.name,m.email,m.role||'Member']);
    await activity(`Added team member: ${m.name}`,'team',id);
    res.status(201).json({id,...m});
  } catch(e) { next(e); }
});
router.delete('/team/:id', async (req,res,next) => {
  try { await getPool().execute('DELETE FROM team_members WHERE id=?',[req.params.id]); await activity('Removed a team member','team',req.params.id); res.json({ok:true}); }
  catch(e) { next(e); }
});

router.get('/files', async (_req,res,next) => {
  try { const [rows] = await getPool().query('SELECT id,original_name,mime_type,size_bytes,project_id,uploaded_at FROM project_files ORDER BY uploaded_at DESC'); res.json(rows); }
  catch(e) { next(e); }
});
router.post('/files', upload.single('file'), async (req,res,next) => {
  try {
    if (!req.file) return res.status(400).json({error:'Choose a file first.'});
    const id=uuid(), f=req.file;
    await getPool().execute(
      'INSERT INTO project_files (id,original_name,stored_name,mime_type,size_bytes,project_id) VALUES (?,?,?,?,?,?)',
      [id,f.originalname,f.filename,f.mimetype,f.size,req.body.project_id||null]
    );
    await activity(`Uploaded file: ${f.originalname}`,'file',id);
    res.status(201).json({id,original_name:f.originalname,mime_type:f.mimetype,size_bytes:f.size,project_id:req.body.project_id||null,download_url:`/api/files/${id}/download`});
  } catch(e) { next(e); }
});
router.get('/files/:id/download', async (req,res,next) => {
  try {
    const [rows]=await getPool().execute('SELECT * FROM project_files WHERE id=?',[req.params.id]);
    if (!rows.length) return res.status(404).json({error:'File not found'});
    res.download(path.resolve('server/uploads',rows[0].stored_name),rows[0].original_name);
  } catch(e) { next(e); }
});
router.delete('/files/:id', async (req,res,next) => {
  try {
    const [rows]=await getPool().execute('SELECT stored_name FROM project_files WHERE id=?',[req.params.id]);
    if (!rows.length) return res.status(404).json({error:'File not found'});
    await getPool().execute('DELETE FROM project_files WHERE id=?',[req.params.id]);
    const fs = await import('node:fs/promises');
    try { await fs.unlink(path.resolve('server/uploads',rows[0].stored_name)); } catch {}
    res.json({ok:true});
  } catch(e) { next(e); }
});

router.get('/tasks/:id/comments', async (req,res,next) => {
  try { const [rows]=await getPool().execute('SELECT * FROM task_comments WHERE task_id=? ORDER BY created_at DESC',[req.params.id]); res.json(rows); }
  catch(e) { next(e); }
});
router.post('/tasks/:id/comments', async (req,res,next) => {
  try {
    const {author='Workspace member',body}=req.body;
    if (!body?.trim()) return res.status(400).json({error:'Comment cannot be empty'});
    const id=uuid();
    await getPool().execute('INSERT INTO task_comments (id,task_id,author,body) VALUES (?,?,?,?)',[id,req.params.id,author,body.trim()]);
    await activity(`Commented on a task`,'comment',id);
    res.status(201).json({id,task_id:req.params.id,author,body:body.trim()});
  } catch(e) { next(e); }
});
router.get('/activity', async (_req,res,next) => {
  try { const [rows]=await getPool().query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 100'); res.json(rows); }
  catch(e) { next(e); }
});

export default router;
