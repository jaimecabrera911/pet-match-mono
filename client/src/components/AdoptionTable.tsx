import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface Adoption {
  id: number;
  status: string;
  applicationDate: string;
  notes: string | null;
  pet: {
    id: number;
    name: string;
    breed: string;
  };
  user: {
    id: number;
    username: string;
  };
}

interface AdoptionTableProps {
  adoptions: Adoption[];
  onUpdateStatus: (adoptionId: number, status: "approved" | "rejected") => void;
  isLoading?: boolean;
}

export function AdoptionTable({ adoptions, onUpdateStatus, isLoading }: AdoptionTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mascota</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Fecha de Solicitud</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell className="animate-pulse bg-muted h-4 w-32 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-24 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-32 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-20 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-24 rounded" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mascota</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Fecha de Solicitud</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {adoptions.map((adoption) => (
          <TableRow key={adoption.id}>
            <TableCell>
              <div>
                <p className="font-medium">{adoption.pet.name}</p>
                <p className="text-sm text-muted-foreground">{adoption.pet.breed}</p>
              </div>
            </TableCell>
            <TableCell>{adoption.user.username}</TableCell>
            <TableCell>
              {new Date(adoption.applicationDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  adoption.status === "approved"
                    ? "success"
                    : adoption.status === "rejected"
                    ? "destructive"
                    : "default"
                }
              >
                {adoption.status === "approved"
                  ? "Aprobada"
                  : adoption.status === "rejected"
                  ? "Rechazada"
                  : "Pendiente"}
              </Badge>
            </TableCell>
            <TableCell>
              {adoption.status === "pending" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateStatus(adoption.id, "approved")}
                    className="text-green-600 hover:text-green-700"
                    aria-label="Aprobar adopción"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateStatus(adoption.id, "rejected")}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Rechazar adopción"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
