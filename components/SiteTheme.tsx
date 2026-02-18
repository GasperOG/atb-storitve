import React from "react";

type Props = { children: React.ReactNode };

export default function SiteTheme({ children }: Props) {
  // Barve iz logotipa: primarna modra, akcetna rdeca, nevtralna ozadje
  const themeVarsRecord: Record<string, string> = {
    "--color-primary": "#1464FF", // posodobljeno na modro iz priponke
    "--color-accent": "#d61f26",
    "--color-muted": "#f3f4f6",
    "--color-foreground": "#111827",
    "--color-background": "#ffffff",
  };
  const themeVars = themeVarsRecord as React.CSSProperties;

  return (
    <div style={themeVars} className="min-h-screen">
      {children}
    </div>
  );
}
