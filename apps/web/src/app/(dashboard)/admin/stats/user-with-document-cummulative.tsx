'use client';

import { DateTime } from 'luxon';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { GetUserWithDocumentMonthlyGrowth } from '@documenso/lib/server-only/admin/get-users-stats';

export type UserWithDocumentCummulativeChartProps = {
  className?: string;
  data: GetUserWithDocumentMonthlyGrowth;
};

export const UserWithDocumentCummulativeChart = ({
  className,
  data,
}: UserWithDocumentCummulativeChartProps) => {
  const formattedData = [...data]
    .reverse()
    .map(({ month, cume_count: count, cume_signed_count: signed_count }) => {
      return {
        month: DateTime.fromFormat(month, 'yyyy-MM').toFormat('LLLL'),
        count: Number(count),
        signed_count: Number(signed_count),
      };
    });

  return (
    <div className={className}>
      <div className="border-border flex flex-1 flex-col justify-center rounded-2xl border p-6 pl-2">
        <div className="mb-6 flex px-4">
          <h3 className="text-lg font-semibold">Total Activity (Cummulative)</h3>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={formattedData}>
            <XAxis dataKey="month" />
            <YAxis />

            <Tooltip
              labelStyle={{
                color: 'hsl(var(--primary-foreground))',
              }}
              formatter={(value, name) => [
                Number(value).toLocaleString('en-US'),
                name === 'count' ? 'User with document' : 'Users with signed document',
              ]}
              cursor={{ fill: 'hsl(var(--primary) / 10%)' }}
            />

            <Bar
              dataKey="signed_count"
              fill="hsl(var(--gold))"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              label="Documents Added"
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              label="Documents Signed"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
