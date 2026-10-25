export const seedProjects = [
  {id:'p1',name:'BuildSphere Workspace',description:'A unified workspace for planning student and team projects.',status:'In Progress',priority:'High',start_date:'2026-09-01',due_date:'2026-11-20',progress:68},
  {id:'p2',name:'Campus Connect',description:'A campus community and event discovery experience.',status:'Planning',priority:'Medium',start_date:'2026-10-01',due_date:'2026-12-05',progress:20},
  {id:'p3',name:'Staff Tracker',description:'Employee attendance and salary tracking system.',status:'In Progress',priority:'High',start_date:'2026-09-20',due_date:'2026-11-10',progress:42},
  {id:'p4',name:'Data Insights',description:'A small analytics dashboard for sample business data.',status:'Completed',priority:'Low',start_date:'2026-08-01',due_date:'2026-10-01',progress:100}
];
export const seedMembers = [
  {id:'m1',name:'Gunika Sethi',email:'gunika@example.com',role:'Admin'},
  {id:'m2',name:'Aarav Sharma',email:'aarav@example.com',role:'Project Lead'},
  {id:'m3',name:'Mehak Kaur',email:'mehak@example.com',role:'Member'},
  {id:'m4',name:'Ishaan Verma',email:'ishaan@example.com',role:'Viewer'}
];
export const seedTasks = [
  {id:'t1',title:'Finalize dashboard layout',description:'Review spacing, metrics and responsive layout.',project_id:'p1',assignee_id:'m1',status:'Completed',priority:'High',due_date:'2026-10-12'},
  {id:'t2',title:'Connect project forms',description:'Wire create and update actions to workspace state.',project_id:'p1',assignee_id:'m2',status:'In Progress',priority:'High',due_date:'2026-10-18'},
  {id:'t3',title:'Prepare database schema',description:'Create tables and relationships for project data.',project_id:'p1',assignee_id:'m3',status:'To Do',priority:'Medium',due_date:'2026-10-21'},
  {id:'t4',title:'Collect campus event requirements',description:'List the key screens and user journeys.',project_id:'p2',assignee_id:'m2',status:'To Do',priority:'Low',due_date:'2026-10-24'},
  {id:'t5',title:'Test salary calculations',description:'Check monthly attendance and half-day scenarios.',project_id:'p3',assignee_id:'m3',status:'In Progress',priority:'High',due_date:'2026-10-16'},
  {id:'t6',title:'Create sample charts',description:'Show task and project status summaries.',project_id:'p4',assignee_id:'m1',status:'Completed',priority:'Low',due_date:'2026-10-05'}
];
export const seedFiles = [];
export const seedActivity = [
  {id:'a1',message:'BuildSphere Workspace project is in progress',created_at:new Date().toISOString()},
  {id:'a2',message:'Dashboard layout marked as completed',created_at:new Date(Date.now()-3600000*3).toISOString()},
  {id:'a3',message:'Staff Tracker deadline is coming up',created_at:new Date(Date.now()-3600000*8).toISOString()}
];
