import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { motion } from "framer-motion";

const themes = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
  { value: "system" as const, icon: Monitor, label: "System" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className="relative rounded-full p-2 transition-colors"
          aria-label={label}
        >
          {theme === value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Icon className={`relative z-10 h-4 w-4 ${theme === value ? "text-primary-foreground" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}
