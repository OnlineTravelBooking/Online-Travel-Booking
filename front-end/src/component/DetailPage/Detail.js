import React, { useState } from "react";
import { UserHeader } from "../Header";
import { useAuth } from "../../AuthContext";
import { useLocation } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

export default function Detail() {
  const location = useLocation();
  const { documentId, Title, Price, Type, Description } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(Price);
  const [count, setCount] = useState(1);
  return (
    <div>
      <UserHeader />
      <div>
        <div>{Title}</div>
        <div>
          <div>{Type}</div>
          <BlocksRenderer content={Description} />
        </div>
        <div>{count}</div>
        <div>
          <Button
            type="primary"
            shape="circle"
            icon={<MinusOutlined />}
            onClick={() =>
              count > 1 ? setCount((count) => count - 1) : setCount(1)
            }
          />
          {count === 0 ? totalPrice : totalPrice * count}
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => setCount((count) => count + 1)}
          />
        </div>
      </div>
    </div>
  );
}
