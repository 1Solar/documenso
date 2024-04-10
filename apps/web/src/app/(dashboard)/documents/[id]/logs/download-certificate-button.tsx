'use client';

import { DownloadIcon } from 'lucide-react';

import { trpc } from '@documenso/trpc/react';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';

export type DownloadCertificateButtonProps = {
  className?: string;
  documentId: number;
};

export const DownloadCertificateButton = ({
  className,
  documentId,
}: DownloadCertificateButtonProps) => {
  const { mutateAsync: downloadCertificate, isLoading } =
    trpc.document.downloadCertificate.useMutation();

  const onDownloadCertificatesClick = async () => {
    const { url } = await downloadCertificate({ documentId });

    const iframe = Object.assign(document.createElement('iframe'), {
      src: url,
    });

    Object.assign(iframe.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '0',
      height: '0',
    });

    const onLoaded = () => {
      if (iframe.contentDocument?.readyState === 'complete') {
        iframe.contentWindow?.print();

        iframe.contentWindow?.addEventListener('afterprint', () => {
          document.body.removeChild(iframe);
        });
      }
    };

    // When the iframe has loaded, print the iframe and remove it from the dom
    iframe.addEventListener('load', onLoaded);

    document.body.appendChild(iframe);

    onLoaded();
  };

  return (
    <Button
      className={cn('w-full sm:w-auto', className)}
      loading={isLoading}
      variant="outline"
      onClick={() => void onDownloadCertificatesClick()}
    >
      {!isLoading && <DownloadIcon className="mr-1.5 h-4 w-4" />}
      Download Certificate
    </Button>
  );
};
