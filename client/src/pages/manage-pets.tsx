import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { SelectPet } from "@db/schema";
import { useToast } from "@/hooks/use-toast";
import { PetTable } from "@/components/PetTable";
import { PetFormDialog } from "@/components/PetFormDialog";

export default function ManagePets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPet, setSelectedPet] = useState<SelectPet | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: pets, isLoading } = useQuery<SelectPet[]>({
    queryKey: ["/api/pets"],
  });

  const deletePetMutation = useMutation({
    mutationFn: async (petId: number) => {
      const response = await fetch(`/api/pets/${petId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la mascota");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "Éxito",
        description: "Mascota eliminada correctamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la mascota",
      });
    },
  });

  const handleDelete = async (petId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
      await deletePetMutation.mutateAsync(petId);
    }
  };

  const handleEdit = (pet: SelectPet) => {
    setSelectedPet(pet);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedPet(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Mascotas</h1>
          <p className="text-muted-foreground">
            Administra el catálogo de mascotas disponibles para adopción
          </p>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#FF585F] text-white hover:bg-[#e04c52]"
          onClick={handleAdd}
          aria-label="Agregar nueva mascota"
        >
          <PlusCircle className="h-5 w-5" />
          Agregar Mascota 
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <PetTable
          pets={pets || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      <PetFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        pet={selectedPet}
      />
    </div>
  );
}