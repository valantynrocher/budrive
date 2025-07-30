import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";

const DashboardPage = () => {
  return (
    <Stack direction="row" alignItems="flex-start" sx={{ gap: 10 }}>
      <Stack direction="column" sx={{ gap: 4 }}>
        <Stack sx={{ gap: 2, alignItems: "center" }}>
          <Button variant="contained" color="primary">
            Primary
          </Button>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">light</Typography>
              <Box sx={{ bgcolor: "primary.light", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">main</Typography>
              <Box sx={{ bgcolor: "primary.main", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">dark</Typography>
              <Box sx={{ bgcolor: "primary.dark", width: 40, height: 20 }} />
            </Stack>
          </Stack>
        </Stack>
        <Stack sx={{ gap: 2, alignItems: "center" }}>
          <Button variant="contained" color="warning">
            Warning
          </Button>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">light</Typography>
              <Box sx={{ bgcolor: "warning.light", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">main</Typography>
              <Box sx={{ bgcolor: "warning.main", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">dark</Typography>
              <Box sx={{ bgcolor: "warning.dark", width: 40, height: 20 }} />
            </Stack>
          </Stack>
        </Stack>
        <Stack sx={{ gap: 2, alignItems: "center" }}>
          <Button variant="contained" color="error">
            Error
          </Button>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">light</Typography>
              <Box sx={{ bgcolor: "error.light", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">main</Typography>
              <Box sx={{ bgcolor: "error.main", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">dark</Typography>
              <Box sx={{ bgcolor: "error.dark", width: 40, height: 20 }} />
            </Stack>
          </Stack>
        </Stack>
        <Stack sx={{ gap: 2, alignItems: "center" }}>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">light</Typography>
              <Box sx={{ bgcolor: "secondary.light", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">main</Typography>
              <Box sx={{ bgcolor: "secondary.main", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">dark</Typography>
              <Box sx={{ bgcolor: "secondary.dark", width: 40, height: 20 }} />
            </Stack>
          </Stack>
        </Stack>
        <Stack sx={{ gap: 2, alignItems: "center" }}>
          <Button variant="contained" color="info">
            Info
          </Button>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">light</Typography>
              <Box sx={{ bgcolor: "info.light", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">main</Typography>
              <Box sx={{ bgcolor: "info.main", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">dark</Typography>
              <Box sx={{ bgcolor: "info.dark", width: 40, height: 20 }} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="column" sx={{ gap: 4, mt: 4 }}>
        <Stack sx={{ gap: 2, alignItems: "center" }}>
          <Button variant="contained" color="success">
            Success
          </Button>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">light</Typography>
              <Box sx={{ bgcolor: "success.light", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">main</Typography>
              <Box sx={{ bgcolor: "success.main", width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="body2">dark</Typography>
              <Box sx={{ bgcolor: "success.dark", width: 40, height: 20 }} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DashboardPage;
