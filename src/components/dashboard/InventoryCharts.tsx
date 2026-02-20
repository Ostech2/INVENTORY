import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const inventoryData = [
  { month: "Jan", items: 1200, allocated: 980 },
  { month: "Feb", items: 1350, allocated: 1100 },
  { month: "Mar", items: 1180, allocated: 950 },
  { month: "Apr", items: 1500, allocated: 1280 },
  { month: "May", items: 1420, allocated: 1150 },
  { month: "Jun", items: 1680, allocated: 1400 },
];

const categoryData = [
  { name: "Beds", count: 450 },
  { name: "Mattresses", count: 480 },
  { name: "Chairs", count: 320 },
  { name: "Tables", count: 280 },
  { name: "Wardrobes", count: 200 },
  { name: "Others", count: 150 },
];

export function InventoryChart() {
  return (
    <div className="stat-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Inventory Trends</h3>
          <p className="text-sm text-muted-foreground">Total vs Allocated items over time</p>
        </div>
        <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Last 6 months</option>
          <option>Last year</option>
          <option>All time</option>
        </select>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={inventoryData}>
            <defs>
              <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 85%, 35%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(210, 85%, 35%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAllocated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(42, 95%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(42, 95%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(214, 20%, 88%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px hsl(215 28% 17% / 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="items"
              stroke="hsl(210, 85%, 35%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorItems)"
              name="Total Items"
            />
            <Area
              type="monotone"
              dataKey="allocated"
              stroke="hsl(42, 95%, 55%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAllocated)"
              name="Allocated"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryChart() {
  return (
    <div className="stat-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Items by Category</h3>
        <p className="text-sm text-muted-foreground">Distribution of inventory items</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" horizontal={false} />
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(214, 20%, 88%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px hsl(215 28% 17% / 0.1)',
              }}
            />
            <Bar 
              dataKey="count" 
              fill="hsl(210, 85%, 35%)" 
              radius={[0, 4, 4, 0]}
              name="Count"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
