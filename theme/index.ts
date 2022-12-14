import { extendTheme } from "@chakra-ui/react";

import Accordion from "./accordion";
import Button from "./button";
import Heading from "./heading";
import Input from "./input";
import Link from "./link";
import Menu from "./menu";
import Modal from "./modal";
import Popover from "./popover";
import Spinner from "./spinner";
import Slider from "./slider";
import Tabs from "./tabs";
import Tooltip from "./tooltip";

import shadows from "./shadows";

export default extendTheme({
  styles: {
    global: {
      "html, body": {
        bg: "#030309",
      },

      "*": {
        scrollbarWidth: "6px",
        scrollbarColor: "#7F56D9 transparent",
      },

      "*::-webkit-scrollbar": {
        width: "6px",
      },

      "*::-webkit-scrollbar-track": {
        bg: "transparent",
      },

      "*::-webkit-scrollbar-thumb": {
        bg: "#7F56D9",
        borderRadius: "1.5rem",
      },
    },
  },
  shadows,
  fonts: {
    heading:
      "'Roboto Mono',-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
    body: "'Roboto Mono',-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
    mono: "Menlo, monospace",
  },
  components: {
    Accordion,
    Button,
    Heading,
    Input,
    Link,
    Menu,
    Modal,
    Popover,
    Spinner,
    Slider,
    Tabs,
    Tooltip,
  },
  colors: {
    "accent": {
      "50": "#F1ECF9",
      "100": "#D6C9EE",
      "200": "#BCA6E3",
      "300": "#A283D8",
      "400": "#8860CD",
      "500": "#6E3DC2",
      "600": "#58319B",
      "700": "#422574",
      "800": "#2C184E",
      "900": "#160C27"
    },
    brand: {
      darkerBrown: "#a08b77",
      darkBrown: "hsl(262deg 52% 70%)",
      lightBrown: "hsl(262deg 52% 80%)",
      lighterBrown: "#e4d5c8",
      red: "hsl(262deg 52% 40%)",
      accent_light: "hsl(262deg 55% 55%)",
      //black: "#312b26",
      black: "#fff",
      white: "#fff",
    },
  },
  textStyles: {
    h1: {
      fontWeight: 700,
      color: "gray.900",
      fontSize: "xl",
      mb: 2,
      letterSpacing: 0.5,
    },
    bold: {
      color: "gray.700",
      fontWeight: 700,
    },
    light: {
      color: "gray.500",
      fontSize: "sm",
    },
  },
});
