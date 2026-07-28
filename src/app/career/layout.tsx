import React from "react";
import { CareerProvider } from "../../context/CareerContext";

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CareerProvider>{children}</CareerProvider>;
}
