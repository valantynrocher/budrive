"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VehicleContext from "./VehicleContext";
import extractVehicleIdFromPath from "./utils/extractVehicleIdFromPath";
import { isVehicleRoute } from "@/utils/fp/routes";

const VehicleProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [vehicleId, setVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const urlId = extractVehicleIdFromPath(pathname);
    if (urlId && urlId !== vehicleId) {
      setVehicleId(urlId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 🚗 Fonction de navigation
  const selectVehicle = (id: string | null) => {
    setVehicleId(id);
    if (id && isVehicleRoute(pathname)) {
      const newPath = pathname.replace(
        /\/dashboard\/[^/]+/,
        `/dashboard/${id}`
      );
      router.push(newPath);
    }
  };

  return (
    <VehicleContext.Provider value={{ vehicleId, selectVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};

export default VehicleProvider;
