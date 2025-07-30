import { myVehicles } from "@/data/vehicles";
import { Tables } from "@/utils/supabase/types/database";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent, selectClasses } from "@mui/material/Select";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const VehicleSelector = () => {
  const [vehicles] = useState<Tables<"vehicles">[]>(myVehicles);
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();

  const selectedId = params?.vehicleId ? Number(params.vehicleId) : null;

  const handleChange = (event: SelectChangeEvent) => {
    const nextId = event.target.value;
    router.push(`/app/dashboard/${nextId}`);
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
