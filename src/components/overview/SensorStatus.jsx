import { Panel } from "../ui/Panel";
import { SENSOR_FIELDS } from "../../schemas/missionSchemas";

export function SensorStatus({ sensors }) {
  return (
    <Panel title="Mission Inputs">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-2 max-md:grid-cols-1">
        {SENSOR_FIELDS.map(({ key, label }) => {
          const available = Boolean(sensors[key]);
          return (
            <li
              key={key}
              className="flex items-center justify-between gap-3 border-b border-border/60 pb-1.5 text-xs last:border-b-0"
            >
              <span className="text-muted-foreground">{label}</span>
              <span
                className={`flex items-center gap-2 ${available ? "text-status-ok" : "text-muted-foreground"}`}
              >
                <span
                  className={`size-1.5 rounded-full ${available ? "bg-status-ok" : "bg-muted-foreground/50"}`}
                  aria-hidden="true"
                />
                {available ? "Available" : "Unavailable"}
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
