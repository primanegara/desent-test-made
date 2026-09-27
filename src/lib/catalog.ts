import deskUluwatu from "@/assets/desk-uluwatu.png";
import deskSeminyak from "@/assets/desk-seminyak.png";
import chairAeroflow from "@/assets/chair-aeroflow.png";
import chairExecutive from "@/assets/chair-executive.png";
import accMonitor from "@/assets/acc-monitor.png";
import accPlant from "@/assets/acc-plant.png";
import accLamp from "@/assets/acc-lamp.png";
import accCoffee from "@/assets/acc-coffee.png";
import accSurf from "@/assets/acc-surf.png";
import accKeyboard from "@/assets/acc-keyboard.png";

export type Desk = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  image: string;
};

export type Chair = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  image: string;
};

export type AccessoryGroup = "tech" | "vibe";

export type Accessory = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  image: string;
  group: AccessoryGroup;
  maxQty: number;
  /** Placement in the scene, % of the stage box. */
  spot: { left: number; top: number; width: number; z: number };
  /** Horizontal offset in % applied per extra copy. */
  repeatOffset?: number;
};

export const DESKS: Desk[] = [
  {
    id: "uluwatu",
    name: "The Uluwatu",
    blurb: "Bamboo top, motorised sit-stand frame, 140×70cm",
    price: 45,
    image: deskUluwatu,
  },
  {
    id: "seminyak",
    name: "The Seminyak",
    blurb: "Solid mahogany executive desk with six drawers",
    price: 60,
    image: deskSeminyak,
  },
];

export const CHAIRS: Chair[] = [
  {
    id: "aeroflow",
    name: "AeroFlow Mesh",
    blurb: "Breathable mesh with lumbar support",
    price: 25,
    image: chairAeroflow,
  },
  {
    id: "executive",
    name: "Classic Executive",
    blurb: "Tan leather and walnut, mid-century",
    price: 35,
    image: chairExecutive,
  },
];

export const ACCESSORIES: Accessory[] = [
  {
    id: "monitor",
    name: '27" 4K Monitor',
    blurb: "Colour-calibrated, height adjustable",
    price: 15,
    image: accMonitor,
    group: "tech",
    maxQty: 3,
    spot: { left: 44, top: 17, width: 21, z: 10 },
    repeatOffset: 20,
  },
  {
    id: "keyboard",
    name: "Keyboard + Mouse",
    blurb: "Wireless mechanical, quiet switches",
    price: 6,
    image: accKeyboard,
    group: "tech",
    maxQty: 1,
    spot: { left: 37, top: 47, width: 15, z: 20 },
  },
  {
    id: "lamp",
    name: "Halo Desk Lamp",
    blurb: "Warm dimmable LED task light",
    price: 5,
    image: accLamp,
    group: "tech",
    maxQty: 1,
    spot: { left: 66, top: 27, width: 11, z: 12 },
  },
  {
    id: "plant",
    name: "Monstera Plant",
    blurb: "Potted, watered weekly by us",
    price: 4,
    image: accPlant,
    group: "vibe",
    maxQty: 2,
    spot: { left: 25, top: 25, width: 12, z: 12 },
    repeatOffset: -14,
  },
  {
    id: "coffee",
    name: "Espresso Station",
    blurb: "Machine, grinder and a kilo of Kintamani beans",
    price: 18,
    image: accCoffee,
    group: "vibe",
    maxQty: 1,
    spot: { left: 68, top: 43, width: 14, z: 25 },
  },
  {
    id: "surf",
    name: "Surf Rack",
    blurb: "Wall rack with a 6'2\" foam board",
    price: 12,
    image: accSurf,
    group: "vibe",
    maxQty: 1,
    spot: { left: 4, top: 6, width: 16, z: 5 },
  },
];

export type Setup = {
  deskId: string;
  chairId: string;
  accessories: Record<string, number>;
};

export const DEFAULT_SETUP: Setup = {
  deskId: "uluwatu",
  chairId: "aeroflow",
  accessories: { monitor: 1, keyboard: 1, plant: 1 },
};

export type LineItem = {
  id: string;
  label: string;
  qty: number;
  price: number;
};

export function buildLineItems(setup: Setup): LineItem[] {
  const desk = DESKS.find((d) => d.id === setup.deskId);
  const chair = CHAIRS.find((c) => c.id === setup.chairId);
  const items: LineItem[] = [];
  if (desk)
    items.push({ id: desk.id, label: desk.name, qty: 1, price: desk.price });
  if (chair)
    items.push({ id: chair.id, label: chair.name, qty: 1, price: chair.price });
  for (const acc of ACCESSORIES) {
    const qty = setup.accessories[acc.id] ?? 0;
    if (qty > 0)
      items.push({ id: acc.id, label: acc.name, qty, price: acc.price });
  }
  return items;
}

export function monthlyTotal(setup: Setup): number {
  return buildLineItems(setup).reduce((sum, i) => sum + i.qty * i.price, 0);
}

export function accessoryCount(setup: Setup): number {
  return ACCESSORIES.reduce((n, a) => n + (setup.accessories[a.id] ?? 0), 0);
}

/** A playful name for the current configuration. */
export function setupName(setup: Setup): string {
  const count = accessoryCount(setup);
  if ((setup.accessories["monitor"] ?? 0) >= 3)
    return "The Triple Screen Beast";
  if (setup.accessories["coffee"] && setup.accessories["surf"])
    return "The Canggu Lifestyle Pack";
  if (count === 0) return "The Monk Mode Minimal";
  if (count >= 5) return "The Everything Studio";
  return "The Digital Zen Pack";
}
