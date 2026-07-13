import {
  Building2,
  Candy,
  Car,
  CircleHelp,
  Coffee,
  Croissant,
  Gift,
  Heart,
  Home,
  MoreHorizontal,
  Repeat,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  TrainFront,
  Utensils,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Candy,
  Car,
  Coffee,
  Croissant,
  Gift,
  Heart,
  Home,
  MoreHorizontal,
  Repeat,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  TrainFront,
  Utensils,
  UtensilsCrossed,
};

export function CategoryIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? CircleHelp;
  return <Icon size={size} strokeWidth={2} aria-hidden />;
}

export function CategoryChip({
  icon,
  color,
  size = 44,
  iconSize = 20,
}: {
  icon: string;
  color: string;
  size?: number;
  iconSize?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        color: `color-mix(in srgb, ${color} 30%, #33302a)`,
      }}
    >
      <CategoryIcon name={icon} size={iconSize} />
    </span>
  );
}
