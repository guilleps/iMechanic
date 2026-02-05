import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table";
import { Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllServices } from "../api/service.api";
import { ServiceResponse } from "../models/service";
import ModalCreateService from "./modal/ModalCreateService";

export default function Services() {
    const [searchTerm, setSearchTerm] = useState("");
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const loadServices = async () => {
        try {
            setLoading(true);
            const data = await getAllServices();
            setServices(data);
        } catch (err) {
            console.error("Error cargando servicios", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadServices();
    }, []);

    const filteredServices = services.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout title="Servicios Ofrecidos">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            className="pl-10"
                            placeholder="Buscar servicio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ModalCreateService onCreated={loadServices} />
                </div>

                {/* Table */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Precio Base</TableHead>
                                <TableHead>Descripción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredServices.length > 0 ? (
                                filteredServices.map((s, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{s.name}</TableCell>
                                        <TableCell>
                                            <Badge>{s.category === 'MAINTENANCE' ? 'Mantenimiento' : 'Reparación'}</Badge>
                                        </TableCell>
                                        <TableCell>S/ {s.basePrice.toFixed(2)}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {s.description || "Sin descripción"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10">
                                        <Settings className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                                        <p className="text-muted-foreground">No hay servicios registrados.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="text-sm text-muted-foreground">
                    {loading
                        ? "Cargando servicios..."
                        : `Mostrando ${filteredServices.length} de ${services.length} servicios`}
                </div>
            </div>
        </MainLayout>
    );
}
