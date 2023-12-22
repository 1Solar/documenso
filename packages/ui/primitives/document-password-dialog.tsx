import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog'; 

import { Input } from './input'; 
import { Button } from './button'; 

type PasswordDialogProps = {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  setPassword: (_password: string) => void;
  handleSubmit: () => void;
  isError?: boolean;
}

export const PasswordDialog = ({ open, onOpenChange, handleSubmit, isError, setPassword }: PasswordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Password Required</DialogTitle>
          <DialogDescription>
            {isError ? (
              <p className="text-red-500">Incorrect password. Please try again.</p>
            ) : (
              <p className="text-muted-foreground">
                This document is password protected. Please enter the password to view the document.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full items-center justify-center gap-4">
          <Input
            id="password"
            type="password"
            className="bg-background mt-1.5"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
