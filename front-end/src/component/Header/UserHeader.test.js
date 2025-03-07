import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserHeader } from "./UserHeader";
import * as AuthContext from "../../AuthContext";

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

  test('เมื่อยังไม่ได้ล็อกอิน จะแสดงเมนู "เข้าสู่ระบบ" และ "ลงทะเบียน"', async () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
      data: {},
    });

    renderWithRouter(<UserHeader />);

    expect(await screen.findByText("เข้าสู่ระบบ")).toBeInTheDocument();
    expect(await screen.findByText("ลงทะเบียน")).toBeInTheDocument();
  });

  test('เมื่อล็อกอินแล้ว จะแสดง "Favorite package", "ตรวจสอบสถานะการจองทัวร์" และชื่อผู้ใช้', async () => {
    const mockLogout = jest.fn();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
      data: { Fname: "Pacharapol", Lname: "Piyadilok" },
    });

    renderWithRouter(<UserHeader />, { route: "/" });

    expect(await screen.findByText("Favorite package")).toBeInTheDocument();
    expect(await screen.findByText("ตรวจสอบสถานะการจองทัวร์")).toBeInTheDocument();
    expect(await screen.findByText(/Pacharapol Piyadilok/)).toBeInTheDocument();
  });
});
