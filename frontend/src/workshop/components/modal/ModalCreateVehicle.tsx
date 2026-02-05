import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { VehicleCreate } from "@/workshop/models/vehicle";
import { formatPlate, initialVehicleState, isValidPhone } from "@/workshop/utils/vehicleUtils";
import { createVehicle } from "@/workshop/api/vehicle.api";

interface Props {
    onCreated: () => void; // para recargar la lista en el componente padre
}

export default function ModalCreateVehicle({ onCreated }: Props) {
    const [open, setOpen] = useState(false);
    const [vehicle, setVehicle] = useState<VehicleCreate>(initialVehicleState);

    const reset = () => setVehicle(initialVehicleState);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createVehicle(vehicle);
            onCreated();
            setOpen(false);
            reset();
        } catch (err) {
            console.error("Error creando vehículo", err);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                setOpen(val);
                if (!val) reset();
            }}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Vehículo
                </Button>
            </DialogTrigger>

            <DialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Registrar Vehículo</DialogTitle>
                    <DialogDescription>Ingresa los datos del nuevo vehículo</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="plate">Placa *</Label>
                            <Input
                                id="plate"
                                placeholder="ABC-123"
                                value={vehicle.plate}
                                onChange={(e) =>
                                    setVehicle({ ...vehicle, plate: formatPlate(e.target.value) })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Año *</Label>
                            <Input
                                id="year"
                                type="number"
                                placeholder="2020"
                                maxLength={4}
                                value={vehicle.year}
                                onChange={(e) => {
                                    setVehicle({
                                        ...vehicle,
                                        year: e.target.value,
                                    });
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand">Marca *</Label>
                            <Input
                                id="brand"
                                placeholder="Toyota"
                                value={vehicle.brand}
                                onChange={(e) =>
                                    setVehicle({ ...vehicle, brand: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Modelo *</Label>
                            <Input
                                id="model"
                                placeholder="Corolla"
                                value={vehicle.model}
                                onChange={(e) =>
                                    setVehicle({ ...vehicle, model: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre(s) *</Label>
                            <Input
                                id="firstName"
                                placeholder="Nombre del cliente"
                                value={vehicle.firstName}
                                onChange={(e) =>
                                    setVehicle({
                                        ...vehicle,
                                        firstName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido(s) *</Label>
                            <Input
                                id="lastName"
                                placeholder="Apellido del cliente"
                                value={vehicle.lastName}
                                onChange={(e) =>
                                    setVehicle({
                                        ...vehicle,
                                        lastName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <div className="relative">
                            <Input
                                id="phone"
                                placeholder="999 999 999"
                                value={vehicle.phone}
                                onChange={(e) =>
                                    setVehicle({
                                        ...vehicle,
                                        phone: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        {vehicle.phone.length > 0 &&
                            !isValidPhone(vehicle.phone) && (
                                <p className="text-[14px] text-red-500">
                                    El número debe iniciar con 9 y tener 9 dígitos.
                                </p>
                            )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1">
                            Registrar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
