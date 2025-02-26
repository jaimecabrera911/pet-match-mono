import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AdoptionSteps } from "@/components/AdoptionSteps";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { Link } from "wouter";

const statusMap = {
  creada: "Creada",
  en_entrevista: "En Entrevista",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  pending: "Pendiente"
};

const getStatusBadgeVariant = (status: string) => {
  console.log(status);
  switch (status) {
    case "aceptada":
      return "default bg-green-100 text-green-800";
    case "rechazada":
      return "default bg-red-100 text-red-800";
    case "en_entrevista":
      return "default bg-yellow-100 text-yellow-800";
    case "pending":
      return "default bg-write-100 text-yellow-800";
    default:
      return "default bg-blue-100 text-blue-800";
  }
};

export default function UserAdoptions() {

  const { data: adoptions = [], isLoading: isLoadingAdoptions } = useQuery({
    queryKey: ["/api/adoptions/user"],

    queryFn: async () => {
      const res = await fetch("/api/adoptions/user", {
        method: "GET",
        credentials: "include",
        headers: {
          "user": sessionStorage.getItem("user") || ""
        },
      });
      if (!res.ok) {
        throw new Error("Error al cargar las adopciones");
      }
      return res.json();
    },
  });

  const { data: questionaries, isLoading: isLoadingQuestionaries } = useQuery({
    queryKey: ["Questionaries"],
    queryFn: async () => {
      const res = await fetch("/api/questionaries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user": sessionStorage.getItem("user") || ""
        },
      });
      if (!res.ok) {
        throw new Error("Error al cargar las adopciones");
      }
      return res.json();
    },
  });

  if (isLoadingAdoptions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isLoadingQuestionaries) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mis Adopciones</h1>
          <p className="text-muted-foreground">
            Gestiona tus procesos de adopción y sigue su estado
          </p>
        </div>
        <Link href="/dashboard/cuestionario">
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contestar Cuestionario
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Solicitudes de Adopción</CardTitle>
          <CardDescription>
            Aquí puedes ver el estado de tus solicitudes de adopción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mascota</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Solicitud</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adoptions.map((adoption: any) => (
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
                    <Badge className={getStatusBadgeVariant(adoption.status)}>
                      {statusMap[adoption.status as keyof typeof statusMap]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(adoption.applicationDate).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Estado de cuestionario</CardTitle>
          <CardDescription>
            Aquí puedes ver el estado de los cuestionarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questionaries && questionaries.length > 0 && (
            questionaries[0].status === "approved" ?
              <Badge color="green">Aprobado</Badge>
              :
              <Badge color="red">Rechazado</Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proceso de Adopción</CardTitle>
          <CardDescription>
            Conoce las etapas del proceso de adopción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdoptionSteps />
        </CardContent>
      </Card>
    </div>
  );
}
