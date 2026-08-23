import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { StorageOverview } from '@/models/admin/StorageOverview'
import type { SystemStatistics } from '@/models/admin/SystemStatistics'

export function SystemActivityChart({ statistics }: { statistics: SystemStatistics }) {
  const data = [
    {
      name: 'Users',
      active: statistics.activeUsers,
      other: Math.max(statistics.totalUsers - statistics.activeUsers, 0),
    },
    {
      name: 'Plans',
      active: statistics.activeStoragePlans,
      other: Math.max(statistics.totalStoragePlans - statistics.activeStoragePlans, 0),
    },
    {
      name: 'Subscriptions',
      active: statistics.activeSubscriptions,
      other: Math.max(statistics.totalSubscriptions - statistics.activeSubscriptions, 0),
    },
  ]

  return (
    <div className="h-52 w-full min-w-0" role="img" aria-label="Active and other platform records">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, left: -22, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
          <Tooltip
            cursor={{ fill: 'var(--card-muted)' }}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--foreground)',
            }}
          />
          <Bar
            dataKey="active"
            name="Active"
            stackId="state"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="other"
            name="Other"
            stackId="state"
            fill="var(--brand)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StorageCapacityChart({ overview }: { overview: StorageOverview }) {
  const values = [
    { name: 'Physical', bytes: overview.totalPhysicalCapacityBytes },
    { name: 'Allocated', bytes: overview.totalAllocatedBytes },
    { name: 'Used', bytes: overview.totalUsedBytes },
    { name: 'Available', bytes: overview.totalAvailableBytes },
  ]

  return (
    <div className="h-52 w-full min-w-0" role="img" aria-label="Platform storage values in bytes">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={values}
          layout="vertical"
          margin={{ top: 8, right: 8, left: 10, bottom: 0 }}
        >
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={64}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          />
          <Tooltip
            formatter={(value) => new Intl.NumberFormat().format(Number(value))}
            cursor={{ fill: 'var(--card-muted)' }}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--foreground)',
            }}
          />
          <Bar
            dataKey="bytes"
            name="Bytes"
            fill="var(--primary)"
            radius={[0, 6, 6, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
