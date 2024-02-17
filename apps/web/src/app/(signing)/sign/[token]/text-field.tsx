'use client';

import { useEffect, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { Loader } from 'lucide-react';

import type { Recipient } from '@documenso/prisma/client';
import type { FieldWithSignature } from '@documenso/prisma/types/field-with-signature';
import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@documenso/ui/primitives/dialog';
import { Label } from '@documenso/ui/primitives/label';
import { Textarea } from '@documenso/ui/primitives/textarea';
import { useToast } from '@documenso/ui/primitives/use-toast';

import { useRequiredSigningContext } from './provider';
import { SigningFieldContainer } from './signing-field-container';

export type TextFieldProps = {
  field: FieldWithSignature;
  recipient: Recipient;
};

export const TextField = ({ field, recipient }: TextFieldProps) => {
  const router = useRouter();

  const { toast } = useToast();
  const { customText: providedCustomText, setCustomText: setProvidedCustomText } =
    useRequiredSigningContext();

  const [isPending, startTransition] = useTransition();

  const { mutateAsync: signFieldWithToken, isLoading: isSignFieldWithTokenLoading } =
    trpc.field.signFieldWithToken.useMutation();

  const {
    mutateAsync: removeSignedFieldWithToken,
    isLoading: isRemoveSignedFieldWithTokenLoading,
  } = trpc.field.removeSignedFieldWithToken.useMutation();

  const isLoading = isSignFieldWithTokenLoading || isRemoveSignedFieldWithTokenLoading || isPending;

  const [showCustomTextModal, setShowCustomTextModal] = useState(false);
  const [localText, setLocalCustomText] = useState('');
  const [isLocalSignatureSet, setIsLocalSignatureSet] = useState(false);

  useEffect(() => {
    if (!showCustomTextModal && !isLocalSignatureSet) {
      setLocalCustomText('');
    }
  }, [showCustomTextModal, isLocalSignatureSet]);

  const onSign = async (source: 'local' | 'provider' = 'provider') => {
    try {
      if (!providedCustomText && !localText) {
        setIsLocalSignatureSet(false);
        setShowCustomTextModal(true);
        return;
      }

      const value = source === 'local' && localText ? localText : providedCustomText ?? '';

      if (!value) {
        return;
      }

      await signFieldWithToken({
        token: recipient.token,
        fieldId: field.id,
        value,
        isBase64: true,
      });

      if (source === 'local' && !providedCustomText) {
        setProvidedCustomText(localText);
      }

      setLocalCustomText('');

      startTransition(() => router.refresh());
    } catch (err) {
      console.error(err);

      toast({
        title: 'Error',
        description: 'An error occurred while signing the document.',
        variant: 'destructive',
      });
    }
  };

  const onRemove = async () => {
    try {
      // Necessary to reset the custom text if the user removes the signature
      setProvidedCustomText('');

      await removeSignedFieldWithToken({
        token: recipient.token,
        fieldId: field.id,
      });

      startTransition(() => router.refresh());
    } catch (err) {
      console.error(err);

      toast({
        title: 'Error',
        description: 'An error occurred while removing the signature.',
        variant: 'destructive',
      });
    }
  };

  return (
    <SigningFieldContainer field={field} onSign={onSign} onRemove={onRemove} type="Signature">
      {isLoading && (
        <div className="bg-background absolute inset-0 flex items-center justify-center rounded-md">
          <Loader className="text-primary h-5 w-5 animate-spin md:h-8 md:w-8" />
        </div>
      )}

      {!field.inserted && (
        <p className="group-hover:text-primary text-muted-foreground text-lg duration-200">Text</p>
      )}

      {field.inserted && <p className="text-muted-foreground duration-200">{field.customText}</p>}

      <Dialog open={showCustomTextModal} onOpenChange={setShowCustomTextModal}>
        <DialogContent>
          <DialogTitle>
            Enter a Text <span className="text-muted-foreground">({recipient.email})</span>
          </DialogTitle>

          <div className="">
            <Label htmlFor="signature">Custom Text</Label>

            <Textarea
              id="custom-text"
              className="border-border mt-2 h-44 w-full rounded-md border"
              onChange={(e) => setLocalCustomText(e.target.value)}
            />
          </div>

          <DialogFooter>
            <div className="flex w-full flex-1 flex-nowrap gap-4">
              <Button
                type="button"
                className="dark:bg-muted dark:hover:bg-muted/80 flex-1  bg-black/5 hover:bg-black/10"
                variant="secondary"
                onClick={() => {
                  setShowCustomTextModal(false);
                  setLocalCustomText('');
                }}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="flex-1"
                disabled={!localText}
                onClick={() => {
                  setShowCustomTextModal(false);
                  setIsLocalSignatureSet(true);
                  void onSign('local');
                }}
              >
                Save Text
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SigningFieldContainer>
  );
};
