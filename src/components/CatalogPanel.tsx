import { useState } from "react";
import { ACCESSORIES, CHAIRS, DESKS, type Setup } from "@/lib/catalog";

type Tab = "furniture" | "tech" | "vibe";

type Props = {
  setup: Setup;
  onSelectDesk: (id: string) => void;
  onSelectChair: (id: string) => void;
  onSetQty: (accessoryId: string, qty: number) => void;
};

export function CatalogPanel({
  setup,
  onSelectDesk,
  onSelectChair,
  onSetQty,
}: Props) {
  const [tab, setTab] = useState<Tab>("furniture");

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-8 flex gap-1 rounded-2xl bg-background p-1">
        {(
          [
            ["furniture", "Furniture"],
            ["tech", "Tech"],
            ["vibe", "Vibe"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
              tab === value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "furniture" && (
        <div className="space-y-8">
          <section>
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Select your base
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {DESKS.map((desk) => {
                const active = setup.deskId === desk.id;
                return (
                  <button
                    key={desk.id}
                    type="button"
                    onClick={() => onSelectDesk(desk.id)}
                    className="group text-left"
                  >
                    <div
                      className={`mb-2 grid aspect-[4/3] w-full place-items-center rounded-2xl bg-background p-2 transition-all ${
                        active
                          ? "outline-2 outline-offset-2 outline-accent"
                          : "opacity-70 group-hover:opacity-100"
                      }`}
                    >
                      <img
                        src={desk.image}
                        alt={desk.name}
                        loading="lazy"
                        className="max-h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-bold">{desk.name}</span>
                      <span
                        className={`text-xs font-bold ${active ? "text-accent" : "text-muted-foreground"}`}
                      >
                        ${desk.price}/mo
                      </span>
                    </div>
                    <p className="px-1 pt-1 text-[11px] text-muted-foreground">
                      {desk.blurb}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Select seating
            </h3>
            <div className="space-y-3">
              {CHAIRS.map((chair) => {
                const active = setup.chairId === chair.id;
                return (
                  <button
                    key={chair.id}
                    type="button"
                    onClick={() => onSelectChair(chair.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-colors ${
                      active
                        ? "border-accent/40 bg-accent/5"
                        : "border-border hover:border-primary/20"
                    }`}
                  >
                    <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-background p-1">
                      <img
                        src={chair.image}
                        alt={chair.name}
                        loading="lazy"
                        className="max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{chair.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {chair.blurb}
                      </p>
                    </div>
                    <span className="text-sm font-bold">+${chair.price}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {tab !== "furniture" && (
        <div className="space-y-3">
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
            {tab === "tech" ? "Gear on the desk" : "Make it feel like home"}
          </h3>
          {ACCESSORIES.filter((a) => a.group === tab).map((acc) => {
            const qty = setup.accessories[acc.id] ?? 0;
            return (
              <div
                key={acc.id}
                className={`flex items-center gap-4 rounded-2xl border p-3 transition-colors ${
                  qty > 0 ? "border-accent/40 bg-accent/5" : "border-border"
                }`}
              >
                <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-background p-1">
                  <img
                    src={acc.image}
                    alt={acc.name}
                    loading="lazy"
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{acc.name}</p>
                  <p className="text-xs text-muted-foreground">{acc.blurb}</p>
                  <p className="pt-0.5 text-[11px] font-bold text-accent">
                    +${acc.price}/mo each
                  </p>
                </div>
                {acc.maxQty > 1 ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSetQty(acc.id, Math.max(0, qty - 1))}
                      disabled={qty === 0}
                      className="size-8 rounded-full border border-border font-bold disabled:opacity-30"
                      aria-label={`Remove one ${acc.name}`}
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-bold">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onSetQty(acc.id, Math.min(acc.maxQty, qty + 1))
                      }
                      disabled={qty >= acc.maxQty}
                      className="size-8 rounded-full bg-primary font-bold text-primary-foreground disabled:opacity-30"
                      aria-label={`Add one ${acc.name}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSetQty(acc.id, qty > 0 ? 0 : 1)}
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      qty > 0
                        ? "bg-accent text-primary-foreground"
                        : "border border-border hover:border-primary/30"
                    }`}
                  >
                    {qty > 0 ? "Added" : "Add"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
