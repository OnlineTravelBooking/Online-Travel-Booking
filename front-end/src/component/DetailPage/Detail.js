import React from "react";
import { UserHeader } from "../Header";
import { useAuth } from "../../AuthContext";
import { useLocation } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default function Detail() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { documentId, Title, Price, Type, Description } = location.state || {};
  const content = [
    {
      type: "paragraph",
      children: [{ type: "text", text: "A simple paragraph" }],
    },
  ];
  console.log("description:", Description);
  return (
    <div>
      <UserHeader />
      <div>
        <div>{Title}</div>
        <div>
          <BlocksRenderer content={Description} />
        </div>
      </div>
    </div>
  );
}
