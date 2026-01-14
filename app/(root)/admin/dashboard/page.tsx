"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  BookOpen,
  MessageSquareQuote,
  Tags,
  TrendingUp,
  TrendingDown,
  Calendar,
  Star,
  Eye,
  Clock
} from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import BooksByGenreChart from "@/components/charts/BooksByGenreChart"
import UserGrowthChart from "@/components/charts/UserGrowthChart"
import ReviewRatingsChart from "@/components/charts/ReviewRatingsChart"
import MonthlyActivityChart from "@/components/charts/MonthlyActivityChart"

interface DashboardStats {
  totalUsers: number
  totalBooks: number
  totalReviews: number
  totalGenres: number
  activeUsers: number
  newUsersThisMonth: number
  newBooksThisMonth: number
  averageRating: number
  pendingReviews: number
}

interface RecentActivity {
  id: string
  type: 'user' | 'book' | 'review'
  title: string
  description: string
  time: string
  status?: 'pending' | 'approved' | 'rejected'
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch stats (you'll need to create these API endpoints)
        const statsResponse = await api.books.getAll()
        // For now, mock data until API endpoints are created
        setStats({
          totalUsers: 1247,
          totalBooks: 8562,
          totalReviews: 15642,
          totalGenres: 42,
          activeUsers: 892,
          newUsersThisMonth: 156,
          newBooksThisMonth: 89,
          averageRating: 4.2,
          pendingReviews: 23
        })

        // Mock recent activity
        setRecentActivity([
          {
            id: '1',
            type: 'user',
            title: 'New User Registration',
            description: 'Sarah Johnson joined Bookworm',
            time: '2 minutes ago',
            status: 'approved'
          },
          {
            id: '2',
            type: 'book',
            title: 'Book Added',
            description: 'The Midnight Library added to Fiction',
            time: '15 minutes ago',
            status: 'approved'
          },
          {
            id: '3',
            type: 'review',
            title: 'Review Pending',
            description: 'John Doe reviewed "Atomic Habits"',
            time: '32 minutes ago',
            status: 'pending'
          },
          {
            id: '4',
            type: 'book',
            title: 'Book Updated',
            description: 'Cover image updated for "Dune"',
            time: '1 hour ago',
            status: 'approved'
          },
          {
            id: '5',
            type: 'review',
            title: 'Review Approved',
            description: 'Review for "The Alchemist" approved',
            time: '2 hours ago',
            status: 'approved'
          }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newUsersThisMonth} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBooks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newBooksThisMonth} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquareQuote className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReviews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg. rating: {stats?.averageRating}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Need moderation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 col-span-7">
          <BooksByGenreChart
            data={[
              { genre: "Fiction", count: 1200, color: "#8884d8" },
              { genre: "Non-Fiction", count: 800, color: "#82ca9d" },
              { genre: "Mystery", count: 600, color: "#ffc658" },
              { genre: "Sci-Fi", count: 400, color: "#ff7300" },
              { genre: "Romance", count: 300, color: "#0088fe" },
              { genre: "Biography", count: 200, color: "#00c49f" }
            ]}
          />
          <UserGrowthChart
            data={[
              { month: "Jan", users: 1000, newUsers: 50 },
              { month: "Feb", users: 1050, newUsers: 60 },
              { month: "Mar", users: 1110, newUsers: 75 },
              { month: "Apr", users: 1185, newUsers: 80 },
              { month: "May", users: 1265, newUsers: 90 },
              { month: "Jun", users: 1355, newUsers: 100 }
            ]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 col-span-7">
          <ReviewRatingsChart
            data={[
              { rating: "5★", count: 6500, percentage: 42 },
              { rating: "4★", count: 4200, percentage: 27 },
              { rating: "3★", count: 2800, percentage: 18 },
              { rating: "2★", count: 1200, percentage: 8 },
              { rating: "1★", count: 742, percentage: 5 }
            ]}
          />
          <MonthlyActivityChart
            data={[
              { month: "Jan", booksAdded: 89, reviews: 1200, usersJoined: 156 },
              { month: "Feb", booksAdded: 75, reviews: 1100, usersJoined: 142 },
              { month: "Mar", booksAdded: 92, reviews: 1350, usersJoined: 178 },
              { month: "Apr", booksAdded: 68, reviews: 1050, usersJoined: 135 },
              { month: "May", booksAdded: 105, reviews: 1420, usersJoined: 190 },
              { month: "Jun", booksAdded: 83, reviews: 1180, usersJoined: 162 }
            ]}
          />
        </div>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'book' ? 'bg-green-100 text-green-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                    {activity.type === 'user' && <Users className="h-4 w-4" />}
                    {activity.type === 'book' && <BookOpen className="h-4 w-4" />}
                    {activity.type === 'review' && <MessageSquareQuote className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={
                      activity.status === 'pending' ? 'secondary' :
                        activity.status === 'approved' ? 'default' : 'destructive'
                    }>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </main>
  )
}
