import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { VehiclePageHeaderProps } from "./props";

const VehiclePageHeaderComponent = ({
  title,
  subtitle,
  actions: Actions,
}: VehiclePageHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      {/* Title */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h2">{title}</Typography>
        <Typography>{subtitle}</Typography>
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={2}>
        {Actions}
      </Stack>
    </Box>
  );
};

export default VehiclePageHeaderComponent;
