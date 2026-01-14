import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface UserGrowthProps {
  data: Array<{
    month: string
    users: number
    newUsers: number
  }>
}

const UserGrowthChart = ({ data }: UserGrowthProps) => {
  const chartConfig = {
    users: {
      label: "Total Users",
      color: "hsl(var(--chart-1))",
    },
    newUsers: {
      label: "New Users",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Monthly user growth trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={false}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="var(--color-users)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="var(--color-newUsers)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default UserGrowthChart
