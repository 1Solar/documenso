import { DateTime } from 'luxon';

import { prisma } from '@documenso/prisma';
import { DocumentStatus, SubscriptionStatus } from '@documenso/prisma/client';

export const getUsersCount = async () => {
  return await prisma.user.count();
};

export const getUsersWithSubscriptionsCount = async () => {
  return await prisma.user.count({
    where: {
      Subscription: {
        some: {
          status: SubscriptionStatus.ACTIVE,
        },
      },
    },
  });
};

export const getUserWithAtLeastOneDocumentPerMonth = async () => {
  return await prisma.user.count({
    where: {
      Document: {
        some: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      },
    },
  });
};

export const getUserWithAtLeastOneDocumentSignedPerMonth = async () => {
  return await prisma.user.count({
    where: {
      Document: {
        some: {
          status: {
            equals: DocumentStatus.COMPLETED,
          },
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      },
    },
  });
};

export type GetUserWithDocumentMonthlyGrowth = Array<{
  month: string;
  count: number;
  cume_count: number;
  signed_count: number;
  cume_signed_count: number;
}>;

type GetUserWithDocumentMonthlyGrowthQueryResult = Array<{
  month: Date;
  count: bigint;
  cume_count: bigint;
  signed_count: bigint;
  cume_signed_count: bigint;
}>;

export const getUserWithSignedDocumentMonthlyGrowth = async () => {
  const result = await prisma.$queryRaw<GetUserWithDocumentMonthlyGrowthQueryResult>`
      SELECT
        DATE_TRUNC('month', "Document"."createdAt") AS "month",
        COUNT(DISTINCT "Document"."userId") as "count",
        SUM(COUNT(DISTINCT "Document"."userId")) OVER (ORDER BY DATE_TRUNC('month', "Document"."createdAt")) as "cume_count",
        COUNT(DISTINCT CASE WHEN "Document"."status" = 'COMPLETED' THEN "Document"."userId" END) as "signed_count",
        SUM(COUNT(DISTINCT CASE WHEN "Document"."status" = 'COMPLETED' THEN "Document"."userId" END)) OVER (ORDER BY DATE_TRUNC('month', "Document"."createdAt")) as "cume_signed_count"
      FROM "Document"
      GROUP BY "month"
      ORDER BY "month" DESC
      LIMIT 12
`;

  return result.map((row) => ({
    month: DateTime.fromJSDate(row.month).toFormat('yyyy-MM'),
    count: Number(row.count),
    cume_count: Number(row.cume_count),
    signed_count: Number(row.signed_count),
    cume_signed_count: Number(row.cume_signed_count),
  }));
};
