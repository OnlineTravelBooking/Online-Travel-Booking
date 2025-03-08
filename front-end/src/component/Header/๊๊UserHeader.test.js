import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserHeader } from "./UserHeader";
import * as AuthContext from "../../AuthContext";
import { useNavigate } from "react-router-dom";

// การ mock useNavigate hook เพื่อจับการเรียกใช้งานการนำทาง
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(), // mock useNavigate ให้เป็นฟังก์ชันจำลอง
}));

describe("UserHeader Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui, { route = "/" } = {}) => {
    return render(
      <MemoryRouter
        initialEntries={[route]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {ui}
      </MemoryRouter>
    );
  };

  // ทดสอบเมื่อคลิกเมนู "เข้าสู่ระบบ" และนำทางไปหน้าล็อกอิน
  test('เมื่อคลิก "เข้าสู่ระบบ" จะนำทางไปยังหน้าล็อกอิน', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
      data: {},
    });

    renderWithRouter(<UserHeader />);

    const loginMenuItem = await screen.findByText("เข้าสู่ระบบ");
    fireEvent.click(loginMenuItem);

    expect(mockNavigate).toHaveBeenCalledWith("/login"); // นำทางไปหน้าล็อกอิน
  });

  // ทดสอบเมื่อคลิกเมนู "ลงทะเบียน" และนำทางไปหน้าลงทะเบียน
  test('เมื่อคลิก "ลงทะเบียน" จะนำทางไปยังหน้าลงทะเบียน', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
      data: {},
    });

    renderWithRouter(<UserHeader />);

    const registerMenuItem = await screen.findByText("ลงทะเบียน");
    fireEvent.click(registerMenuItem);

    expect(mockNavigate).toHaveBeenCalledWith("/register"); // นำทางไปหน้าลงทะเบียน
  });

  // ทดสอบเมื่อผู้ใช้คลิก "ตรวจสอบสถานะการจองทัวร์"
  test('เมื่อคลิก "ตรวจสอบสถานะการจองทัวร์" จะนำทางไปยังหน้าสถานะการจองทัวร์', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      data: { Fname: "Monai", Lname: "Suchatanon" },
    });

    renderWithRouter(<UserHeader />);

    const statusMenuItem = await screen.findByText("ตรวจสอบสถานะการจองทัวร์");
    fireEvent.click(statusMenuItem);

    expect(mockNavigate).toHaveBeenCalledWith("/status");
  });
});
