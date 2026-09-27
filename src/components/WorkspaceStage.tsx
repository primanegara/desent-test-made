import { ACCESSORIES, CHAIRS, DESKS, type Setup } from "@/lib/catalog";

type Props = {
  setup: Setup;
  onBump: (accessoryId: string) => void;
};

const HOTSPOTS = [
  { id: "monitor", left: 32, top: 12, label: "Add monitor" },
  { id: "plant", left: 16, top: 42, label: "Place a plant" },
  { id: "lamp", left: 78, top: 22, label: "Add lamp" },
  { id: "coffee", left: 84, top: 66, label: "Brew coffee" },
];

export function WorkspaceStage({ setup, onBump }: Props) {
  const desk = DESKS.find((d) => d.id === setup.deskId);
  const chair = CHAIRS.find((c) => c.id === setup.chairId);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[40px] border border-border bg-card shadow-stage">
      <div className="stage-floor absolute inset-0" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
          backgroundSize: "34px 34px",
        }}
      />

      <div className="absolute left-6 top-6 z-40 rounded-full bg-primary/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground backdrop-blur">
        Live preview
      </div>

      {/* Scene */}
      <div className="absolute inset-0">
        {/* Surf rack sits on the back wall, behind everything */}
        {ACCESSORIES.filter((a) => a.spot.z < 10).map((acc) =>
          Array.from({ length: setup.accessories[acc.id] ?? 0 }).map((_, i) => (
            <img
              key={`${acc.id}-${i}`}
              src={acc.image}
              alt={acc.name}
              loading="lazy"
              className="animate-pop-in absolute"
              style={{
                left: `${acc.spot.left + i * (acc.repeatOffset ?? 0)}%`,
                top: `${acc.spot.top}%`,
                width: `${acc.spot.width}%`,
                zIndex: acc.spot.z,
              }}
            />
          )),
        )}

        {/* Accessories that stand behind the desk surface */}
        {ACCESSORIES.filter((a) => a.spot.z >= 10 && a.spot.z < 20).map((acc) =>
          Array.from({ length: setup.accessories[acc.id] ?? 0 }).map((_, i) => (
            <img
              key={`${acc.id}-${i}`}
              src={acc.image}
              alt={acc.name}
              loading="lazy"
              className="animate-pop-in absolute drop-shadow-lg"
              style={{
                left: `${acc.spot.left + i * (acc.repeatOffset ?? 0)}%`,
                top: `${acc.spot.top}%`,
                width: `${acc.spot.width}%`,
                zIndex: acc.spot.z,
              }}
            />
          )),
        )}

        {/* Desk */}
        {desk && (
          <img
            key={desk.id}
            src={desk.image}
            alt={desk.name}
            width={1200}
            height={800}
            className="animate-pop-in absolute left-1/2 top-[40%] w-[72%] -translate-x-1/2 drop-shadow-2xl"
            style={{ zIndex: 15 }}
          />
        )}

        {/* Desktop-level accessories */}
        {ACCESSORIES.filter((a) => a.spot.z >= 20).map((acc) =>
          Array.from({ length: setup.accessories[acc.id] ?? 0 }).map((_, i) => (
            <img
              key={`${acc.id}-${i}`}
              src={acc.image}
              alt={acc.name}
              loading="lazy"
              className="animate-pop-in absolute drop-shadow-md"
              style={{
                left: `${acc.spot.left + i * (acc.repeatOffset ?? 0)}%`,
                top: `${acc.spot.top}%`,
                width: `${acc.spot.width}%`,
                zIndex: acc.spot.z,
              }}
            />
          )),
        )}

        {/* Chair in front */}
        {chair && (
          <img
            key={chair.id}
            src={chair.image}
            alt={chair.name}
            width={800}
            height={912}
            className="animate-pop-in absolute left-1/2 top-[60%] w-[26%] -translate-x-1/2 drop-shadow-2xl"
            style={{ zIndex: 30 }}
          />
        )}
      </div>

      {/* Hotspots */}
      {HOTSPOTS.map((hotspot) => {
        const acc = ACCESSORIES.find((a) => a.id === hotspot.id);
        if (!acc) return null;
        const qty = setup.accessories[acc.id] ?? 0;
        const full = qty >= acc.maxQty;
        return (
          <button
            key={hotspot.id}
            type="button"
            onClick={() => onBump(acc.id)}
            className="group absolute z-40 flex items-center gap-2"
            style={{ left: `${hotspot.left}%`, top: `${hotspot.top}%` }}
            aria-label={full ? `Remove ${acc.name}` : hotspot.label}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-accent text-lg font-bold text-primary-foreground shadow-float ring-4 ring-card transition-transform group-hover:scale-110">
              {full ? "−" : "+"}
            </span>
            <span className="whitespace-nowrap rounded-lg bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider opacity-0 shadow-float transition-opacity group-hover:opacity-100">
              {full ? `Remove ${acc.name}` : hotspot.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
