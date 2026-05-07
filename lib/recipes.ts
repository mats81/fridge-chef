import { Recipe } from "@/lib/types";

export const recipes: Recipe[] = [
  {
    id: "lemon-ricotta-pasta",
    title: "Zitronige Ricotta-Spaghetti",
    description: "Cremig, frisch und in 15 Minuten auf dem Tisch.",
    category: "pasta",
    cuisine: "italian",
    tags: ["quick", "light"],
    diet: ["vegetarian", "quick"],
    base: "pasta",
    method: "pan",
    timeMinutes: 15,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "pasta", displayName: "Nudeln", amount: 250, unit: "g" },
      { name: "ricotta", displayName: "Ricotta", amount: 150, unit: "g" },
      { name: "lemon", displayName: "Zitrone", amount: 1, unit: "Stk" },
      { name: "parmesan", displayName: "Parmesan", amount: 30, unit: "g", optional: true },
      { name: "pepper", displayName: "Pfeffer" },
      { name: "olive oil", displayName: "Olivenöl" }
    ],
    steps: [
      "Pasta in Salzwasser kochen.",
      "Ricotta mit Zitronenabrieb, Zitronensaft, Pfeffer und etwas Pastawasser cremig rühren.",
      "Pasta mit Sauce schwenken und optional mit Parmesan servieren."
    ],
    nutrition: { calories: 610, protein: 22, carbs: 78, fat: 23 },
    substitutions: ["Ricotta durch Frischkäse ersetzen."]
  },
  {
    id: "sheet-pan-rice-feta",
    title: "Ofenreis mit Gemüse und Feta",
    description: "Ein herzhaftes Ofengericht mit wenig Aufwand.",
    category: "bake",
    cuisine: "mediterranean",
    tags: ["comfort", "budget"],
    diet: ["vegetarian", "budget", "kid-friendly"],
    base: "rice",
    method: "oven",
    timeMinutes: 40,
    difficulty: "Easy",
    servings: 3,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "rice", displayName: "Reis", amount: 250, unit: "g" },
      { name: "tomato", displayName: "Tomaten", amount: 2, unit: "Stk" },
      { name: "zucchini", displayName: "Zucchini", amount: 1, unit: "Stk" },
      { name: "feta", displayName: "Feta", amount: 150, unit: "g" },
      { name: "garlic", displayName: "Knoblauch", amount: 2, unit: "Zehen", optional: true },
      { name: "olive oil", displayName: "Olivenöl" }
    ],
    steps: [
      "Gemüse schneiden und mit Reis in eine Auflaufform geben.",
      "Mit Wasser oder Brühe bedecken, würzen und backen.",
      "Zum Schluss Feta darübergeben und kurz gratinieren."
    ],
    nutrition: { calories: 690, protein: 24, carbs: 81, fat: 28 },
    substitutions: ["Feta durch Halloumi oder Tofu ersetzen."]
  },
  {
    id: "gochujang-noodles",
    title: "Gochujang-Nudeln mit Sesam",
    description: "Scharf, schnell und deutlich kreativer als Standard-Pasta.",
    category: "noodles",
    cuisine: "korean",
    tags: ["creative", "quick"],
    diet: ["quick"],
    base: "pasta",
    method: "pan",
    timeMinutes: 18,
    difficulty: "Medium",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "pasta", displayName: "Nudeln", amount: 200, unit: "g" },
      { name: "gochujang", displayName: "Gochujang", amount: 1, unit: "EL" },
      { name: "soy sauce", displayName: "Sojasauce", amount: 2, unit: "EL" },
      { name: "egg", displayName: "Eier", amount: 2, unit: "Stk", optional: true },
      { name: "spring onion", displayName: "Frühlingszwiebeln", amount: 2, unit: "Stk", optional: true },
      { name: "sesame oil", displayName: "Sesamöl", amount: 1, unit: "EL", optional: true }
    ],
    steps: [
      "Nudeln kochen.",
      "Gochujang mit Sojasauce und etwas Nudelwasser verrühren.",
      "Alles in der Pfanne glasieren und optional mit Ei und Frühlingszwiebeln toppen."
    ],
    nutrition: { calories: 560, protein: 18, carbs: 83, fat: 16 },
    substitutions: ["Gochujang durch Chili und Tomatenmark ersetzen."]
  },
  {
    id: "chickpea-yogurt-pan",
    title: "Kichererbsen-Pfanne mit Zitronenjoghurt",
    description: "Sättigend, proteinreich und alltagstauglich.",
    category: "pan",
    cuisine: "middle eastern",
    tags: ["comfort", "high-protein"],
    diet: ["vegetarian", "high-protein", "budget", "kid-friendly"],
    base: "legumes",
    method: "pan",
    timeMinutes: 20,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "chickpeas", displayName: "Kichererbsen", amount: 1, unit: "Dose" },
      { name: "tomato", displayName: "Tomaten", amount: 2, unit: "Stk" },
      { name: "onion", displayName: "Zwiebel", amount: 1, unit: "Stk" },
      { name: "yogurt", displayName: "Joghurt", amount: 120, unit: "g" },
      { name: "lemon", displayName: "Zitrone", amount: 1, unit: "Stk", optional: true },
      { name: "cumin", displayName: "Kreuzkümmel", optional: true }
    ],
    steps: [
      "Zwiebel und Tomaten anschwitzen.",
      "Kichererbsen zugeben und würzen.",
      "Mit Zitronenjoghurt servieren."
    ],
    nutrition: { calories: 480, protein: 21, carbs: 51, fat: 18 },
    substitutions: ["Joghurt durch pflanzliche Alternative ersetzen."]
  },
  {
    id: "green-shakshuka",
    title: "Green Shakshuka mit Spinat",
    description: "Eiergericht mit viel Gemüse und wenig Aufwand.",
    category: "egg",
    cuisine: "levantine",
    tags: ["light", "high-protein"],
    diet: ["vegetarian", "high-protein", "gluten-free"],
    base: "egg",
    method: "pan",
    timeMinutes: 22,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "egg", displayName: "Eier", amount: 4, unit: "Stk" },
      { name: "spinach", displayName: "Spinat", amount: 200, unit: "g" },
      { name: "onion", displayName: "Zwiebel", amount: 1, unit: "Stk" },
      { name: "feta", displayName: "Feta", amount: 80, unit: "g", optional: true },
      { name: "garlic", displayName: "Knoblauch", optional: true }
    ],
    steps: [
      "Zwiebel anschwitzen, Spinat zusammenfallen lassen.",
      "Mulden formen und Eier hineingeben.",
      "Stocken lassen und optional mit Feta servieren."
    ],
    nutrition: { calories: 410, protein: 29, carbs: 10, fat: 26 },
    substitutions: ["Feta weglassen oder durch Tofu ersetzen."]
  },
  {
    id: "crispy-wraps",
    title: "Knusprige Wraps aus Resten",
    description: "Perfekt für viele vorhandene Zutaten und sehr flexibel.",
    category: "wrap",
    cuisine: "fusion",
    tags: ["quick", "kid-friendly"],
    diet: ["quick", "kid-friendly"],
    base: "bread",
    method: "pan",
    timeMinutes: 12,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "wraps", displayName: "Wraps", amount: 4, unit: "Stk" },
      { name: "chicken", displayName: "Huhn", amount: 150, unit: "g", optional: true },
      { name: "tofu", displayName: "Tofu", amount: 150, unit: "g", optional: true },
      { name: "cheese", displayName: "Käse", amount: 80, unit: "g", optional: true },
      { name: "tomato", displayName: "Tomate", amount: 1, unit: "Stk", optional: true },
      { name: "yogurt", displayName: "Joghurt", amount: 80, unit: "g", optional: true }
    ],
    steps: [
      "Füllung vorbereiten.",
      "Wraps füllen und einklappen.",
      "In der Pfanne knusprig braten."
    ],
    nutrition: { calories: 520, protein: 28, carbs: 39, fat: 25 },
    substitutions: ["Tortillas durch Fladenbrot ersetzen."]
  },
  {
    id: "panzanella",
    title: "Tomaten-Brot-Salat",
    description: "Leicht, sommerlich und ideal für altes Brot.",
    category: "salad",
    cuisine: "italian",
    tags: ["light", "budget"],
    diet: ["vegan", "vegetarian", "budget", "lactose-free"],
    base: "bread",
    method: "cold",
    timeMinutes: 10,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "bread", displayName: "Brot", amount: 4, unit: "Scheiben" },
      { name: "tomato", displayName: "Tomaten", amount: 3, unit: "Stk" },
      { name: "cucumber", displayName: "Gurke", amount: 1, unit: "Stk", optional: true },
      { name: "olive oil", displayName: "Olivenöl" },
      { name: "vinegar", displayName: "Essig", optional: true },
      { name: "basil", displayName: "Basilikum", optional: true }
    ],
    steps: [
      "Brot würfeln und kurz anrösten oder trocken verwenden.",
      "Tomaten schneiden und mit Dressing mischen.",
      "Brot kurz ziehen lassen und servieren."
    ],
    nutrition: { calories: 330, protein: 8, carbs: 42, fat: 14 },
    substitutions: ["Basilikum durch Petersilie ersetzen."]
  },
  {
    id: "tomato-egg-fried-rice",
    title: "Tomaten-Eierreis",
    description: "Schnell, sättigend und komplett aus deinen Basiszutaten machbar.",
    category: "rice",
    cuisine: "fusion",
    tags: ["quick", "comfort"],
    diet: ["vegetarian", "quick", "budget", "kid-friendly"],
    base: "rice",
    method: "pan",
    timeMinutes: 15,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "rice", displayName: "Reis", amount: 250, unit: "g" },
      { name: "egg", displayName: "Eier", amount: 3, unit: "Stk" },
      { name: "tomato", displayName: "Tomaten", amount: 2, unit: "Stk" },
      { name: "spinach", displayName: "Spinat", amount: 80, unit: "g", optional: true }
    ],
    steps: [
      "Reis garen oder übrigen Reis verwenden.",
      "Tomaten klein schneiden und in der Pfanne weich werden lassen.",
      "Eier dazugeben und stocken lassen.",
      "Reis untermischen und optional Spinat kurz zusammenfallen lassen."
    ],
    nutrition: { calories: 520, protein: 22, carbs: 64, fat: 18 },
    substitutions: ["Spinat kann weggelassen werden."]
  },
  {
    id: "spinach-lemon-pasta",
    title: "Spinat-Zitronen-Pasta",
    description: "Frisch, leicht und mit deinen vorhandenen Zutaten direkt kochbar.",
    category: "pasta",
    cuisine: "italian",
    tags: ["quick", "light"],
    diet: ["vegetarian", "quick", "budget"],
    base: "pasta",
    method: "pan",
    timeMinutes: 14,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "pasta", displayName: "Nudeln", amount: 250, unit: "g" },
      { name: "spinach", displayName: "Spinat", amount: 150, unit: "g" },
      { name: "lemon", displayName: "Zitrone", amount: 1, unit: "Stk" },
      { name: "yogurt", displayName: "Joghurt", amount: 120, unit: "g", optional: true }
    ],
    steps: [
      "Nudeln kochen.",
      "Spinat in einer Pfanne kurz zusammenfallen lassen.",
      "Zitronensaft und etwas Kochwasser dazugeben.",
      "Nudeln untermischen und optional mit Joghurt cremig abrunden."
    ],
    nutrition: { calories: 470, protein: 16, carbs: 74, fat: 11 },
    substitutions: ["Joghurt ist optional und macht die Sauce cremiger."]
  },
  {
    id: "tomato-spinach-frittata",
    title: "Tomaten-Spinat-Frittata",
    description: "Ein einfaches Eiergericht, das du sofort mit deinen Zutaten machen kannst.",
    category: "egg",
    cuisine: "mediterranean",
    tags: ["quick", "high-protein", "light"],
    diet: ["vegetarian", "quick", "high-protein", "gluten-free"],
    base: "egg",
    method: "pan",
    timeMinutes: 16,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "egg", displayName: "Eier", amount: 4, unit: "Stk" },
      { name: "tomato", displayName: "Tomaten", amount: 2, unit: "Stk" },
      { name: "spinach", displayName: "Spinat", amount: 120, unit: "g" },
      { name: "yogurt", displayName: "Joghurt", amount: 2, unit: "EL", optional: true }
    ],
    steps: [
      "Tomaten in der Pfanne kurz anbraten.",
      "Spinat dazugeben und zusammenfallen lassen.",
      "Eier verquirlen, optional etwas Joghurt einrühren und darübergießen.",
      "Bei kleiner Hitze stocken lassen."
    ],
    nutrition: { calories: 390, protein: 28, carbs: 12, fat: 23 },
    substitutions: ["Mit etwas Brot servieren."]
  },
  {
    id: "warm-tomato-bread-bowl",
    title: "Warme Tomaten-Brot-Bowl mit Joghurt",
    description: "Ein schnelles Restegericht aus Brot, Tomaten und Joghurt.",
    category: "bread",
    cuisine: "fusion",
    tags: ["quick", "budget", "light"],
    diet: ["vegetarian", "quick", "budget"],
    base: "bread",
    method: "pan",
    timeMinutes: 10,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "bread", displayName: "Brot", amount: 4, unit: "Scheiben" },
      { name: "tomato", displayName: "Tomaten", amount: 3, unit: "Stk" },
      { name: "yogurt", displayName: "Joghurt", amount: 120, unit: "g" },
      { name: "lemon", displayName: "Zitrone", amount: 1, unit: "Stk", optional: true }
    ],
    steps: [
      "Brot in Stücke reißen oder würfeln.",
      "Tomaten kurz warm schwenken, bis sie weich werden.",
      "Brot in eine Schüssel geben und die warmen Tomaten darauf verteilen.",
      "Mit Joghurt und optional etwas Zitronensaft servieren."
    ],
    nutrition: { calories: 340, protein: 12, carbs: 46, fat: 10 },
    substitutions: ["Auch kalt als Brotsalat essbar."]
  },
  {
    id: "lemon-yogurt-pasta",
    title: "Zitronen-Joghurt-Pasta",
    description: "Cremig, frisch und komplett mit deinen vorhandenen Basics machbar.",
    category: "pasta",
    cuisine: "italian",
    tags: ["quick", "light"],
    diet: ["vegetarian", "quick", "budget"],
    base: "pasta",
    method: "pan",
    timeMinutes: 12,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "pasta", displayName: "Nudeln", amount: 250, unit: "g" },
      { name: "yogurt", displayName: "Joghurt", amount: 150, unit: "g" },
      { name: "lemon", displayName: "Zitrone", amount: 1, unit: "Stk" }
    ],
    steps: [
      "Nudeln kochen.",
      "Joghurt mit Zitronensaft und etwas Nudelwasser verrühren.",
      "Nudeln unterheben und kurz cremig ziehen lassen."
    ],
    nutrition: { calories: 430, protein: 17, carbs: 68, fat: 9 },
    substitutions: ["Mit Spinat ergänzen, falls du mehr Gemüse möchtest."]
  }
];