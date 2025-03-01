import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { DesktopOutlined, FileOutlined, PlusCircleFilled, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../AuthContext";
const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem("Create Package", "1", <PlusCircleFilled />),
  getItem("Verify Slip", "2", <DesktopOutlined />),
  getItem("Approved List", "3", <FileOutlined />),
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname.includes("/admin/approve")) return ["3"];
    if (location.pathname.includes("/admin/verify")) return ["2"];
    return ["1"];
  };

  return (
    <Sider collapsible style={{ display: "flex", flexDirection: "column", backgroundColor: "#005C78" }}>
      <div>
        <Menu
          className="Menu-admin"
          selectedKeys={getSelectedKey()}
          mode="inline"
          items={items}
          onSelect={({ key }) => {
            switch (key) {
              case "1":
                navigate("/admin/create-package");
                break;
              case "2":
                navigate("/admin/verify");
                break;
              case "3":
                navigate("/admin/approve");
                break;
              default:
                break;
            }
          }}
        />
      </div>
      <Menu
        className="logout-menu"
        mode="inline"
        style={{ marginTop: "auto" }}
        items={[getItem(<span>Logout</span>, "4", <LogoutOutlined />)]}
        onSelect={({ key }) => {
          if (key === "4") {
            logout();
            navigate("/login");
          }
        }}
      />
    </Sider>
  );
}
