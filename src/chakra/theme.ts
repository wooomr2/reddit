import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

const colors = {
  brand: {
    100: "#FF3C00",
  },
};

const fonts = {
  body: "Open Sans, sans-serif",
};

const styles = {
  global: () => ({
    body: {
      bg: "gray.200",
    },
  }),
};

const components = {
  Button,
};

export const theme = extendTheme({ colors, fonts, styles, components });
