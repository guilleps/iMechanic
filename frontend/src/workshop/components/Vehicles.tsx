import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Car, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { createVehicle, getAllVehicles } from "../api/vehicle.api";
import type { VehicleCreateResponse } from "../models/vehicle";
import {
  initialVehicleState
} from "../utils/vehicleUtils";
import ModalCreateVehicle from "./modal/ModalCreateVehicle";

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleCreateResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [newVehicle, setNewVehicle] = useState(initialVehicleState);
  const resetNewVehicle = () => setNewVehicle(initialVehicleState);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await getAllVehicles();
      const rows: VehicleCreateResponse[] = response.data.map(
        (v: VehicleCreateResponse) => ({
          plate: v.plate,
          brand: v.brand,
          model: v.model,
          year: v.year,
          firstName: v.firstName,
          lastName: v.lastName,
          phone: v.phone,
        }),
      );
      setVehicles(rows);
    } catch (e) {
      console.error("Error cargando vehículos", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVehicle(newVehicle);
      await loadVehicles();
      setIsModalOpen(false);
      resetNewVehicle();
    } catch (err) {
      console.error("Error creando vehículo", err);
    }
  };

  return (
    <MainLayout title="Vehículos Registrados">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por placa, marca o modelo..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ModalCreateVehicle onCreated={loadVehicles} />
        </div>

        {/* Vehicles Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Placa</TableHead>
                <TableHead>Marca / Modelo</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Contacto</TableHead>
                {/* <TableHead>VIN</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle, i) => (
                  <TableRow
                    key={i || vehicle.plate}
                    className="hover:bg-muted/30"
                  >
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-mono font-medium"
                      >
                        {vehicle.plate}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {vehicle.brand} {vehicle.model}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>
                      {vehicle.firstName + " " + vehicle.lastName}
                    </TableCell>
                    <TableCell>{vehicle.phone}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Car className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-muted-foreground">
                      No se encontraron vehículos
                    </p>
                    {searchTerm && (
                      <p className="text-sm text-muted-foreground">
                        Intenta con otra búsqueda
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="text-sm text-muted-foreground">
          {loading
            ? "Cargando vehículos..."
            : `Mostrando ${filteredVehicles.length} de ${vehicles.length} vehículos`}
        </div>
      </div>
    </MainLayout>
  );
}
