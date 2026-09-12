// Recipes that arrive at runtime (Spoonacular, Ollama) have no diet tags, which
// meant a single active filter removed all of them. These heuristics derive tags
// from the ingredient list so online and AI recipes can compete with local ones.

import { DietTag, Recipe } from "@/lib/types";
import { normalize } from "@/lib/ingredient-meta";

/** Substring matching is intentional: "Hähnchenbrust" must match "haehnchen". */
const MEAT = [
  "fleisch", "meat", "huhn", "haehnchen", "chicken", "pute", "turkey", "rind",
  "beef", "steak", "schwein", "pork", "speck", "bacon", "schinken", "ham",
  "wurst", "sausage", "salami", "chorizo", "hack", "mince", "lamm", "lamb",
  "ente", "duck", "kalb", "veal", "gelatine"
];

/** Broth is only meat when nothing says otherwise — "Gemüsebrühe" is not. */
const BROTH = ["bruehe", "broth", "bouillon"];
const PLANT_BROTH = /^(gemuese|gemuse|pilz|vegetable|veggie|hefe|miso|kraeuter|klare)/;

const FISH = [
  "fisch", "fish", "lachs", "salmon", "thunfisch", "tuna", "garnele", "shrimp",
  "prawn", "kabeljau", "cod", "forelle", "trout", "sardine", "anchovi", "sardelle",
  "muschel", "mussel", "tintenfisch", "squid", "calamari", "hering", "makrele",
  "fischsauce", "austern"
];

const DAIRY = [
  "milch", "milk", "butter", "sahne", "cream", "kaese", "cheese", "joghurt",
  "yogurt", "yoghurt", "quark", "frischkaese", "ricotta", "mozzarella", "feta",
  "parmesan", "mascarpone", "schmand", "creme fraiche", "ghee", "molke", "whey",
  "rahm", "obers", "skyr", "halloumi", "brie", "camembert", "gouda", "cheddar",
  "burrata", "mozarella", "kondensmilch"
];

const EGG = ["ei", "eier", "egg", "eggs", "eigelb", "eiweiss", "mayonnaise", "mayo"];

const HONEY = ["honig", "honey"];

const GLUTEN = [
  "mehl", "flour", "weizen", "wheat", "nudeln", "pasta", "spaghetti", "penne",
  "ravioli", "agnolotti", "brot", "bread", "toast", "ciabatta", "semmel",
  "broetchen", "paniermehl", "breadcrumb", "brotkruemel", "couscous", "bulgur",
  "gerste", "barley", "roggen", "rye", "dinkel", "spelt", "seitan", "bier",
  "sojasauce", "soy sauce", "tortilla", "wrap", "cracker", "keks",
  "griess", "panko", "teig", "quiche", "pizza", "pfannkuchen", "waffel",
  "crouton", "zwieback", "knoedel", "spaetzle", "gnocchi", "tortellini",
  "lasagne", "makkaroni", "fusilli", "farfalle", "tagliatelle", "linguine",
  "tarte", "strudel", "baguette", "brezel", "muesli", "cornflakes", "paniert"
];

/** Ingredients that are cheap almost everywhere — used for the budget heuristic. */
const CHEAP_BASE = [
  "reis", "rice", "nudeln", "pasta", "kartoffel", "potato", "ei", "eier", "egg",
  "zwiebel", "onion", "linsen", "lentil", "bohnen", "bean", "kichererbsen",
  "chickpea", "karotte", "carrot", "kohl", "cabbage", "haferflocken", "oat",
  "mehl", "flour", "tomate", "tomato"
];

/**
 * Plant-based products whose names contain a dairy word. Without this,
 * "Kokosmilch" reads as dairy and every Thai curry loses its vegan tag.
 */
const PLANT_ALTERNATIVES =
  /^(kokos|mandel|hafer|soja|reis|cashew|dinkel|erbsen|erdnuss|nuss|lupinen|hanf|kakao|shea|coconut|almond|oat|soy|peanut)/;

