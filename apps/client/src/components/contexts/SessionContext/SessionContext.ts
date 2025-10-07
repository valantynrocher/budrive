"use client";
import { createContext } from "react";
import { SessionContextType } from "./types/SessionContextType";

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export default SessionContext;
