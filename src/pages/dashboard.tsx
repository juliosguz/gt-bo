import { Link } from 'react-router';
import { useStores } from '../hooks/use-stores';
import { useAuth } from '../hooks/use-auth';
import StatsCard from '../components/stats-card';

export default function DashboardPage() {
  const { user } = useAuth();
  const canReadStores = user?.capabilities?.stores?.read ?? false;
  const { data: stores, isLoading, error } = useStores({ enabled: canReadStores });

  const total = stores?.length ?? 0;
  const activeCount = stores?.filter((s) => s.active).length ?? 0;
  const inactiveCount = total - activeCount;

  const categoryCounts = stores?.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + 1;
    return acc;
  }, {}) ?? {};

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  const recentStores = stores?.slice(-5).reverse() ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {!canReadStores ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Welcome to GT Backoffice</h2>
            <p className="text-base-content/60">Use the navigation menu to access available sections.</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg" /></div>
      ) : error ? (
        <div className="alert alert-error">{error.message}</div>
      ) : (
        <>
          <div className="stats stats-vertical sm:stats-horizontal shadow">
            <StatsCard title="Total Stores" value={total} />
            <StatsCard title="Active" value={activeCount} description={`${inactiveCount} inactive`} />
            <StatsCard
              title="Top Category"
              value={topCategory?.[0] ?? '-'}
              description={topCategory ? `${topCategory[1]} stores` : undefined}
            />
            <StatsCard title="Categories" value={Object.keys(categoryCounts).length} />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Stores</h2>
            <Link to="/stores" className="btn btn-sm btn-ghost">View all</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentStores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td><span className="badge badge-ghost">{store.category}</span></td>
                    <td>
                      <span className={`badge ${store.active ? 'badge-success' : 'badge-error'}`}>
                        {store.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentStores.length === 0 && (
                  <tr><td colSpan={3} className="text-center opacity-60">No stores yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
