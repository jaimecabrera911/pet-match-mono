import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface Adoption {
  id: number;
  status: "creada" | "en_entrevista" | "aceptada" | "rechazada";
  applicationDate: string;
  aprobada: boolean | null;
  estadoDecision: string | null;
  experienciaPreviaDetalles: string | null;
  tipoVivienda: string | null;
  tieneEspacioExterior: string | null;
  tieneOtrasMascotas: string | null;
  otrasMascotasDetalles: string | null;
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

interface AdoptionDetailsProps {
  adoptionId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AdoptionDetailsDialog({ adoptionId, isOpen, onClose }: AdoptionDetailsProps) {
  const { data: adoption, isLoading } = useQuery<Adoption>({
    queryKey: [`/api/adoptions/${adoptionId}`],
    enabled: isOpen && !!adoptionId,
  });

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

  const getAprobadaLabel = (aprobada: boolean | null, estadoDecision: string | null) => {
    if (aprobada === true) return `Aprobada en ${getStatusLabel(estadoDecision || '')}`;
    if (aprobada === false) return `Rechazada en ${getStatusLabel(estadoDecision || '')}`;
    return "Pendiente";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles de la Adopción</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : adoption ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Mascota</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={adoption.pet.imageUrl}
                    alt={adoption.pet.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{adoption.pet.name}</p>
                    <p className="text-sm text-gray-500">{adoption.pet.breed}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Adoptante</h3>
                <p className="font-medium">
                  {adoption.user.nombres} {adoption.user.apellidos}
                </p>
                <p className="text-sm text-gray-500">{adoption.user.correo}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Estado de la Adopción</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Estado actual:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(adoption.status)}`}>
                    {getStatusLabel(adoption.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Decisión:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(adoption.estadoDecision || '')}`}>
                    {getAprobadaLabel(adoption.aprobada, adoption.estadoDecision)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Fecha de solicitud: {format(new Date(adoption.applicationDate), "PPP", { locale: es })}
                </p>
              </div>
            </div>

            {adoption.experienciaPreviaDetalles && (
              <div>
                <h3 className="font-semibold mb-2">Experiencia Previa</h3>
                <p className="text-sm">{adoption.experienciaPreviaDetalles}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Vivienda</h3>
                <p className="text-sm">Tipo: {adoption.tipoVivienda}</p>
                <p className="text-sm">
                  Espacio exterior: {adoption.tieneEspacioExterior === 'si' ? 'Sí' : 'No'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Otras Mascotas</h3>
                <p className="text-sm">
                  ¿Tiene otras mascotas?: {adoption.tieneOtrasMascotas === 'si' ? 'Sí' : 'No'}
                </p>
                {adoption.otrasMascotasDetalles && (
                  <p className="text-sm mt-1">{adoption.otrasMascotasDetalles}</p>
                )}
              </div>
            </div>

            {adoption.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notas Adicionales</h3>
                <p className="text-sm">{adoption.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No se encontraron detalles de la adopción</p>
        )}
      </DialogContent>
    </Dialog>
  );
}