import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { env } from 'next-runtime-env';

import { IS_GOOGLE_SSO_ENABLED } from '@documenso/lib/constants/auth';
import { decryptSecondaryData } from '@documenso/lib/server-only/crypto/decrypt';

import { SignUpForm } from '~/components/forms/signup';

import SignUpLayout from '../signup-layout';

export const metadata: Metadata = {
  title: 'Sign Up',
};

type SignUpPageProps = {
  searchParams: {
    email?: string;
  };
};

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  const NEXT_PUBLIC_DISABLE_SIGNUP = env('NEXT_PUBLIC_DISABLE_SIGNUP');

  if (NEXT_PUBLIC_DISABLE_SIGNUP === 'true') {
    redirect('/signin');
  }

  const rawEmail = typeof searchParams.email === 'string' ? searchParams.email : undefined;
  const email = rawEmail ? decryptSecondaryData(rawEmail) : null;

  if (!email && rawEmail) {
    redirect('/signup');
  }

  return (
    <SignUpLayout>
      <>
        <h1 className="text-3xl font-semibold">Create a new account</h1>

        <p className="text-muted-foreground/60 mt-2 text-sm">
          Create your account and start using state-of-the-art document signing. Open and beautiful
          signing is within your grasp.
        </p>

        <SignUpForm
          className="mt-1"
          initialEmail={email || undefined}
          isGoogleSSOEnabled={IS_GOOGLE_SSO_ENABLED}
        />

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/signin" className="text-primary duration-200 hover:opacity-70">
            Sign in instead
          </Link>
        </p>
      </>
    </SignUpLayout>
  );
}
