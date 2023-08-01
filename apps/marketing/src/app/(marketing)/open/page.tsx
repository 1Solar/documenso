import { z } from 'zod';

import { MetricCard } from '~/app/(marketing)/open/metric-card';
import { SalaryBands } from '~/app/(marketing)/open/salary-bands';

import { FundingRaised } from './funding-raised';
import { TeamMembers } from './team-members';

export const revalidate = 86400;

const ZGithubStatsResponse = z.object({
  stargazers_count: z.number(),
  forks_count: z.number(),
  open_issues: z.number(),
});

const ZMergedPullRequestsResponse = z.object({
  total_count: z.number(),
});

// const ZOpenPullRequestsResponse = ZMergedPullRequestsResponse;

export default async function OpenPage() {
  const {
    forks_count: forksCount,
    open_issues: openIssues,
    stargazers_count: stargazersCount,
  } = await fetch('https://api.github.com/repos/documenso/documenso', {
    headers: {
      accept: 'application/vnd.github.v3+json',
    },
  })
    .then((res) => res.json())
    .then((res) => ZGithubStatsResponse.parse(res));

  const { total_count: mergedPullRequests } = await fetch(
    'https://api.github.com/search/issues?q=repo:documenso/documenso/+is:pr+merged:>=2010-01-01&page=0&per_page=1',
    {
      headers: {
        accept: 'application/vnd.github.v3+json',
      },
    },
  )
    .then((res) => res.json())
    .then((res) => ZMergedPullRequestsResponse.parse(res));

  return (
    <div className="mx-auto mt-12 max-w-screen-lg">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold lg:text-5xl">Open Startup</h1>

        <p className="text-muted-foreground mt-4 max-w-[55ch] text-center text-lg leading-normal">
          All our metrics, finances, and learnings are public. We believe in transparency and want
          to share our journey with you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 grid grid-cols-4 gap-4">
          <MetricCard
            className="col-span-2 lg:col-span-1"
            title="Stargazers"
            value={stargazersCount.toLocaleString('en-US')}
          />
          <MetricCard
            className="col-span-2 lg:col-span-1"
            title="Forks"
            value={forksCount.toLocaleString('en-US')}
          />
          <MetricCard
            className="col-span-2 lg:col-span-1"
            title="Open Issues"
            value={openIssues.toLocaleString('en-US')}
          />
          <MetricCard
            className="col-span-2 lg:col-span-1"
            title="Merged PR's"
            value={mergedPullRequests.toLocaleString('en-US')}
          />
        </div>

        <TeamMembers className="col-span-12" />

        <SalaryBands className="col-span-12 lg:col-span-6" />

        <FundingRaised className="col-span-12 lg:col-span-6" />

        <div className="col-span-12 mt-12 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Where's the rest?</h2>

          <p className="text-muted-foreground mt-4 max-w-[55ch] text-center text-lg leading-normal">
            We're still working on getting all our metrics together. We'll update this page as soon
            as we have more to share.
          </p>
        </div>
      </div>
    </div>
  );
}
