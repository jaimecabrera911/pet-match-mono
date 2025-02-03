import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SelectPet } from "@db/schema";

export default function AvailablePets() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: pets = [], isLoading } = useQuery<SelectPet[]>({
    queryKey: ["/api/pets"],
  });

  const createAdoptionMutation = useMutation({
    mutationFn: async (petId: number) => {
      const response = await fetch("/api/adoptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petId }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la solicitud de adopción");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Solicitud enviada!",
        description: "Tu solicitud de adopción ha sido creada exitosamente.",
      });
      navigate("/dashboard/user-adoptions");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const availablePets = pets.filter(pet => !pet.isAdopted);

  const handleAdoptClick = async (petId: number) => {
    try {
      await createAdoptionMutation.mutateAsync(petId);
    } catch (error) {
      console.error("Error al crear la adopción:", error);
    }
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
                disabled={createAdoptionMutation.isPending}
              >
                <Heart className="mr-2 h-4 w-4" />
                {createAdoptionMutation.isPending ? "Procesando..." : "Adoptar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}