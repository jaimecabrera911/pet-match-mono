import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AdoptionsTable } from "@/components/AdoptionsTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useLocation } from "wouter";

interface Adoption {
  id: number;
  status: "pending" | "approved" | "rejected";
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

export default function ManageAdoptions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: adoptions = [], isLoading } = useQuery<Adoption[]>({
    queryKey: ["/api/adoptions"],
  });

  const updateAdoptionMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/adoptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
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
        description: "Estado de adopción actualizado correctamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado de la adopción",
      });
    },
  });

  const handleCreateAdoption = () => {
    navigate("/dashboard/adopciones/crear");
  };

  const handleUpdateStatus = async (adoptionId: number, status: "approved" | "rejected") => {
    await updateAdoptionMutation.mutateAsync({ id: adoptionId, status });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Adopciones</h1>
          <p className="text-muted-foreground">
            Administra las solicitudes de adopción de mascotas
          </p>
        </div>
        <Button 
          onClick={handleCreateAdoption}
          className="bg-[#FF585F] hover:bg-[#e04c52] text-white"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Crear Adopción
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <AdoptionsTable
          adoptions={adoptions}
          onUpdateStatus={handleUpdateStatus}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}