"use client";

import {
  Backpack,
  BatteryCharging,
  Beef,
  Box,
  Check,
  Clipboard,
  ChevronDown,
  CloudRain,
  Code2,
  Download,
  Droplets,
  FileText,
  Flame,
  Footprints,
  GlassWater,
  HeartPulse,
  ImageDown,
  Map,
  Mountain,
  Plus,
  Scale,
  Share2,
  Shirt,
  Sparkles,
  Sun,
  Tent,
  Trash2,
  Upload,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import packageJson from "../package.json";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CategoryId =
  | "base4"
  | "clothing"
  | "electronics"
  | "foodWater"
  | "safety"
  | "hygiene"
  | "misc";

type CarryMode = "carried" | "worn" | "consumable";
type SectionId = "library" | "pack" | "charts" | "gear" | "editor";

type GearItem = {
  id: string;
  name: string;
  description?: string;
  weight: number;
  qty: number;
  category: CategoryId;
  mode: CarryMode;
  csvCategory?: string;
  templateId?: string;
};

type CommonItem = {
  id: string;
  label: string;
  category: CategoryId;
  weight: number;
  icon: React.ElementType;
};

const STORAGE_KEY = "te-araroa-gear-v1";

const categories: Record<
  CategoryId,
  { label: string; shortLabel: string; color: string; tint: string }
> = {
  base4: {
    label: "Base 4",
    shortLabel: "Base 4",
    color: "#2e5d44",
    tint: "rgba(46, 93, 68, 0.13)",
  },
  clothing: {
    label: "Clothing",
    shortLabel: "Clothes",
    color: "#b78b3b",
    tint: "rgba(183, 139, 59, 0.17)",
  },
  electronics: {
    label: "Electronics",
    shortLabel: "Tech",
    color: "#21537c",
    tint: "rgba(33, 83, 124, 0.14)",
  },
  foodWater: {
    label: "Food and water",
    shortLabel: "Food/water",
    color: "#277e8f",
    tint: "rgba(39, 126, 143, 0.16)",
  },
  safety: {
    label: "Safety",
    shortLabel: "Safety",
    color: "#d25b36",
    tint: "rgba(210, 91, 54, 0.16)",
  },
  hygiene: {
    label: "Hygiene",
    shortLabel: "Hygiene",
    color: "#8e6653",
    tint: "rgba(142, 102, 83, 0.17)",
  },
  misc: {
    label: "Misc",
    shortLabel: "Misc",
    color: "#26312f",
    tint: "rgba(38, 49, 47, 0.1)",
  },
};

const commonItems: CommonItem[] = [
  { id: "pack", label: "Pack", category: "base4", weight: 950, icon: Backpack },
  { id: "shelter", label: "Shelter", category: "base4", weight: 820, icon: Tent },
  { id: "quilt", label: "Quilt", category: "base4", weight: 620, icon: Wind },
  { id: "sleeping-pad", label: "Sleeping pad", category: "base4", weight: 430, icon: Mountain },
  { id: "rain-jacket", label: "Rain jacket", category: "clothing", weight: 210, icon: CloudRain },
  { id: "sun-hoody", label: "Sun hoody", category: "clothing", weight: 185, icon: Shirt },
  { id: "fleece", label: "Fleece", category: "clothing", weight: 260, icon: Shirt },
  { id: "battery", label: "Power bank", category: "electronics", weight: 180, icon: BatteryCharging },
  { id: "headlamp", label: "Headlamp", category: "electronics", weight: 78, icon: Zap },
  { id: "navigation", label: "Nav map", category: "electronics", weight: 115, icon: Map },
  { id: "stove", label: "Stove", category: "foodWater", weight: 73, icon: Flame },
  { id: "water-filter", label: "Water filter", category: "foodWater", weight: 65, icon: Droplets },
  { id: "bottle", label: "Bottle", category: "foodWater", weight: 43, icon: GlassWater },
  { id: "first-aid", label: "First aid", category: "safety", weight: 140, icon: HeartPulse },
  { id: "sunscreen", label: "Sunscreen", category: "hygiene", weight: 75, icon: Sun },
  { id: "ditty-bag", label: "Ditty bag", category: "misc", weight: 95, icon: Box },
];

const starterItems: GearItem[] = [
  {
    id: "starter-pack",
    name: "Framed 50L pack",
    weight: 980,
    qty: 1,
    category: "base4",
    mode: "carried",
    templateId: "pack",
  },
  {
    id: "starter-shelter",
    name: "Single-wall shelter",
    weight: 760,
    qty: 1,
    category: "base4",
    mode: "carried",
    templateId: "shelter",
  },
  {
    id: "starter-quilt",
    name: "20F down quilt",
    weight: 610,
    qty: 1,
    category: "base4",
    mode: "carried",
    templateId: "quilt",
  },
  {
    id: "starter-pad",
    name: "Insulated pad",
    weight: 410,
    qty: 1,
    category: "base4",
    mode: "carried",
    templateId: "sleeping-pad",
  },
  {
    id: "starter-rain",
    name: "Storm shell",
    weight: 205,
    qty: 1,
    category: "clothing",
    mode: "carried",
    templateId: "rain-jacket",
  },
  {
    id: "starter-bank",
    name: "10k power bank",
    weight: 174,
    qty: 1,
    category: "electronics",
    mode: "carried",
    templateId: "battery",
  },
  {
    id: "starter-filter",
    name: "Squeeze filter",
    weight: 63,
    qty: 1,
    category: "foodWater",
    mode: "carried",
    templateId: "water-filter",
  },
];

function grams(value: number) {
  return `${Math.round(value).toLocaleString()} g`;
}

function kilos(value: number) {
  return `${(value / 1000).toFixed(2)} kg`;
}

function id() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function itemTotalWeight(item: Pick<GearItem, "weight" | "qty">) {
  return item.weight * Math.max(1, item.qty || 1);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const nextRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + nextRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, nextRadius);
  ctx.arcTo(x + width, y + height, x, y + height, nextRadius);
  ctx.arcTo(x, y + height, x, y, nextRadius);
  ctx.arcTo(x, y, x + width, y, nextRadius);
  ctx.closePath();
}

function truncateCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let nextText = text;
  while (nextText.length > 1 && ctx.measureText(`${nextText}...`).width > maxWidth) {
    nextText = nextText.slice(0, -1);
  }
  return `${nextText}...`;
}

function getTemplateIcon(templateId?: string) {
  return commonItems.find((item) => item.id === templateId)?.icon ?? Box;
}

const csvHeaders = [
  "Item Name",
  "Category",
  "Description",
  "Qty",
  "Weight",
  "Unit",
  "Worn",
  "Consumable",
];

const unitToGrams: Record<string, number> = {
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,
  oz: 28.349523125,
  ounce: 28.349523125,
  ounces: 28.349523125,
  lb: 453.59237,
  lbs: 453.59237,
  pound: 453.59237,
  pounds: 453.59237,
};

function escapeCsvCell(value: string | number | boolean | undefined) {
  const stringValue = String(value ?? "");
  if (!/[",\n\r]/.test(stringValue)) return stringValue;
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function stringifyCsv(rows: Array<Array<string | number | boolean | undefined>>) {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function parseCsv(text: string) {
  const rows: string[][] = [[]];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      rows[rows.length - 1].push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      rows[rows.length - 1].push(cell);
      cell = "";
      if (char === "\r" && next === "\n") index += 1;
      if (rows[rows.length - 1].some((value) => value.trim())) rows.push([]);
    } else {
      cell += char;
    }
  }

  rows[rows.length - 1].push(cell);
  return rows.filter((row) => row.some((value) => value.trim()));
}

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function truthyCsv(value: string | undefined) {
  return ["1", "true", "yes", "y", "x"].includes(String(value ?? "").trim().toLowerCase());
}

function categoryFromCsv(value: string | undefined): { category: CategoryId; csvCategory?: string } {
  const normalized = normalizeHeader(value ?? "");
  const match = Object.entries(categories).find(([idKey, category]) =>
    [idKey, category.label, category.shortLabel].some((candidate) => normalizeHeader(candidate) === normalized),
  );

  if (match) return { category: match[0] as CategoryId, csvCategory: match[1].label };
  return { category: "misc", csvCategory: value?.trim() || categories.misc.label };
}

function csvCategoryForItem(item: GearItem) {
  return item.csvCategory?.trim() || categories[item.category].label;
}

function itemsToCsv(gearItems: GearItem[]) {
  const rows = gearItems.map((item) => [
    item.name,
    csvCategoryForItem(item),
    item.description ?? "",
    item.qty || 1,
    Number(item.weight.toFixed(2)),
    "g",
    item.mode === "worn" ? 1 : 0,
    item.mode === "consumable" ? 1 : 0,
  ]);

  return `${stringifyCsv([csvHeaders, ...rows])}\n`;
}

function itemsFromCsv(text: string): GearItem[] {
  const rows = parseCsv(text);
  if (!rows.length) return [];

  const firstRow = rows[0].map(normalizeHeader);
  const hasHeader = firstRow.includes("itemname") || firstRow.includes("name");
  const indexFor = (aliases: string[], fallback: number) => {
    if (!hasHeader) return fallback;
    const index = firstRow.findIndex((header) => aliases.includes(header));
    return index >= 0 ? index : fallback;
  };

  const itemNameIndex = indexFor(["itemname", "name", "item"], 0);
  const categoryIndex = indexFor(["category", "cat"], 1);
  const descriptionIndex = indexFor(["description", "desc", "notes"], 2);
  const qtyIndex = indexFor(["qty", "quantity", "count"], 3);
  const weightIndex = indexFor(["weight", "wt"], 4);
  const unitIndex = indexFor(["unit", "units"], 5);
  const wornIndex = indexFor(["worn"], 6);
  const consumableIndex = indexFor(["consumable", "consumed"], 7);

  return rows.slice(hasHeader ? 1 : 0).flatMap((row) => {
    const name = row[itemNameIndex]?.trim();
    const weight = Number(row[weightIndex]);
    const qty = Math.max(1, Number(row[qtyIndex]) || 1);
    const unit = String(row[unitIndex] || "g").trim().toLowerCase();
    const gramsPerUnit = unitToGrams[unit];

    if (!name || Number.isNaN(weight) || weight < 0 || !gramsPerUnit) return [];

    const { category, csvCategory } = categoryFromCsv(row[categoryIndex]);
    const mode: CarryMode = truthyCsv(row[wornIndex])
      ? "worn"
      : truthyCsv(row[consumableIndex])
        ? "consumable"
        : "carried";

    return [
      {
        id: id(),
        name,
        description: row[descriptionIndex]?.trim() || undefined,
        weight: weight * gramsPerUnit,
        qty,
        category,
        csvCategory,
        mode,
      },
    ];
  });
}

function readLocalItems(): GearItem[] | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? null : normalizeItems(JSON.parse(stored));
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable in restricted browsing modes.
    }
    return null;
  }
}

