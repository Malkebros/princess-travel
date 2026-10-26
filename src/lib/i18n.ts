export type Lang = "en" | "ar";

export const LANG_KEY = "princess-travel-lang-v1";
export const SELECTED_KEY = "princess-travel-selected-v1";

type Dict = Record<string, string>;

const en: Dict = {
  brandSub: "Amira Aboudeeb",
  tagline: "Names, numbers, and trips — Sabre stays in Sabre.",
  search: "Search name or phone…",
  newCaller: "New caller",
  resetSamples: "Reset samples",
  all: "All",
  backToList: "All callers",
  noCaller: "No caller selected",
  opening: "Opening Princess Travel…",
  status: "Status",
  name: "Name",
  phone: "Phone",
  email: "Email",
  passengers: "How many people",
  from: "From",
  to: "To",
  depart: "Leave",
  return: "Return",
  price: "Price",
  nextAction: "What to do next",
  notes: "Notes",
  more: "More (email & price)",
  hideMore: "Hide",
  whatsapp: "WhatsApp",
  remove: "Remove",
  removeConfirm: "Remove this caller?",
  save: "Save",
  cancel: "Cancel",
  optional: "optional",
  newCallerTitle: "New caller",
  newCallerHint: "Name and phone first. Add the trip if you know it.",
  tripOptional: "Trip (if you know it)",
  noRoute: "No trip yet",
  noMatch: "No callers match. Clear search and try again.",
  pax: "people",
  langEn: "EN",
  langAr: "عربي",
};

const ar: Dict = {
  brandSub: "أميرة أبو ديب",
  tagline: "الأسماء والأرقام والرحلات — سابري يبقى في سابري.",
  search: "ابحث بالاسم أو الرقم…",
  newCaller: "متصل جديد",
  resetSamples: "إعادة الأمثلة",
  all: "الكل",
  backToList: "كل المتصلين",
  noCaller: "لم يتم اختيار متصل",
  opening: "جاري فتح برنسيس ترافيل…",
  status: "الحالة",
  name: "الاسم",
  phone: "الهاتف",
  email: "البريد",
  passengers: "عدد الأشخاص",
  from: "من",
  to: "إلى",
  depart: "الذهاب",
  return: "العودة",
  price: "السعر",
  nextAction: "ماذا بعد",
  notes: "ملاحظات",
  more: "المزيد (بريد وسعر)",
  hideMore: "إخفاء",
  whatsapp: "واتساب",
  remove: "حذف",
  removeConfirm: "حذف هذا المتصل؟",
  save: "حفظ",
  cancel: "إلغاء",
  optional: "اختياري",
  newCallerTitle: "متصل جديد",
  newCallerHint: "الاسم والهاتف أولاً. أضيفي الرحلة إن عرفتها.",
  tripOptional: "الرحلة (إن عرفتها)",
  noRoute: "لا توجد رحلة بعد",
  noMatch: "لا يوجد نتائج. امسحي البحث وحاولي مرة أخرى.",
  pax: "أشخاص",
  langEn: "EN",
  langAr: "عربي",
};

export const STAGE_LABELS: Record<
  string,
  { en: string; ar: string }
> = {
  open: { en: "New", ar: "جديد" },
  working: { en: "Working on it", ar: "قيد العمل" },
  waiting_pay: { en: "Waiting for pay", ar: "بانتظار الدفع" },
  done: { en: "Done", ar: "تم" },
  problem: { en: "Needs help", ar: "يحتاج مساعدة" },
};

export function t(lang: Lang, key: keyof typeof en): string {
  return (lang === "ar" ? ar : en)[key] ?? en[key] ?? key;
}

export function stageLabel(lang: Lang, stage: string): string {
  const row = STAGE_LABELS[stage];
  if (!row) return stage;
  return lang === "ar" ? row.ar : row.en;
}

export function loadLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const v = window.localStorage.getItem(LANG_KEY);
    return v === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export function saveLang(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANG_KEY, lang);
}

export function loadSelectedId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SELECTED_KEY);
  } catch {
    return null;
  }
}

export function saveSelectedId(id: string | null) {
  if (typeof window === "undefined") return;
  if (!id) window.localStorage.removeItem(SELECTED_KEY);
  else window.localStorage.setItem(SELECTED_KEY, id);
}

export function whatsappUrl(phone: string): string | null {
  const d = phone.replace(/\D/g, "");
  if (d.length < 10) return null;
  const withCountry = d.length === 10 ? `1${d}` : d;
  return `https://wa.me/${withCountry}`;
}
