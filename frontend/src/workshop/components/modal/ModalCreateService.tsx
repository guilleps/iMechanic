import { Button } from "@/shared/components/ui/button";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader,
    DialogTitle, DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { toastHttpError } from "@/shared/lib/httpErrorToast";
import { createService } from "@/workshop/api/service.api";
import { CategoryService } from "@/workshop/models/service";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import ServiceSidebar from "../ServiceSidebar";

const initialServiceState = {
    name: "",
    description: "",
    category: "MAINTENANCE" as CategoryService,
    basePrice: "",
};

export default function ModalCreateService({ onCreated }: { onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [service, setService] = useState(initialServiceState);

    const reset = () => setService(initialServiceState);
    const queryClient = useQueryClient();

    queryClient.invalidateQueries({ queryKey: ["services"] });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createService({ ...service, basePrice: Number(service.basePrice) });
            onCreated();
            setOpen(false);
            reset();
        } catch (err) {
            toastHttpError("Error creando servicio", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset(); }}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Servicio
                </Button>
            </DialogTrigger>
            <DialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Registrar Servicio</DialogTitle>
                    <DialogDescription>Completa los campos requeridos</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                            id="name"
                            placeholder="Ej. Cambio de aceite"
                            value={service.name}
                            onChange={(e) => setService({ ...service, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Input
                            id="description"
                            placeholder="Ej. Reemplazo de aceite de motor y filtro"
                            value={service.description}
                            onChange={(e) => setService({ ...service, description: e.target.value })}
                        />                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría *</Label>
                            <Select value={service.category} onValueChange={(value) => setService({ ...service, category: value as CategoryService })}>
                                <SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                                    <SelectItem value="REPAIR">Reparación</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio base *</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="Ej. 120.00"
                                value={service.basePrice}
                                onChange={(e) =>
                                    setService({ ...service, basePrice: e.target.value })
                                }
                                required
                            />
                        </div>
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
