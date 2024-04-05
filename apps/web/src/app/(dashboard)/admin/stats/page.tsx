import {
  File,
  FileCheck,
  FileClock,
  FileEdit,
  Mail,
  MailOpen,
  PenTool,
  User as UserIcon,
  UserPlus2,
  UserSquare2,
} from 'lucide-react';

import { getDocumentStats } from '@documenso/lib/server-only/admin/get-documents-stats';
import { getRecipientsStats } from '@documenso/lib/server-only/admin/get-recipients-stats';
import {
  getUserWithAtLeastOneDocumentPerMonth,
  getUserWithAtLeastOneDocumentSignedPerMonth,
  getUserWithSignedDocumentMonthlyGrowth,
  getUsersCount,
  getUsersWithSubscriptionsCount,
} from '@documenso/lib/server-only/admin/get-users-stats';

import { CardMetric } from '~/components/(dashboard)/metric-card/metric-card';

import { UserWithDocumentChart } from './user-with-document';
import { UserWithDocumentCummulativeChart } from './user-with-document-cummulative';

export default async function AdminStatsPage() {
  const [
    usersCount,
    usersWithSubscriptionsCount,
    docStats,
    recipientStats,
    userWithAtLeastOneDocumentPerMonth,
    userWithAtLeastOneDocumentSignedPerMonth,
    MONTHLY_USERS_SIGNED,
  ] = await Promise.all([
    getUsersCount(),
    getUsersWithSubscriptionsCount(),
    getDocumentStats(),
    getRecipientsStats(),
    getUserWithAtLeastOneDocumentPerMonth(),
    getUserWithAtLeastOneDocumentSignedPerMonth(),
    getUserWithSignedDocumentMonthlyGrowth(),
  ]);

  return (
    <div>
      <h2 className="text-4xl font-semibold">Instance Stats</h2>

      <div className="mt-8 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardMetric icon={UserIcon} title="Total Users" value={usersCount} />
        <CardMetric icon={File} title="Total Documents" value={docStats.ALL} />
        <CardMetric
          icon={UserPlus2}
          title="Active Subscriptions"
          value={usersWithSubscriptionsCount}
        />
        <CardMetric icon={UserPlus2} title="App Version" value={`v${process.env.APP_VERSION}`} />
      </div>

      {/* TODO: remove grid and see something */}
      <div className="mt-16 gap-8">
        <div>
          <h3 className="text-3xl font-semibold">User metrics</h3>

          <div className="mb-8 mt-4 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
            <CardMetric
              icon={File}
              title="Users with document in the last month"
              value={userWithAtLeastOneDocumentPerMonth}
            />
            <CardMetric
              icon={File}
              title="Users with signed document in the last month"
              value={userWithAtLeastOneDocumentSignedPerMonth}
            />
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-semibold">Document metrics</h3>

          <div className="mb-8 mt-4 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
            {/* <CardMetric icon={File} title="Total Documents" value={docStats.ALL} /> */}
            <CardMetric icon={FileEdit} title="Drafted Documents" value={docStats.DRAFT} />
            <CardMetric icon={FileClock} title="Pending Documents" value={docStats.PENDING} />
            <CardMetric icon={FileCheck} title="Completed Documents" value={docStats.COMPLETED} />
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-semibold">Recipients metrics</h3>

          <div className="mb-8 mt-4 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
            <CardMetric
              icon={UserSquare2}
              title="Total Recipients"
              value={recipientStats.TOTAL_RECIPIENTS}
            />
            <CardMetric icon={Mail} title="Documents Received" value={recipientStats.SENT} />
            <CardMetric icon={MailOpen} title="Documents Viewed" value={recipientStats.OPENED} />
            <CardMetric icon={PenTool} title="Signatures Collected" value={recipientStats.SIGNED} />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-3xl font-semibold">User Charts</h3>

        <UserWithDocumentChart
          data={MONTHLY_USERS_SIGNED}
          className="col-span-12 mb-8 mt-4 lg:col-span-6"
        />

        <UserWithDocumentCummulativeChart
          data={MONTHLY_USERS_SIGNED}
          className="col-span-12 mb-8 mt-4 lg:col-span-6"
        />
      </div>
    </div>
  );
}
