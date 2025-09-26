import { useVehicleContext } from "@/components/contexts/VehicleContext";
import { buildVehicleSectionUrl } from "@/utils/fp/routes";
import { VehicleId } from "@/utils/types/vehicles";
import CarRepairRoundedIcon from "@mui/icons-material/CarRepairRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PaletteIcon from "@mui/icons-material/Palette";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { usePathname, useRouter } from "next/navigation";
import { match } from "path-to-regexp";

type NavigationMenuItem = {
  id: string;
  text: string;
  icon: React.ReactNode;
  pattern?: string;
  to: string | ((vehicleId: VehicleId | null) => string);
  disabled?: boolean;
};

const mainMenuItems: NavigationMenuItem[] = [
  {
    id: "dashboard",
    text: "Tableau de bord",
    icon: <HomeRoundedIcon />,
    to: "/dashboard",
  },
];

const vehicleMenuItems: NavigationMenuItem[] = [
  {
    id: "my-vehicle",
    text: "Mon véhicule",
    icon: <DirectionsCarRoundedIcon />,
    pattern: "/dashboard/:vehicle_id/vehicule",
    to: (vehicleId: VehicleId | null) =>
      buildVehicleSectionUrl("vehicule", vehicleId),
  },
  {
    id: "insurance",
    text: "Mon asssurance",
    icon: <ShieldRoundedIcon />,
    pattern: "/dashboard/:vehicle_id/assurance",
    to: (vehicleId: VehicleId | null) =>
      buildVehicleSectionUrl("assurance", vehicleId),
  },
  {
    id: "repairs",
    text: "Mes réparations",
    icon: <CarRepairRoundedIcon />,
    pattern: "/dashboard/:vehicle_id/reparations",
    to: (vehicleId: VehicleId | null) =>
      buildVehicleSectionUrl("reparations", vehicleId),
  },
  {
    id: "documents",
    text: "Mes documents",
    icon: <FolderRoundedIcon />,
    pattern: "/dashboard/:vehicle_id/documents",
    to: (vehicleId: VehicleId | null) =>
      buildVehicleSectionUrl("documents", vehicleId),
  },
];

const utilsMenuItems: NavigationMenuItem[] = [
  {
    id: "palette",
    text: "Palette",
    icon: <PaletteIcon />,
    to: "/dashboard/palette",
  },
];

const useSelectedNavItem = (
  items: NavigationMenuItem[],
  vehicleId: VehicleId | null
) => {
  const pathname = usePathname();

  return items.find((item) => {
    const { pattern = "" } = item;

    const matcherPattern = match(pattern, { decode: decodeURIComponent });
    const matchedPattern = matcherPattern(pathname);

    const to = typeof item.to === "function" ? item.to(vehicleId) : item.to;
    // If `to` is a function, we need to match the resulting path
    const matcherTo = match(to, { decode: decodeURIComponent });
    const matchedTo = matcherTo(pathname);

    return !!matchedPattern || !!matchedTo;
  });
};

const NavigationMenu = () => {
  const router = useRouter();
  const { vehicleId } = useVehicleContext();
  const selectedItem = useSelectedNavItem(
    [...mainMenuItems, ...vehicleMenuItems, ...utilsMenuItems],
    vehicleId as VehicleId | null
  );

  const handleClick = (item: NavigationMenuItem) => () => {
    if (item.disabled === true) return;

    let nextPath = "";
    if (typeof item.to === "function") {
      nextPath = item.to(vehicleId as VehicleId | null);
    } else {
      nextPath = item.to;
    }
    router.push(nextPath);
  };

  return (
    <Stack sx={{ flexGrow: 1, py: 1 }}>
      <MenuList>
        {mainMenuItems.map((item) => (
          <MenuItem
            key={item.id}
            onClick={handleClick(item)}
            selected={item.id === selectedItem?.id}
            disabled={item.disabled === true}
          >
            <ListItemIcon sx={{ color: "info.main" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <MenuList>
        {vehicleMenuItems.map((item) => (
          <MenuItem
            key={item.id}
            onClick={handleClick(item)}
            selected={item.id === selectedItem?.id}
            disabled={item.disabled === true}
          >
            <ListItemIcon sx={{ color: "secondary.main" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <MenuList>
        {utilsMenuItems.map((item) => (
          <MenuItem
            key={item.id}
            onClick={handleClick(item)}
            selected={item.id === selectedItem?.id}
            disabled={item.disabled === true}
          >
            <ListItemIcon sx={{ color: "warning.main" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </MenuList>
    </Stack>
  );
};

export default NavigationMenu;
