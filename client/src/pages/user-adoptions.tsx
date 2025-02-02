
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { Navigation } from "@/components/Navigation";
import type { SelectAdoption } from "@db/schema";
import { format } from "date-fns";

export default function UserAdoptions() {
  const { user } = useUser();
  const { data: adoptions = [] } = useQuery<SelectAdoption[]>({
    queryKey: [`/api/users/${user?.id}/adoptions`],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Mis Adopciones</h1>
        <div className="grid gap-4">
          {adoptions.map((adoption) => (
            <Card key={adoption.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Solicitud #{adoption.id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-medium ${
                      adoption.status === 'approved' ? 'text-green-600' :
                      adoption.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {adoption.status === 'approved' ? 'Aprobada' :
                       adoption.status === 'rejected' ? 'Rechazada' :
                       'Pendiente'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de solicitud:</span>
                    <span>{format(new Date(adoption.applicationDate), 'dd/MM/yyyy')}</span>
                  </div>
                  {adoption.notes && (
                    <div className="mt-2">
                      <span className="text-gray-600">Notas:</span>
                      <p className="mt-1">{adoption.notes}</p>
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
    </div>
  );
}
