import { pool } from "./db";
import type { BudgetEntry, Category, Expense } from "./types";

export async function getCategories(): Promise<Category[]> {
  const { rows } = await pool.query(
    `SELECT id, slug, name, icon, color, sort_order, budget_cents
     FROM categories
     ORDER BY sort_order`
  );
  return rows;
}

export async function getBudgets(month: string): Promise<BudgetEntry[]> {
  const { rows } = await pool.query(
    `SELECT
       c.id AS category_id,
       c.slug,
       c.name,
       c.icon,
       c.color,
       c.budget_cents,
       COALESCE(SUM(e.amount_cents), 0)::int AS spent_cents,
       (c.budget_cents - COALESCE(SUM(e.amount_cents), 0))::int AS remaining_cents
     FROM categories c
     LEFT JOIN expenses e
       ON e.category_id = c.id AND to_char(e.spent_at, 'YYYY-MM') = $1
     GROUP BY c.id
     ORDER BY c.sort_order`,
    [month]
  );
  return rows;
}

export async function getExpenses(
  opts: { search?: string; month?: string } = {}
): Promise<Expense[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (opts.month) {
    params.push(opts.month);
    conditions.push(`to_char(e.spent_at, 'YYYY-MM') = $${params.length}`);
  }
  if (opts.search) {
    params.push(`%${opts.search}%`);
    conditions.push(
      `(e.description ILIKE $${params.length} OR c.name ILIKE $${params.length})`
    );
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await pool.query(
    `SELECT
       e.id, e.category_id, e.amount_cents, e.description,
       to_char(e.spent_at, 'YYYY-MM-DD') AS spent_at,
       c.slug, c.name AS category_name, c.icon, c.color
     FROM expenses e
     JOIN categories c ON c.id = e.category_id
     ${where}
     ORDER BY e.spent_at DESC, e.created_at DESC, e.id DESC`,
    params
  );
  return rows;
}

export async function getMonthSummary(
  month: string
): Promise<{ spent_cents: number; budget_cents: number }> {
  const { rows } = await pool.query(
    `SELECT
       (SELECT COALESCE(SUM(amount_cents), 0)::int
          FROM expenses WHERE to_char(spent_at, 'YYYY-MM') = $1) AS spent_cents,
       (SELECT COALESCE(SUM(budget_cents), 0)::int FROM categories) AS budget_cents`,
    [month]
  );
  return rows[0];
}
