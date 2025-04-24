export type CategoryType = 'Santé' | 'Fitness' | 'Nutrition' | 'Sommeil';

export interface CategoryData {
  label: string;
  unit: string;
}

export const CATEGORIES: CategoryType[] = ['Santé', 'Fitness', 'Nutrition', 'Sommeil'];

export const CATEGORY_MAPPINGS: Record<CategoryType, CategoryData> = {
  'Santé': { label: 'Qualité du sommeil', unit: '' },
  'Fitness': { label: 'Durée d\'exercice', unit: 'min' },
  'Nutrition': { label: 'Calories consommées', unit: 'kcal' },
  'Sommeil': { label: 'Durée de sommeil', unit: 'h' }
} as const;
