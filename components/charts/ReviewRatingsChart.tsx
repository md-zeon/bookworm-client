import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface ReviewRatingsProps {
  data: Array<{
    rating: string
    count: number
    percentage: number
  }>
}

const ReviewRatingsChart = ({ data }: ReviewRatingsProps) => {
  const chartConfig = {
    count: {
      label: "Reviews",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Ratings Distribution</CardTitle>
        <CardDescription>Breakdown of user ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={false}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ReviewRatingsChart
