import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
export const UserHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid">
      <div className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item
            key="3"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export const LoggedIn = () => {
  return (
    <div className="container-fluid">
      <div className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item>User</Menu.Item>
        </Menu>
      </div>
    </div>
  );
};
