import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Download, FileText, Printer, Calendar, TrendingUp, Package, Building2, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { WardenPerformance } from "@/components/reports/WardenPerformance";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Sample data for charts
const categoryDistribution = [
  { name: "Furniture", value: 450, color: "hsl(210, 85%, 35%)" },
  { name: "Bedding", value: 380, color: "hsl(42, 95%, 55%)" },
  { name: "Storage", value: 200, color: "hsl(142, 72%, 40%)" },
  { name: "Accessories", value: 150, color: "hsl(200, 98%, 39%)" },
];

const hostelInventory = [
  { name: "St. Paul's", items: 456, allocated: 420 },
  { name: "St. Mary's", items: 389, allocated: 350 },
  { name: "Bishop's", items: 312, allocated: 290 },
  { name: "Grace", items: 348, allocated: 310 },
  { name: "Emmanuel", items: 234, allocated: 180 },
  { name: "Hope", items: 287, allocated: 260 },
];

const monthlyTrends = [
  { month: "Sep", additions: 120, disposals: 45, transfers: 30 },
  { month: "Oct", additions: 85, disposals: 32, transfers: 55 },
  { month: "Nov", additions: 150, disposals: 28, transfers: 42 },
  { month: "Dec", additions: 65, disposals: 15, transfers: 20 },
  { month: "Jan", additions: 200, disposals: 50, transfers: 35 },
];

