import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SuccessStory {
  id: number;
  petName: string;
  adopterName: string;
  beforeImage: string;
  afterImage: string;
  testimony: string;
  adoptionDate: string;
}

// Simulated API call to fetch success stories
const fetchSuccessStories = async (): Promise<SuccessStory[]> => {
  // In a real application, this would be an API call
  return [
    {
      id: 1,
      petName: "Luna",
      adopterName: "María González",
      beforeImage: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467",
      afterImage: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47",
      testimony: "Luna ha traído tanta alegría a nuestra familia. No podemos imaginar la vida sin ella.",
      adoptionDate: "Enero 2024"
    },
    {
      id: 2,
      petName: "Max",
      adopterName: "Carlos Rodríguez",
      beforeImage: "https://images.unsplash.com/photo-1444212477490-ca407925329e",
      afterImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1",
      testimony: "Max era tímido al principio, pero ahora es el alma de la casa.",
      adoptionDate: "Diciembre 2023"
    }
  ];
};

export function SuccessStories() {
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["success-stories"],
    queryFn: fetchSuccessStories
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Historias de Éxito</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cada adopción es una historia de amor y esperanza. Conoce a algunas de las mascotas que han encontrado su hogar para siempre.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {stories.map((story) => (
            <motion.div key={story.id} variants={cardVariants}>
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        Antes
                      </div>
                      <img
                        src={story.beforeImage}
                        alt={`${story.petName} antes`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-primary/50 text-white px-2 py-1 rounded text-xs">
                        Después
                      </div>
                      <img
                        src={story.afterImage}
                        alt={`${story.petName} después`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{story.petName}</h3>
                      <p className="text-sm text-gray-500">Adoptado por {story.adopterName} - {story.adoptionDate}</p>
                    </div>
                    <p className="text-gray-600 italic">"{story.testimony}"</p>
                    <Button variant="outline" className="w-full">
                      Leer más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}