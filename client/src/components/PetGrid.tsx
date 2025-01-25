import { useState } from "react";
import { PetCard } from "./PetCard";
import { FiltersSection } from "./FiltersSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <div className="sticky top-20 bg-white rounded-lg shadow-sm">
          <FiltersSection
            ageRange={ageRange}
            onAgeChange={setAgeRange}
            selectedBreed={selectedBreed}
            onBreedChange={setSelectedBreed}
            availableBreeds={availableBreeds}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-grow">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredPets.map((pet, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <PetCard {...pet} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}