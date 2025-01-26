import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import type { SelectPet } from "@db/schema";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";

export default function ManagePets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPet, setSelectedPet] = useState<SelectPet | null>(null);

  const { data: pets, isLoading } = useQuery<SelectPet[]>({
    queryKey: ["/api/pets"],
  });

  const deletePetMutation = useMutation({
    mutationFn: async (petId: number) => {
      const response = await fetch(`/api/pets/${petId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la mascota");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "Éxito",
        description: "Mascota eliminada correctamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la mascota",
      });
    },
  });

  const handleDelete = async (petId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
      await deletePetMutation.mutateAsync(petId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="p-4 sm:ml-64">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Gestión de Mascotas</h1>
              <p className="text-muted-foreground">
                Administra el catálogo de mascotas disponibles para adopción
              </p>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setSelectedPet(null)}
              aria-label="Agregar nueva mascota"
            >
              <PlusCircle className="h-5 w-5" />
              Agregar Mascota
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              pets?.map((pet) => (
                <Card key={pet.id}>
                  <CardHeader>
                    <CardTitle>{pet.name}</CardTitle>
                    <CardDescription>
                      {pet.breed} · {pet.age}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={pet.imageUrl}
                      alt={`Foto de ${pet.name}`}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {pet.location}
                      </span>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedPet(pet)}
                          aria-label={`Editar ${pet.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(pet.id)}
                          aria-label={`Eliminar ${pet.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
