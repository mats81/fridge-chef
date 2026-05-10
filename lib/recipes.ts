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
  },
  {
    id: "thai-green-curry",
    title: "Grünes Thai-Curry mit Gemüse",
    description: "Aromatisch, cremig und voller Geschmack – ein Klassiker der thailändischen Küche.",
    category: "curry",
    cuisine: "thai",
    tags: ["comfort", "creative"],
    diet: ["vegan", "vegetarian", "gluten-free", "lactose-free"],
    base: "rice",
    method: "pan",
    timeMinutes: 25,
    difficulty: "Medium",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "rice", displayName: "Reis", amount: 200, unit: "g" },
      { name: "coconut milk", displayName: "Kokosmilch", amount: 400, unit: "ml" },
      { name: "green curry paste", displayName: "Grüne Currypaste", amount: 2, unit: "EL" },
      { name: "zucchini", displayName: "Zucchini", amount: 1, unit: "Stk" },
      { name: "bell pepper", displayName: "Paprika", amount: 1, unit: "Stk" },
      { name: "tofu", displayName: "Tofu", amount: 200, unit: "g", optional: true },
      { name: "basil", displayName: "Basilikum", optional: true }
    ],
    steps: [
      "Reis kochen.",
      "Currypaste in etwas Kokosmilch anbraten.",
      "Gemüse und restliche Kokosmilch zugeben und 10 Minuten köcheln.",
      "Optional Tofu dazugeben und mit Basilikum servieren."
    ],
    nutrition: { calories: 580, protein: 14, carbs: 62, fat: 30 },
    substitutions: ["Currypaste durch rote Currypaste ersetzen.", "Kokosmilch durch Sahne ersetzen (nicht mehr vegan)."]
  },
  {
    id: "kartoffelpuffer",
    title: "Kartoffelpuffer mit Apfelmus",
    description: "Knusprig, goldbraun und ein echter Klassiker der deutschen Küche.",
    category: "pan",
    cuisine: "german",
    tags: ["comfort", "kid-friendly"],
    diet: ["vegetarian", "budget", "kid-friendly", "lactose-free"],
    base: "potato",
    method: "pan",
    timeMinutes: 30,
    difficulty: "Easy",
    servings: 3,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "potato", displayName: "Kartoffeln", amount: 500, unit: "g" },
      { name: "egg", displayName: "Ei", amount: 1, unit: "Stk" },
      { name: "onion", displayName: "Zwiebel", amount: 1, unit: "Stk" },
      { name: "flour", displayName: "Mehl", amount: 2, unit: "EL" },
      { name: "apple sauce", displayName: "Apfelmus", amount: 200, unit: "g", optional: true },
      { name: "oil", displayName: "Öl" }
    ],
    steps: [
      "Kartoffeln und Zwiebel reiben und gut ausdrücken.",
      "Mit Ei, Mehl und Salz vermengen.",
      "In heißem Öl goldbraun ausbacken.",
      "Mit Apfelmus servieren."
    ],
    nutrition: { calories: 420, protein: 10, carbs: 58, fat: 16 },
    substitutions: ["Apfelmus durch Sauerrahm ersetzen."]
  },
  {
    id: "teriyaki-salmon",
    title: "Teriyaki-Lachs mit Reis",
    description: "Glasierter Lachs mit süß-salziger Teriyaki-Sauce – schnell und elegant.",
    category: "fish",
    cuisine: "japanese",
    tags: ["high-protein", "creative"],
    diet: ["high-protein", "gluten-free", "lactose-free"],
    base: "fish",
    method: "pan",
    timeMinutes: 20,
    difficulty: "Medium",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "salmon", displayName: "Lachs", amount: 300, unit: "g" },
      { name: "rice", displayName: "Reis", amount: 200, unit: "g" },
      { name: "soy sauce", displayName: "Sojasauce", amount: 3, unit: "EL" },
      { name: "honey", displayName: "Honig", amount: 1, unit: "EL" },
      { name: "garlic", displayName: "Knoblauch", amount: 1, unit: "Zehe" },
      { name: "sesame", displayName: "Sesam", optional: true },
      { name: "spring onion", displayName: "Frühlingszwiebeln", optional: true }
    ],
    steps: [
      "Reis kochen.",
      "Sojasauce, Honig und Knoblauch zur Teriyaki-Sauce verrühren.",
      "Lachs in der Pfanne anbraten und mit der Sauce glasieren.",
      "Mit Reis, Sesam und Frühlingszwiebeln servieren."
    ],
    nutrition: { calories: 620, protein: 38, carbs: 60, fat: 22 },
    substitutions: ["Lachs durch Hähnchenbrust ersetzen.", "Honig durch Ahornsirup ersetzen."]
  },
  {
    id: "burrito-bowl",
    title: "Mexikanische Burrito Bowl",
    description: "Bunt, sättigend und vollgepackt mit Aromen – wie Burrito, nur ohne Wrap.",
    category: "bowl",
    cuisine: "mexican",
    tags: ["comfort", "high-protein"],
    diet: ["vegetarian", "high-protein", "gluten-free"],
    base: "rice",
    method: "pan",
    timeMinutes: 30,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1543339308-d595c4f5c5b3?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "rice", displayName: "Reis", amount: 200, unit: "g" },
      { name: "black beans", displayName: "Schwarze Bohnen", amount: 1, unit: "Dose" },
      { name: "corn", displayName: "Mais", amount: 150, unit: "g" },
      { name: "avocado", displayName: "Avocado", amount: 1, unit: "Stk" },
      { name: "tomato", displayName: "Tomate", amount: 2, unit: "Stk" },
      { name: "lime", displayName: "Limette", amount: 1, unit: "Stk", optional: true },
      { name: "cheese", displayName: "Käse", amount: 50, unit: "g", optional: true }
    ],
    steps: [
      "Reis kochen.",
      "Bohnen und Mais erwärmen und würzen.",
      "Tomaten und Avocado schneiden.",
      "Alles in einer Bowl anrichten und optional mit Käse und Limette toppen."
    ],
    nutrition: { calories: 650, protein: 22, carbs: 85, fat: 24 },
    substitutions: ["Schwarze Bohnen durch Kidneybohnen ersetzen.", "Avocado durch Guacamole ersetzen."]
  },
  {
    id: "dal-tadka",
    title: "Indisches Dal mit Naan",
    description: "Cremiges Linsengericht mit aromatischem Tadka – echtes indisches Soulfood.",
    category: "curry",
    cuisine: "indian",
    tags: ["comfort", "budget"],
    diet: ["vegan", "vegetarian", "high-protein", "budget", "gluten-free", "lactose-free"],
    base: "legumes",
    method: "pan",
    timeMinutes: 35,
    difficulty: "Medium",
    servings: 3,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "red lentils", displayName: "Rote Linsen", amount: 200, unit: "g" },
      { name: "onion", displayName: "Zwiebel", amount: 1, unit: "Stk" },
      { name: "garlic", displayName: "Knoblauch", amount: 2, unit: "Zehen" },
      { name: "ginger", displayName: "Ingwer", amount: 1, unit: "Stk" },
      { name: "tomato", displayName: "Tomaten", amount: 2, unit: "Stk" },
      { name: "cumin", displayName: "Kreuzkümmel", amount: 1, unit: "TL" },
      { name: "turmeric", displayName: "Kurkuma", amount: 1, unit: "TL", optional: true }
    ],
    steps: [
      "Linsen waschen und mit Wasser weich kochen.",
      "Zwiebel, Knoblauch und Ingwer anschwitzen.",
      "Tomaten und Gewürze dazugeben und einkochen lassen.",
      "Linsen untermischen und mit Naan oder Reis servieren."
    ],
    nutrition: { calories: 380, protein: 22, carbs: 58, fat: 6 },
    substitutions: ["Rote Linsen durch gelbe Linsen ersetzen.", "Mit Reis statt Naan servieren."]
  },
  {
    id: "greek-salad",
    title: "Griechischer Bauernsalat",
    description: "Frisch, knackig und mediterran – perfekt als leichte Mahlzeit oder Beilage.",
    category: "salad",
    cuisine: "greek",
    tags: ["light", "quick"],
    diet: ["vegetarian", "quick", "gluten-free", "budget"],
    base: "vegetable",
    method: "cold",
    timeMinutes: 10,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "cucumber", displayName: "Gurke", amount: 1, unit: "Stk" },
      { name: "tomato", displayName: "Tomaten", amount: 3, unit: "Stk" },
      { name: "feta", displayName: "Feta", amount: 150, unit: "g" },
      { name: "onion", displayName: "Rote Zwiebel", amount: 1, unit: "Stk" },
      { name: "olive oil", displayName: "Olivenöl" },
      { name: "olives", displayName: "Oliven", amount: 80, unit: "g", optional: true },
      { name: "bell pepper", displayName: "Paprika", amount: 1, unit: "Stk", optional: true }
    ],
    steps: [
      "Gemüse in große Stücke schneiden.",
      "Feta darüber bröseln.",
      "Mit Olivenöl, Salz und Oregano würzen."
    ],
    nutrition: { calories: 320, protein: 14, carbs: 16, fat: 22 },
    substitutions: ["Feta durch veganen Käse ersetzen."]
  },
  {
    id: "chicken-stir-fry",
    title: "Asia-Hähnchenpfanne mit Gemüse",
    description: "Schnell im Wok, knackiges Gemüse und zartes Hähnchen – besser als vom Lieferservice.",
    category: "pan",
    cuisine: "asian",
    tags: ["quick", "high-protein"],
    diet: ["quick", "high-protein", "lactose-free"],
    base: "meat",
    method: "pan",
    timeMinutes: 18,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "chicken", displayName: "Hähnchenbrust", amount: 300, unit: "g" },
      { name: "bell pepper", displayName: "Paprika", amount: 1, unit: "Stk" },
      { name: "broccoli", displayName: "Brokkoli", amount: 150, unit: "g" },
      { name: "soy sauce", displayName: "Sojasauce", amount: 3, unit: "EL" },
      { name: "garlic", displayName: "Knoblauch", amount: 2, unit: "Zehen" },
      { name: "rice", displayName: "Reis", amount: 200, unit: "g", optional: true },
      { name: "sesame oil", displayName: "Sesamöl", optional: true }
    ],
    steps: [
      "Hähnchen in Streifen schneiden und scharf anbraten.",
      "Gemüse dazugeben und kurz mitbraten.",
      "Mit Sojasauce und Knoblauch ablöschen.",
      "Optional mit Reis servieren."
    ],
    nutrition: { calories: 480, protein: 42, carbs: 28, fat: 18 },
    substitutions: ["Hähnchen durch Tofu ersetzen.", "Brokkoli durch Zuckerschoten ersetzen."]
  },
  {
    id: "ofenkartoffeln",
    title: "Ofenkartoffeln mit Kräuterquark",
    description: "Simpel, günstig und immer lecker – das perfekte Alltagsessen.",
    category: "bake",
    cuisine: "german",
    tags: ["comfort", "budget"],
    diet: ["vegetarian", "budget", "gluten-free", "kid-friendly"],
    base: "potato",
    method: "oven",
    timeMinutes: 45,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "potato", displayName: "Kartoffeln", amount: 4, unit: "Stk" },
      { name: "quark", displayName: "Quark", amount: 200, unit: "g" },
      { name: "chives", displayName: "Schnittlauch", optional: true },
      { name: "garlic", displayName: "Knoblauch", amount: 1, unit: "Zehe", optional: true },
      { name: "olive oil", displayName: "Olivenöl" },
      { name: "cheese", displayName: "Käse", amount: 50, unit: "g", optional: true }
    ],
    steps: [
      "Kartoffeln waschen, einritzen und mit Olivenöl einreiben.",
      "Bei 200°C ca. 40 Minuten backen.",
      "Quark mit Schnittlauch und Knoblauch verrühren.",
      "Kartoffeln aufschneiden und mit Kräuterquark füllen."
    ],
    nutrition: { calories: 450, protein: 18, carbs: 62, fat: 14 },
    substitutions: ["Quark durch Schmand oder Joghurt ersetzen."]
  },
  {
    id: "couscous-salad",
    title: "Bunter Couscous-Salat",
    description: "Schnell zubereitet, perfekt zum Mitnehmen und herrlich erfrischend.",
    category: "salad",
    cuisine: "north african",
    tags: ["quick", "light"],
    diet: ["vegan", "vegetarian", "quick", "budget", "lactose-free"],
    base: "grain",
    method: "cold",
    timeMinutes: 15,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "couscous", displayName: "Couscous", amount: 200, unit: "g" },
      { name: "cucumber", displayName: "Gurke", amount: 1, unit: "Stk" },
      { name: "tomato", displayName: "Tomaten", amount: 2, unit: "Stk" },
      { name: "bell pepper", displayName: "Paprika", amount: 1, unit: "Stk" },
      { name: "lemon", displayName: "Zitrone", amount: 1, unit: "Stk" },
      { name: "olive oil", displayName: "Olivenöl" },
      { name: "mint", displayName: "Minze", optional: true }
    ],
    steps: [
      "Couscous mit heißem Wasser übergießen und quellen lassen.",
      "Gemüse klein schneiden.",
      "Alles mit Zitronensaft und Olivenöl vermengen.",
      "Optional mit frischer Minze garnieren."
    ],
    nutrition: { calories: 390, protein: 12, carbs: 62, fat: 10 },
    substitutions: ["Couscous durch Bulgur ersetzen.", "Minze durch Petersilie ersetzen."]
  },
  {
    id: "pasta-aglio-olio",
    title: "Pasta Aglio e Olio",
    description: "Der italienische Mitternachtsklassiker – simpel, schnell und unverschämt gut.",
    category: "pasta",
    cuisine: "italian",
    tags: ["quick", "budget"],
    diet: ["vegan", "vegetarian", "quick", "budget", "lactose-free"],
    base: "pasta",
    method: "pan",
    timeMinutes: 15,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "pasta", displayName: "Spaghetti", amount: 250, unit: "g" },
      { name: "garlic", displayName: "Knoblauch", amount: 4, unit: "Zehen" },
      { name: "olive oil", displayName: "Olivenöl", amount: 4, unit: "EL" },
      { name: "chili flakes", displayName: "Chiliflocken", amount: 1, unit: "TL", optional: true },
      { name: "parsley", displayName: "Petersilie", optional: true },
      { name: "parmesan", displayName: "Parmesan", amount: 30, unit: "g", optional: true }
    ],
    steps: [
      "Spaghetti al dente kochen.",
      "Knoblauch in Scheiben schneiden und in Olivenöl goldbraun anbraten.",
      "Chiliflocken kurz mitrösten.",
      "Pasta mit etwas Kochwasser dazugeben und schwenken."
    ],
    nutrition: { calories: 520, protein: 14, carbs: 72, fat: 20 },
    substitutions: ["Chiliflocken weglassen für milde Version."]
  },
  {
    id: "red-thai-chicken-curry",
    title: "Rotes Thai-Curry mit Hähnchen",
    description: "Cremig-scharf mit zartem Hähnchen – ein Wohlfühlgericht aus Thailand.",
    category: "curry",
    cuisine: "thai",
    tags: ["comfort", "high-protein"],
    diet: ["high-protein", "gluten-free", "lactose-free"],
    base: "meat",
    method: "pan",
    timeMinutes: 25,
    difficulty: "Medium",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "chicken", displayName: "Hähnchenbrust", amount: 300, unit: "g" },
      { name: "coconut milk", displayName: "Kokosmilch", amount: 400, unit: "ml" },
      { name: "red curry paste", displayName: "Rote Currypaste", amount: 2, unit: "EL" },
      { name: "bell pepper", displayName: "Paprika", amount: 1, unit: "Stk" },
      { name: "bamboo shoots", displayName: "Bambussprossen", amount: 100, unit: "g", optional: true },
      { name: "rice", displayName: "Reis", amount: 200, unit: "g" },
      { name: "basil", displayName: "Thai-Basilikum", optional: true }
    ],
    steps: [
      "Reis kochen.",
      "Hähnchen in Streifen schneiden und anbraten.",
      "Currypaste kurz anrösten, dann Kokosmilch angießen.",
      "Gemüse und Hähnchen dazugeben und 10 Minuten köcheln lassen."
    ],
    nutrition: { calories: 640, protein: 38, carbs: 58, fat: 28 },
    substitutions: ["Hähnchen durch Garnelen oder Tofu ersetzen."]
  },
  {
    id: "roasted-cauliflower",
    title: "Gerösteter Blumenkohl mit Tahini",
    description: "Nussig, knusprig und überraschend sättigend – ein unterschätztes Ofengericht.",
    category: "bake",
    cuisine: "levantine",
    tags: ["light", "creative"],
    diet: ["vegan", "vegetarian", "gluten-free", "lactose-free"],
    base: "vegetable",
    method: "oven",
    timeMinutes: 35,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "cauliflower", displayName: "Blumenkohl", amount: 1, unit: "Stk" },
      { name: "tahini", displayName: "Tahini", amount: 3, unit: "EL" },
      { name: "lemon", displayName: "Zitrone", amount: 1, unit: "Stk" },
      { name: "garlic", displayName: "Knoblauch", amount: 2, unit: "Zehen" },
      { name: "olive oil", displayName: "Olivenöl" },
      { name: "pomegranate", displayName: "Granatapfelkerne", optional: true },
      { name: "parsley", displayName: "Petersilie", optional: true }
    ],
    steps: [
      "Blumenkohl in Röschen teilen und mit Olivenöl, Salz und Pfeffer vermengen.",
      "Bei 220°C ca. 25 Minuten rösten, bis er goldbraun ist.",
      "Tahini mit Zitronensaft und Knoblauch zu einem Dressing verrühren.",
      "Blumenkohl mit Tahini-Dressing und optional Granatapfelkernen servieren."
    ],
    nutrition: { calories: 310, protein: 12, carbs: 22, fat: 20 },
    substitutions: ["Tahini durch Erdnussbutter ersetzen.", "Blumenkohl durch Brokkoli ersetzen."]
  },
  {
    id: "hackpfanne-paprika",
    title: "Hackfleisch-Paprika-Pfanne",
    description: "Deftig, würzig und in 20 Minuten fertig – ein Pfannengericht für jeden Tag.",
    category: "pan",
    cuisine: "hungarian",
    tags: ["comfort", "quick"],
    diet: ["quick", "high-protein", "gluten-free", "kid-friendly"],
    base: "meat",
    method: "pan",
    timeMinutes: 20,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "ground beef", displayName: "Hackfleisch", amount: 300, unit: "g" },
      { name: "bell pepper", displayName: "Paprika", amount: 2, unit: "Stk" },
      { name: "onion", displayName: "Zwiebel", amount: 1, unit: "Stk" },
      { name: "tomato paste", displayName: "Tomatenmark", amount: 2, unit: "EL" },
      { name: "paprika powder", displayName: "Paprikapulver", amount: 1, unit: "TL" },
      { name: "rice", displayName: "Reis", amount: 200, unit: "g", optional: true },
      { name: "sour cream", displayName: "Saure Sahne", amount: 80, unit: "g", optional: true }
    ],
    steps: [
      "Hackfleisch krümelig anbraten.",
      "Zwiebel und Paprika dazugeben und mitbraten.",
      "Tomatenmark und Paprikapulver einrühren, kurz köcheln.",
      "Optional mit Reis und Saurer Sahne servieren."
    ],
    nutrition: { calories: 540, protein: 34, carbs: 18, fat: 36 },
    substitutions: ["Hackfleisch durch veganes Hack ersetzen.", "Saure Sahne durch Joghurt ersetzen."]
  },
  {
    id: "overnight-oats",
    title: "Overnight Oats mit Beeren",
    description: "Am Abend vorbereiten, morgens genießen – das einfachste Frühstück der Welt.",
    category: "breakfast",
    cuisine: "international",
    tags: ["quick", "light"],
    diet: ["vegetarian", "budget", "kid-friendly"],
    base: "grain",
    method: "cold",
    timeMinutes: 5,
    difficulty: "Easy",
    servings: 1,
    image:
      "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "oats", displayName: "Haferflocken", amount: 60, unit: "g" },
      { name: "milk", displayName: "Milch", amount: 150, unit: "ml" },
      { name: "yogurt", displayName: "Joghurt", amount: 80, unit: "g" },
      { name: "berries", displayName: "Beeren", amount: 100, unit: "g" },
      { name: "honey", displayName: "Honig", amount: 1, unit: "EL", optional: true },
      { name: "banana", displayName: "Banane", amount: 1, unit: "Stk", optional: true }
    ],
    steps: [
      "Haferflocken, Milch und Joghurt verrühren.",
      "Über Nacht im Kühlschrank quellen lassen.",
      "Morgens mit Beeren und optional Honig toppen."
    ],
    nutrition: { calories: 340, protein: 14, carbs: 52, fat: 8 },
    substitutions: ["Milch durch Hafermilch ersetzen.", "Joghurt durch pflanzliche Alternative ersetzen."]
  },
  {
    id: "quesadillas",
    title: "Käse-Quesadillas mit Salsa",
    description: "Knusprig, käsig und in unter 10 Minuten fertig – der perfekte Snack.",
    category: "wrap",
    cuisine: "mexican",
    tags: ["quick", "kid-friendly"],
    diet: ["vegetarian", "quick", "kid-friendly"],
    base: "bread",
    method: "pan",
    timeMinutes: 10,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "wraps", displayName: "Tortillas", amount: 4, unit: "Stk" },
      { name: "cheese", displayName: "Käse", amount: 150, unit: "g" },
      { name: "tomato", displayName: "Tomate", amount: 1, unit: "Stk" },
      { name: "corn", displayName: "Mais", amount: 80, unit: "g", optional: true },
      { name: "jalapeño", displayName: "Jalapeño", amount: 1, unit: "Stk", optional: true },
      { name: "sour cream", displayName: "Saure Sahne", optional: true }
    ],
    steps: [
      "Tortilla mit Käse und Füllung belegen.",
      "Zweite Tortilla auflegen.",
      "In der Pfanne von beiden Seiten goldbraun braten.",
      "In Stücke schneiden und mit Salsa oder Saurer Sahne servieren."
    ],
    nutrition: { calories: 480, protein: 22, carbs: 38, fat: 26 },
    substitutions: ["Tortillas durch Wraps ersetzen.", "Käse durch veganen Käse ersetzen."]
  },
  {
    id: "miso-soup",
    title: "Japanische Miso-Suppe",
    description: "Leicht, wärmend und voller Umami – in 10 Minuten fertig.",
    category: "soup",
    cuisine: "japanese",
    tags: ["light", "quick"],
    diet: ["vegan", "vegetarian", "quick", "budget", "lactose-free"],
    base: "vegetable",
    method: "pan",
    timeMinutes: 10,
    difficulty: "Easy",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "miso paste", displayName: "Misopaste", amount: 2, unit: "EL" },
      { name: "tofu", displayName: "Seidentofu", amount: 150, unit: "g" },
      { name: "spring onion", displayName: "Frühlingszwiebeln", amount: 2, unit: "Stk" },
      { name: "seaweed", displayName: "Wakame (Algen)", amount: 5, unit: "g", optional: true },
      { name: "mushrooms", displayName: "Pilze", amount: 50, unit: "g", optional: true }
    ],
    steps: [
      "Wasser zum Kochen bringen.",
      "Tofu würfeln und mit optionalen Pilzen ins Wasser geben.",
      "Vom Herd nehmen und Misopaste einrühren (nicht mehr kochen!).",
      "Mit Frühlingszwiebeln und Wakame servieren."
    ],
    nutrition: { calories: 120, protein: 10, carbs: 8, fat: 5 },
    substitutions: ["Seidentofu durch festen Tofu ersetzen."]
  },
  {
    id: "french-onion-soup",
    title: "Französische Zwiebelsuppe",
    description: "Karamellisierte Zwiebeln, kräftige Brühe und überbackener Käse – pure Wärme.",
    category: "soup",
    cuisine: "french",
    tags: ["comfort"],
    diet: ["vegetarian"],
    base: "vegetable",
    method: "pan",
    timeMinutes: 45,
    difficulty: "Medium",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "onion", displayName: "Zwiebeln", amount: 4, unit: "Stk" },
      { name: "butter", displayName: "Butter", amount: 30, unit: "g" },
      { name: "vegetable broth", displayName: "Gemüsebrühe", amount: 750, unit: "ml" },
      { name: "bread", displayName: "Baguette", amount: 4, unit: "Scheiben" },
      { name: "cheese", displayName: "Gruyère oder Emmentaler", amount: 100, unit: "g" },
      { name: "thyme", displayName: "Thymian", optional: true }
    ],
    steps: [
      "Zwiebeln in Ringe schneiden und in Butter langsam karamellisieren (20 Min.).",
      "Mit Brühe ablöschen und 15 Minuten köcheln lassen.",
      "In ofenfeste Schüsseln füllen, Brot und Käse darauf verteilen.",
      "Im Ofen überbacken, bis der Käse goldbraun ist."
    ],
    nutrition: { calories: 420, protein: 18, carbs: 38, fat: 22 },
    substitutions: ["Gruyère durch Gouda ersetzen.", "Butter durch Olivenöl ersetzen."]
  },
  {
    id: "sweet-potato-curry",
    title: "Süßkartoffel-Kichererbsen-Curry",
    description: "Cremig, wärmend und voll mit pflanzlichem Protein – ein veganer Liebling.",
    category: "curry",
    cuisine: "indian",
    tags: ["comfort", "high-protein"],
    diet: ["vegan", "vegetarian", "high-protein", "gluten-free", "lactose-free"],
    base: "vegetable",
    method: "pan",
    timeMinutes: 30,
    difficulty: "Easy",
    servings: 3,
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    ingredients: [
      { name: "sweet potato", displayName: "Süßkartoffel", amount: 2, unit: "Stk" },
      { name: "chickpeas", displayName: "Kichererbsen", amount: 1, unit: "Dose" },
      { name: "coconut milk", displayName: "Kokosmilch", amount: 400, unit: "ml" },
      { name: "curry powder", displayName: "Currypulver", amount: 2, unit: "TL" },
      { name: "garlic", displayName: "Knoblauch", amount: 2, unit: "Zehen" },
      { name: "spinach", displayName: "Spinat", amount: 100, unit: "g", optional: true },
      { name: "rice", displayName: "Reis", amount: 200, unit: "g", optional: true }
    ],
    steps: [
      "Süßkartoffel schälen und würfeln.",
      "Knoblauch und Currypulver anbraten, dann Süßkartoffel dazugeben.",
      "Kokosmilch und Kichererbsen zugeben und 20 Minuten köcheln.",
      "Optional Spinat unterheben und mit Reis servieren."
    ],
    nutrition: { calories: 520, protein: 16, carbs: 68, fat: 22 },
    substitutions: ["Süßkartoffel durch Kürbis ersetzen.", "Kokosmilch durch Sahne ersetzen."]
  }
];