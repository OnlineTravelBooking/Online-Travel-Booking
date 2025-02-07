import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { MUTATION_LOGIN, ROLE } from "../Graphql";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useMutation, useLazyQuery } from "@apollo/client";

export default function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [userRole, setUserRole] = useState(null);

  const [
    getRole,
    { loading: loading_role, error: error_role, data: data_role },
  ] = useLazyQuery(ROLE);

  const [loginMutation, { loading, error, data }] = useMutation(MUTATION_LOGIN);
  const handleSubmit = async (values) => {
    try {
      await loginMutation({
        variables: {
          input: {
            identifier: values.username,
            password: values.password,
          },
        },
      });

      await getRole({
        variables: {
          filters: {
            username: {
              eq: values.username,
            },
          },
        },
      });

      console.log("is Running");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    if (data_role?.usersPermissionsUsers?.length > 0) {
      console.log(data_role);
      const roleType = data_role.usersPermissionsUsers[0].role.type;
      setUserRole(roleType);

      if (data?.login) {
        const { jwt, user } = data.login;
        login(user, jwt, roleType);
      }

      // Use roleType directly for navigation:
      if (roleType === "user") {
        navigate("/");
      } else if (roleType === "admin") {
        navigate("/admin");
      }
    }
  }, [data_role, navigate]);

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" label={null}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
