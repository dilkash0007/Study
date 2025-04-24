import React from "react";
import { Helmet } from "react-helmet";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function PageLayout({
  children,
  title,
  className = "",
}: PageLayoutProps) {
  return (
    <>
      {title && (
        <Helmet>
          <title>{title} | StarryJourney</title>
        </Helmet>
      )}
      <div className={`container mx-auto px-4 py-6 ${className}`}>
        {children}
      </div>
    </>
  );
}
