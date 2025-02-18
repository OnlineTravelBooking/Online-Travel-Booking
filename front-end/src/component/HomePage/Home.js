import React from "react";
import { UserHeader } from "../Header/UserHeader";
import { useAuth } from "../../AuthContext";
import PackageCard from "./PackageCard";
import Slide from "./Slide-img";

export default function Home() {
  const { isAuthenticated } = useAuth();
  console.log("Auth: ", isAuthenticated);
  return (
    <div>
      <UserHeader />
      <div>
        <Slide />
      </div>
      <div>{<PackageCard /> ? <PackageCard /> : <h1>No Package Data</h1>}</div>
    </div>
  );
}
