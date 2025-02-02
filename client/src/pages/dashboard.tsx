import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle, PawPrint, Heart, Users, MapPin } from "lucide-react";
import type { SelectPet } from "@db/schema";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: pets = [], isLoading } = useQuery<SelectPet[]>({
    queryKey: ["/api/pets"],
  });

  const stats = [
    {
      title: "Total Mascotas",
      value: pets.length,
      description: "Mascotas registradas",
      icon: PawPrint,
      color: "text-blue-600",
    },
    {
      title: "Disponibles",
      value: pets.filter(pet => !pet.isAdopted).length,
      description: "Esperando un hogar",
      icon: Heart,
      color: "text-[#FF5C7F]",
    },
    {
      title: "Adoptados",
      value: pets.filter(pet => pet.isAdopted).length,
      description: "Hogares encontrados",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Ubicaciones",
      value: new Set(pets.map(pet => pet.location)).size,
      description: "Ciudades activas",
      icon: MapPin,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
            {user && (
              <div className="mt-2 text-gray-600">
                <p>
                  Bienvenido, {user.nombres} {user.apellidos}
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role === 'admin' ? 'Administrador' : 
                     user.role === 'shelter' ? 'Refugio' : 'Adoptante'}
                  </span>
                </p>
              </div>
            )}
            <p className="text-gray-500 mt-1">
              Vista general del sistema de adopción
            </p>
          </div>

          <div className="flex justify-end mb-8">
            <Button 
              variant="default" 
              className="bg-[#FF5C7F] hover:bg-[#FF5C7F]/90"
              onClick={() => window.location.href = '/mascotas'}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Agregar Mascota
            </Button>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ? (
              // Skeleton loading state for statistics
              Array(4).fill(null).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              stats.map((stat, i) => (
                <Card key={i} className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{stat.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Recent Pets Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mascotas Recientes</h2>
              <p className="mt-1 text-sm text-gray-500">
                Últimas mascotas añadidas al sistema
              </p>
            </div>
            <div className="p-6">
              {isLoading ? (
                // Skeleton loading state for recent pets
                <div className="space-y-4">
                  {Array(3).fill(null).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {pets.slice(0, 5).map((pet) => (
                    <div key={pet.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={pet.imageUrl}
                          alt={pet.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {pet.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {pet.breed} · {pet.location}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pet.isAdopted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {pet.isAdopted ? 'Adoptado' : 'Disponible'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}