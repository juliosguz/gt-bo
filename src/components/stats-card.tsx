interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export default function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="stat bg-base-200 rounded-box">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {description && <div className="stat-desc">{description}</div>}
    </div>
  );
}
