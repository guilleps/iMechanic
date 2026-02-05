import { getAllServices } from "@/workshop/api/service.api";
import { ServiceResponse } from "@/workshop/models/order";
import { useQuery } from "@tanstack/react-query";

interface Props {
    selected: number[];
    onChange: (ids: number[]) => void;
}

export default function ServiceSidebar({ selected, onChange }: Props) {
    const { data: services = [], isLoading } = useQuery<ServiceResponse[]>({
        queryKey: ["services"],
        queryFn: getAllServices,
    });

    const toggle = (id: number) => {
        onChange(
            selected.includes(id)
                ? selected.filter(s => s !== id)
                : [...selected, id]
        );
    };

    const renderGroup = (title: string, items: ServiceResponse[]) => (
        <section className="mb-4">
            <h3 className="font-medium text-primary">{title}</h3>
            <div className="flex flex-col gap-2">
                {items.map(service => (
                    <label key={service.name} className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={selected.includes(service.basePrice)} // Usa `id` real si está disponible
                            onChange={() => toggle(service.basePrice)} // cambia por `service.id` real
                        />
                        <span>{service.name} – S/ {service.basePrice}</span>
                    </label>
                ))}
            </div>
        </section>
    );

    const grouped = {
        MAINTENANCE: services.filter(s => s.category === "MAINTENANCE"),
        REPAIR: services.filter(s => s.category === "REPAIR"),
    };

    return (
        <aside className="w-full max-w-sm p-4 border rounded-lg bg-muted">
            <h2 className="text-lg font-semibold mb-4">Selecciona servicios</h2>
            {isLoading ? <p>Cargando servicios...</p> : (
                <>
                    {renderGroup("Mantenimiento", grouped.MAINTENANCE)}
                    {renderGroup("Reparación", grouped.REPAIR)}
                </>
            )}
        </aside>
    );
}
