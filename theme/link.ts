const link = {
  variants: {
    submit: {
      transition: "0.2s all",
      outline: "none",
      border: "solid 2px #d9474b",
      borderRadius: "md",
      color: "white",
      bg: "accent.600",
      pl: "5",
      pr: "6",
      _hover: {
        color: "accent.600",
        bg: "transparent",
        textDecoration: "none",
      },
    },
    footer: {
      color: "white",
      textUnderlineOffset: "0.3rem",
    },
    docs: {
      textUnderlineOffset: "0.3rem",
    },
  },
};

export default link;
