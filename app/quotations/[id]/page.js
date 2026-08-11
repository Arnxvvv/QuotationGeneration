import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/format";
import PrintButton from "@/components/PrintButton";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function QuotationDetailPage({ params }) {
  const { id } = await params;
  const quotation = await prisma.quotation.findUnique({
    where: { id: Number(id) },
    include: { items: true },
  });
  if (!quotation) notFound();

  return (
    <div className="card p-6 sm:p-8 space-y-6 print:p-0 print:border-none print:shadow-none print:bg-transparent">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-slate-800 print:border-gray-900">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
            Quotation {quotation.refNumber}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Date:{" "}
            {new Date(quotation.quotationDate).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {quotation.customerName && (
            <p className="text-sm text-gray-700 dark:text-slate-300 mt-1">
              Customer: <span className="font-medium text-gray-900 dark:text-slate-100">{quotation.customerName}</span>
              {quotation.customerPhone ? ` (${quotation.customerPhone})` : ""}
            </p>
          )}
        </div>
        <PrintButton />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700">
              <th className="py-3 px-3 w-10">#</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Component</th>
              <th className="py-3 px-3 text-right">Unit Price</th>
              <th className="py-3 px-3 text-center w-16">Qty</th>
              <th className="py-3 px-3 text-right w-28">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {quotation.items.map((it, i) => (
              <tr key={it.id}>
                <td className="py-3 px-3 text-gray-400 dark:text-slate-500">{i + 1}</td>
                <td className="py-3 px-3 text-gray-600 dark:text-slate-400">{it.categorySnapshot}</td>
                <td className="py-3 px-3 font-medium text-gray-900 dark:text-slate-100">
                  {it.brandSnapshot ? `${it.brandSnapshot} ` : ""}
                  {it.productNameSnapshot}
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-gray-700 dark:text-slate-300">{formatINR(it.unitPrice)}</td>
                <td className="py-3 px-3 text-center tabular-nums text-gray-700 dark:text-slate-300">{it.quantity}</td>
                <td className="py-3 px-3 text-right tabular-nums font-semibold text-gray-900 dark:text-slate-100">{formatINR(it.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-900 dark:border-slate-700">
              <td colSpan="5" className="py-3 px-3 text-right font-bold text-gray-900 dark:text-slate-100 text-sm">
                Grand Total
              </td>
              <td className="py-3 px-3 text-right font-bold tabular-nums text-gray-900 dark:text-slate-100 text-base">
                {formatINR(quotation.grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
