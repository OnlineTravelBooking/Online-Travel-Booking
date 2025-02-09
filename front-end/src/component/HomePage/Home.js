import React from "react";
import { UserHeader } from "../Header";
import { useAuth } from "../../AuthContext";
import PackageCard from "./PackageCard";

export default function Home() {
  const { isAuthenticated } = useAuth();
  console.log("Auth: ", isAuthenticated);
  return (
    <div>
      <UserHeader />
      <div>{<PackageCard /> ? <PackageCard /> : <h1>No Package Data</h1>}</div>
    </div>
  );
}
