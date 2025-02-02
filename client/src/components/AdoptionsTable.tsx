import { useQuery } from "@tanstack/react-query";
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
  const { data: adoptions = [], isLoading } = useQuery<Adoption[]>({
    queryKey: ["/api/adoptions"],
  });

  const handleStatusChange = async (adoptionId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/adoptions/${adoptionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado");
      }

      // Recargar los datos
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
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
                <div className="flex items-center">
                  {adoption.etapa === "cuestionario" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Cuestionario
                    </span>
                  )}
                  {adoption.etapa === "entrevista" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Entrevista
                    </span>
                  )}
                  {adoption.etapa === "adopcion" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Adopción
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={adoption.status}
                  onValueChange={(value) =>
                    handleStatusChange(adoption.id, value)
                  }
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
                    onClick={() =>
                      handleStatusChange(adoption.id, "approved")
                    }
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleStatusChange(adoption.id, "rejected")
                    }
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}