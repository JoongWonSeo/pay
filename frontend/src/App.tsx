import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useBackend } from "./synced-store";

const chartData = [
  { month: "Jan", views: 8.2, cost: 1.52 },
  { month: "Feb", views: 9.8, cost: 1.48 },
  { month: "Mar", views: 11.2, cost: 1.45 },
  { month: "Apr", views: 12.9, cost: 1.43 },
  { month: "May", views: 15.9, cost: 1.4 },
  { month: "Jun", views: 22.2, cost: 1.42 },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null
  );
  const state = useBackend();

  const renderContent = () => {
    if (currentPage === "home") {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Views
                  </p>
                  <h3 className="text-2xl font-bold mt-2">85.2M</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    +18.3% from last month
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Creators
                  </p>
                  <h3 className="text-2xl font-bold mt-2">103</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    +8 from last month
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Cost per 1K Views
                  </p>
                  <h3 className="text-2xl font-bold mt-2">$1.42</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    -$0.08 from last month
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Payouts
                  </p>
                  <h3 className="text-2xl font-bold mt-2">$121,084.00</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    +18% from last month
                  </p>
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
                      <linearGradient
                        id="colorViews"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#a855f7"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#a855f7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
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
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => [
                        `${value}M views`,
                        "Views",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      dot={{ fill: "#a855f7", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost per 1K Views Chart */}
            <div className="rounded-xl border bg-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Avg Cost per 1K Views
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorCost"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#a855f7"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#a855f7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
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
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => [
                        `$${value.toFixed(2)}`,
                        "Cost per 1K",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCost)"
                      dot={{ fill: "#a855f7", strokeWidth: 2, r: 3 }}
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
                    <p className="font-medium">
                      Payment processed for Sarah Johnson
                    </p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                  <span className="text-sm font-medium">$1,234.00</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">
                      New creator onboarded: Mike Chen
                    </p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Creator ID: #3421
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">
                      Payment processed for Emma Davis
                    </p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                  <span className="text-sm font-medium">$856.50</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Monthly report generated</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    View Report
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === "creators") {
      // Mock monthly views for each creator (based on their ID)
      const getMonthlyViews = (creatorId: string) => {
        // Simple hash function to generate consistent mock data
        const hash = creatorId
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return Math.floor((hash % 50) * 1000 + 10000); // Between 10K-60K views
      };

      // Mock payment amount based on views
      const getPaymentAmount = (creatorId: string) => {
        const views = getMonthlyViews(creatorId);
        const paymentPerView = 0.05; // $0.05 per view
        return views * paymentPerView;
      };

      // If a channel is selected, show the channel detail page
      if (selectedChannelId) {
        const selectedChannel = state.channels.find(
          (c) => c.id === selectedChannelId
        );
        if (!selectedChannel) {
          setSelectedChannelId(null);
          return null;
        }

        // Filter posts for this channel (for now, show all posts as mock data)
        const channelPosts = state.posts;

        return (
          <div className="flex flex-1 flex-col gap-6 p-8">
            {/* Channel Header */}
            <div className="flex items-start gap-6 pb-6 border-b">
              <img
                src={selectedChannel.avatar_url}
                alt={selectedChannel.nickname}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {selectedChannel.nickname}
                </h1>
                <p className="text-lg text-muted-foreground mb-3">
                  @{selectedChannel.handle}
                </p>
                <p className="text-muted-foreground">
                  {selectedChannel.description}
                </p>
              </div>
            </div>

            {/* Posts */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Posts</h2>
              {channelPosts.length === 0 ? (
                <p className="text-muted-foreground">No posts found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {channelPosts.map((post) => {
                    // Calculate impact score based on play count (0-100 scale)
                    const impactScore = Math.min(
                      100,
                      Math.floor((post.stats.play_count / 1000) * 10)
                    );
                    const getImpactColor = (score: number) => {
                      if (score >= 80) return "text-green-600";
                      if (score >= 50) return "text-yellow-600";
                      return "text-red-600";
                    };

                    return (
                      <div
                        key={post.id}
                        className="rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {/* Cover Image */}
                        <div className="aspect-[4/5] bg-muted relative">
                          <img
                            src={post.dynamic_cover_url}
                            alt="Post cover"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-white/70">
                                Impact
                              </span>
                              <span
                                className={`text-sm font-bold ${getImpactColor(
                                  impactScore
                                ).replace("text-", "text-white ")}`}
                              >
                                {impactScore}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                          {/* Stats - Compact with Icons */}
                          <div className="flex flex-wrap gap-2 mb-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span className="font-medium">
                                {post.stats.play_count.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span className="font-medium">
                                {post.stats.like_count.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span className="font-medium">
                                {post.stats.comment_count.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="w-3 h-3" />
                              <span className="font-medium">
                                {post.stats.share_count.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>
                              {new Date(post.date_posted).toLocaleDateString()}
                            </span>
                            {post.url && (
                              <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-1 flex-col gap-6 p-8">
          <h2 className="text-2xl font-bold">Your Creator Fleet</h2>
          {state.channels.length === 0 ? (
            <p className="text-muted-foreground">No creators found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.channels.map((creator) => {
                const monthlyViews = getMonthlyViews(creator.id);
                const paymentAmount = getPaymentAmount(creator.id);
                return (
                  <div
                    key={creator.id}
                    onClick={() => setSelectedChannelId(creator.id)}
                    className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={creator.avatar_url}
                        alt={creator.nickname}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {creator.nickname}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          @{creator.handle}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {creator.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Followers</p>
                        <p className="font-semibold">
                          {creator.stats.follower_count.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Videos</p>
                        <p className="font-semibold">
                          {creator.stats.video_count.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hearts</p>
                        <p className="font-semibold">
                          {creator.stats.heart_count.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Following</p>
                        <p className="font-semibold">
                          {creator.stats.following_count.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          This Month
                        </span>
                        <span className="font-medium">
                          {monthlyViews.toLocaleString()} views
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          To Be Paid
                        </span>
                        <span className="font-bold text-lg">
                          $
                          {paymentAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
  };

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
              {currentPage === "creators" && selectedChannelId ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => setSelectedChannelId(null)}
                      className="cursor-pointer"
                    >
                      Creators
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {state.channels.find((c) => c.id === selectedChannelId)
                        ?.nickname || "Channel"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {currentPage}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {renderContent()}
      </SidebarInset>
    </SidebarProvider>
  );
}
