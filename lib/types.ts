export type DietTag =
  | "vegetarian"
  | "vegan"
  | "high-protein"
  | "budget"
  | "quick"
  | "gluten-free"
  | "lactose-free"
  | "kid-friendly";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface RecipeIngredient {
  name: string;
  displayName?: string;
  amount?: number;
  unit?: string;
  optional?: boolean;
  substitutes?: string[];
}

export interface Nutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  cuisine: string;
  tags: string[];
  diet: DietTag[];
  base: string;
  method: string;
  timeMinutes: number;
  difficulty: Difficulty;
  servings: number;
  image: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  nutrition?: Nutrition;
  substitutions?: string[];
  sourceUrl?: string;
}