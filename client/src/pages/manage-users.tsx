import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { SelectUser } from "@db/schema";
import { useToast } from "@/hooks/use-toast";
import { UserTable } from "@/components/UserTable";
import { UserFormDialog } from "@/components/UserFormDialog";

export default function ManageUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<SelectUser | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: users, isLoading } = useQuery<SelectUser[]>({
    queryKey: ["/api/users"],
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("RESPONSE:", response);

      console.log("Datos de respuesta:", response.status);

      if (response.status !== 200) { 
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar el usuario",
        });
        return;
      }
      toast({
        title: "Usuario eliminado correctamente",
        description: "El usuario ha sido eliminado del sistema",
      });
      window.location.reload();
    },
  });

  const handleDelete = async (userId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      await deleteUserMutation.mutateAsync(userId);
    }
  };

  const handleEdit = (user: SelectUser) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#FF585F] text-white hover:bg-[#e04c52]"
          onClick={handleAdd}
          aria-label="Agregar nuevo usuario"
        >
          <PlusCircle className="h-5 w-5" />
          Agregar Usuario
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <UserTable
          users={users || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      <UserFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
