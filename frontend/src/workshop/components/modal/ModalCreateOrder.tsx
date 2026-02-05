import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/shared/components/ui/select";
import { toastHttpError } from "@/shared/lib/httpErrorToast";
import { createOrder } from "@/workshop/api/order.api";
import { searchVehicleByPlate } from "@/workshop/api/vehicle.api";
import type { OrderStatus } from "@/types/orders";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import ServiceSidebar from "../ServiceSidebar";

const initialForm = {
  plate: '', brand: '', model: '', year: '',
  customerFirstName: '', customerLastName: '', status: 'OPEN' as OrderStatus,
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (data: typeof initialForm) => void;
}

export default function ModalCreateOrder({ open, onOpenChange, onCreate }: Props) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  useEffect(() => {
    if (!open) setForm(initialForm);
  }, [open]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const formatPlate = (value: string) => {
    const alnum = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
    return alnum.length <= 3 ? alnum : `${alnum.slice(0, 3)}-${alnum.slice(3)}`;
  };

  const handleSearch = async () => {
    const plate = form.plate.trim();
    if (!plate) return;
    try {
      setLoading(true);
      const { data } = await searchVehicleByPlate(plate);
      setForm(prev => ({
        ...prev,
        brand: data.brand ?? prev.brand,
        model: data.model ?? prev.model,
        year: data.year ? String(data.year) : prev.year,
        customerFirstName: data.firstName ?? prev.customerFirstName,
        customerLastName: data.lastName ?? prev.customerLastName,
      }));
    } catch (err) {
      toastHttpError(err, "No se encontró el vehículo");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrder({
        plate: form.plate,
        items: selectedServiceIds.map(id => ({
          serviceId: id,
          employeeId: 1
        }))
      });
      onCreate?.(form);
      onOpenChange(false);
    } catch (err) {
      toastHttpError(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-6">
        <DialogHeader>
          <DialogTitle>Nueva Orden</DialogTitle>
          <DialogDescription>
            Completa los datos del vehículo, cliente y servicios seleccionados.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulario de Orden */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 space-y-6 bg-background p-4 rounded-xl shadow-sm border"
          >
            {/* Placa + Año */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <Label>Placa *</Label>
                <Input
                  value={form.plate}
                  placeholder="ABC-123"
                  onChange={(e) => handleChange("plate", formatPlate(e.target.value))}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleSearch())
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Año *</Label>
                <Input value={form.year} readOnly required placeholder="2024" />
              </div>
            </div>

            {/* Marca + Modelo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marca *</Label>
                <Input
                  value={form.brand}
                  readOnly
                  required
                  className="pointer-events-none focus-visible:outline-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Modelo *</Label>
                <Input
                  value={form.model}
                  readOnly
                  required
                  className="pointer-events-none focus-visible:outline-none"
                />
              </div>
            </div>

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre cliente *</Label>
                <Input
                  value={form.customerFirstName}
                  readOnly
                  required
                  className="pointer-events-none focus-visible:outline-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Apellido cliente *</Label>
                <Input
                  value={form.customerLastName}
                  readOnly
                  required
                  className="pointer-events-none focus-visible:outline-none"
                />
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label>Estado inicial *</Label>
              <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Abierto</SelectItem>
                  <SelectItem value="IN_PROGRESS">En progreso</SelectItem>
                  <SelectItem value="READY">Listo</SelectItem>
                  <SelectItem value="DELIVERED">Entregado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Crear Orden
              </Button>
            </div>
          </form>

          {/* Sidebar de Servicios */}
          <div className="w-full lg:w-[320px] max-h-[520px] overflow-auto rounded-xl shadow-sm">
            <ServiceSidebar
              selected={selectedServiceIds}
              onChange={setSelectedServiceIds}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
