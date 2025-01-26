import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PetCardProps {
  name: string;
  age: string;
  breed: string;
  location: string;
  imageUrl: string;
}

export function PetCard({ name, age, breed, location, imageUrl }: PetCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-[400px] w-full [perspective:1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={cn(
        "absolute inset-0 w-full h-full transition-transform duration-500 [transform-style:preserve-3d]",
        isFlipped ? "[transform:rotateY(180deg)]" : ""
      )}>
        {/* Frente de la tarjeta */}
        <Card className="absolute inset-0 overflow-hidden bg-[#FFD868] border-none [backface-visibility:hidden]">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="aspect-square overflow-hidden rounded-t-xl flex-shrink-0">
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{name}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <p>Edad: {age}</p>
                  <p>Raza: {breed}</p>
                  <p>Ubicación: {location}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  className="flex-1 bg-[#FF5C7F] hover:bg-[#FF5C7F]/90 transition-colors" 
                  size="sm"
                >
                  Adoptar
                </Button>
                <Button 
                  className="flex-1 bg-gray-500 hover:bg-gray-600 transition-colors" 
                  size="sm"
                >
                  Conocer más
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reverso de la tarjeta */}
        <Card className="absolute inset-0 overflow-hidden bg-[#FFD868] border-none [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-4">{name}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Personalidad</h4>
                  <p className="text-sm text-gray-700">
                    {name} es un perro muy cariñoso y juguetón. Le encanta estar con personas y otros perros.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Salud</h4>
                  <ul className="text-sm text-gray-700 list-disc list-inside">
                    <li>Vacunas al día</li>
                    <li>Desparasitado</li>
                    <li>Esterilizado</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Requisitos</h4>
                  <ul className="text-sm text-gray-700 list-disc list-inside">
                    <li>Hogar con espacio</li>
                    <li>Familia comprometida</li>
                    <li>Visita previa</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-gray-500 hover:bg-gray-600 transition-colors" 
              size="sm"
              onClick={() => setIsFlipped(false)}
            >
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}