import CarRepairRoundedIcon from "@mui/icons-material/CarRepairRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { usePathname } from "next/navigation";
import { match } from "path-to-regexp";

const mainListItems = [
  {
    id: "my-vehicle",
    text: "Mon véhicule",
    icon: <DirectionsCarRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id",
  },
  {
    id: "insurances",
    text: "Assurances",
    icon: <ShieldRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id/assurances",
  },
  {
    id: "repairs",
    text: "Réparations",
    icon: <CarRepairRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id/reparations",
  },
];

const useSelectedNavItem = () => {
  const pathname = usePathname();

  return mainListItems.find((item) => {
    const matcher = match(item.pattern, { decode: decodeURIComponent });
    const matched = matcher(pathname);

    if (matched) {
    }
    return !!matched;
  });
};

const NavigationMenu = () => {
  const selectedItem = useSelectedNavItem();
  const { id } = selectedItem || {};

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List>
        {mainListItems.map((item) => (
          <ListItem key={item.id} sx={{ display: "block" }}>
            <ListItemButton selected={item.id === id}>
              <ListItemIcon sx={{ color: "secondary.main" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default NavigationMenu;
