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
import { useBackend } from "./synced-store"

export default function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const state = useBackend()

  const renderContent = () => {
    if (currentPage === "home") {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-2">$45,231.89</h3>
                  <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Creators</p>
                  <h3 className="text-2xl font-bold mt-2">2,350</h3>
                  <p className="text-xs text-muted-foreground mt-1">+180 from last month</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                  <h3 className="text-2xl font-bold mt-2">$12,234.00</h3>
                  <p className="text-xs text-muted-foreground mt-1">+19% from last month</p>
                </div>
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
      return (
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="rounded-xl border bg-card">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Creators</h2>
              <div className="space-y-4">
                {state.channels.length === 0 ? (
                  <p className="text-muted-foreground">No creators found.</p>
                ) : (
                  <div className="space-y-3">
                    {state.channels.map((creator) => (
                      <div
                        key={creator.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{creator.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {creator.description}
                          </p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-sm text-muted-foreground">
                              {creator.payment_email}
                            </span>
                            <a
                              href={creator.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              View Channel
                            </a>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {creator.id}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
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
