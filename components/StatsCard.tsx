import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export default function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800',
          bg: 'bg-emerald-50/50 dark:bg-emerald-900/10'
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          border: 'border-yellow-200 dark:border-yellow-800',
          bg: 'bg-yellow-50/50 dark:bg-yellow-900/10'
        };
      case 'danger':
        return {
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
          bg: 'bg-red-50/50 dark:bg-red-900/10'
        };
      default:
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
          bg: 'bg-blue-50/50 dark:bg-blue-900/10'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={`group hover-lift border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 ${styles.border} ${styles.bg}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </CardDescription>
            )}
          </div>
          <div className={`w-12 h-12 ${styles.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </span>
            {trend && (
              <span className={`text-sm font-medium ${
                trend.isPositive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          
          {trend && (
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                trend.isPositive 
                  ? 'bg-emerald-500' 
                  : 'bg-red-500'
              }`} />
              <span className={`text-xs ${
                trend.isPositive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {trend.isPositive ? 'Aumento' : 'Disminución'} desde el mes pasado
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
