'use client';

import { useState } from 'react';

import { signOut } from 'next-auth/react';

import type { User } from '@documenso/prisma/client';
import { TRPCClientError } from '@documenso/trpc/client';
import { trpc } from '@documenso/trpc/react';
import { Alert, AlertDescription, AlertTitle } from '@documenso/ui/primitives/alert';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import { Input } from '@documenso/ui/primitives/input';
import { useToast } from '@documenso/ui/primitives/use-toast';

export type DeleteAccountDialogProps = {
  className?: string;
  user: User;
};

export const DeleteAccountDialog = ({ className, user }: DeleteAccountDialogProps) => {
  const { toast } = useToast();

  const hasTwoFactorAuthentication = user.twoFactorEnabled;
  const username = user.name!;

  const [enteredUsername, setEnteredUsername] = useState<string>('');

  const { mutateAsync: deleteAccount, isLoading: isDeletingAccount } =
    trpc.profile.deleteAccount.useMutation();

  const onDeleteAccount = async () => {
    try {
      await deleteAccount();

      toast({
        title: 'Account deleted',
        description: 'Your account has been deleted successfully.',
        duration: 5000,
      });

      return await signOut({ callbackUrl: '/' });
    } catch (err) {
      if (err instanceof TRPCClientError && err.data?.code === 'BAD_REQUEST') {
        toast({
          title: 'An error occurred',
          description: err.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'An unknown error occurred',
          variant: 'destructive',
          description:
            err.message ??
            'We encountered an unknown error while attempting to delete your account. Please try again later.',
        });
      }
    }
  };

  return (
    <div className={className}>
      <Alert
        className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row "
        variant="neutral"
      >
        <div>
          <AlertTitle>Delete Account</AlertTitle>
          <AlertDescription className="mr-2">
            Delete your account and all its contents, including completed documents. This action is
            irreversible and will cancel your subscription, so proceed with caution.
          </AlertDescription>
        </div>

        <div className="flex-shrink-0">
          <Dialog onOpenChange={() => setEnteredUsername('')}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-4">
                <DialogTitle>Delete Account</DialogTitle>

                <Alert variant="destructive">
                  <AlertDescription className="selection:bg-red-100">
                    This action is not reversible. Please be certain.
                  </AlertDescription>
                </Alert>

                {hasTwoFactorAuthentication && (
                  <Alert variant="destructive">
                    <AlertDescription className="selection:bg-red-100">
                      Disable Two Factor Authentication before deleting your account.
                    </AlertDescription>
                  </Alert>
                )}

                <DialogDescription>
                  Documenso will delete <span className="font-semibold">all of your documents</span>
                  , along with all of your completed documents, signatures, and all other resources
                  belonging to your Account.
                </DialogDescription>
                {!hasTwoFactorAuthentication && (
                  <DialogDescription>
                    Please type <span className="font-semibold">{username}</span> to confirm.
                  </DialogDescription>
                )}
              </DialogHeader>

              {!hasTwoFactorAuthentication && (
                <div className="mt-4">
                  <Input
                    type="text"
                    value={enteredUsername}
                    onChange={(e) => setEnteredUsername(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                  />
                </div>
              )}
              <DialogFooter>
                {!hasTwoFactorAuthentication && (
                  <Button
                    className="text-red-500 hover:bg-red-500 hover:text-white sm:w-full"
                    onClick={onDeleteAccount}
                    loading={isDeletingAccount}
                    variant="outline"
                    disabled={hasTwoFactorAuthentication || enteredUsername !== username}
                  >
                    {isDeletingAccount ? (
                      'Deleting account...'
                    ) : (
                      <>
                        <span className="sm:hidden">Delete account</span>
                        <span className="hidden sm:block">
                          I understand the consequences, delete this account
                        </span>
                      </>
                    )}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Alert>
    </div>
  );
};
