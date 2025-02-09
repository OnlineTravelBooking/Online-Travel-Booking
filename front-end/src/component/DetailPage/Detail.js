import React from "react";
import { UserHeader } from "../Header";
import { useAuth } from "../../AuthContext";

export default function Detail() {
  const { isAuthenticated } = useAuth();

  console.log("Auth: ", isAuthenticated);
  return (
    <div>
      <UserHeader />
      <div>
        <h1>Detail YAY!</h1>
      </div>
    </div>
  );
}
