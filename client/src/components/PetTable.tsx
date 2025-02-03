import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import type { SelectPet } from "@db/schema";
import { Avatar } from "@/components/ui/avatar";

interface PetTableProps {
  pets: SelectPet[];
  onEdit: (pet: SelectPet) => void;
  onDelete: (petId: number) => void;
  isLoading?: boolean;
}

export function PetTable({ pets, onEdit, onDelete, isLoading }: PetTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell className="animate-pulse bg-muted h-10 w-10 rounded-full" />
              <TableCell className="animate-pulse bg-muted h-4 w-20 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-12 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-24 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-16 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-32 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-16 rounded" />
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
          <TableHead>Imagen</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Edad</TableHead>
          <TableHead>Raza</TableHead>
          <TableHead>Tamaño</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pets.map((pet) => (
          <TableRow key={pet.id}>
            <TableCell>
              <Avatar className="h-10 w-10">
                <img src={pet.imageUrl} alt={`Foto de ${pet.name}`} className="object-cover" />
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{pet.name}</TableCell>
            <TableCell>{pet.age}</TableCell>
            <TableCell>{pet.breed}</TableCell>
            <TableCell className="capitalize">{pet.size}</TableCell>
            <TableCell>{pet.location}</TableCell>
            <TableCell>
              {pet.isAdopted ? "Adoptado" : "Disponible"}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(pet)}
                  aria-label={`Editar ${pet.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(pet.id)}
                  aria-label={`Eliminar ${pet.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}