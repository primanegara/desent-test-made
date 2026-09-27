import { useEffect, useState } from "react";
import {
  buildLineItems,
  monthlyTotal,
  setupName,
  type Setup,
} from "@/lib/catalog";

type Props = {
  open: boolean;
  setup: Setup;
  onClose: () => void;
};

export function CheckoutDialog({ open, setup, onClose }: Props) {
  const [months, setMonths] = useState(3);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) setSent(false);
  }, [open]);

  if (!open) return null;

  const items = buildLineItems(setup);
  const perMonth = monthlyTotal(setup);
  const discount = months >= 6 ? 0.1 : months >= 3 ? 0.05 : 0;
  const billed = Math.round(perMonth * months * (1 - discount));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm">
      <div className="animate-pop-in max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-8 shadow-stage">
        {sent ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-accent text-3xl text-primary-foreground">
              ✓
            </div>
            <h2 className="text-2xl font-black">Your setup is reserved</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              We&apos;ll message you within the hour to confirm a delivery slot.
              Most Canggu and Seminyak setups are assembled within 48 hours.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-2xl bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-primary-foreground"
            >
              Keep building
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-accent">
                  Order summary
                </p>
                <h2 className="mt-1 text-2xl font-black italic tracking-tight">
                  {setupName(setup)}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-3 py-1 text-sm font-bold"
                aria-label="Close summary"
              >
                ✕
              </button>
            </div>

            <ul className="mt-6 divide-y divide-border">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="font-medium">
                    {item.qty > 1 ? `${item.qty}× ` : ""}
                    {item.label}
                  </span>
                  <span className="font-bold">${item.qty * item.price}/mo</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                Rental length
              </p>
              <div className="flex gap-2">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMonths(m)}
                    className={`flex-1 rounded-xl border py-3 text-sm font-bold transition-colors ${
                      months === m
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m} mo
                  </button>
                ))}
              </div>
              {discount > 0 && (
                <p className="mt-2 text-xs font-bold text-accent">
                  {Math.round(discount * 100)}% long-stay discount applied
                </p>
              )}
            </div>

            <div className="mt-6 flex items-end justify-between rounded-2xl bg-primary p-6 text-primary-foreground">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Monthly
                </p>
                <p className="text-2xl font-black">${perMonth}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Total for {months} {months === 1 ? "month" : "months"}
                </p>
                <p className="text-3xl font-black text-accent">${billed}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSent(true)}
              className="mt-4 w-full rounded-2xl bg-accent py-5 text-sm font-black uppercase tracking-widest text-primary-foreground transition-transform hover:brightness-105 active:scale-[0.99]"
            >
              Rent this setup
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Free delivery and assembly in Canggu, Seminyak and Uluwatu. Cancel
              any time after month one.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
