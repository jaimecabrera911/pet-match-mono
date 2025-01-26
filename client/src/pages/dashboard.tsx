import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import type { SelectPet } from "@db/schema";
import { Sidebar } from "@/components/Sidebar";

export default function Dashboard() {
  const { data: pets, isLoading } = useQuery<SelectPet[]>({
    queryKey: ["/api/pets"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="p-4 sm:ml-64">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Panel de Control</h1>
              <p className="text-muted-foreground">
                Gestiona las mascotas disponibles para adopción
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Agregar Mascota
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Skeleton loading state
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
              // Pet cards
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
                      alt={pet.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {pet.location}
                      </span>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm">
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