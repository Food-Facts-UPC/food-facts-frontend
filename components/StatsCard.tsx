import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconColor, 
  trend 
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500">vs último mes</span>
              </div>
            )}
          </div>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
}
