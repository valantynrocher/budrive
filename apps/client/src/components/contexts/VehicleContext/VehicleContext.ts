"use client";
import { createContext } from "react";
import { VehicleContextType } from "./types/VehicleContextType";

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export default VehicleContext;
