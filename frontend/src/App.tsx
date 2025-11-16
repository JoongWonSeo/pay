import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { backend, useBackend } from "./synced-store";

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
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const state = useBackend();

  console.log("Backend state:", state);

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

      // If a post is selected, show the post detail page
      if (selectedPostId && selectedChannelId) {
        const selectedChannel = state.channels.find(
          (c) => c.id === selectedChannelId
        );
        const channelPosts = state.postsByChannelId[selectedChannelId] || [];
        const selectedPost = channelPosts.find((p) => p.id === selectedPostId);
        // @ts-expect-error - postEvaluations will be available after type regeneration
        const evaluation = state.postEvaluations?.[selectedPostId];

        if (!selectedPost || !selectedChannel) {
          setSelectedPostId(null);
          return null;
        }

        // Calculate impact score
        const impactScore = Math.min(
          100,
          Math.floor((selectedPost.stats.play_count / 1000) * 10)
        );

        // Get payout history for this post
        // @ts-expect-error - using snake_case to match runtime data
        const payouts = state.postPayouts?.[selectedPostId] || [];
        const latestPayout = payouts[0]; // Get the most recent payout
        // @ts-expect-error - using snake_case to match runtime data
        const chatHistory =
          latestPayout?.chat_between_agent_and_creator?.chat_history || [];

        return (
          <div className="flex flex-1 gap-6 p-8">
            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Post Header */}
              <div className="flex items-start gap-6 pb-6">
                <img
                  src={selectedPost.dynamic_cover_url}
                  alt="Post thumbnail"
                  className="w-64 h-80 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">Post Details</h1>
                  <p className="text-sm text-muted-foreground mb-4">
                    ID: {selectedPost.id}
                  </p>
                  <p className="text-muted-foreground mb-4">
                    {selectedPost.description}
                  </p>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground mb-6">
                    <span>
                      Posted on{" "}
                      {new Date(selectedPost.date_posted).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                    {selectedPost.url && (
                      <>
                        <span>•</span>
                        <a
                          href={selectedPost.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View on TikTok
                        </a>
                      </>
                    )}
                  </div>

                  {/* Performance Stats - Minimal */}
                  <div className="flex gap-6 text-sm mb-4">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedPost.stats.play_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedPost.stats.like_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedPost.stats.comment_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedPost.stats.share_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="font-medium">{impactScore}%</span>
                    </div>
                  </div>

                  {/* Payment Info - Compact */}
                  <div className="flex gap-4 items-center">
                    {latestPayout ? (
                      <div className="rounded-lg border bg-card p-4 inline-block">
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Payment
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          $
                          {latestPayout.determined_final_payout.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg border bg-card p-4 inline-block">
                        <p className="text-sm text-muted-foreground mb-2">
                          Ready to evaluate and process payment
                        </p>
                        <Button
                          onClick={() => {
                            toast.info("Evaluating and processing payment...");
                            backend.evaluateAndPayForPost({
                              channelId: selectedChannelId,
                              postId: selectedPostId,
                            });
                          }}
                          size="lg"
                          className="w-full text-black"
                        >
                          Evaluate & Pay
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* AI Analysis */}
              <div>
                <h2 className="text-2xl font-bold mb-4">AI Analysis</h2>
                {evaluation ? (
                  <div className="space-y-6">
                    {/* Main Layout: Left Bar + Right Column */}
                    <div className="flex gap-6">
                      {/* Left: Content Evaluation Bar */}
                      <div className="w-64 shrink-0 space-y-3">
                        <h3 className="text-lg font-semibold mb-3">
                          Content Evaluation
                        </h3>
                        <div className="p-3 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">
                            Post Type
                          </p>
                          <p className="font-semibold capitalize">
                            {evaluation.post_type || "N/A"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">
                            Product Mentioned
                          </p>
                          <p className="font-semibold">
                            {evaluation.product_mentioned ? "Yes" : "No"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">
                            Product Prominence
                          </p>
                          <p className="font-semibold capitalize">
                            {evaluation.prominence_of_product || "N/A"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">
                            Target Fit
                          </p>
                          <p className="font-semibold capitalize">
                            {evaluation.target_group_fit || "N/A"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">
                            Estimated CTR
                          </p>
                          <p className="font-semibold">
                            {evaluation.estimated_ctr
                              ? `${evaluation.estimated_ctr.toFixed(2)}%`
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Right: Reasoning Column */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-3">
                          Evaluation Reasoning
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {evaluation.evaluation_text ||
                            "No evaluation text available."}
                        </p>
                      </div>
                    </div>

                    {/* Bottom: Payment Breakdown */}
                    {latestPayout && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Payment Calculation Breakdown
                        </h3>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="p-3 text-muted-foreground">
                                  Price per 1K Views
                                </td>
                                <td className="p-3 text-right font-semibold">
                                  $
                                  {latestPayout.determined_price_per_1k?.toFixed(
                                    2
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="p-3 text-muted-foreground">
                                  Number of Views (
                                  {selectedPost.stats.play_count.toLocaleString()}
                                  )
                                </td>
                                <td className="p-3 text-right font-semibold">
                                  ×
                                  {(
                                    selectedPost.stats.play_count / 1000
                                  ).toFixed(1)}
                                  K
                                </td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="p-3 font-medium">Base Payout</td>
                                <td className="p-3 text-right font-bold">
                                  $
                                  {latestPayout.determined_base_payout?.toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </td>
                              </tr>
                              {latestPayout.determined_bonus &&
                                latestPayout.determined_bonus > 0 && (
                                  <tr className="bg-green-50/50 dark:bg-green-950/20">
                                    <td className="p-3 text-muted-foreground">
                                      Bonus{" "}
                                      {latestPayout.bonus_reason &&
                                        `(${latestPayout.bonus_reason})`}
                                    </td>
                                    <td className="p-3 text-right font-semibold text-green-600">
                                      +$
                                      {latestPayout.determined_bonus.toFixed(2)}
                                    </td>
                                  </tr>
                                )}
                              {latestPayout.determined_penalty &&
                                latestPayout.determined_penalty > 0 && (
                                  <tr className="bg-red-50/50 dark:bg-red-950/20">
                                    <td className="p-3 text-muted-foreground">
                                      Penalty{" "}
                                      {latestPayout.penalty_reason &&
                                        `(${latestPayout.penalty_reason})`}
                                    </td>
                                    <td className="p-3 text-right font-semibold text-red-600">
                                      -$
                                      {latestPayout.determined_penalty.toFixed(
                                        2
                                      )}
                                    </td>
                                  </tr>
                                )}
                              <tr className="border-t-2 border-primary/20 bg-primary/10">
                                <td className="p-3 font-bold text-lg">
                                  Final Payout
                                </td>
                                <td className="p-3 text-right font-bold text-lg text-primary">
                                  $
                                  {latestPayout.determined_final_payout?.toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Impact Score Reasoning
                      </h3>
                      <p className="text-muted-foreground italic">
                        Analysis coming soon...
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Payment Calculation
                      </h3>
                      <p className="text-muted-foreground italic">
                        Analysis coming soon...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Chat Sidebar */}
            <div className="w-80 shrink-0">
              <div className="sticky top-8">
                <div className="rounded-xl border bg-card">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Agent Chat History</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Conversation between AI and creator
                    </p>
                  </div>
                  <div className="p-4 space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {chatHistory.length > 0 ? (
                      chatHistory.map((message: any, index: number) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            message.role === "payout_agent"
                              ? "bg-primary/10 ml-2"
                              : "bg-muted mr-2"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold">
                              {message.role === "payout_agent"
                                ? "AI Agent"
                                : "Creator"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic text-center py-8">
                        No chat history available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // If a channel is selected, show the channel detail page
      if (selectedChannelId) {
        const selectedChannel = state.channels.find(
          (c) => c.id === selectedChannelId
        );
        if (!selectedChannel) {
          setSelectedChannelId(null);
          return null;
        }

        // Get posts for this specific channel
        const channelPosts = state.postsByChannelId[selectedChannelId] || [];

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
                        onClick={() => setSelectedPostId(post.id)}
                        className="rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
              {currentPage === "creators" &&
              selectedChannelId &&
              selectedPostId ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => {
                        setSelectedChannelId(null);
                        setSelectedPostId(null);
                      }}
                      className="cursor-pointer"
                    >
                      Creators
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => setSelectedPostId(null)}
                      className="cursor-pointer"
                    >
                      {state.channels.find((c) => c.id === selectedChannelId)
                        ?.nickname || "Channel"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Post Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : currentPage === "creators" && selectedChannelId ? (
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
