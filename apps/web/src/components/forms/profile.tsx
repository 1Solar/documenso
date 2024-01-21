'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { User } from '@documenso/prisma/client';
import { TRPCClientError } from '@documenso/trpc/client';
import { trpc } from '@documenso/trpc/react';
import { cn } from '@documenso/ui/lib/utils';
import { Alert, AlertDescription } from '@documenso/ui/primitives/alert';
import { Button } from '@documenso/ui/primitives/button';
import { Card, CardContent, CardFooter } from '@documenso/ui/primitives/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import { Label } from '@documenso/ui/primitives/label';
import { SignaturePad } from '@documenso/ui/primitives/signature-pad';
import { useToast } from '@documenso/ui/primitives/use-toast';

export const ZProfileFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Please enter a valid name.' }),
  signature: z.string().min(1, 'Signature Pad cannot be empty'),
});

export type TProfileFormSchema = z.infer<typeof ZProfileFormSchema>;

export type ProfileFormProps = {
  className?: string;
  user: User;
};

export const ProfileForm = ({ className, user }: ProfileFormProps) => {
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<TProfileFormSchema>({
    values: {
      name: user.name ?? '',
      signature: user.signature || '',
    },
    resolver: zodResolver(ZProfileFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const { mutateAsync: updateProfile } = trpc.profile.updateProfile.useMutation();
  const { mutateAsync: deleteAccount, isLoading: isDeletingAccount } =
    trpc.profile.deleteAccount.useMutation();

  const onFormSubmit = async ({ name, signature }: TProfileFormSchema) => {
    try {
      await updateProfile({
        name,
        signature,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        duration: 5000,
      });

      router.refresh();
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
            'We encountered an unknown error while attempting to sign you In. Please try again later.',
        });
      }
    }
  };

  const onDeleteAccount = async () => {
    try {
      await deleteAccount();

      await signOut({ callbackUrl: '/' });

      toast({
        title: 'Account deleted',
        description: 'Your account has been deleted successfully.',
        duration: 5000,
      });

      // logout after deleting account

      router.push('/');
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
            'We encountered an unknown error while attempting to delete your account. Please try again later.',
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex w-full flex-col gap-y-4', className)}
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <fieldset className="flex w-full flex-col gap-y-4" disabled={isSubmitting}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input id="email" type="email" className="bg-muted mt-2" value={user.email} disabled />
          </div>

          <FormField
            control={form.control}
            name="signature"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>Signature</FormLabel>
                <FormControl>
                  <SignaturePad
                    className="h-44 w-full"
                    containerClassName="rounded-lg border bg-background"
                    defaultValue={user.signature ?? undefined}
                    onChange={(v) => onChange(v ?? '')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <Button type="submit" loading={isSubmitting} className="self-end">
          {isSubmitting ? 'Updating profile...' : 'Update profile'}
        </Button>
      </form>

      <div className="mt-8 max-w-xl">
        <Label>Delete Account</Label>
        <Card className="border-destructive mt-2 pb-0">
          <CardContent className="p-4">
            Delete your account and all its contents, including completed documents. This action is
            irreversible and will cancel your subscription, so proceed with caution.
          </CardContent>
          <CardFooter className="justify-end pb-4 pr-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    Documenso will delete{' '}
                    <span className="font-semibold">all of your documents</span>, along with all of
                    your completed documents, signatures, and all other resources belonging to your
                    Account.
                    <Alert variant="destructive" className="mt-5">
                      <AlertDescription className="selection:bg-red-100">
                        This action is not reversible. Please be certain.
                      </AlertDescription>
                    </Alert>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={onDeleteAccount}
                    loading={isDeletingAccount}
                    variant="destructive"
                  >
                    {isDeletingAccount ? 'Deleting account...' : 'Delete Account'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </Form>
  );
};
