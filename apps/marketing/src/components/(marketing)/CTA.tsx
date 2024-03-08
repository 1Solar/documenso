import Link from 'next/link';

import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';
import { Button } from '@documenso/ui/primitives/button';
import { Card, CardContent } from '@documenso/ui/primitives/card';

export default function CTA() {
  return (
    <Card spotlight className="mt-12">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <h2 className="text-center text-2xl font-bold">Join the Open Signing Movement</h2>

        <p className="text-muted-foreground max-w-[55ch] text-center leading-normal">
          Create your account and start using state-of-the-art document signing. Open and beautiful
          signing is within your grasp.
        </p>

        <Button className="mt-2.5 rounded-full no-underline" size="sm" asChild>
          <Link href={`${NEXT_PUBLIC_WEBAPP_URL()}/signup?utm_source=cta`} target="_blank">
            Get started
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
