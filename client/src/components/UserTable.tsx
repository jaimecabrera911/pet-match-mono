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
import type { SelectUser } from "@db/schema";

interface UserTableProps {
  users: SelectUser[];
  onEdit: (user: SelectUser) => void;
  onDelete: (userId: number) => void;
  isLoading?: boolean;
}

export function UserTable({ users, onEdit, onDelete, isLoading }: UserTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo Documento</TableHead>
            <TableHead>Número Documento</TableHead>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell className="animate-pulse bg-muted h-4 w-32 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-24 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-40 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-32 rounded" />
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
          <TableHead>Tipo Documento</TableHead>
          <TableHead>Número Documento</TableHead>
          <TableHead>Nombre Completo</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.tipoDocumento}</TableCell>
            <TableCell>{user.numeroDocumento}</TableCell>
            <TableCell>{`${user.nombres} ${user.apellidos}`}</TableCell>
            <TableCell>{user.correo}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(user)}
                  aria-label={`Editar ${user.nombres}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(user.id)}
                  aria-label={`Eliminar ${user.nombres}`}
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