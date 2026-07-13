import ExpenseList from "@/components/ExpenseList";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import { getCategories, getExpenses } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AusgabenPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = q?.trim() || "";
  const [expenses, categories] = await Promise.all([
    getExpenses({ search: search || undefined }),
    getCategories(),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Ausgaben"
        subtitle={`${expenses.length} ${expenses.length === 1 ? "Eintrag" : "Einträge"}`}
      />
      <SearchBar initial={search} />
      <ExpenseList expenses={expenses} categories={categories} searchTerm={search} />
    </div>
  );
}
