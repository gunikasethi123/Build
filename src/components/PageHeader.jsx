import { Plus } from 'lucide-react';
export default function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  children}) {
  return 
  <div className="page-header">
    <div>
      <div className="eyebrow">{eyebrow||'WORKSPACE'}
    </div>
        <h1>{title}</h1>
        <p>{description}</p>
  </div>
        <div className="header-actions">{children}{actionLabel&&
          <button className="btn btn-primary" onClick={onAction}>
          <Plus size={17}/>{actionLabel}
          </button>}
        </div>
  </div>;
}
