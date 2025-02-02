import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface Adoption {
  id: number;
  status: "creada" | "en_entrevista" | "aceptada" | "rechazada";
  applicationDate: string;
  aprobada: boolean | null;
  notes: string | null;
  pet: {
    id: number;
    name: string;
    breed: string;
    imageUrl: string;
  };
  user: {
    id: number;
    nombres: string;
    apellidos: string;
    correo: string;
  };
}

export function AdoptionsTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: adoptions = [], isLoading } = useQuery<Adoption[]>({
    queryKey: ["/api/adoptions"],
  });

  const updateAdoptionMutation = useMutation({
    mutationFn: async ({ id, status, aprobada }: { id: number; status?: string; aprobada?: boolean }) => {
      const response = await fetch(`/api/adoptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, aprobada }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la adopción");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/adoptions"] });
      toast({
        title: "Éxito",
        description: "Adopción actualizada correctamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la adopción",
      });
    },
  });

  const handleStatusChange = async (adoptionId: number, newStatus: string, aprobada: boolean) => {
    await updateAdoptionMutation.mutateAsync({ id: adoptionId, status: newStatus, aprobada });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'creada':
        return 'bg-blue-100 text-blue-800';
      case 'en_entrevista':
        return 'bg-yellow-100 text-yellow-800';
      case 'aceptada':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'creada':
        return 'Creada';
      case 'en_entrevista':
        return 'En Entrevista';
      case 'aceptada':
        return 'Aceptada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return status;
    }
  };

  const getAprobadaLabel = (aprobada: boolean | null) => {
    if (aprobada === true) return "Aprobada";
    if (aprobada === false) return "No Aprobada";
    return "Pendiente";
  };

  const getAprobadaBadgeColor = (aprobada: boolean | null) => {
    if (aprobada === true) return "bg-green-100 text-green-800";
    if (aprobada === false) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mascota</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Aprobación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adoptions.map((adoption) => (
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
                <div>
                  <div className="font-medium">
                    {adoption.user.nombres} {adoption.user.apellidos}
                  </div>
                  <div className="text-sm text-gray-500">
                    {adoption.user.correo}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(adoption.applicationDate), "PPP", {
                  locale: es,
                })}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(adoption.status)}`}>
                  {getStatusLabel(adoption.status)}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAprobadaBadgeColor(adoption.aprobada)}`}>
                  {getAprobadaLabel(adoption.aprobada)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/dashboard/adopciones/${adoption.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {adoption.status !== "aceptada" && adoption.status !== "rechazada" && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleStatusChange(adoption.id, "aceptada", true)}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleStatusChange(adoption.id, "rechazada", false)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}