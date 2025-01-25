import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { PetGrid } from "@/components/PetGrid";
import { AdoptionSteps } from "@/components/AdoptionSteps";
import { Tips } from "@/components/Tips";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Adopta una mascota
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Dale una segunda oportunidad a un amigo peludo. Encuentra tu compañero perfecto entre nuestros adorables animales en adopción.
            </p>
            <Button size="lg" className="text-lg px-8">
              Conocer mascotas
            </Button>
          </div>
        </section>

        {/* Pets Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Busca tu amigo
            </h2>
            <PetGrid />
          </div>
        </section>

        {/* Adoption Steps */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <AdoptionSteps />
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Tips />
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">¿Tienes preguntas?</h2>
            <p className="text-gray-600 mb-8">
              ¿Necesitas información adicional? Contáctanos y te ayudaremos.
            </p>
            <Button variant="outline" size="lg">
              Contactar
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            © 2024 PetMatch. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
