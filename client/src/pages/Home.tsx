import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { PetGrid } from "@/components/PetGrid";
import { AdoptionSteps } from "@/components/AdoptionSteps";
import { Tips } from "@/components/Tips";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 text-primary">
                🦴
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-lg inline-block px-8 py-4 mb-6">
              <h1 className="text-2xl font-semibold mb-2">
                Adopta una mascota
              </h1>
              <p className="text-sm text-gray-600 max-w-xl">
                Dale una segunda oportunidad a un amigo peludo.
              </p>
            </div>
            <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90">
              Conocer más
            </Button>
          </div>
        </section>

        {/* Pets Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-center mb-2">
              Busca tu amigo
            </h2>
            <p className="text-sm text-center text-gray-500 mb-8">
              #Encontramos a nuestro listado de mascotas en toda España
            </p>
            <PetGrid />
          </div>
        </section>

        {/* Adoption Steps */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <AdoptionSteps />
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-center mb-2">Tips</h2>
            <p className="text-sm text-center text-gray-500 mb-8">
              Feliz y Saludable ♥
            </p>
            <Tips />
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">¿Tienes preguntas?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Registra tu correo para recibir las últimas actualizaciones
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="sm" className="rounded-full">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t text-sm text-gray-500 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2024 PetMatch. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}