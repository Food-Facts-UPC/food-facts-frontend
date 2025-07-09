"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Info, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: {
    code: string;
    product_name: string;
    brands?: string;
    image_url?: string;
    nutrition_grade_fr?: string;
    nutriments?: {
      energy_100g?: number;
      proteins_100g?: number;
      carbohydrates_100g?: number;
      fat_100g?: number;
    };
  };
  isFavorite?: boolean;
  onToggleFavorite?: (code: string) => void;
}

export default function ProductCard({ product, isFavorite = false, onToggleFavorite }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const getNutritionGradeColor = (grade?: string) => {
    switch (grade?.toLowerCase()) {
      case 'a': return 'bg-green-500';
      case 'b': return 'bg-light-green-500';
      case 'c': return 'bg-yellow-500';
      case 'd': return 'bg-orange-500';
      case 'e': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getNutritionGradeText = (grade?: string) => {
    switch (grade?.toLowerCase()) {
      case 'a': return 'Excelente';
      case 'b': return 'Bueno';
      case 'c': return 'Regular';
      case 'd': return 'Malo';
      case 'e': return 'Muy Malo';
      default: return 'Sin calificación';
    }
  };

  const formatEnergy = (energy?: number) => {
    if (!energy) return 'N/A';
    return `${Math.round(energy)} kcal/100g`;
  };

  return (
    <Card className="group hover-lift overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {product.product_name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
            onClick={() => onToggleFavorite(product.code)}
          >
            <Heart 
              className={`w-5 h-5 transition-colors duration-200 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'
              }`} 
            />
          </Button>
        )}

        {/* Nutrition Grade Badge */}
        {product.nutrition_grade_fr && (
          <div className="absolute bottom-2 left-2">
            <div className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getNutritionGradeColor(product.nutrition_grade_fr)}`}>
              {product.nutrition_grade_fr.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
          {product.product_name}
        </CardTitle>
        {product.brands && (
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            {product.brands}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pb-4">
        {/* Nutrition Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatEnergy(product.nutriments?.energy_100g)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Energía</div>
          </div>
          <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
            <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
              {product.nutriments?.proteins_100g ? `${product.nutriments.proteins_100g}g` : 'N/A'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Proteínas</div>
          </div>
        </div>

        {/* Nutrition Grade Description */}
        {product.nutrition_grade_fr && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Calificación: {getNutritionGradeText(product.nutrition_grade_fr)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Link href={`/restaurant/${product.code}`} className="flex-1">
            <Button variant="outline" className="w-full group/btn">
              <Info className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
              Ver Detalles
            </Button>
          </Link>
          <Button variant="gradient" size="icon" className="flex-shrink-0">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 