import { Building2, Users, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Hostel {
  id: string;
  name: string;
  type: "male" | "female";
  capacity: number;
  occupied: number;
  items: number;
}
export function HostelOverview({ hostels = [] }: { hostels?: Hostel[] }) {
  return (
    <div className="stat-card h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Hostel Overview</h3>
        <button className="text-sm font-medium text-primary hover:underline">Manage</button>
      </div>
      <div className="space-y-3">
        {hostels.map((hostel, index) => {
          const occupancyPercent = Math.round((hostel.occupied / hostel.capacity) * 100);
          const isFemale = hostel.type === "female";
          
          return (
            <div
              key={hostel.id}
              className={cn(
                "rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors cursor-pointer opacity-0 animate-fade-in",
                `stagger-${Math.min(index + 1, 4)}`
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    isFemale ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"
                  )}>
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{hostel.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{hostel.type}</p>
                  </div>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  occupancyPercent >= 90 ? "bg-destructive/10 text-destructive" :
                  occupancyPercent >= 70 ? "bg-warning/10 text-warning" :
                  "bg-success/10 text-success"
                )}>
                  {occupancyPercent}% full
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="mb-2">
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      occupancyPercent >= 90 ? "bg-destructive" :
                      occupancyPercent >= 70 ? "bg-warning" :
                      "bg-success"
                    )}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {hostel.occupied}/{hostel.capacity}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {hostel.items} items
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
