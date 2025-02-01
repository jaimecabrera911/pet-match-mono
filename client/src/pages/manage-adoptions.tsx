import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AdoptionTable } from "@/components/AdoptionTable";

// Mock API call to fetch adoptions data
async function fetchAdoptions() {
  // Simulated API response with adoption data
  return [
    {
      id: 1,
      status: "pending",
      applicationDate: "2025-02-01T10:00:00Z",
      notes: "Familia con experiencia en perros",
      pet: {
        id: 101,
        name: "Luna",
        breed: "Labrador Retriever"
      },
      user: {
        id: 201,
        username: "María González"
      }
    },
    {
      id: 2,
      status: "approved",
      applicationDate: "2025-01-30T15:30:00Z",
      notes: "Hogar con jardín grande",
      pet: {
        id: 102,
        name: "Max",
        breed: "Pastor Alemán"
      },
      user: {
        id: 202,
        username: "Carlos Rodríguez"
      }
    }
  ];
}

// Mock API call to update adoption status
async function updateAdoptionStatus(id: number, status: string) {
  // Simulated API call
  console.log(`Updating adoption ${id} to status: ${status}`);
  return {
    id,
    status,
    message: "Status updated successfully"
  };
}

export default function ManageAdoptions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: adoptions = [], isLoading } = useQuery({
    queryKey: ["adoptions"],
    queryFn: fetchAdoptions
  });

  const updateAdoptionMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return updateAdoptionStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adoptions"] });
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

  const handleUpdateStatus = async (adoptionId: number, status: "approved" | "rejected") => {
    await updateAdoptionMutation.mutateAsync({ id: adoptionId, status });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Adopciones</h1>
        <p className="text-muted-foreground">
          Administra las solicitudes de adopción de mascotas
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <AdoptionTable
          adoptions={adoptions}
          onUpdateStatus={handleUpdateStatus}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}