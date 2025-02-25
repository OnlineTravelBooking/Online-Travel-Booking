import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { MUTATION_LOGIN, ROLE } from "../Graphql";
import { Button, Checkbox, Form, Input, message, Layout } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useLazyQuery } from "@apollo/client";

export default function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const images = ["Login.jpg"];

  const [getRole, { loading: loading_role, error: error_role, data: data_role }] = useLazyQuery(ROLE);

  const [loginMutation, { loading, error, data }] = useMutation(MUTATION_LOGIN);

  const handleSubmit = async (values) => {
    try {
      message.destroy();
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
    } catch (err) {
      message.error("Login failed:", err);
    }
  };

  useEffect(() => {
    if (data_role?.usersPermissionsUsers?.length > 0 && data?.login) {
      const roleType = data_role.usersPermissionsUsers[0].role.type;
      const { jwt } = data.login;
      const user = data_role.usersPermissionsUsers[0];
      login(user, jwt, roleType);

      if (roleType === "user") {
        navigate("/");
      } else if (roleType === "admin") {
        navigate("/admin/create-package");
      }
    }
  }, [data, data_role, navigate]);

  const { Content } = Layout;

  const contentStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 70px)",
    backgroundImage: `url(${images[0]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Content style={contentStyle}>
        <div
          style={{
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Form
            className="formLogin"
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <p className="login-Title">Login</p>
            <p className="login-Subtitle">Sign in to your account</p>
            <Form.Item
              name="username"
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input className="Input-login" placeholder="Username" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name="password"
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                className="Input-login"
                placeholder="Password"
                prefix={<LockOutlined />}
                type="password"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button className="button-Login" type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Form.Item>
            <Form.Item className="Checkbox" name="remember" valuePropName="checked" wrapperCol={{ span: 24 }}>
              <Checkbox className="Checkbox">Remember me</Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }} className="Register-container">
              <Button
                type="primary"
                className="button-Register"
                onClick={() => navigate("/register")} // เปลี่ยนไปหน้า /register
              >
                Register New Account
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}
