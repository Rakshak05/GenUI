import { z } from "zod";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const PieChartProps = z.object({
  title: z.string().optional().describe("Chart title"),
  data: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        color: z.string().optional(),
      })
    )
    .describe("Chart data"),
  innerRadius: z.number().optional().describe("Inner radius for donut chart"),
});

type PieChartPropsType = z.infer<typeof PieChartProps>;

const DEFAULT_COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#6366f1", // Indigo
];

export function PieChart({ title, data = [], innerRadius = 40 }: PieChartPropsType) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-md">
      {title && (
        <div className="font-bold text-gray-800 text-lg mb-4 tracking-tight border-b border-gray-50 pb-2">
          {title}
        </div>
      )}
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={75}
              paddingAngle={3}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                border: "1px solid #f3f4f6",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
