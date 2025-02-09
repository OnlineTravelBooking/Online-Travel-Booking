import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export default function RegisterForm({ setIsRegister }) {
  const [fullName, setFullName] = useState({ firstname: "", lastname: "" });

  const handleFullNameChange = (e) => {
    const value = e.target.value.split(" ");
    setFullName({
      firstname: value[0] || "",
      lastname: value[1] || "",
    });
  };
  return (
    <Form
      className="formRegister"
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <p className="login-Title">Register</p>
      <p className="login-Subtitle">Create your new account</p>
      <div className="Input-Box">
        <Form.Item
          name="Fullname"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            className="Input-register"
            value={`${fullName.firstname} ${fullName.lastname}`}
            onChange={handleFullNameChange}
            placeholder="First name and Last name"
          />
        </Form.Item>
        <Form.Item
          name="email"
          wrapperCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input className="Input-register" type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="Username"
          wrapperCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            className="Input-register"
            placeholder="Username"
            prefix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item
          name="Password"
          wrapperCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            className="Input-register"
            placeholder="Password"
            prefix={<LockOutlined />}
            visibilityToggle={false}
          />
        </Form.Item>
        <Form.Item
          name="Confirm password"
          wrapperCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            className="Input-register"
            placeholder="Confirm password"
            prefix={<LockOutlined />}
            visibilityToggle={false}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            onClick={() => setIsRegister(false)}
            className="button_Register"
            type="primary"
            htmlType="submit"
          >
            Create new account
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            onClick={() => setIsRegister(false)}
            className="button_Register"
            type="primary"
          >
            Go back to login
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
}
