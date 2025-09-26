import FavoritesButton from "@/app/dashboard/[vehicle_id]/vehicule/FavoritesButton";
import IconCard from "@/components/ui/IconCard";
import VehiclePageHeader from "@/components/ui/VehiclePageHeader";
import { getVehicleById } from "@/data/vehicles";
import { formatRegistration } from "@/utils/fp/vehicles";
import { SelectedVehicleParams } from "@/utils/hooks/useSelectedVehicle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SettingsIcon from "@mui/icons-material/Settings";
import SpeedIcon from "@mui/icons-material/Speed";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HistoryIcon from "@mui/icons-material/History";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Avatar from "@mui/material/Avatar";
import BuildIcon from "@mui/icons-material/Build";
import VerifiedIcon from "@mui/icons-material/Verified";

interface VehiclePageProps {
  params: Promise<SelectedVehicleParams>;
}

const VehiclePage = async ({ params }: VehiclePageProps) => {
  const { vehicle_id } = await params;
  const vehicle = getVehicleById(vehicle_id);

  return (
    <Stack spacing={2}>
      <VehiclePageHeader
        title="Mon véhicule"
        subtitle="Gérez les informations et l'historique de votre véhicule"
        actions={
          <>
            <FavoritesButton />
            <Button
              size="small"
              startIcon={<EditIcon fontSize="small" />}
              sx={{
                p: 1,
                color: "common.white",
                // typography: "caption",
                textTransform: "none",
                background:
                  "linear-gradient(90deg,rgba(242, 191, 108, 1) 30%, rgba(246, 154, 151, 1) 100%);",
              }}
            >
              Modifier
            </Button>
          </>
        }
      />

      <Card
        sx={{
          padding: 2,
          backgroundColor: "background.default",
          borderRadius: 2,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "divider",
          display: "flex",
        }}
      >
        {/* Left column */}
        <Box sx={{ width: "40%", height: "100%", margin: "auto" }}>
          <Image
            src="/peugeot-207.jpg"
            alt=""
            width="438"
            height="205"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>

        <div
          style={{
            width: 20,
          }}
        />

        {/* Right column */}
        <Stack
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {vehicle?.make} {vehicle?.model}
            <Chip
              label={vehicle ? formatRegistration(vehicle?.registration) : ""}
              sx={{ ml: 2 }}
              color="success"
            />
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconCard
              icon={<CalendarMonthIcon color="warning" />}
              title="Année"
              value={vehicle?.year ?? ""}
              sx={{ flex: 1 }}
            />
            <IconCard
              icon={<SpeedIcon color="error" />}
              title="Kilométrage"
              value={(vehicle?.mileage ?? "") + " km"}
              sx={{ flex: 1 }}
            />
            <IconCard
              icon={<LocalGasStationIcon color="secondary" />}
              title="Carburant"
              value={vehicle?.fuel ?? ""}
              sx={{ flex: 1 }}
            />
            <IconCard
              icon={<SettingsIcon color="info" />}
              title="Transmission"
              value={vehicle?.transmission ?? ""}
              sx={{ flex: 1 }}
            />
          </Stack>
        </Stack>
      </Card>

      <Stack direction="row" spacing={2}>
        <Card
          sx={{
            padding: 2,
            backgroundColor: "background.default",
            borderRadius: 2,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "divider",
            width: "50%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textAlign: "left",
              mb: 2,
            }}
          >
            <InfoRoundedIcon color="warning" fontSize="small" />
            Informations générales
          </Typography>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    color: "text.secondary",
                    textAlign: "left",
                    typography: "caption",
                  }}
                >
                  Marque
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  {vehicle?.make}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    color: "text.secondary",
                    textAlign: "left",
                    typography: "caption",
                  }}
                >
                  Modèle
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  {vehicle?.model}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    color: "text.secondary",
                    textAlign: "left",
                    typography: "caption",
                  }}
                >
                  Date d&apos;achat
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  20 janvier 2015
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    color: "text.secondary",
                    textAlign: "left",
                    typography: "caption",
                  }}
                >
                  Prix d&apos;achat
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  6,200 €
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    color: "text.secondary",
                    textAlign: "left",
                    typography: "caption",
                  }}
                >
                  Couleur
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  Gris antracite
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    color: "text.secondary",
                    textAlign: "left",
                    typography: "caption",
                  }}
                >
                  Nombre de places
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  5
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    color: "text.secondary",
                    textAlign: "left",
                    typography: "caption",
                  }}
                >
                  Statut
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  <Chip label="En service" color="success" size="small" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
        <Card
          sx={{
            padding: 2,
            backgroundColor: "background.default",
            borderRadius: 2,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "divider",
            width: "50%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textAlign: "left",
              mb: 2,
            }}
          >
            <HistoryIcon color="error" fontSize="small" />
            Activités récentes
          </Typography>

          <Stack spacing={1}>
            <Card
              sx={{
                display: "flex",
                backgroundColor: "transparent",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "divider",
                p: 1.25,
                gap: 1,
              }}
            >
              <Avatar
                sx={{ backgroundColor: "warning.main" }}
                variant="rounded"
              >
                <VerifiedIcon />
              </Avatar>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                      }}
                    >
                      Contre-visite
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      25 €
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                      }}
                    >
                      Autovision - 18/07/2025
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        textAlign: "right",
                      }}
                    >
                      xxxxxx km
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            <Card
              sx={{
                display: "flex",
                backgroundColor: "transparent",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "divider",
                p: 1.25,
                gap: 1,
              }}
            >
              <Avatar sx={{ backgroundColor: "info.main" }} variant="rounded">
                <BuildIcon />
              </Avatar>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                      }}
                    >
                      Pièces
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      52,59 €
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                      }}
                    >
                      Oscaro.com - 09/07/2025
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        textAlign: "right",
                      }}
                    >
                      xxxxxx km
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            <Card
              sx={{
                display: "flex",
                backgroundColor: "transparent",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "divider",
                p: 1.25,
                gap: 1,
              }}
            >
              <Avatar sx={{ backgroundColor: "info.main" }} variant="rounded">
                <BuildIcon />
              </Avatar>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                      }}
                    >
                      Pièces
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      50 €
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                      }}
                    >
                      Casse - 09/07/2025
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        textAlign: "right",
                      }}
                    >
                      xxxxxx km
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            <Card
              sx={{
                display: "flex",
                backgroundColor: "transparent",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "divider",
                p: 1.25,
                gap: 1,
              }}
            >
              <Avatar
                sx={{ backgroundColor: "warning.main" }}
                variant="rounded"
              >
                <VerifiedIcon />
              </Avatar>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                      }}
                    >
                      Contrôle technique
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      71 €
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                      }}
                    >
                      Autovision - 04/07/2025
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        textAlign: "right",
                      }}
                    >
                      xxxxxx km
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            <Card
              sx={{
                display: "flex",
                backgroundColor: "transparent",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "divider",
                p: 1.25,
                gap: 1,
              }}
            >
              <Avatar sx={{ backgroundColor: "info.main" }} variant="rounded">
                <BuildIcon />
              </Avatar>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                      }}
                    >
                      Pneus avant + parallélisme
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      215,65 €
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                      }}
                    >
                      Norauto - 03/07/2025
                    </TableCell>
                    <TableCell
                      padding="none"
                      sx={{
                        border: 0,
                        typography: "caption",
                        textAlign: "right",
                      }}
                    >
                      xxxxxx km
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
};

export default VehiclePage;
