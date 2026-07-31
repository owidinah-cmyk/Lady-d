// /components/account/ReceiptBlock.js
// Server Component. Renders a single receipt from the
// Receipt.content JSON. The shape of the content is:
//   {
//     type: "DEPOSIT" | "FINAL",
//     orderRef: string,
//     customerName: string,
//     items: [{ name, size, quantity, unitPrice, lineTotal }],
//     subtotal: number,    // in kobo
//     deliveryFee: number, // in kobo
//     total: number,       // in kobo
//     depositAmount?: number,
//     balanceAmount?: number,
//     amountCollected?: number,
//     issuedAt: string (ISO),
//     riderName?: string,
//     riderCode?: string,
//   }
// The imageUrl field is filled when admin generates a rendered
// image of the receipt (deferred to Phase 6). For now we just
// show the JSON content in a readable format.

import { formatPrice } from "@/lib/menu/dishes";

export default function ReceiptBlock({ receipt }) {
  const content = receipt.content || {};
  const isDeposit = content.type === "DEPOSIT";
  const label = isDeposit ? "Deposit receipt" : "Final receipt";

  return (
    <div className="bg-white border border-hairline rounded-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted">
          {content.issuedAt
            ? new Date(content.issuedAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Issued"}
        </p>
      </div>

      {content.customerName && (
        <p className="text-xs text-muted mb-2">
          {content.customerName} · {content.orderRef}
        </p>
      )}

      {receipt.imageUrl ? (
        <a
          href={receipt.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={receipt.imageUrl}
            alt={label}
            className="w-full border border-hairline rounded"
          />
        </a>
      ) : (
        <div className="text-sm space-y-2">
          {Array.isArray(content.items) && (
            <div className="space-y-1">
              {content.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-xs text-muted"
                >
                  <span className="truncate mr-2">
                    {item.name} ({item.size}) × {item.quantity}
                  </span>
                  <span>{formatPrice(item.lineTotal || 0)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="pt-2 mt-2 border-t border-hairline space-y-1">
            {typeof content.subtotal === "number" && (
              <div className="flex justify-between text-xs">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(content.subtotal)}</span>
              </div>
            )}
            {typeof content.deliveryFee === "number" && (
              <div className="flex justify-between text-xs">
                <span className="text-muted">Delivery</span>
                <span>{formatPrice(content.deliveryFee)}</span>
              </div>
            )}
            {typeof content.total === "number" && (
              <div className="flex justify-between text-sm font-semibold pt-1">
                <span>Total</span>
                <span className="text-clay">
                  {formatPrice(content.total)}
                </span>
              </div>
            )}
            {typeof content.depositAmount === "number" && isDeposit && (
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted">Deposit collected</span>
                <span>{formatPrice(content.depositAmount)}</span>
              </div>
            )}
            {typeof content.balanceAmount === "number" && isDeposit && (
              <div className="flex justify-between text-xs">
                <span className="text-muted">Balance remaining</span>
                <span>{formatPrice(content.balanceAmount)}</span>
              </div>
            )}
            {typeof content.amountCollected === "number" && !isDeposit && (
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted">Balance collected</span>
                <span>{formatPrice(content.amountCollected)}</span>
              </div>
            )}
            {content.riderName && (
              <div className="flex justify-between text-xs pt-2 mt-2 border-t border-hairline">
                <span className="text-muted">Rider</span>
                <span>
                  {content.riderName}{" "}
                  {content.riderCode && (
                    <span className="text-muted">
                      ({content.riderCode})
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
