import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Workflow, Box, ClipboardCheck, Radar } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/reconstruction", label: "Reconstruction", icon: Workflow },
  { to: "/analysis", label: "3D Analysis", icon: Box },
  { to: "/outputs", label: "Outputs & QA", icon: ClipboardCheck },
];

export function Sidebar() {
  return (
    <nav
      aria-label="Primary"
      className="flex w-[240px] shrink-0 flex-col border-r border-border bg-sidebar max-lg:w-[64px]"
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <Radar className="size-5 text-accent" aria-hidden="true" />
        <span className="text-sm font-semibold tracking-[0.18em] text-foreground max-lg:hidden">
          VIRRS
        </span>
      </div>

      <ul className="flex flex-1 flex-col gap-0.5 p-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              title={label}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[status=active]:bg-secondary data-[status=active]:text-foreground data-[status=active]:shadow-[inset_2px_0_0_0_var(--accent)] max-lg:justify-center max-lg:px-0"
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="max-lg:hidden">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t border-border px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 max-lg:hidden">
        VIRRS · V1.0
      </div>
    </nav>
  );
}
