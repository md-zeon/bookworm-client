import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface BooksByGenreProps {
  data: Array<{
    genre: string
    count: number
    color: string
  }>
}

const BooksByGenreChart = ({ data }: BooksByGenreProps) => {
  const chartConfig = {
    count: {
      label: "Books",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Books by Genre</CardTitle>
        <CardDescription>Distribution of books across different genres</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={false}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default BooksByGenreChart