function normalizeItems(value: unknown): GearItem[] {
  if (!Array.isArray(value)) return [];

  const normalized: GearItem[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Partial<GearItem>;
    const category = candidate.category;
    const mode = candidate.mode;
    const weight = Number(candidate.weight);
    const qty = Math.max(1, Number(candidate.qty) || 1);

    if (
      !candidate.id ||
      !candidate.name ||
      !category ||
      !Object.keys(categories).includes(category) ||
      !mode ||
      !["carried", "worn", "consumable"].includes(mode) ||
      Number.isNaN(weight) ||
      weight < 0
    ) {
      continue;
    }

    normalized.push({
      id: String(candidate.id),
      name: String(candidate.name),
      description: candidate.description ? String(candidate.description) : undefined,
      weight,
      qty,
      category,
      mode,
      csvCategory: candidate.csvCategory ? String(candidate.csvCategory) : undefined,
      templateId: candidate.templateId ? String(candidate.templateId) : undefined,
    });
  }

  return normalized;
}

export default function Home() {
  const [items, setItems] = useState<GearItem[]>(starterItems);
  const [selectedId, setSelectedId] = useState<string | null>(starterItems[0]?.id ?? null);
  const [draggingOver, setDraggingOver] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Loading local list");
  const [csvText, setCsvText] = useState("");
  const [activeMenu, setActiveMenu] = useState<"import" | "export" | null>(null);
  const [showPasteDialog, setShowPasteDialog] = useState(false);
  const [sharePreviewUrl, setSharePreviewUrl] = useState<string | null>(null);
  const [sharePreviewBlob, setSharePreviewBlob] = useState<Blob | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<SectionId, boolean>>({
    library: false,
    pack: false,
    charts: false,
    gear: false,
    editor: false,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    weight: "",
    qty: "1",
    category: "base4" as CategoryId,
    mode: "carried" as CarryMode,
    templateId: "pack",
  });

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const localItems = readLocalItems();
      if (localItems !== null) {
        setItems(localItems);
        setSelectedId(localItems[0]?.id ?? null);
        setSaveStatus(localItems.length ? "Loaded local list" : "Loaded empty local list");
      } else {
        setSaveStatus("Starter list loaded");
      }
      if (window.matchMedia("(max-width: 860px)").matches) {
        setCollapsedSections((current) => ({ ...current, library: true, editor: true }));
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    let nextStatus: string;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      nextStatus = "Saved locally";
    } catch {
      nextStatus = "Could not save in this browser";
    }

    const statusTimer = window.setTimeout(() => setSaveStatus(nextStatus), 0);
    return () => window.clearTimeout(statusTimer);
  }, [hydrated, items]);

  useEffect(() => {
    return () => {
      if (sharePreviewUrl) URL.revokeObjectURL(sharePreviewUrl);
    };
  }, [sharePreviewUrl]);

  const totals = useMemo(() => {
    const carried = items.filter((item) => item.mode === "carried");
    const worn = items.filter((item) => item.mode === "worn");
    const consumable = items.filter((item) => item.mode === "consumable");

    return {
      carried: carried.reduce((sum, item) => sum + itemTotalWeight(item), 0),
      worn: worn.reduce((sum, item) => sum + itemTotalWeight(item), 0),
      consumable: consumable.reduce((sum, item) => sum + itemTotalWeight(item), 0),
      all: items.reduce((sum, item) => sum + itemTotalWeight(item), 0),
      count: items.length,
    };
  }, [items]);

  const categoryData = useMemo(() => {
    return Object.entries(categories)
      .map(([key, category]) => {
        const value = items
          .filter((item) => item.category === key && item.mode === "carried")
          .reduce((sum, item) => sum + itemTotalWeight(item), 0);

        return {
          id: key,
          name: category.shortLabel,
          fullName: category.label,
          value,
          color: category.color,
        };
      })
      .filter((item) => item.value > 0);
  }, [items]);

  const baseFour = items
    .filter((item) => item.category === "base4" && item.mode === "carried")
    .reduce((sum, item) => sum + itemTotalWeight(item), 0);

  const hasCategoryData = categoryData.length > 0;
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const sectionPanelClass = (section: SectionId, baseClass: string) =>
    `${baseClass} section-card ${collapsedSections[section] ? "mobile-collapsed" : ""}`;
  const sectionToggleLabel = (section: SectionId, label: string) =>
    `${collapsedSections[section] ? "Expand" : "Collapse"} ${label}`;
  const packGroups = useMemo(() => {
    return Object.entries(categories)
      .map(([categoryId, category]) => {
        const groupItems = items
          .filter((item) => item.category === categoryId)
          .sort((a, b) => itemTotalWeight(b) - itemTotalWeight(a));

        return {
          id: categoryId as CategoryId,
          category,
          items: groupItems,
          total: groupItems.reduce((sum, item) => sum + itemTotalWeight(item), 0),
          loadShare: totals.all
            ? Math.max(8, (groupItems.reduce((sum, item) => sum + itemTotalWeight(item), 0) / totals.all) * 100)
            : 0,
        };
      })
      .filter((group) => group.items.length);
  }, [items, totals.all]);

  function primeDraft(template: CommonItem) {
    setDraft({
      name: template.label,
      description: "",
      weight: String(template.weight),
      qty: "1",
      category: template.category,
      mode: "carried",
      templateId: template.id,
    });
  }

  function addItem(overrides?: Partial<typeof draft>) {
    const nextDraft = { ...draft, ...overrides };
    const weight = Number(nextDraft.weight);
    const qty = Math.max(1, Number(nextDraft.qty) || 1);
    if (!nextDraft.name.trim() || Number.isNaN(weight) || weight < 0) return;

    const next: GearItem = {
      id: id(),
      name: nextDraft.name.trim(),
      description: nextDraft.description.trim() || undefined,
      weight,
      qty,
      category: nextDraft.category,
      mode: nextDraft.mode,
      csvCategory: categories[nextDraft.category].label,
      templateId: nextDraft.templateId,
    };

    setItems((current) => [...current, next]);
    setSelectedId(next.id);
    setDraft((current) => ({ ...current, name: "", description: "", weight: "", qty: "1" }));
  }

  function addTemplate(template: CommonItem) {
    const next: GearItem = {
      id: id(),
      name: template.label,
      weight: template.weight,
      qty: 1,
      category: template.category,
      mode: "carried",
      csvCategory: categories[template.category].label,
      templateId: template.id,
    };

    setItems((current) => [...current, next]);
    setSelectedId(next.id);
  }

  function updateItem(itemId: string, patch: Partial<GearItem>) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;
        const next = { ...item, ...patch };
        if (patch.category) next.csvCategory = categories[patch.category].label;
        return next;
      }),
    );
  }

  function toggleSection(section: SectionId) {
    setCollapsedSections((current) => ({ ...current, [section]: !current[section] }));
  }

  function deleteItem(itemId: string) {
    setItems((current) => current.filter((item) => item.id !== itemId));
    if (selectedId === itemId) {
      setSelectedId(items.find((item) => item.id !== itemId)?.id ?? null);
    }
  }

  function exportList() {
    const blob = new Blob([itemsToCsv(items)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kitweight-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setSaveStatus("Exported CSV");
  }

  function importCsvText(text: string, status = "Imported CSV") {
    try {
      const nextItems = itemsFromCsv(text);
      if (!nextItems.length) {
        setSaveStatus("CSV did not contain gear items");
        return;
      }

      setItems(nextItems);
      setSelectedId(nextItems[0]?.id ?? null);
      setSaveStatus(status);
    } catch {
      setSaveStatus("Could not read CSV");
    }
  }

  async function importList(file: File | undefined) {
    if (!file) return;

    try {
      importCsvText(await file.text(), "Imported CSV file");
      setActiveMenu(null);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function copyCsv() {
    const nextCsv = itemsToCsv(items);
    setCsvText(nextCsv);

    try {
      await navigator.clipboard.writeText(nextCsv);
      setSaveStatus("Copied CSV");
    } catch {
      setSaveStatus("CSV ready to copy");
    }
  }

  async function pasteCsvFromClipboard() {
    setActiveMenu(null);
    try {
      const text = await navigator.clipboard.readText();
      setCsvText(text);
      setShowPasteDialog(true);
      setSaveStatus("CSV ready to import");
    } catch {
      setSaveStatus("Paste CSV below");
      setShowPasteDialog(true);
    }
  }

  function importPastedCsv() {
    importCsvText(csvText, "Imported pasted CSV");
    setShowPasteDialog(false);
  }

  async function createShareImageBlob() {
    const width = 1400;
    const rowHeight = 38;
    const sortedItems = items
      .slice()
      .sort((a, b) => a.category.localeCompare(b.category) || itemTotalWeight(b) - itemTotalWeight(a));
    const graphLegendHeight = Math.max(0, categoryData.length - 1) * 42;
    const graphHeight = 390 + graphLegendHeight + 74;
    const listHeight = Math.max(390, sortedItems.length * rowHeight + 80);
    const height = Math.max(880, 320 + Math.max(listHeight, graphHeight) + 90);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }

    const panel = "#fffaf0";
    const ink = "#22302e";
    const muted = "#66736d";
    const line = "rgba(34, 48, 46, 0.16)";
    ctx.fillStyle = "#e2ece5";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = panel;
    roundRect(ctx, 48, 44, width - 96, height - 88, 30);
    ctx.fill();

    ctx.fillStyle = ink;
    ctx.font = "800 48px Avenir Next, Arial, sans-serif";
    ctx.fillText("KitWeight", 92, 118);
    ctx.font = "700 22px Avenir Next, Arial, sans-serif";
    ctx.fillStyle = muted;
    ctx.fillText(`${totals.count} items / ${kilos(totals.carried)} carried / ${kilos(totals.all)} all listed`, 92, 156);

    const metricX = [92, 312, 532];
    [
      ["Carried", kilos(totals.carried), categories.base4.color],
      ["Worn", kilos(totals.worn), categories.clothing.color],
      ["Consumable", kilos(totals.consumable), categories.foodWater.color],
    ].forEach(([label, value, color], index) => {
      const x = metricX[index];
      ctx.fillStyle = String(color);
      roundRect(ctx, x, 190, 178, 78, 16);
      ctx.fill();
      ctx.fillStyle = "#fffaf0";
      ctx.font = "800 18px Avenir Next, Arial, sans-serif";
      ctx.fillText(String(label), x + 18, 220);
      ctx.font = "900 28px Avenir Next, Arial, sans-serif";
      ctx.fillText(String(value), x + 18, 252);
    });

    const left = 92;
    const top = 320;
    const listWidth = 650;
    ctx.fillStyle = ink;
    ctx.font = "900 28px Avenir Next, Arial, sans-serif";
    ctx.fillText("Packlist", left, top - 26);
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + listWidth, top);
    ctx.stroke();

    sortedItems.forEach((item, index) => {
      const y = top + 34 + index * rowHeight;
      ctx.fillStyle = categories[item.category].color;
      ctx.beginPath();
      ctx.arc(left + 10, y - 7, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = ink;
      ctx.font = "800 19px Avenir Next, Arial, sans-serif";
      const name = item.qty > 1 ? `${item.name} x ${item.qty}` : item.name;
      ctx.fillText(truncateCanvasText(ctx, name, 390), left + 28, y);
      ctx.fillStyle = muted;
      ctx.font = "700 16px Avenir Next, Arial, sans-serif";
      ctx.fillText(csvCategoryForItem(item), left + 420, y);
      ctx.fillStyle = ink;
      ctx.textAlign = "right";
      ctx.fillText(grams(itemTotalWeight(item)), left + listWidth, y);
      ctx.textAlign = "left";
    });

    const graphLeft = 820;
    const graphTop = 320;
    ctx.fillStyle = ink;
    ctx.font = "900 28px Avenir Next, Arial, sans-serif";
    ctx.fillText("Weight Graph", graphLeft, graphTop - 26);

    const centerX = graphLeft + 210;
    const centerY = graphTop + 190;
    const radius = 142;
    let startAngle = -Math.PI / 2;
    const chartTotal = categoryData.reduce((sum, entry) => sum + entry.value, 0);

    if (chartTotal) {
      categoryData.forEach((entry) => {
        const slice = (entry.value / chartTotal) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
        ctx.closePath();
        ctx.fillStyle = entry.color;
        ctx.fill();
        startAngle += slice;
      });
      ctx.fillStyle = panel;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 82, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.font = "900 34px Avenir Next, Arial, sans-serif";
      ctx.fillText(kilos(totals.carried), centerX, centerY + 4);
      ctx.font = "800 17px Avenir Next, Arial, sans-serif";
      ctx.fillStyle = muted;
      ctx.fillText("carried", centerX, centerY + 32);
      ctx.textAlign = "left";

      const maxValue = Math.max(...categoryData.map((entry) => entry.value));
      categoryData.forEach((entry, index) => {
        const y = graphTop + 390 + index * 42;
        ctx.fillStyle = muted;
        ctx.font = "800 17px Avenir Next, Arial, sans-serif";
        ctx.fillText(entry.fullName, graphLeft, y);
        ctx.fillStyle = entry.color;
        roundRect(ctx, graphLeft + 150, y - 18, Math.max(8, (entry.value / maxValue) * 270), 18, 8);
        ctx.fill();
        ctx.fillStyle = ink;
        ctx.font = "800 16px Avenir Next, Arial, sans-serif";
        ctx.fillText(kilos(entry.value), graphLeft + 435, y - 2);
      });
    } else {
      ctx.fillStyle = muted;
      ctx.font = "800 22px Avenir Next, Arial, sans-serif";
      ctx.fillText("Add carried items to show the graph.", graphLeft, graphTop + 60);
    }

    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
  }

  async function prepareSharePreview() {
    const blob = await createShareImageBlob();
    if (!blob) {
      setSaveStatus("Could not create image");
      return;
    }

    if (sharePreviewUrl) URL.revokeObjectURL(sharePreviewUrl);
    const url = URL.createObjectURL(blob);
    setSharePreviewBlob(blob);
    setSharePreviewUrl(url);
    setShowShareDialog(true);
    setActiveMenu(null);
    setSaveStatus("Preview ready");
  }

  function downloadShareImage() {
    if (!sharePreviewBlob) return;
    const filename = `kitweight-${new Date().toISOString().slice(0, 10)}.png`;
    const url = URL.createObjectURL(sharePreviewBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setSaveStatus("Exported image");
  }

  async function copyShareImage() {
    if (!sharePreviewBlob) return;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [sharePreviewBlob.type]: sharePreviewBlob,
        }),
      ]);
      setSaveStatus("Copied image");
    } catch {
      setSaveStatus("Could not copy image");
    }
  }

  async function sharePreparedImage() {
    if (!sharePreviewBlob) return;

    const filename = `kitweight-${new Date().toISOString().slice(0, 10)}.png`;
    const file = new File([sharePreviewBlob], filename, { type: "image/png" });
    const navigatorWithShare = navigator as Navigator & {
      canShare?: (data: ShareData) => boolean;
      share?: (data: ShareData) => Promise<void>;
    };

    if (navigatorWithShare.canShare?.({ files: [file] }) && navigatorWithShare.share) {
      try {
        await navigatorWithShare.share({
          title: "KitWeight",
          text: `${kilos(totals.carried)} carried packlist`,
          files: [file],
        });
        setSaveStatus("Shared image");
        return;
      } catch {
        setSaveStatus("Share cancelled");
        return;
      }
    }

    setSaveStatus("Sharing not supported");
  }

  return (
    <main className="page-shell">
      <section className="hero-panel" aria-labelledby="app-title">
        <div className="route-map" aria-hidden="true">
          <span className="range range-one" />
          <span className="range range-two" />
          <span className="range range-three" />
          <span className="trail-line" />
          <Waves className="map-icon sea" />
          <Mountain className="map-icon peak" />
          <Footprints className="map-icon steps" />
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Hike kit board</p>
          <h1 id="app-title">See the weight of every choice before it hits your shoulders.</h1>
          <p>
            Click an item to customize it, or drag it straight into the pack. Your list is
            saved in this browser, with CSV import and export for backups or moving devices.
          </p>
        </div>

        <div className="summit-strip" aria-label="Current gear totals">
          <div>
            <span className="metric-label">Carried</span>
            <strong>{kilos(totals.carried)}</strong>
          </div>
          <div>
            <span className="metric-label">Base 4</span>
            <strong>{kilos(baseFour)}</strong>
          </div>
          <div>
            <span className="metric-label">All listed</span>
            <strong>{kilos(totals.all)}</strong>
          </div>
        </div>
      </section>

      <section className="sync-toolbar" aria-label="List actions">
        <div aria-live="polite" className="sync-pill online">
          <Check size={17} />
          <span>{saveStatus}</span>
        </div>

        <div className="action-buttons">
          <div className="action-menu">
            <button
              aria-expanded={activeMenu === "import"}
              onClick={() => setActiveMenu((current) => (current === "import" ? null : "import"))}
              type="button"
            >
              <Upload size={17} />
              Import
              <ChevronDown size={15} />
            </button>
            {activeMenu === "import" ? (
              <div className="menu-popover">
                <button onClick={pasteCsvFromClipboard} type="button">
                  <FileText size={16} />
                  Paste CSV
                </button>
                <button
                  onClick={() => {
                    setActiveMenu(null);
                    fileInputRef.current?.click();
                  }}
                  type="button"
                >
                  <Upload size={16} />
                  Import file
                </button>
              </div>
            ) : null}
          </div>

          <div className="action-menu">
            <button
              aria-expanded={activeMenu === "export"}
              onClick={() => setActiveMenu((current) => (current === "export" ? null : "export"))}
              type="button"
            >
              <Download size={17} />
              Export
              <ChevronDown size={15} />
            </button>
            {activeMenu === "export" ? (
              <div className="menu-popover">
                <button
                  onClick={() => {
                    copyCsv();
                    setActiveMenu(null);
                  }}
                  type="button"
                >
                  <Clipboard size={16} />
                  Copy CSV
                </button>
                <button
                  onClick={() => {
                    exportList();
                    setActiveMenu(null);
                  }}
                  type="button"
                >
                  <Download size={16} />
                  Export file
                </button>
              </div>
            ) : null}
          </div>

          <button onClick={prepareSharePreview} type="button">
            <Share2 size={17} />
            Share
          </button>

          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            accept="text/csv,.csv"
            onChange={(event) => importList(event.target.files?.[0])}
          />
        </div>
      </section>

      <nav className="mobile-jump-nav" aria-label="Mobile section navigation">
        <a href="#section-pack">Pack</a>
        <a href="#section-charts">Charts</a>
        <a href="#section-gear">List</a>
        <a href="#section-library">Add</a>
        <a href="#section-editor">Edit</a>
      </nav>

      {showPasteDialog ? (
        <div className="modal-backdrop" role="presentation">
          <section
            aria-labelledby="paste-title"
            aria-modal="true"
            className="modal-panel"
            role="dialog"
          >
            <div className="modal-heading">
              <span>
                <FileText size={18} />
                <strong id="paste-title">Paste CSV</strong>
              </span>
              <button onClick={() => setShowPasteDialog(false)} type="button">
                Close
              </button>
            </div>
            <textarea
              aria-label="KitWeight CSV"
              className="modal-textarea"
              placeholder="Item Name,Category,Description,Qty,Weight,Unit,Worn,Consumable"
              value={csvText}
              onChange={(event) => setCsvText(event.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setShowPasteDialog(false)} type="button">
                Cancel
              </button>
              <button className="primary-button compact" onClick={importPastedCsv} type="button">
                <Upload size={16} />
                Import
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {showShareDialog && sharePreviewUrl ? (
        <div className="modal-backdrop" role="presentation">
          <section
            aria-labelledby="share-title"
            aria-modal="true"
            className="modal-panel share-panel"
            role="dialog"
          >
            <div className="modal-heading">
              <span>
                <ImageDown size={18} />
                <strong id="share-title">Share Preview</strong>
              </span>
              <button onClick={() => setShowShareDialog(false)} type="button">
                Close
              </button>
            </div>
            <div className="share-preview">
              {/* This is a temporary local Blob URL, so Next.js cannot optimize it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Packlist and weight graph export preview" src={sharePreviewUrl} />
            </div>
            <div className="modal-actions">
              <button onClick={copyShareImage} type="button">
                <Clipboard size={16} />
                Copy image
              </button>
              <button onClick={downloadShareImage} type="button">
                <Download size={16} />
                Download
              </button>
              <button className="primary-button compact" onClick={sharePreparedImage} type="button">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <section className="workspace-grid">
        <aside
          className={sectionPanelClass("library", "kit-library")}
          id="section-library"
          aria-label="Common hike items"
        >
          <div className="section-heading">
            <span>
              <Sparkles size={18} />
              Common items
            </span>
            <div className="section-heading-actions">
              <small>Click or drag</small>
              <button
                aria-expanded={!collapsedSections.library}
                aria-label={sectionToggleLabel("library", "common items")}
                className="mobile-section-toggle"
                onClick={() => toggleSection("library")}
                type="button"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="section-body">
            <div className="item-grid">
              {commonItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    className="common-item"
                    draggable
                    key={item.id}
                    onClick={() => primeDraft(item)}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", item.id);
                      event.dataTransfer.effectAllowed = "copy";
                    }}
                    style={{ "--item-tint": categories[item.category].tint } as React.CSSProperties}
                    type="button"
                  >
                    <Icon size={22} />
                    <span>{item.label}</span>
                    <small>{grams(item.weight)}</small>
                  </button>
                );
              })}
            </div>

            <form
              className="add-panel"
              onSubmit={(event) => {
                event.preventDefault();
                addItem();
              }}
            >
              <div className="section-heading compact">
                <span>
                  <Plus size={18} />
                  Add item
                </span>
              </div>

              <label>
                Item name
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="e.g. Alpha fleece"
                />
              </label>

              <label className="full-field">
                Description
                <textarea
                  value={draft.description}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Optional notes"
                />
              </label>

              <div className="field-row">
                <label>
                  Weight (g)
                  <input
                    min="0"
                    type="number"
                    value={draft.weight}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, weight: event.target.value }))
                    }
                    placeholder="260"
                  />
                </label>

                <label>
                  Qty
                  <input
                    min="1"
                    step="1"
                    type="number"
                    value={draft.qty}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, qty: event.target.value }))
                    }
                    placeholder="1"
                  />
                </label>
              </div>

              <div className="field-row single">
                <label>
                  Category
                  <select
                    value={draft.category}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        category: event.target.value as CategoryId,
                      }))
                    }
                  >
                    {Object.entries(categories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mode-toggle" aria-label="Carry mode">
                {(["carried", "worn", "consumable"] as CarryMode[]).map((mode) => (
                  <button
                    className={draft.mode === mode ? "active" : ""}
                    key={mode}
                    onClick={() => setDraft((current) => ({ ...current, mode }))}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <button className="primary-button" type="submit">
                <Plus size={18} />
                Add to pack
              </button>
            </form>
          </div>
        </aside>

        <section
          className={sectionPanelClass("pack", "pack-panel")}
          id="section-pack"
          aria-labelledby="pack-title"
        >
          <div className="section-heading">
            <span id="pack-title">
              <Backpack size={18} />
              Pack visual
            </span>
            <div className="section-heading-actions">
              <small>
                {kilos(totals.carried)} carried / {totals.count} items
              </small>
              <button
                aria-expanded={!collapsedSections.pack}
                aria-label={sectionToggleLabel("pack", "pack visual")}
                className="mobile-section-toggle"
                onClick={() => toggleSection("pack")}
                type="button"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="section-body">
            <div
              className={`pack-dropzone ${draggingOver ? "is-over" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
                setDraggingOver(true);
              }}
              onDragLeave={() => setDraggingOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDraggingOver(false);
                const template = commonItems.find(
                  (item) => item.id === event.dataTransfer.getData("text/plain"),
                );
                if (template) addTemplate(template);
              }}
            >
              <div className="pack-overview">
                <div className="load-map" aria-hidden="true">
                  <div className="load-stack">
                    {packGroups.map((group) => (
                      <span
                        key={group.id}
                        style={
                          {
                            "--load-color": group.category.color,
                            "--load-share": `${group.loadShare}%`,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="pack-manifest">
                  {packGroups.map((group) => (
                    <div
                      className="pack-shelf"
                      key={group.id}
                      style={
                        {
                          "--shelf-color": group.category.color,
                          "--shelf-tint": group.category.tint,
                        } as React.CSSProperties
                      }
                    >
                      <div className="shelf-header">
                        <span>{group.category.shortLabel}</span>
                        <strong>{kilos(group.total)}</strong>
                      </div>
                      <div className="shelf-items">
                        {group.items.slice(0, 3).map((item) => {
                          const Icon = getTemplateIcon(item.templateId);
                          return (
                            <button
                              aria-label={`Select ${item.name}`}
                              className={`pack-chip ${selectedId === item.id ? "selected" : ""}`}
                              key={item.id}
                              onClick={() => setSelectedId(item.id)}
                              type="button"
                            >
                              <Icon size={15} />
                              <span>{item.qty > 1 ? `${item.name} x ${item.qty}` : item.name}</span>
                            </button>
                          );
                        })}
                        {group.items.length > 3 ? <em>+{group.items.length - 3}</em> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="stats-row">
              <div>
                <Scale size={18} />
                <span>Worn</span>
                <strong>{kilos(totals.worn)}</strong>
              </div>
              <div>
                <Beef size={18} />
                <span>Consumables</span>
                <strong>{kilos(totals.consumable)}</strong>
              </div>
              <div>
                <Mountain size={18} />
                <span>Base 4</span>
                <strong>{kilos(baseFour)}</strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className={sectionPanelClass("charts", "charts-panel")}
          id="section-charts"
          aria-labelledby="charts-title"
        >
          <div className="section-heading">
            <span id="charts-title">
              <Scale size={18} />
              Weight by category
            </span>
            <div className="section-heading-actions">
              <small>Carried items</small>
              <button
                aria-expanded={!collapsedSections.charts}
                aria-label={sectionToggleLabel("charts", "weight by category")}
                className="mobile-section-toggle"
                onClick={() => toggleSection("charts")}
                type="button"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="section-body">
            {hasCategoryData ? (
              <>
                <div className="chart-grid">
                  <div className="donut-wrap" aria-label="Category donut chart">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          innerRadius="58%"
                          outerRadius="84%"
                          paddingAngle={3}
                          stroke="var(--panel)"
                          strokeWidth={4}
                        >
                          {categoryData.map((entry) => (
                            <Cell fill={entry.color} key={entry.id} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => grams(Number(value ?? 0))}
                          wrapperStyle={{ zIndex: 30, pointerEvents: "none" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-total">
                      <strong>{kilos(totals.carried)}</strong>
                      <span>carried</span>
                    </div>
                  </div>

                  <div className="bar-chart-wrap">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 4 }}>
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={72}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => grams(Number(value ?? 0))}
                          wrapperStyle={{ zIndex: 30, pointerEvents: "none" }}
                        />
                        <Bar dataKey="value" radius={[0, 7, 7, 0]}>
                          {categoryData.map((entry) => (
                            <Cell fill={entry.color} key={entry.id} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="category-legend">
                  {categoryData.map((entry) => (
                    <span key={entry.id}>
                      <i style={{ background: entry.color }} />
                      {entry.fullName}: {kilos(entry.value)}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="chart-empty">
                <Scale size={26} />
                <p>Add a carried item to show category weight.</p>
              </div>
            )}
          </div>
        </section>

        <section
          className={sectionPanelClass("gear", "gear-table")}
          id="section-gear"
          aria-labelledby="gear-title"
        >
          <div className="section-heading">
            <span id="gear-title">
              <Footprints size={18} />
              KitWeight
            </span>
            <div className="section-heading-actions">
              <small>Saved locally</small>
              <button
                aria-expanded={!collapsedSections.gear}
                aria-label={sectionToggleLabel("gear", "KitWeight")}
                className="mobile-section-toggle"
                onClick={() => toggleSection("gear")}
                type="button"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="section-body table-body">
            <div className="list-scroll">
              {items
                .slice()
                .sort((a, b) => a.category.localeCompare(b.category) || itemTotalWeight(b) - itemTotalWeight(a))
                .map((item) => {
                  const Icon = getTemplateIcon(item.templateId);
                  return (
                    <button
                      className={`gear-row ${selectedId === item.id ? "selected" : ""}`}
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      type="button"
                    >
                      <span
                        className="row-icon"
                        style={{ "--row-color": categories[item.category].color } as React.CSSProperties}
                      >
                        <Icon size={18} />
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>
                          {csvCategoryForItem(item)} / {item.mode}
                          {item.qty > 1 ? ` / qty ${item.qty}` : ""}
                        </small>
                      </span>
                      <b>{grams(itemTotalWeight(item))}</b>
                    </button>
                  );
                })}
            </div>
          </div>
        </section>

        <section
          className={sectionPanelClass("editor", "editor-panel")}
          id="section-editor"
          aria-labelledby="editor-title"
        >
          <div className="section-heading">
            <span id="editor-title">
              <Sparkles size={18} />
              Item details
            </span>
            <button
              aria-expanded={!collapsedSections.editor}
              aria-label={sectionToggleLabel("editor", "item details")}
              className="mobile-section-toggle"
              onClick={() => toggleSection("editor")}
              type="button"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="section-body">
            {selected ? (
              <div className="editor-fields">
                <label>
                  Item name
                  <input
                    value={selected.name}
                    onChange={(event) => updateItem(selected.id, { name: event.target.value })}
                  />
                </label>

                <label>
                  Description
                  <textarea
                    value={selected.description ?? ""}
                    onChange={(event) =>
                      updateItem(selected.id, { description: event.target.value || undefined })
                    }
                  />
                </label>

                <div className="field-row">
                  <label>
                    Weight (g)
                    <input
                      min="0"
                      type="number"
                      value={selected.weight}
                      onChange={(event) =>
                        updateItem(selected.id, { weight: Number(event.target.value) || 0 })
                      }
                    />
                  </label>

                  <label>
                    Qty
                    <input
                      min="1"
                      step="1"
                      type="number"
                      value={selected.qty}
                      onChange={(event) =>
                        updateItem(selected.id, {
                          qty: Math.max(1, Number(event.target.value) || 1),
                        })
                      }
                    />
                  </label>
                </div>

                <div className="field-row single">
                  <label>
                    Category
                    <select
                      value={selected.category}
                      onChange={(event) =>
                        updateItem(selected.id, { category: event.target.value as CategoryId })
                      }
                    >
                      {Object.entries(categories).map(([key, category]) => (
                        <option key={key} value={key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mode-toggle" aria-label="Selected item carry mode">
                  {(["carried", "worn", "consumable"] as CarryMode[]).map((mode) => (
                    <button
                      className={selected.mode === mode ? "active" : ""}
                      key={mode}
                      onClick={() => updateItem(selected.id, { mode })}
                      type="button"
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <button className="danger-button" onClick={() => deleteItem(selected.id)} type="button">
                  <Trash2 size={17} />
                  Remove item
                </button>
              </div>
            ) : (
              <div className="empty-state">
                <Backpack size={26} />
                <p>Add or select an item to tune the list.</p>
              </div>
            )}
          </div>
        </section>
      </section>

      <footer className="site-footer">
        <div>
          <strong>KitWeight v{packageJson.version}</strong>
          <span>Local-first by design. Your gear stays in this browser.</span>
        </div>
        <nav aria-label="Project links">
          <a href="https://github.com/andreedd/kitweight" rel="noreferrer" target="_blank">
            <Code2 size={16} />
            Source on GitHub
          </a>
          <a
            href="https://github.com/andreedd/kitweight/blob/main/LICENSE"
            rel="noreferrer"
            target="_blank"
          >
            MIT License
          </a>
        </nav>
      </footer>
    </main>
  );
}
