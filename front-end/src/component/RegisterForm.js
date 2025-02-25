import React, { useState } from "react";
import { Form, Input, Button, Layout, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { MUTATION_REGISTER, MUTATION_LOGIN } from "../Graphql";
import { useAuth } from "../AuthContext";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState({ firstname: "Grace", lastname: "Katherine" });
  const images = ["Login.jpg"];
  const { login } = useAuth();

  const [registerMutation, { loading }] = useMutation(MUTATION_REGISTER);
  const [loginMutation] = useMutation(MUTATION_LOGIN);

  const handleFullNameChange = (e) => {
    const value = e.target.value.split(" ");
    setFullName({
      firstname: value[0] || "",
      lastname: value[1] || "",
    });
  };

  const handleSubmit = async (values) => {

    const registerData = {
      username: values.Username,
      email: values.email,
      Fname: fullName.firstname,
      Lname: fullName.lastname,
      password: values.Password,
      role: 5,
      confirmed: true,
    };

    
    try {
      const result = await registerMutation({
        variables: {
          data: registerData,
        },
      });


      const loginResult = await loginMutation({
        variables: {
          input: {
            identifier: values.Username,
            password: values.Password,
          },
        },
      });

      const jwt = loginResult.data.login.jwt;
      const userData = {
        username: values.Username,
        Fname: fullName.firstname,
        Lname: fullName.lastname,
        email: values.email
      };
      message.destroy();
      login(userData, jwt, "user");
      message.success("สมัครสมาชิกสำเร็จและล็อกอินแล้ว!");
      navigate("/");

    } catch (err) {
      if (err.graphQLErrors) {
        message.destroy();
        if (err.graphQLErrors[0].message === "Email already taken") {
          message.error("Email นี้ถูกใช้แล้ว!", { style: { color: "red" } });
        } else if (err.graphQLErrors[0].message === "Username already taken") {
          message.error("Username นี้ถูกใช้แล้ว!", { style: { color: "red" } });
        } else {
          message.error("สมัครสมาชิกล้มเหลว! " + err.graphQLErrors[0].message);
        }
      } else {
        message.destroy();
        message.error("สมัครสมาชิกล้มเหลว! เกิดข้อผิดพลาดที่ไม่รู้จัก");
      }
    }
  };

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
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <p className="login-Title">Register</p>
            <p className="login-Subtitle">Create your new account</p>
            <Form.Item
              name="Fullname"
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: "Please input your full name!" }]}
            >
              <Input
                className="Input-login"
                value={`${fullName.firstname} ${fullName.lastname}`}
                onChange={handleFullNameChange}
                placeholder="First name and Last name"
              />
            </Form.Item>
            <Form.Item
              name="email"
              wrapperCol={{ span: 24 }}
              rules={[
                { required: true, message: "กรุณากรอก Email!" },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email ไม่ถูกต้อง! ต้องมี @ และ domain เช่น example.com"
                }
              ]}
            >
              <Input className="Input-login" type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="Username"
              wrapperCol={{ span: 24 }}
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                className="Input-login"
                placeholder="Username"
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="Password"
              wrapperCol={{ span: 24 }}
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัว!" },
                { max: 20, message: "รหัสผ่านต้องไม่เกิน 20 ตัว!" },
                { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/, message: "รหัสต้องมีตัวอักษร ตัวเลข และอักขระพิเศษ!" },
              ]}
            >
              <Input.Password
                className="Input-login"
                placeholder="Password"
                prefix={<LockOutlined />}
                visibilityToggle={false}
              />
            </Form.Item>
            <Form.Item
              name="Confirm password"
              wrapperCol={{ span: 24 }}
              rules={[
                { required: true, message: "Please input your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("Password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("รหัสผ่านไม่ตรงกัน!");
                  },
                }),
              ]}
            >
              <Input.Password
                className="Input-login"
                placeholder="Confirm password"
                prefix={<LockOutlined />}
                visibilityToggle={false}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                className="button-Login"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Create new account
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                onClick={() => navigate("/")}
                className="button-Register"
                type="primary"
              >
                Go back to login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}