import { Activity as ActivityIcon, FolderKanban, CheckCircle2, Users, Paperclip, MessageCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
export default function ActivityPage({activity}) {
  const iconFor=m=>m.toLowerCase().includes('task')?<CheckCircle2 size={18}/>:m.toLowerCase().includes('member')
  ?<Users size={18}/>:m.toLowerCase().includes('file')?<Paperclip size={18}/>:m.toLowerCase().includes('comment')
  ?<MessageCircle size={18}/>:<FolderKanban size={18}/>;
  return <><PageHeader eyebrow="WORKSPACE HISTORY" title="Activity" description="A running timeline of what has changed in your workspace."/>
  <section className="panel activity-page-panel">
    <div className="panel-heading">
      <div><h2>Recent updates</h2>
      <p>Latest workspace events.
        </p>
        </div>
        <ActivityIcon size={20}/>
        </div>{activity.length?activity.map((a,i)=>
        <div className="timeline-row" key={a.id}>
          <div className={`timeline-icon timeline-${i%4}`}>{iconFor(a.message)}</div>
          <div className="timeline-copy">
            <b>{a.message}</b>
            <small>{new Date(a.created_at).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}</small>
            </div>
            <span className="timeline-label">Workspace</span>
            </div>):
            <p className="muted">No activity recorded yet.</p>}
            </section>
            </>;
}
