export type Category = {
  id: number;
  slug: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
  budget_cents: number;
};

export type Expense = {
  id: number;
  category_id: number;
  amount_cents: number;
  description: string | null;
  spent_at: string; // YYYY-MM-DD
  slug: string;
  category_name: string;
  icon: string;
  color: string;
};

export type BudgetEntry = {
  category_id: number;
  slug: string;
  name: string;
  icon: string;
  color: string;
  budget_cents: number;
  spent_cents: number;
  remaining_cents: number;
};
