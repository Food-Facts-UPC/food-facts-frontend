import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
        <div className="container mx-auto flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-6xl font-extrabold mb-4">
            Bienvenido a <span className="text-green-600">Food Facts</span>
          </h1>
          <p className="text-2xl mb-10 text-gray-600">
            Tu guía definitiva para una alimentación consciente y saludable.
          </p>

          <div className="w-full max-w-2xl transform hover:scale-105 transition-transform duration-300">
            <form action="/search" method="GET">
              <div className="flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <input
                  type="text"
                  name="query"
                  placeholder='Busca un alimento (ej. "leche de almendras")'
                  className="w-full px-8 py-5 text-xl text-gray-700 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-8 py-5 font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-300"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          <div className="mt-16">
            <Link href="/restaurants" className="text-xl text-green-600 hover:underline transition-colors duration-300">
              O explora restaurantes saludables en el mapa
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
