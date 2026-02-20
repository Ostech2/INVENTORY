import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { HostelOverview } from "@/components/dashboard/HostelOverview";
import { InventoryChart, CategoryChart } from "@/components/dashboard/InventoryCharts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Package, Building2, Users, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { profile, role } = useAuth();

  const getWelcomeMessage = () => {
    if (role === "warden" && profile?.gender) {
      const wardenType = profile.gender === "male" ? "Male Warden" : "Female Warden";
      return `Welcome back, ${profile?.full_name || "Warden"} (${wardenType})`;
    }
    return `Welcome back, ${profile?.full_name || "User"}`;
  };

  return (
    <AppLayout>
      <AppHeader 
        title="Dashboard" 
        subtitle={getWelcomeMessage()}
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="opacity-0 animate-fade-in stagger-1">
            <StatCard
              title="Total Items"
              value="1,847"
              change={{ value: "+12.5% from last month", type: "increase" }}
              icon={Package}
              iconColor="primary"
            />
          </div>
          <div className="opacity-0 animate-fade-in stagger-2">
            <StatCard
              title="Active Hostels"
              value="8"
              change={{ value: "2 new this semester", type: "neutral" }}
              icon={Building2}
              iconColor="info"
            />
          </div>
          <div className="opacity-0 animate-fade-in stagger-3">
            <StatCard
              title="Allocated Items"
              value="1,523"
              change={{ value: "+8.3% allocation rate", type: "increase" }}
              icon={Users}
              iconColor="success"
            />
          </div>
          <div className="opacity-0 animate-fade-in stagger-4">
            <StatCard
              title="Items Need Attention"
              value="24"
              change={{ value: "3 urgent repairs", type: "decrease" }}
              icon={AlertTriangle}
              iconColor="warning"
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <InventoryChart />
          </div>
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CategoryChart />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <QuickActions />
          </div>
          <div className="lg:col-span-1 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <HostelOverview />
          </div>
          <div className="lg:col-span-1 opacity-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <RecentActivity />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
