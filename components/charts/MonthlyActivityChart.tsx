import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface MonthlyActivityProps {
  data: Array<{
    month: string
    booksAdded: number
    reviews: number
    usersJoined: number
  }>
}

const MonthlyActivityChart = ({ data }: MonthlyActivityProps) => {
  const chartConfig = {
    booksAdded: {
      label: "Books Added",
      color: "hsl(var(--chart-1))",
    },
    reviews: {
      label: "Reviews",
      color: "hsl(var(--chart-2))",
    },
    usersJoined: {
      label: "Users Joined",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Activity</CardTitle>
        <CardDescription>Platform activity across different metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={false}
              />
              <Bar
                dataKey="booksAdded"
                fill="var(--color-booksAdded)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="reviews"
                fill="var(--color-reviews)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="usersJoined"
                fill="var(--color-usersJoined)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MonthlyActivityChart
