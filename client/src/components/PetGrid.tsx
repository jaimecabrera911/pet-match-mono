import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PetCard } from "./PetCard";
import { FiltersSection } from "./FiltersSection";

// Define the Pet type based on the external API response
interface Pet {
  id: string;
  name: string;
  age: string;
  breed: string;
  location: string;
  imageUrl: string;
  requirements: string[];
  healthStatus: string[];
  personality: string[];
  isAdopted: boolean;
}

const fetchPets = async (): Promise<Pet[]> => {
  // Using the Dog API as an example - replace with your preferred external API
  const response = await fetch('https://api.thedogapi.com/v1/breeds?limit=10');
  const data = await response.json();

  // Transform the API response to match our Pet interface
  return data.map((dog: any) => ({
    id: dog.id.toString(),
    name: dog.name,
    age: "2", // Example age since the API doesn't provide this
    breed: dog.name,
    location: "España",
    imageUrl: dog.image?.url || "https://placedog.net/500",
    requirements: ["Hogar con espacio adecuado", "Familia responsable"],
    healthStatus: ["Saludable", "Vacunado"],
    personality: dog.temperament ? dog.temperament.split(', ') : ["Amigable"],
    isAdopted: false
  }));
};

export function PetGrid() {
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 15]);
  const [selectedBreed, setSelectedBreed] = useState("");

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: fetchPets
  });

  const availableBreeds = Array.from(new Set(pets.map(pet => pet.breed)));

  const filteredPets = pets.filter(pet => {
    const ageNum = parseInt(pet.age);
    const ageInRange = isNaN(ageNum) || (ageNum >= ageRange[0] && ageNum <= ageRange[1]);
    const breedMatches = !selectedBreed || pet.breed === selectedBreed;
    return ageInRange && breedMatches && !pet.isAdopted;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 border-4 border-t-[#FF5C7F] border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-lg shadow p-6">
          <FiltersSection
            ageRange={ageRange}
            onAgeChange={setAgeRange}
            selectedBreed={selectedBreed}
            onBreedChange={setSelectedBreed}
            availableBreeds={availableBreeds}
          />
        </div>
      </aside>

      {/* Pet Grid */}
      <div className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              name={pet.name}
              age={pet.age}
              breed={pet.breed}
              location={pet.location}
              imageUrl={pet.imageUrl}
              requirements={pet.requirements}
              healthStatus={pet.healthStatus}
              personality={pet.personality}
            />
          ))}
        </div>
      </div>
    </div>
  );
}