"use client";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const FavoritesButtonComponent = () => {
  const [favorites, setFavorites] = useState(false);
  const toggleFavorites = () => setFavorites(!favorites);

  return (
    <Button
      variant="outlined"
      color="warning"
      startIcon={favorites ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
      onClick={toggleFavorites}
      sx={{
        minWidth: 0,
        padding: 1,
        "& >.MuiButton-icon": {
          margin: 0,
        },
      }}
    />
  );
};

export default FavoritesButtonComponent;
