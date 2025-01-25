import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PetCardProps {
  name: string;
  age: string;
  breed: string;
  location: string;
  imageUrl: string;
}

export function PetCard({ name, age, breed, location, imageUrl }: PetCardProps) {
  return (
    <Card className="overflow-hidden bg-[#FFD868] border-none">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-xl">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            <p>Edad: {age}</p>
            <p>Raza: {breed}</p>
            <p>Ubicación: {location}</p>
          </div>
          <Button className="w-full mt-4 bg-primary hover:bg-primary/90" size="sm">
            Conocer más
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}