const conditionReport = [
  { condition: "Good", count: 1420, percent: 77 },
  { condition: "Fair", count: 320, percent: 17 },
  { condition: "Needs Repair", count: 107, percent: 6 },
];

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("semester");
  const [isGenerating, setIsGenerating] = useState(false);
  const { role } = useAuth();
  const navigate = useNavigate();

  const generateFullReport = async () => {
    setIsGenerating(true);
    try {
      const [
        { data: inventory, error: inventoryError },
        { data: hostels, error: hostelsError },
        { data: allocations, error: allocationsError },
        { data: profiles, error: profilesError },
      ] = await Promise.all([
        supabase.from("inventory").select("*"),
        supabase.from("hostels").select("*"),
        supabase.from("room_allocations").select("*"),
        supabase.from("profiles").select("*"),
      ]);

      if (inventoryError || hostelsError || allocationsError || profilesError) {
        throw inventoryError || hostelsError || allocationsError || profilesError;
      }

      const report = {
        generated_at: new Date().toISOString(),
        period: selectedPeriod,
        inventory: inventory || [],
        hostels: hostels || [],
        allocations: allocations || [],
        profiles: profiles || [],
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `full-report-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast({ title: "Success", description: "Report downloaded" });
    } catch (error: any) {
      console.error("Error generating report:", error);
      const detail = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      toast({ title: "Error", description: detail || "Failed to generate report", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportReportPDF = async () => {
    setIsGenerating(true);
    try {
      const [
        { data: inventory, error: inventoryError },
        { data: hostels, error: hostelsError },
        { data: allocations, error: allocationsError },
        { data: profiles, error: profilesError },
      ] = await Promise.all([
        supabase.from("inventory").select("*"),
        supabase.from("hostels").select("*"),
        supabase.from("room_allocations").select("*"),
        supabase.from("profiles").select("*"),
      ]);

      if (inventoryError || hostelsError || allocationsError || profilesError) {
        throw inventoryError || hostelsError || allocationsError || profilesError;
      }

      const reportHtml = `
        <html>
          <head>
            <title>Full Report</title>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <style>
              @media print {
                @page { size: A4; margin: 20mm }
                body { -webkit-print-color-adjust: exact }
                .no-print { display: none }
              }
              body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 20px; color: #111827; background: #fff }
              .header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px }
              .brand { display:flex; align-items:center; gap:12px }
              .brand .logo { width:48px; height:48px; border-radius:8px; background:#f3f4f6; display:inline-flex; align-items:center; justify-content:center; font-weight:700; color:#111827 }
              h1 { font-size:18px; margin:0 }
              .meta { color:#6b7280; font-size:13px }
              h2 { font-size:14px; margin:16px 0 8px }
              table { width:100%; border-collapse:collapse; margin-bottom:12px; page-break-inside:avoid }
              th, td { border:1px solid #e5e7eb; padding:6px 8px; text-align:left; font-size:11px }
              th { background:#f8fafc; font-weight:600 }
              .section { margin-bottom:18px }
              .page-break { page-break-after: always }
            </style>
          </head>
          <body>
            <div class="header no-print">
              <div class="brand">
                <div class="logo">HIMS</div>
                <div>
                  <div style="font-weight:700">Hostel Inventory Management System</div>
                  <div class="meta">Full report - ${new Date().toLocaleString()}</div>
                </div>
              </div>
              <div class="meta">Period: ${selectedPeriod}</div>
            </div>

            <h1>Full Report</h1>

            <div class="section">
              <h2>Hostels (${(hostels || []).length})</h2>
              <table>
                <thead><tr><th>Name</th><th>Warden</th><th>Location</th><th>Capacity</th></tr></thead>
                <tbody>
                  ${(hostels || []).map(h => `<tr><td>${h.name}</td><td>${h.warden_id || ''}</td><td>${h.location || ''}</td><td>${h.capacity || ''}</td></tr>`).join('')}
                </tbody>
              </table>
            </div>

            <div class="section page-break">
              <h2>Inventory (${(inventory || []).length})</h2>
              <table>
                <thead><tr><th>Name</th><th>Category</th><th>Notes</th><th>Quantity</th></tr></thead>
                <tbody>
                  ${(inventory || []).slice(0,500).map(i => `<tr><td>${i.item_name || ''}</td><td>${i.category || ''}</td><td>${i.notes || ''}</td><td>${i.quantity ?? ''}</td></tr>`).join('')}
                </tbody>
              </table>
              <div class="meta">Showing first 500 inventory items</div>
            </div>

            <div class="section page-break">
              <h2>Allocations (${(allocations || []).length})</h2>
              <table>
                <thead><tr><th>Hostel</th><th>Room</th><th>Student</th><th>Date</th></tr></thead>
                // ...existing code...
                <tbody>
                  ${(allocations || []).slice(0,500).map(a => `<tr><td>${''}</td><td>${a.room_id || ''}</td><td>${a.student_id || ''}</td><td>${a.created_at || ''}</td></tr>`).join('')}
                </tbody>
// ...existing code...
              </table>
              <div class="meta">Showing first 500 allocations</div>
            </div>

            <div class="section">
              <h2>Profiles (${(profiles || []).length})</h2>
              <table>
                <thead><tr><th>Full Name</th><th>Email</th><th>Role</th><th>Gender</th></tr></thead>
                // ...existing code...
                <tbody>
                  ${(profiles || []).slice(0,500).map(p => `<tr><td>${p.full_name || ''}</td><td>${p.email || ''}</td><td>${(p as any).role || ''}</td><td>${p.gender || ''}</td></tr>`).join('')}
                </tbody>
// ...existing code...
              </table>
              <div class="meta">Showing first 500 profiles</div>
            </div>
          </body>
        </html>
      `;

      const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
      if (!win) throw new Error("Unable to open print window");

      win.document.open();
      win.document.write(reportHtml);
      win.document.close();

      // Give the new window a moment to render before printing
      setTimeout(() => {
        try {
          win.print();
        } catch (e) {
          console.warn("Print failed:", e);
        }
      }, 500);

      toast({ title: "Success", description: "Printable report opened" });
    } catch (error: any) {
      console.error("Error exporting PDF:", error);
      const detail = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      toast({ title: "Error", description: detail || "Failed to export PDF", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <AppHeader 
        title="Reports & Analytics" 
        subtitle="Generate reports and view inventory analytics" 
      />
      
      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="semester">This Semester</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              className="btn-gradient-primary gap-2"
              onClick={exportReportPDF}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGenerating ? "Preparing PDF..." : "Export Report"}
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,847</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5%
                </p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">82%</p>
                <p className="text-sm text-muted-foreground">Allocation Rate</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +3.2%
                </p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10 text-info">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">620</p>
                <p className="text-sm text-muted-foreground">New This Semester</p>
                <p className="text-xs text-muted-foreground mt-1">Items added</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">107</p>
                <p className="text-sm text-muted-foreground">Need Attention</p>
                <p className="text-xs text-warning mt-1">Repairs needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warden Performance - Admin Only */}
        {role === "admin" && <WardenPerformance />}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inventory by Category</span>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 100%)',
                        border: '1px solid hsl(214, 20%, 88%)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hostel Inventory Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inventory by Hostel</span>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hostelInventory} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }} width={70} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 100%)',
                        border: '1px solid hsl(214, 20%, 88%)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="items" fill="hsl(210, 85%, 35%)" radius={[0, 4, 4, 0]} name="Total Items" />
                    <Bar dataKey="allocated" fill="hsl(42, 95%, 55%)" radius={[0, 4, 4, 0]} name="Allocated" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 100%)',
                        border: '1px solid hsl(214, 20%, 88%)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="additions" stroke="hsl(142, 72%, 40%)" strokeWidth={2} dot={{ r: 4 }} name="Additions" />
                    <Line type="monotone" dataKey="disposals" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={{ r: 4 }} name="Disposals" />
                    <Line type="monotone" dataKey="transfers" stroke="hsl(42, 95%, 55%)" strokeWidth={2} dot={{ r: 4 }} name="Transfers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Condition Report */}
          <Card>
            <CardHeader>
              <CardTitle>Item Condition Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {conditionReport.map((item, index) => (
                <div key={item.condition} className={cn("opacity-0 animate-fade-in", `stagger-${index + 1}`)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.condition}</span>
                    <span className="text-sm text-muted-foreground">{item.count} items ({item.percent}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        item.condition === "Good" ? "bg-success" :
                        item.condition === "Fair" ? "bg-warning" :
                        "bg-destructive"
                      )}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={generateFullReport}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate Full Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Inventory Summary", desc: "Complete inventory list with details", icon: Package, href: "/inventory" },
                { title: "Allocation Report", desc: "All active allocations by hostel", icon: Building2, href: "/allocations" },
                { title: "Maintenance Report", desc: "Items needing repair or replacement", icon: AlertTriangle, href: "/inventory?filter=maintenance" },
                { title: "Procurement History", desc: "Purchase records and suppliers", icon: FileText, href: "/inventory?filter=history" },
              ].map((report, index) => (
                <button
                  key={report.title}
                  onClick={() => navigate(report.href)}
                  className={cn(
                    "flex flex-col items-start gap-3 rounded-xl border border-border p-4 text-left transition-all hover:border-primary hover:bg-muted/50 hover:shadow-md cursor-pointer opacity-0 animate-fade-in",
                    `stagger-${index + 1}`
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.title}</p>
                    <p className="text-sm text-muted-foreground">{report.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
