import useSelectedVehicle from "@/utils/hooks/useSelectedVehicle";
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
  to?: string;
  disabled?: boolean;
};

const mainMenuItems: NavigationMenuItem[] = [
  {
    id: "dashboard",
    text: "Tableau de bord",
    icon: <HomeRoundedIcon />,
    to: "/app/dashboard",
  },
];

const vehicleMenuItems: NavigationMenuItem[] = [
  {
    id: "my-vehicle",
    text: "Mon véhicule",
    icon: <DirectionsCarRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id/vehicule",
    to: "/app/dashboard/vehicule",
  },
  {
    id: "insurance",
    text: "Mon asssurance",
    icon: <ShieldRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id/assurance",
    to: "/app/dashboard/assurance",
  },
  {
    id: "repairs",
    text: "Mes réparations",
    icon: <CarRepairRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id/reparations",
    to: "/app/dashboard/reparations",
  },
  {
    id: "documents",
    text: "Mes documents",
    icon: <FolderRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id/documents",
    to: "/app/dashboard/documents",
  },
];

const utilsMenuItems: NavigationMenuItem[] = [
  {
    id: "palette",
    text: "Palette",
    icon: <PaletteIcon />,
    to: "/app/utils/palette",
  },
];

const useSelectedNavItem = (items: NavigationMenuItem[]) => {
  const pathname = usePathname();

  return items.find((item) => {
    const { pattern = "", to = "" } = item;

    const matcherPattern = match(pattern, { decode: decodeURIComponent });
    const matchedPattern = matcherPattern(pathname);

    const matcherTo = match(to, { decode: decodeURIComponent });
    const matchedTo = matcherTo(pathname);

    return !!matchedPattern || !!matchedTo;
  });
};

const NavigationMenu = () => {
  const router = useRouter();
  const vehicle_id = useSelectedVehicle();
  const selectedItem = useSelectedNavItem([
    ...mainMenuItems,
    ...vehicleMenuItems,
    ...utilsMenuItems,
  ]);

  const handleClick = (item: NavigationMenuItem) => () => {
    if (item.disabled === true) return;

    if (item.pattern) {
      if (vehicle_id) {
        const nextPath = item.pattern.replace(":vehicle_id", vehicle_id);
        router.push(nextPath);
        return;
      } else if (item.to) {
        router.push(item.to);
        return;
      }
    } else if (item.to) {
      const nextPath = item.to;
      router.push(nextPath);
    }
    return;
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1 }}>
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
