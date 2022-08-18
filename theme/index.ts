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
        bg: "#030309"
      },

      "*": {
        scrollbarWidth: "6px",
        scrollbarColor: "#7F56D9 transparent"
      },

      "*::-webkit-scrollbar": {
        width: "6px"
      },

      "*::-webkit-scrollbar-track": {
        bg: "transparent"
      },

      "*::-webkit-scrollbar-thumb": {
        bg: "#7F56D9",
        borderRadius: "1.5rem"
      }
    }
  },
  shadows,
  fonts: {
    heading:
      "'Roboto Mono',-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
    body: "'Roboto Mono',-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
    mono: "Menlo, monospace"
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
    Tooltip
  },
  colors: {
    brand: {
      darkerBrown: "#a08b77",
      darkBrown: "#d2bba6",
      lightBrown: "#f5d9c0",
      lighterBrown: "#e4d5c8",
      red: "#d9474b",
      //black: "#312b26",
      black: "#fff",
      white:"#fff"
    }
  },
  textStyles: {
    h1: {
      fontWeight: 700,
      color: "gray.900",
      fontSize: "xl",
      mb: 2,
      letterSpacing: 0.5
    },
    bold: {
      color: "gray.700",
      fontWeight: 700
    },
    light: {
      color: "gray.500",
      fontSize: "sm"
    }
  }

});