/** Matched inside compounds, so "Sauerrahm" and "Magerquark" are caught too. */
const DAIRY_WORDS =
  /(milch|sahne|butter|joghurt|yogurt|kaese|cheese|cream|creme|rahm|obers|quark|ricotta|mozzarella|mascarpone|skyr|halloumi|burrata|ghee|molke|whey)/;

/**
 * Word-aware matching. Plain substring search is wrong in German: "ei" occurs
 * inside "Weizen", "rind" inside "Tamarinde". Short needles must therefore match
 * a whole word, while longer ones may match inside a compound ("Kalbfleisch").
 */
function contains(haystack: string[], needles: string[]): boolean {
  return haystack.some((item) => {
    const words = item.split(/[^a-z0-9]+/).filter(Boolean);

    return needles.some((needle) =>
      needle.includes(" ")
        ? item.includes(needle)
        : needle.length <= 3
          ? words.some((word) => word === needle)
          : words.some((word) => word.includes(needle))
    );
  });
}

/** Meat check that treats vegetable broth as what it is. */
function containsMeat(haystack: string[]): boolean {
  return haystack.some((item) => {
    const words = item.split(/[^a-z0-9]+/).filter(Boolean);

    return words.some((word) => {
      if (BROTH.some((broth) => word.includes(broth))) {
        return !PLANT_BROTH.test(word) && !PLANT_BROTH.test(item);
      }

      return MEAT.some((needle) =>
        needle.length <= 3 ? word === needle : word.includes(needle)
      );
    });
  });
}

/** Dairy check that ignores plant-based products named after a dairy product. */
function containsDairy(haystack: string[]): boolean {
  return haystack.some((item) => {
    const words = item.split(/[^a-z0-9]+/).filter(Boolean);

    return words.some((word) => {
      if (!DAIRY_WORDS.test(word) && !DAIRY.includes(word)) return false;
      return !PLANT_ALTERNATIVES.test(word);
    });
  });
}

/**
 * Derive diet tags from a recipe's ingredients and metadata.
 * Deliberately conservative: a tag is only claimed when nothing contradicts it.
 */
export function deriveDietTags(recipe: {
  title?: string;
  ingredients: Array<{ name: string; displayName?: string }>;
  timeMinutes: number;
  nutrition?: { protein?: number; calories?: number };
}): DietTag[] {
  const names = recipe.ingredients.flatMap((item) =>
    [item.name, item.displayName].filter(Boolean).map((value) => normalize(value as string))
  );

  if (names.length === 0) return [];

  // The title often names something the ingredient list only implies —
  // a "Quiche" or "Pizza" is not gluten-free no matter what the list says.
  const haystack = recipe.title ? [...names, normalize(recipe.title)] : names;

  const tags = new Set<DietTag>();

  const hasMeat = containsMeat(haystack);
  const hasFish = contains(haystack, FISH);
  const hasDairy = containsDairy(haystack);
  const hasEgg = contains(haystack, EGG);
  const hasHoney = contains(haystack, HONEY);

  if (!hasMeat && !hasFish) {
    tags.add("vegetarian");
    if (!hasDairy && !hasEgg && !hasHoney) tags.add("vegan");
  }

  if (!contains(haystack, GLUTEN)) tags.add("gluten-free");
  if (!hasDairy) tags.add("lactose-free");

  if (recipe.timeMinutes <= 20) tags.add("quick");

  const protein = recipe.nutrition?.protein;
  if (typeof protein === "number" && protein >= 25) tags.add("high-protein");

  // Short ingredient lists built on staples are usually the cheap ones
  if (recipe.ingredients.length <= 7 && contains(names, CHEAP_BASE)) {
    tags.add("budget");
  }

  return [...tags];
}

/** Attach derived tags to a recipe that has none, leaving curated tags untouched. */
export function withDerivedDiet(recipe: Recipe): Recipe {
  if (recipe.diet.length > 0) return recipe;
  return { ...recipe, diet: deriveDietTags(recipe) };
}
