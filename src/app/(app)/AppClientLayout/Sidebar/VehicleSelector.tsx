import { Tables } from "@/utils/supabase/types/database";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent, selectClasses } from "@mui/material/Select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const VehicleSelector = () => {
  const [vehicles, setVehicles] = useState<Tables<"vehicles">[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await fetch("/api/vehicles");
      const data = await response.json();
      setVehicles(data);
      setSelectedId(data[0]?.id || null);
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    if (selectedId !== null) router.push(`/dashboard/${selectedId}`);
  }, [selectedId]);

  const handleChange = (event: SelectChangeEvent) => {
    const nextId = event.target.value;
    setSelectedId(nextId);
  };

  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      value={selectedId ?? ""}
      onChange={handleChange}
      displayEmpty
      inputProps={{ "aria-label": "Select company" }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 215,
        "&.MuiList-root": {
          p: "8px",
        },
        [`& .${selectClasses.select}`]: {
          display: "flex",
          alignItems: "center",
          gap: "2px",
          pl: 1,
        },
      }}
    >
      {vehicles.map((v) => (
        <MenuItem key={v.id} value={v.id}>
          <ListItemAvatar
            sx={{
              minWidth: 0,
              marginRight: 2,
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                backgroundColor: (theme.vars || theme).palette.background.paper,
                color: (theme.vars || theme).palette.text.secondary,
                border: `1px solid ${(theme.vars || theme).palette.divider}`,
              }}
              alt={`${v.make} ${v.model}`}
            >
              {/* {v.logo_marque ? (
                <Image
                  alt={`logo_${v.make}_${v.model}`}
                  src={v.logo_marque}
                  width={28}
                  height={28}
                />
              ) : (
                <DirectionsCarIcon sx={{ fontSize: "1rem" }} />
              )} */}
              <DirectionsCarIcon sx={{ fontSize: "1rem" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${v.make} ${v.model}`}
            secondary={v.registration}
          />
        </MenuItem>
      ))}
    </Select>
  );
};

export default VehicleSelector;
