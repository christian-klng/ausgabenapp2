"use server";

import { revalidatePath } from "next/cache";
import { pool } from "./db";

export type ExpenseInput = {
  category_id: number;
  amount_cents: number;
  description: string | null;
  spent_at: string; // YYYY-MM-DD
};

function refresh() {
  revalidatePath("/");
  revalidatePath("/ausgaben");
  revalidatePath("/budget");
}

function assertExpenseInput(input: ExpenseInput) {
  if (!Number.isInteger(input.category_id)) throw new Error("Ungültige Kategorie");
  if (!Number.isInteger(input.amount_cents) || input.amount_cents <= 0)
    throw new Error("Betrag muss größer als 0 sein");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.spent_at)) throw new Error("Ungültiges Datum");
}

export async function createExpense(input: ExpenseInput) {
  assertExpenseInput(input);
  await pool.query(
    `INSERT INTO expenses (category_id, amount_cents, description, spent_at)
     VALUES ($1, $2, $3, $4)`,
    [input.category_id, input.amount_cents, input.description || null, input.spent_at]
  );
  refresh();
}

export async function updateExpense(id: number, input: ExpenseInput) {
  assertExpenseInput(input);
  await pool.query(
    `UPDATE expenses
     SET category_id = $1, amount_cents = $2, description = $3, spent_at = $4
     WHERE id = $5`,
    [input.category_id, input.amount_cents, input.description || null, input.spent_at, id]
  );
  refresh();
}

export async function deleteExpense(id: number) {
  await pool.query(`DELETE FROM expenses WHERE id = $1`, [id]);
  refresh();
}

export async function updateBudget(categoryId: number, budgetCents: number) {
  if (!Number.isInteger(budgetCents) || budgetCents < 0)
    throw new Error("Ungültiges Budget");
  await pool.query(`UPDATE categories SET budget_cents = $1 WHERE id = $2`, [
    budgetCents,
    categoryId,
  ]);
  refresh();
}
