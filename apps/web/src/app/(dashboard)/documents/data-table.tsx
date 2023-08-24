'use client';

import { useTransition } from 'react';

import Link from 'next/link';

import {
  Copy,
  Download,
  Edit,
  History,
  Loader,
  MoreHorizontal,
  Pencil,
  Share,
  Trash2,
  XCircle,
} from 'lucide-react';

import { useUpdateSearchParams } from '@documenso/lib/client-only/hooks/use-update-search-params';
import { FindResultSet } from '@documenso/lib/types/find-result-set';
import { DocumentWithReciepient } from '@documenso/prisma/types/document-with-recipient';
import { Button } from '@documenso/ui/primitives/button';
import { DataTable } from '@documenso/ui/primitives/data-table';
import { DataTablePagination } from '@documenso/ui/primitives/data-table-pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@documenso/ui/primitives/dropdown-menu';

import { StackAvatarsWithTooltip } from '~/components/(dashboard)/avatar/stack-avatars-with-tooltip';
import { DocumentStatus } from '~/components/formatter/document-status';
import { LocaleDate } from '~/components/formatter/locale-date';

export type DocumentsDataTableProps = {
  results: FindResultSet<DocumentWithReciepient>;
};

export const DocumentsDataTable = ({ results }: DocumentsDataTableProps) => {
  const [isPending, startTransition] = useTransition();

  const updateSearchParams = useUpdateSearchParams();

  const onPaginationChange = (page: number, perPage: number) => {
    startTransition(() => {
      updateSearchParams({
        page,
        perPage,
      });
    });
  };

  return (
    <div className="relative">
      <DataTable
        columns={[
          {
            header: 'ID',
            accessorKey: 'id',
          },
          {
            header: 'Title',
            cell: ({ row }) => (
              <Link href={`/documents/${row.original.id}`} className="font-medium hover:underline">
                {row.original.title}
              </Link>
            ),
          },
          {
            header: 'Recipient',
            accessorKey: 'recipient',
            cell: ({ row }) => {
              return <StackAvatarsWithTooltip recipients={row.original.Recipient} />;
            },
          },
          {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => <DocumentStatus status={row.getValue('status')} />,
          },
          {
            header: 'Created',
            accessorKey: 'created',
            cell: ({ row }) => <LocaleDate date={row.getValue('created')} />,
          },
          {
            header: 'Actions',
            cell: ({ row: _row }) => (
              <div className="flex items-center gap-x-4">
                <Button>Action</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-52" align="start" forceMount>
                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                    <DropdownMenuItem disabled>
                      <Pencil className="mr-2 h-4 w-4" />
                      Sign
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <XCircle className="mr-2 h-4 w-4" />
                      Void
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>

                    <DropdownMenuLabel>Share</DropdownMenuLabel>
                    <DropdownMenuItem disabled>
                      <History className="mr-2 h-4 w-4" />
                      Resend
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
          },
        ]}
        data={results.data}
        perPage={results.perPage}
        currentPage={results.currentPage}
        totalPages={results.totalPages}
        onPaginationChange={onPaginationChange}
      >
        {(table) => <DataTablePagination table={table} />}
      </DataTable>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  );
};
