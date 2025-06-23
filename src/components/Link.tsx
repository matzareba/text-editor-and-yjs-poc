import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

interface LinkProps extends Omit<RouterLinkProps, "style"> {
  variant?: "nav" | "button";
  children: React.ReactNode;
  isActive?: boolean;
}

const navStyles = {
  textDecoration: "none",
  color: "#666",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  transition: "background-color 0.2s",
};

const navActiveStyles = {
  ...navStyles,
  backgroundColor: "#e9ecef",
  color: "#333",
  fontWeight: "bold",
};

const buttonStyles = {
  display: "inline-block",
  backgroundColor: "#007bff",
  color: "white",
  padding: "0.75rem 1.5rem",
  textDecoration: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  transition: "background-color 0.2s",
};

const hoverStyles = {
  nav: "#e9ecef",
  button: "#0056b3",
};

export const Link: React.FC<LinkProps> = ({
  variant = "nav",
  children,
  isActive = false,
  ...props
}) => {
  const baseStyles =
    variant === "button"
      ? buttonStyles
      : isActive
      ? navActiveStyles
      : navStyles;
  const hoverColor = hoverStyles[variant];

  return (
    <RouterLink
      {...props}
      style={baseStyles}
      onMouseOver={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = hoverColor;
        }
      }}
      onMouseOut={(e) => {
        if (isActive) {
          e.currentTarget.style.backgroundColor = "#e9ecef";
        } else {
          e.currentTarget.style.backgroundColor =
            variant === "button" ? "#007bff" : "transparent";
        }
      }}
    >
      {children}
    </RouterLink>
  );
};
