'use client';

import React, { useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoIcon, Plus, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { nanoid } from '@documenso/lib/universal/id';
import { type Field, type Recipient, RecipientRole } from '@documenso/prisma/client';
import { Button } from '@documenso/ui/primitives/button';
import { FormErrorMessage } from '@documenso/ui/primitives/form/form-error-message';
import { Input } from '@documenso/ui/primitives/input';
import { Label } from '@documenso/ui/primitives/label';

import {
  DocumentFlowFormContainerActions,
  DocumentFlowFormContainerContent,
  DocumentFlowFormContainerFooter,
  DocumentFlowFormContainerStep,
} from '../document-flow/document-flow-root';
import type { DocumentFlowStep } from '../document-flow/types';
import { ROLE_ICONS } from '../recipient-role-icons';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../select';
import { useStep } from '../stepper';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import type { TAddTemplatePlacholderRecipientsFormSchema } from './add-template-placeholder-recipients.types';
import { ZAddTemplatePlacholderRecipientsFormSchema } from './add-template-placeholder-recipients.types';

export type AddTemplatePlaceholderRecipientsFormProps = {
  documentFlow: DocumentFlowStep;
  recipients: Recipient[];
  fields: Field[];
  onSubmit: (_data: TAddTemplatePlacholderRecipientsFormSchema) => void;
};

export const AddTemplatePlaceholderRecipientsFormPartial = ({
  documentFlow,
  recipients,
  fields: _fields,
  onSubmit,
}: AddTemplatePlaceholderRecipientsFormProps) => {
  const initialId = useId();
  const { data: session } = useSession();
  const user = session?.user;
  const [placeholderRecipientCount, setPlaceholderRecipientCount] = useState(() =>
    recipients.length > 1 ? recipients.length + 1 : 2,
  );

  const { currentStep, totalSteps, previousStep } = useStep();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<TAddTemplatePlacholderRecipientsFormSchema>({
    resolver: zodResolver(ZAddTemplatePlacholderRecipientsFormSchema),
    defaultValues: {
      signers:
        recipients.length > 0
          ? recipients.map((recipient) => ({
              nativeId: recipient.id,
              formId: String(recipient.id),
              name: recipient.name,
              email: recipient.email,
              role: recipient.role,
            }))
          : [
              {
                formId: initialId,
                name: `Recipient 1`,
                email: `recipient.1@documenso.com`,
                role: RecipientRole.SIGNER,
              },
            ],
    },
  });

  const onFormSubmit = handleSubmit(onSubmit);

  const {
    append: appendSigner,
    fields: signers,
    remove: removeSigner,
  } = useFieldArray({
    control,
    name: 'signers',
  });

  const onAddPlaceholderSelfRecipient = () => {
    appendSigner({
      formId: nanoid(12),
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: RecipientRole.SIGNER,
    });
  };

  const onAddPlaceholderRecipient = () => {
    appendSigner({
      formId: nanoid(12),
      name: `Recipient ${placeholderRecipientCount}`,
      // Update TEMPLATE_RECIPIENT_PLACEHOLDER_REGEX if this is ever changed.
      email: `recipient.${placeholderRecipientCount}@documenso.com`,
      role: RecipientRole.SIGNER,
    });

    setPlaceholderRecipientCount((count) => count + 1);
  };

  const onRemoveSigner = (index: number) => {
    removeSigner(index);
  };

  return (
    <>
      <DocumentFlowFormContainerContent>
        <div className="flex w-full flex-col gap-y-4">
          <AnimatePresence>
            {signers.map((signer, index) => (
              <motion.div
                key={signer.id}
                data-native-id={signer.nativeId}
                className="flex flex-wrap items-end gap-x-4"
              >
                <div className="flex-1">
                  <Label htmlFor={`signer-${signer.id}-email`}>Email</Label>

                  <Input
                    id={`signer-${signer.id}-email`}
                    type="email"
                    value={signer.email}
                    disabled
                    className="bg-background mt-2"
                  />
                </div>

                <div className="flex-1">
                  <Label htmlFor={`signer-${signer.id}-name`}>Name</Label>

                  <Input
                    id={`signer-${signer.id}-name`}
                    type="text"
                    value={signer.name}
                    disabled
                    className="bg-background mt-2"
                  />
                </div>

                <div className="w-[60px]">
                  <Controller
                    control={control}
                    name={`signers.${index}.role`}
                    render={({ field: { value, onChange } }) => (
                      <Select value={value} onValueChange={(x) => onChange(x)}>
                        <SelectTrigger className="bg-background">{ROLE_ICONS[value]}</SelectTrigger>

                        <SelectContent className="" align="end">
                          <SelectItem value={RecipientRole.SIGNER}>
                            <div className="flex items-center">
                              <div className="flex w-[150px] items-center">
                                <span className="mr-2">{ROLE_ICONS[RecipientRole.SIGNER]}</span>
                                Needs to sign
                              </div>
                              <Tooltip>
                                <TooltipTrigger>
                                  <InfoIcon className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent className="text-foreground z-9999 max-w-md p-4">
                                  <p>
                                    The recipient is required to sign the document for it to be
                                    completed.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </SelectItem>

                          <SelectItem value={RecipientRole.APPROVER}>
                            <div className="flex items-center">
                              <div className="flex w-[150px] items-center">
                                <span className="mr-2">{ROLE_ICONS[RecipientRole.APPROVER]}</span>
                                Needs to approve
                              </div>
                              <Tooltip>
                                <TooltipTrigger>
                                  <InfoIcon className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent className="text-foreground z-9999 max-w-md p-4">
                                  <p>
                                    The recipient is required to approve the document for it to be
                                    completed.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </SelectItem>

                          <SelectItem value={RecipientRole.VIEWER}>
                            <div className="flex items-center">
                              <div className="flex w-[150px] items-center">
                                <span className="mr-2">{ROLE_ICONS[RecipientRole.VIEWER]}</span>
                                Needs to view
                              </div>
                              <Tooltip>
                                <TooltipTrigger>
                                  <InfoIcon className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent className="text-foreground z-9999 max-w-md p-4">
                                  <p>
                                    The recipient is required to view the document for it to be
                                    completed.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </SelectItem>

                          <SelectItem value={RecipientRole.CC}>
                            <div className="flex items-center">
                              <div className="flex w-[150px] items-center">
                                <span className="mr-2">{ROLE_ICONS[RecipientRole.CC]}</span>
                                Receives copy
                              </div>
                              <Tooltip>
                                <TooltipTrigger>
                                  <InfoIcon className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent className="text-foreground z-9999 max-w-md p-4">
                                  <p>
                                    The recipient is not required to take any action and receives a
                                    copy of the document after it is completed.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center text-slate-500 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting || signers.length === 1}
                    onClick={() => onRemoveSigner(index)}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>

                <div className="w-full">
                  <FormErrorMessage className="mt-2" error={errors.signers?.[index]?.email} />
                  <FormErrorMessage className="mt-2" error={errors.signers?.[index]?.name} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <FormErrorMessage
          className="mt-2"
          // Dirty hack to handle errors when .root is populated for an array type
          error={'signers__root' in errors && errors['signers__root']}
        />

        <div className="mt-4 flex flex-row items-center space-x-4">
          <Button
            type="button"
            className="flex-1"
            disabled={isSubmitting}
            onClick={() => onAddPlaceholderRecipient()}
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Placeholder Recipient
          </Button>
          <Button
            type="button"
            className="dark:bg-muted dark:hover:bg-muted/80 bg-black/5 hover:bg-black/10"
            variant="secondary"
            disabled={
              isSubmitting || getValues('signers').some((signer) => signer.email === user?.email)
            }
            onClick={() => onAddPlaceholderSelfRecipient()}
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Myself
          </Button>
        </div>
      </DocumentFlowFormContainerContent>

      <DocumentFlowFormContainerFooter>
        <DocumentFlowFormContainerStep
          title={documentFlow.title}
          step={currentStep}
          maxStep={totalSteps}
        />

        <DocumentFlowFormContainerActions
          loading={isSubmitting}
          disabled={isSubmitting}
          canGoBack={currentStep > 1}
          onGoBackClick={() => previousStep()}
          onGoNextClick={() => void onFormSubmit()}
        />
      </DocumentFlowFormContainerFooter>
    </>
  );
};
