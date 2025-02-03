import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdoptionSteps } from "@/components/AdoptionSteps";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const statusMap = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada"
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'approved':
      return 'default bg-green-100 text-green-800';
    case 'rejected':
      return 'default bg-red-100 text-red-800';
    default:
      return 'default bg-blue-100 text-blue-800';
  }
};

export default function UserAdoptions() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: adoptions = [], isLoading } = useQuery({
    queryKey: ['/api/adoptions/user'],
    queryFn: async () => {
      if (!user) {
        throw new Error('Debes iniciar sesión para ver tus adopciones');
      }

      console.log('Haciendo petición a /api/adoptions/user con usuario:', user.id);

      const res = await fetch('/api/adoptions/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error al obtener adopciones:', errorData);
        throw new Error(errorData.error || 'Error al cargar las adopciones');
      }

      const data = await res.json();
      console.log('Adopciones recibidas:', data);
      return data;
    },
    enabled: !!user,
    onError: (error: Error) => {
      console.error('Error en la consulta de adopciones:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mis Adopciones</h1>
          <p className="text-muted-foreground">
            Gestiona tus procesos de adopción y sigue su estado
          </p>
        </div>
        <Link href="/cuestionario-adopcion">
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contestar Cuestionario
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Solicitudes de Adopción</CardTitle>
          <CardDescription>
            Aquí puedes ver el estado de tus solicitudes de adopción
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adoptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tienes solicitudes de adopción activas.
              <div className="mt-2">
                <Link href="/dashboard/available-pets">
                  <Button variant="outline">Ver mascotas disponibles</Button>
                </Link>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Solicitud</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adoptions.map((adoption: any) => (
                  <TableRow key={adoption.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={adoption.pet.imageUrl}
                          alt={adoption.pet.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{adoption.pet.name}</div>
                          <div className="text-sm text-gray-500">
                            {adoption.pet.breed}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeVariant(adoption.status)}>
                        {statusMap[adoption.status as keyof typeof statusMap]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(adoption.applicationDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proceso de Adopción</CardTitle>
          <CardDescription>
            Conoce las etapas del proceso de adopción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdoptionSteps />
        </CardContent>
      </Card>
    </div>
  );
}