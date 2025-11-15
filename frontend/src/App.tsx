import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useBackend } from "./synced-store"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const chartData = [
  { month: 'Jan', views: 8.2, cost: 1.52 },
  { month: 'Feb', views: 9.8, cost: 1.48 },
  { month: 'Mar', views: 11.2, cost: 1.45 },
  { month: 'Apr', views: 12.9, cost: 1.43 },
  { month: 'May', views: 15.9, cost: 1.40 },
  { month: 'Jun', views: 22.2, cost: 1.42 },
]

export default function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const state = useBackend()

  const renderContent = () => {
    if (currentPage === "home") {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <h3 className="text-2xl font-bold mt-2">85.2M</h3>
                  <p className="text-xs text-muted-foreground mt-1">+18.3% from last month</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Creators</p>
                  <h3 className="text-2xl font-bold mt-2">103</h3>
                  <p className="text-xs text-muted-foreground mt-1">+8 from last month</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Cost per 1K Views</p>
                  <h3 className="text-2xl font-bold mt-2">$1.42</h3>
                  <p className="text-xs text-muted-foreground mt-1">-$0.08 from last month</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                  <h3 className="text-2xl font-bold mt-2">$121,084.00</h3>
                  <p className="text-xs text-muted-foreground mt-1">+18% from last month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Views Chart */}
            <div className="rounded-xl border bg-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [`${value}M views`, 'Views']}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      dot={{ fill: '#a855f7', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost per 1K Views Chart */}
            <div className="rounded-xl border bg-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Avg Cost per 1K Views</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                      domain={[1.35, 1.55]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost per 1K']}
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCost)"
                      dot={{ fill: '#a855f7', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border bg-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Payment processed for Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                  <span className="text-sm font-medium">$1,234.00</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">New creator onboarded: Mike Chen</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Creator ID: #3421</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Payment processed for Emma Davis</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                  <span className="text-sm font-medium">$856.50</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Monthly report generated</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                  <span className="text-sm text-muted-foreground">View Report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (currentPage === "creators") {
      // Mock monthly views for each creator (based on their ID)
      const getMonthlyViews = (creatorId: string) => {
        // Simple hash function to generate consistent mock data
        const hash = creatorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return Math.floor((hash % 50) * 1000 + 10000) // Between 10K-60K views
      }

      // Mock payment amount based on views
      const getPaymentAmount = (creatorId: string) => {
        const views = getMonthlyViews(creatorId)
        const paymentPerView = 0.05 // $0.05 per view
        return views * paymentPerView
      }

      // Generate profile image URL based on creator name
      const getProfileImage = (name: string) => {
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1`
      }

      return (
        <div className="flex flex-1 flex-col gap-6 p-8">
          <h2 className="text-2xl font-bold">Your Creator Fleet</h2>
          {state.channels.length === 0 ? (
            <p className="text-muted-foreground">No creators found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">This Month</TableHead>
                  <TableHead className="text-right">To Be Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.channels.map((creator) => {
                  const monthlyViews = getMonthlyViews(creator.id)
                  const paymentAmount = getPaymentAmount(creator.id)
                  const profileImage = getProfileImage(creator.name)
                  return (
                    <TableRow key={creator.id}>
                      <TableCell className="py-4">
                        <img
                          src={profileImage}
                          alt={creator.name}
                          className="w-8 h-8 rounded-full"
                        />
                      </TableCell>
                      <TableCell className="font-semibold py-4">{creator.name}</TableCell>
                      <TableCell className="text-muted-foreground py-4">{creator.payment_email}</TableCell>
                      <TableCell className="py-4">
                        <a
                          href={creator.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Channel
                        </a>
                      </TableCell>
                      <TableCell className="text-right font-medium py-4">
                        {monthlyViews.toLocaleString()} views
                      </TableCell>
                      <TableCell className="text-right font-medium py-4">
                        ${paymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      )
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">{currentPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {renderContent()}
      </SidebarInset>
    </SidebarProvider>
  )
}
