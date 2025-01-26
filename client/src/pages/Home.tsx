import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { PetGrid } from "@/components/PetGrid";
import { AdoptionSteps } from "@/components/AdoptionSteps";
import { VideoGallery } from "@/components/VideoGallery";
import { SuccessStories } from "@/components/SuccessStories";
import { Heart, Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section id="hero" className="relative py-24 px-4">
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920')"
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 text-primary">
                🦴
              </div>
            </div>
            <h1 className="text-3xl font-semibold mb-2 text-white">
              Adopta una mascota
            </h1>
            <p className="text-sm text-gray-200 mb-6 max-w-xl mx-auto">
              Dale una segunda oportunidad a un amigo peludo.
            </p>
            <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90">
              Conocer más
            </Button>
          </div>
        </section>

        {/* Pets Section */}
        <section id="mascotas" className="py-12 px-4">
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
        <section id="proceso" className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <AdoptionSteps />
          </div>
        </section>

        {/* Video Gallery Section */}
        <section id="consejos" className="py-12 px-4">
          <VideoGallery />
        </section>

        {/* Success Stories Section */}
        <SuccessStories />

        {/* Contact Section */}
        <section id="contacto" className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - About text */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#FF5C7F] rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-gray-600">
                Somos una fundación sin fines de
                lucro dedicada a rescatar perros en
                situación de abandono o maltrato.
                Les brindamos una segunda
                oportunidad, ofreciéndoles el amor
                y cuidado que merecen y
                ayudándoles a encontrar un hogar
                lleno de cariño.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right column - Contact form */}
            <div className="space-y-4">
              <div>
                <h3 className="text-[#FF5C7F] font-medium mb-2">¿Tienes inquietudes o consultas?</h3>
                <p className="text-sm text-gray-600 mb-4">Registra tus datos</p>
              </div>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombres y apellidos"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C7F]/20 focus:border-[#FF5C7F]"
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C7F]/20 focus:border-[#FF5C7F]"
                />
                <textarea
                  placeholder="Mensaje"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C7F]/20 focus:border-[#FF5C7F]"
                />
                <Button className="w-full bg-[#FF5C7F] hover:bg-[#FF5C7F]/90">
                  Enviar
                </Button>
              </form>
            </div>
          </div>
        </section>

        <footer id="footer" className="bg-white border-t text-sm text-gray-500 py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p>© 2024 PetMatch. Todos los derechos reservados.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}