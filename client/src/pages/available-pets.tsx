import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function AvailablePets() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const { data: pets = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/pets"],
  });

  const availablePets = pets.filter(pet => !pet.isAdopted);

  const handleAdoptClick = (petId: number) => {
    navigate(`/adopcion/crear/${petId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardHeader>
                <div className="h-6 w-24 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Mascotas Disponibles para Adopción</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availablePets.map((pet) => (
          <Card key={pet.id} className="overflow-hidden">
            <div className="h-48 relative">
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{pet.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{pet.breed}</p>
              <p className="text-sm text-gray-500">{pet.age} años</p>
              <p className="mt-2">{pet.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#FF5C7F] hover:bg-[#FF5C7F]/90"
                onClick={() => handleAdoptClick(pet.id)}
              >
                <Heart className="mr-2 h-4 w-4" />
                Adoptar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
