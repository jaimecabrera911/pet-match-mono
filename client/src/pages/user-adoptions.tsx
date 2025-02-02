import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import type { SelectAdoption } from "@db/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { AdoptionDetailsDialog } from "@/components/AdoptionDetailsDialog";

export default function UserAdoptions() {
  const { user } = useUser();
  const [selectedAdoptionId, setSelectedAdoptionId] = useState<number | null>(null);

  const { data: adoptions = [], isLoading, error } = useQuery<SelectAdoption[]>({
    queryKey: ["/api/user/adoptions"],
    enabled: !!user,
    credentials: 'include'
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobada";
      case "rejected":
        return "Rechazada";
      default:
        return "Pendiente";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Error al cargar las adopciones: {error.message}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Mis Adopciones</h1>
        <div className="grid gap-4">
          {adoptions.map((adoption) => (
            <Card key={adoption.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Solicitud #{adoption.id}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAdoptionId(adoption.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalles
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(adoption.status)}`}>
                      {getStatusLabel(adoption.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de solicitud:</span>
                    <span>{format(new Date(adoption.applicationDate), "PPP", { locale: es })}</span>
                  </div>
                  {adoption.notes && (
                    <div className="mt-2">
                      <span className="text-gray-600">Notas:</span>
                      <p className="mt-1 text-sm">{adoption.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {adoptions.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No tienes solicitudes de adopción activas
            </p>
          )}
        </div>
      </main>

      {selectedAdoptionId && (
        <AdoptionDetailsDialog
          adoptionId={selectedAdoptionId}
          isOpen={true}
          onClose={() => setSelectedAdoptionId(null)}
        />
      )}
    </div>
  );
}