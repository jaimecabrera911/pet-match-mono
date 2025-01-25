import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { PetGrid } from "@/components/PetGrid";
import { AdoptionSteps } from "@/components/AdoptionSteps";
import { Tips } from "@/components/Tips";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 rounded-full p-4">
                <div className="w-12 h-12 text-primary">
                  🦴
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Adopta una mascota
            </h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Dale una segunda oportunidad a un amigo peludo. Encuentra tu compañero perfecto entre nuestros adorables animales en adopción.
            </p>
            <Button size="lg" className="rounded-full px-8">
              Conocer mascotas
            </Button>
          </div>
        </section>

        {/* Pets Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">
              Busca tu amigo
            </h2>
            <p className="text-center text-gray-600 mb-12">
              #Encontramos a nuestro listado de mascotas en toda España
            </p>
            <PetGrid />
          </div>
        </section>

        {/* Adoption Steps */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <AdoptionSteps />
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">Tips</h2>
            <p className="text-center text-gray-600 mb-12">
              Feliz y Saludable ♥
            </p>
            <Tips />
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">¿Tienes preguntas?</h2>
              <p className="text-gray-600 mb-8">
                Registra tu correo para recibir las últimas actualizaciones
              </p>
              <div className="flex gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="px-4 py-2 border rounded-full flex-1 max-w-xs"
                />
                <Button className="rounded-full">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 text-gray-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            © 2024 PetMatch. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}