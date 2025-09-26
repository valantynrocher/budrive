import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import MuiIcon from "@mui/material/Icon";
import { IconCardProps } from "./props";

const IconCard = ({ icon: Icon, title, value, sx }: IconCardProps) => {
  return (
    <Card
      sx={{
        textAlign: "center",
        padding: 1,
        ...sx,
      }}
    >
      <MuiIcon>{Icon}</MuiIcon>
      <Typography variant="caption" display="block" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="subtitle2" fontWeight="bold">
        {value}
      </Typography>
    </Card>
  );
};

export default IconCard;
