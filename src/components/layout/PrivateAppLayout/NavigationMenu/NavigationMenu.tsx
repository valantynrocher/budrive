import CarRepairRoundedIcon from "@mui/icons-material/CarRepairRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import PaletteIcon from "@mui/icons-material/Palette";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
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

const mainListItems: NavigationMenuItem[] = [
  {
    id: "my-vehicle",
    text: "Mon véhicule",
    icon: <DirectionsCarRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id",
  },
  {
    id: "insurance",
    text: "Mon asssurance",
    icon: <ShieldRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id/assurance",
  },
  {
    id: "repairs",
    text: "Mes réparations",
    icon: <CarRepairRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id/reparations",
  },
  {
    id: "documents",
    text: "Mes documents",
    icon: <FolderRoundedIcon />,
    pattern: "/app/dashboard/:vehicle_id/documents",
  },
];

const utilsListItems: NavigationMenuItem[] = [
  {
    id: "palette",
    text: "Palette",
    icon: <PaletteIcon />,
    to: "/app/utils/palette",
    disabled: false,
  },
];

const useSelectedNavItem = () => {
  const pathname = usePathname();

  return mainListItems.find((item) => {
    if (!item.pattern) return false;

    const matcher = match(item.pattern, { decode: decodeURIComponent });
    const matched = matcher(pathname);

    if (matched) {
    }
    return !!matched;
  });
};

const NavigationMenu = () => {
  const router = useRouter();
  const selectedItem = useSelectedNavItem();
  const { id } = selectedItem || {};

  const handleClick = (item: NavigationMenuItem) => () => {
    if (item.disabled) return;

    // TODO : manage item with a path pattern
    if (item.pattern) return;

    if (!item.to) return;

    const nextPath = item.to;
    router.push(nextPath);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List>
        {mainListItems.map((item) => (
          <ListItem
            key={item.id}
            sx={{ display: "block" }}
            onClick={handleClick(item)}
          >
            <ListItemButton selected={item.id === id}>
              <ListItemIcon sx={{ color: "secondary.main" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {utilsListItems.map((item) => (
          <ListItem
            key={item.id}
            sx={{ display: "block" }}
            onClick={handleClick(item)}
          >
            <ListItemButton selected={item.id === id}>
              <ListItemIcon sx={{ color: "warning.main" }}>
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
