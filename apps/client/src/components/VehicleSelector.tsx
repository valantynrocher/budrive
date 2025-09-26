import { useVehicleContext } from "@/components/contexts/VehicleContext";
import { myVehicles } from "@/data/vehicles";
import { Tables } from "@/utils/supabase/types/database";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

const VehicleSelector = () => {
  const [vehicles] = useState<Tables<"vehicles">[]>(myVehicles);
  const { vehicleId, selectVehicle } = useVehicleContext();
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent) => {
    selectVehicle(event.target.value || null);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel
        sx={{
          "&.Mui-focused": {
            color: (theme) => theme.palette.primary.contrastText,
          },
        }}
      >
        Sélectionner un véhicule
      </InputLabel>
      <Select
        value={vehicleId ?? ""}
        onChange={handleChange}
        label="Sélectionner un véhicule"
        fullWidth
      >
        {vehicles.map((v) => (
          <MenuItem key={v.id} value={v.id}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ListItemAvatar
                sx={{
                  minWidth: 0,
                  width: 28,
                  marginRight: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: (theme.vars || theme).palette.background
                      .paper,
                    color: (theme.vars || theme).palette.text.secondary,
                    border: `1px solid ${
                      (theme.vars || theme).palette.divider
                    }`,
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
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default VehicleSelector;
