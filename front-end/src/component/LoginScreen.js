import React, { useState, useEffect } from "react";
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
        navigate("/home");
      } else if (roleType === "admin") {
        navigate("/admin");
      }
    }
  }, [data_role, navigate]);

  const { Content } = Layout;

  const contentStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 70px)",
    backgroundImage:
      "url('https://scontent.fbkk9-3.fna.fbcdn.net/v/t39.30808-6/297825257_5731344180211280_6680882033599668400_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=vSj_xU3_r0UQ7kNvgH-jnlS&_nc_oc=AdjTTmV9WdLAFzBpcHDLWc3Sl-m4zT8IEtEBruSMCEd4DhQ20KY9CyMzHA5CFI2b50M&_nc_zt=23&_nc_ht=scontent.fbkk9-3.fna&_nc_gid=AzRm1E9yElllBt5tmo4cyJ-&oh=00_AYC-Q__4mJxJD1zBbpvO5svsM4_ATdG0uRFrKIy_RmMfHw&oe=67ABBCA4')",
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
              <Input
                className="Inputusername"
                placeholder="Username"
                prefix={<UserOutlined />}
              />
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
                className="Inputpassword"
                placeholder="Password"
                prefix={<LockOutlined />}
                type="password"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                className="button-Login"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
            <Form.Item
              className="Checkbox"
              name="remember"
              valuePropName="checked"
              wrapperCol={{ span: 24 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}
