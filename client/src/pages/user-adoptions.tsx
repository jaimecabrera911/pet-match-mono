import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdoptionSteps } from "@/components/AdoptionSteps";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusMap = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  en_entrevista: "En Entrevista",
  aprobada: "Aprobada",
  rechazada: "Rechazada"
};

export default function UserAdoptions() {
  const { toast } = useToast();
  
  const { data: adoptions, isLoading } = useQuery({
    queryKey: ['/api/user/adoptions'],
    queryFn: async () => {
      const res = await fetch('/api/user/adoptions');
      if (!res.ok) {
        throw new Error('Error al cargar las adopciones');
      }
      return res.json();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Mis Adopciones</CardTitle>
          <CardDescription>
            Gestiona tus procesos de adopción y sigue su estado
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {adoptions?.map((adoption) => (
                <TableRow key={adoption.id}>
                  <TableCell>{adoption.pet.name}</TableCell>
                  <TableCell>
                    <Badge variant={adoption.status === 'aprobada' ? 'success' : 'secondary'}>
                      {statusMap[adoption.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(adoption.createdAt).toLocaleDateString('es-ES')}
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
