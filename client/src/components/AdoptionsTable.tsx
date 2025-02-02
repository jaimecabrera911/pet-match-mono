import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface Adoption {
  id: number;
  status: "pending" | "approved" | "rejected";
  etapa: "cuestionario" | "entrevista" | "adopcion";
  applicationDate: string;
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
    mutationFn: async ({ id, status, etapa }: { id: number; status?: string; etapa?: string }) => {
      const response = await fetch(`/api/adoptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, etapa }),
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

  const handleStatusChange = async (adoptionId: number, newStatus: string) => {
    await updateAdoptionMutation.mutateAsync({ id: adoptionId, status: newStatus });
  };

  const handleEtapaChange = async (adoptionId: number, newEtapa: string) => {
    await updateAdoptionMutation.mutateAsync({ id: adoptionId, etapa: newEtapa });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mascota</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead>Estado</TableHead>
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
                <Select
                  value={adoption.etapa}
                  onValueChange={(value: "cuestionario" | "entrevista" | "adopcion") =>
                    handleEtapaChange(adoption.id, value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cuestionario">Cuestionario</SelectItem>
                    <SelectItem value="entrevista">Entrevista</SelectItem>
                    <SelectItem value="adopcion">Adopción</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={adoption.status}
                  onValueChange={(value) => handleStatusChange(adoption.id, value)}
                  disabled={adoption.etapa !== "adopcion"}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="approved">Aprobada</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
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
                  {adoption.etapa === "adopcion" && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleStatusChange(adoption.id, "approved")}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleStatusChange(adoption.id, "rejected")}
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