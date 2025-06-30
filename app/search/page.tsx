import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

// Definimos un tipo para los productos que recibimos de la API
interface Product {
  code: string;
  product_name: string;
  image_url: string;
}

// Función para buscar productos en la API de Open Food Facts
async function searchProducts(query: string): Promise<Product[]> {
  if (!query) return [];

  try {
    const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
      params: {
        search_terms: query,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 20, // Traemos hasta 20 resultados
      }
    });

    if (response.data.products) {
      return response.data.products.filter((p: any) => p.code && p.product_name && p.image_url);
    }
  } catch (error) {
    console.error("Error fetching data from Open Food Facts:", error);
  }

  return [];
}

export default async function SearchPage({ searchParams }: { searchParams: { query: string } }) {
  const query = searchParams.query || '';
  const products = await searchProducts(query);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
      <header className="bg-white shadow-lg p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-green-600">
            Food Facts
          </Link>
          {/* Formulario de Búsqueda en el Header */}
          <div className="w-full max-w-md">
            <form action="/search" method="GET">
              <div className="flex items-center bg-gray-100 rounded-full shadow-inner">
                <input
                  type="text"
                  name="query"
                  defaultValue={query}
                  placeholder="Busca otro alimento..."
                  className="w-full px-6 py-3 text-lg text-gray-700 bg-transparent rounded-full focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none transition-colors duration-300"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {query && products.length > 0 && (
          <div>
            <h1 className="text-4xl font-bold mb-8">Resultados para "{query}"</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link key={product.code} href={`/product/${product.code}`}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group">
                    <div className="relative h-56 w-full">
                      <Image
                        src={product.image_url}
                        alt={product.product_name}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:opacity-90 transition-opacity duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-xl truncate group-hover:text-green-600 transition-colors duration-300">{product.product_name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {query && products.length === 0 && (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">No se encontraron resultados para "{query}"</h1>
            <p className="text-xl text-gray-600">Intenta con otra búsqueda o verifica la ortografía.</p>
          </div>
        )}

        {!query && (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Realiza una búsqueda</h1>
            <p className="text-xl text-gray-600">Introduce un término en la barra de búsqueda para empezar.</p>
          </div>
        )}
      </main>
    </div>
  );
}
