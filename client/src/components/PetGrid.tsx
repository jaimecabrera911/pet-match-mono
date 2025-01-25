import { useState } from "react";
import { PetCard } from "./PetCard";
import { FiltersSection } from "./FiltersSection";

interface Pet {
  name: string;
  age: string;
  breed: string;
  location: string;
  imageUrl: string;
}

export function PetGrid() {
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 15]);
  const [selectedBreed, setSelectedBreed] = useState("");

  const pets: Pet[] = [
    {
      name: "Luna",
      age: "2 años",
      breed: "Labrador",
      location: "Madrid",
      imageUrl: "https://images.unsplash.com/photo-1508568230916-c2692a5d7b1d"
    },
    {
      name: "Max",
      age: "1 año",
      breed: "Yorkshire",
      location: "Barcelona",
      imageUrl: "https://images.unsplash.com/photo-1508946621775-9d59b75e074e"
    },
    {
      name: "Rocky",
      age: "3 años",
      breed: "Dálmata",
      location: "Valencia",
      imageUrl: "https://images.unsplash.com/photo-1509559320938-387dfd4e074b"
    }
  ];

  const availableBreeds = Array.from(new Set(pets.map(pet => pet.breed)));

  const filteredPets = pets.filter(pet => {
    const petAge = parseInt(pet.age);
    const ageInRange = petAge >= ageRange[0] && petAge <= ageRange[1];
    const breedMatches = !selectedBreed || pet.breed === selectedBreed;
    return ageInRange && breedMatches;
  });

  return (
    <div className="space-y-8">
      <FiltersSection
        ageRange={ageRange}
        onAgeChange={setAgeRange}
        selectedBreed={selectedBreed}
        onBreedChange={setSelectedBreed}
        availableBreeds={availableBreeds}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {filteredPets.map((pet, index) => (
          <PetCard key={index} {...pet} />
        ))}
      </div>
    </div>
  );
}