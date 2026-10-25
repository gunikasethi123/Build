import { FolderOpen } from 'lucide-react';
export default function EmptyState({
  title='Nothing here yet',
  description='Add your first item to get started.'}) {
  return
   <div className="empty-state">
    <div><FolderOpen size={23}/>
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    </div>;
}
