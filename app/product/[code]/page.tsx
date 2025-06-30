
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

// Tipos para los datos del producto
interface ProductDetails {
  code: string;
  product_name: string;
  image_url: string;
  ingredients_text_es: string;
  nutriments: {
    [key: string]: string | number;
  };
  nutriscore_grade: string;
}

// Función para obtener los detalles de un producto
async function getProductDetails(code: string): Promise<ProductDetails | null> {
  if (!code) return null;

  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
    if (response.data.status === 1) {
      return response.data.product as ProductDetails;
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }

  return null;
}

// Mapeo de nutrientes a nombres legibles
const nutrientMapping: { [key: string]: string } = {
  'energy-kcal_100g': 'Calorías (kcal)',
  'fat_100g': 'Grasas (g)',
  'saturated-fat_100g': 'Grasas Saturadas (g)',
  'carbohydrates_100g': 'Carbohidratos (g)',
  'sugars_100g': 'Azúcares (g)',
  'fiber_100g': 'Fibra (g)',
  'proteins_100g': 'Proteínas (g)',
  'salt_100g': 'Sal (g)',
};

export default async function ProductPage({ params }: { params: { code: string } }) {
  const product = await getProductDetails(params.code);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <Link href="/" className="text-green-600 hover:underline mt-4 block">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Food Facts
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna de la Imagen */}
            <div className="flex justify-center items-center">
              <Image
                src={product.image_url || '/placeholder.png'} // Usar un placeholder si no hay imagen
                alt={product.product_name}
                width={400}
                height={400}
                objectFit="contain"
              />
            </div>

            {/* Columna de la Información */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.product_name}</h1>
              
              {/* Nutri-Score */}
              {product.nutriscore_grade && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Nutri-Score</h2>
                  <span className={`text-3xl font-bold uppercase text-${product.nutriscore_grade === 'a' ? 'green' : 'yellow'}-500`}>
                    {product.nutriscore_grade}
                  </span>
                </div>
              )}

              {/* Ingredientes */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Ingredientes</h2>
                <p className="text-gray-700">{product.ingredients_text_es || 'No disponible'}</p>
              </div>

              {/* Tabla Nutricional */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Información Nutricional (por 100g)</h2>
                <ul className="divide-y divide-gray-200">
                  {Object.entries(nutrientMapping).map(([key, name]) => (
                    product.nutriments[key] && (
                      <li key={key} className="py-2 flex justify-between">
                        <span>{name}</span>
                        <span className="font-medium">{product.nutriments[key]}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
