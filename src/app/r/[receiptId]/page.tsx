import { notFound, redirect } from 'next/navigation';
import { STORE_FRONT_API_BASE_URL } from '@/constants';

interface PageProps {
  params: { receiptId: string };
}

export const dynamic = 'force-dynamic';

export default async function ReceiptRedirectPage({ params }: PageProps) {
  const receiptId = params?.receiptId?.trim();

  if (!receiptId) {
    notFound();
  }

  const receiptEndpoint = `${STORE_FRONT_API_BASE_URL}/api/v1/receipts/${encodeURIComponent(receiptId)}/redirect`;
  redirect(receiptEndpoint);
}
