import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { CatalogPanel } from "@/components/CatalogPanel";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { WorkspaceStage } from "@/components/WorkspaceStage";
import {
  ACCESSORIES,
  DEFAULT_SETUP,
  accessoryCount,
  buildLineItems,
  monthlyTotal,
  setupName,
  type Setup,
} from "@/lib/catalog";

const TITLE = "NomadStack Bali — Build your rental workspace";
const DESCRIPTION =
  "Design your dream Bali workspace: pick a desk and chair, add monitors, plants and coffee, see it come together live, then rent it monthly.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Builder,
});

function Builder() {
  const [setup, setSetup] = useState<Setup>(DEFAULT_SETUP);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const setQty = useCallback((id: string, qty: number) => {
    setSetup((prev) => ({
      ...prev,
      accessories: { ...prev.accessories, [id]: qty },
    }));
  }, []);

  const bump = useCallback((id: string) => {
    const acc = ACCESSORIES.find((a) => a.id === id);
    if (!acc) return;
    setSetup((prev) => {
      const qty = prev.accessories[id] ?? 0;
      const next = qty >= acc.maxQty ? 0 : qty + 1;
      return { ...prev, accessories: { ...prev.accessories, [id]: next } };
    });
  }, []);

  const total = monthlyTotal(setup);
  const items = buildLineItems(setup);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/70 px-8 py-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary">
            <div className="size-4 animate-pulse rounded-full bg-accent" />
          </div>
          <span className="text-xl font-extrabold uppercase tracking-tight">
            NomadStack
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Monthly rental
            </span>
            <span className="text-2xl font-bold text-accent">${total}.00</span>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-float transition-transform hover:brightness-110 active:scale-[0.98]"
          >
            Reserve setup
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-8 p-8">
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <div>
            <h1 className="text-3xl font-black leading-tight tracking-tight">
              Build the workspace
              <br />
              you&apos;ll actually want to sit at.
            </h1>
            <p className="mt-3 max-w-[46ch] text-sm text-muted-foreground">
              Pick your base, your chair and the extras. Everything is rented
              monthly, delivered and assembled across Bali in 48 hours.
            </p>
          </div>
          <CatalogPanel
            setup={setup}
            onSelectDesk={(id) => setSetup((p) => ({ ...p, deskId: id }))}
            onSelectChair={(id) => setSetup((p) => ({ ...p, chairId: id }))}
            onSetQty={setQty}
          />
        </div>

        <div className="col-span-12 lg:col-span-8">
          <WorkspaceStage setup={setup} onBump={bump} />

          <div className="relative mt-8 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[32px] bg-primary p-8 text-primary-foreground">
            <div className="absolute right-0 top-0 h-full w-64 translate-x-32 skew-x-12 bg-accent opacity-20" />
            <div className="relative z-10">
              <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">
                Current configuration
              </h2>
              <p className="text-2xl font-bold italic tracking-tight">
                {setupName(setup)}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-60">
                {items.slice(0, 2).map((item) => (
                  <span key={item.id}>
                    {item.qty}× {item.label}
                  </span>
                ))}
                <span>
                  {accessoryCount(setup)} accessor
                  {accessoryCount(setup) === 1 ? "y" : "ies"}
                </span>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-tight opacity-60">
                  Total monthly
                </p>
                <p className="text-4xl font-black text-accent">
                  ${total}
                  <span className="text-lg font-normal opacity-40">.00</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(true)}
                className="rounded-2xl bg-card px-8 py-5 font-black uppercase tracking-widest text-foreground shadow-stage transition-colors hover:bg-accent hover:text-primary-foreground"
              >
                Confirm build
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-8 py-12 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        <div className="flex gap-8">
          <span>Delivering to Canggu</span>
          <span>Assembly included</span>
          <span>Swap items any month</span>
        </div>
        <div>© {new Date().getFullYear()} NomadStack Bali</div>
      </footer>

      <CheckoutDialog
        open={checkoutOpen}
        setup={setup}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}