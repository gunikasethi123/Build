import { useCallback, useEffect, useMemo, useState } from 'react';
import { seedProjects, seedMembers, seedTasks, seedFiles, seedActivity } from '../data/seed.js';

const API = 'http://localhost:4000/api';
const keys = {projects:'bs_projects',tasks:'bs_tasks',members:'bs_members',files:'bs_files',activity:'bs_activity',comments:'bs_comments'};
function read(key, fallback) {
  try { const v=localStorage.getItem(keys[key]); return v?JSON.parse(v):fallback; } catch { return fallback; }
}
function write(key,value) { localStorage.setItem(keys[key],JSON.stringify(value)); }
const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function useWorkspace() {
  const [projects,setProjects]=useState(()=>read('projects',seedProjects));
  const [tasks,setTasks]=useState(()=>read('tasks',seedTasks));
  const [members,setMembers]=useState(()=>read('members',seedMembers));
  const [files,setFiles]=useState(()=>read('files',seedFiles));
  const [activity,setActivity]=useState(()=>read('activity',seedActivity));
  const [comments,setComments]=useState(()=>read('comments',{}));
  const [createIntent,setCreateIntent]=useState('');
  const [apiOnline,setApiOnline]=useState(false);
  useEffect(()=>{ write('projects',projects); },[projects]);
  useEffect(()=>{ write('tasks',tasks); },[tasks]);
  useEffect(()=>{ write('members',members); },[members]);
  useEffect(()=>{ write('files',files); },[files]);
  useEffect(()=>{ write('activity',activity); },[activity]);
  useEffect(()=>{ write('comments',comments); },[comments]);
  useEffect(()=>{ fetch(`${API}/health`).then(r=>r.ok&&setApiOnline(true)).catch(()=>setApiOnline(false)); },[]);

  const log = useCallback(message=>setActivity(old=>[{id:makeId(),message,created_at:new Date().toISOString()},...old].slice(0,100)),[]);
  const addProject = useCallback(data=>{const p={id:makeId(),progress:0,status:'Planning',priority:'Medium',...data};setProjects(old=>[p,...old]);log(`Created project: ${p.name}`);return p;},[log]);
  const updateProject = useCallback((id,patch)=>{setProjects(old=>old.map(p=>p.id===id?{...p,...patch}:p));log('Updated a project');},[log]);
  const deleteProject = useCallback(id=>{setProjects(old=>old.filter(p=>p.id!==id));setTasks(old=>old.map(t=>t.project_id===id?{...t,project_id:''}:t));log('Deleted a project');},[log]);
  const addTask = useCallback(data=>{const t={id:makeId(),status:'To Do',priority:'Medium',...data};setTasks(old=>[t,...old]);log(`Created task: ${t.title}`);return t;},[log]);
  const updateTask = useCallback((id,patch)=>{setTasks(old=>old.map(t=>t.id===id?{...t,...patch}:t));log('Updated a task');},[log]);
  const deleteTask = useCallback(id=>{setTasks(old=>old.filter(t=>t.id!==id));setComments(old=>{const n={...old};delete n[id];return n;});log('Deleted a task');},[log]);
  const addMember = useCallback(data=>{const m={id:makeId(),role:'Member',...data};setMembers(old=>[m,...old]);log(`Added team member: ${m.name}`);return m;},[log]);
  const deleteMember = useCallback(id=>{setMembers(old=>old.filter(m=>m.id!==id));setTasks(old=>old.map(t=>t.assignee_id===id?{...t,assignee_id:''}:t));log('Removed a team member');},[log]);
  const addComment = useCallback((taskId,body,author='Gunika Sethi')=>{const c={id:makeId(),task_id:taskId,body,author,created_at:new Date().toISOString()};setComments(old=>({...old,[taskId]:[c,...(old[taskId]||[])]}));log(`Comment added to task`);},[log]);
  const addFile = useCallback(async(file,projectId)=>{
    if(apiOnline){
      const form=new FormData();form.append('file',file);form.append('project_id',projectId||'');
      try {const r=await fetch(`${API}/files`,{method:'POST',body:form});if(!r.ok)throw new Error('Upload failed');const f=await r.json();f.local=false;setFiles(old=>[f,...old]);log(`Uploaded file: ${file.name}`);return;}
      catch(e){console.error(e);alert('Backend upload failed. The file was not uploaded. Check MySQL/server.');return;}
    }
    const f={id:makeId(),original_name:file.name,mime_type:file.type,size_bytes:file.size,project_id:projectId||'',uploaded_at:new Date().toISOString(),local:true,object_url:URL.createObjectURL(file)};
    setFiles(old=>[f,...old]);log(`Added local file: ${file.name}`);
  },[apiOnline,log]);
  const deleteFile = useCallback(id=>{const f=files.find(x=>x.id===id);if(f?.local&&f.object_url)URL.revokeObjectURL(f.object_url);setFiles(old=>old.filter(x=>x.id!==id));log('Deleted a file');},[files,log]);
  const progressFor = useCallback(projectId=>{const related=tasks.filter(t=>t.project_id===projectId);return related.length?Math.round(related.filter(t=>t.status==='Completed').length/related.length*100):(projects.find(p=>p.id===projectId)?.progress||0);},[tasks,projects]);
  const metrics = useMemo(()=>({projectCount:projects.length,activeTasks:tasks.filter(t=>t.status!=='Completed').length,completedTasks:tasks.filter(t=>t.status==='Completed').length,overdue:tasks.filter(t=>t.status!=='Completed'&&t.due_date&&new Date(`${t.due_date}T23:59:59`)<new Date()).length,upcoming:tasks.filter(t=>t.status!=='Completed'&&t.due_date).length,members:members.length,completion:tasks.length?Math.round(tasks.filter(t=>t.status==='Completed').length/tasks.length*100):0}),[projects,tasks,members]);
  return {projects,tasks,members,files,activity,comments,metrics,apiOnline,createIntent,setCreateIntent,addProject,updateProject,deleteProject,addTask,updateTask,deleteTask,addMember,deleteMember,addComment,addFile,deleteFile,progressFor};
}
