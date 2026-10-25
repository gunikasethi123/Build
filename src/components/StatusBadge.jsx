export default function StatusBadge({
  children
}) {
  const value=String(children||'Planning').toLowerCase().replaceAll(' ','-');
  return 
  <span className={`status-badge status-${value}`}>
    {children}
  </span>;
}
