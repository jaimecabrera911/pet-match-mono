import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FiltersSectionProps {
  ageRange: [number, number];
  onAgeChange: (value: [number, number]) => void;
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
  availableBreeds: string[];
  selectedGender: string;
  onGenderChange: (gender: string) => void;
}

export function FiltersSection({
  ageRange,
  onAgeChange,
  selectedBreed,
  onBreedChange,
  availableBreeds,
  selectedGender,
  onGenderChange,
}: FiltersSectionProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-semibold mb-6">Filtros</h2>
        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Edad (años)</Label>
            <div className="pt-2">
              <Slider
                defaultValue={ageRange}
                max={15}
                min={0}
                step={1}
                onValueChange={onAgeChange}
                className="w-full"
              />
              <motion.div 
                className="flex justify-between mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="px-3 py-1 bg-primary/10 border-none">
                  <span className="text-sm font-medium text-primary">{ageRange[0]} años</span>
                </Card>
                <Card className="px-3 py-1 bg-primary/10 border-none">
                  <span className="text-sm font-medium text-primary">{ageRange[1]} años</span>
                </Card>
              </motion.div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Género</Label>
            <RadioGroup
              value={selectedGender}
              onValueChange={onGenderChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all" />
                <Label htmlFor="all">Todos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="macho" id="male" />
                <Label htmlFor="male">Macho</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hembra" id="female" />
                <Label htmlFor="female">Hembra</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Raza</Label>
            <select
              value={selectedBreed}
              onChange={(e) => onBreedChange(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C7F]/20 focus:border-[#FF5C7F]"
            >
              <option value="">Todas las razas</option>
              {availableBreeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}