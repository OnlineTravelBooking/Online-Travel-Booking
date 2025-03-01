import React, { useEffect, useState } from "react";
import PackageCard from "./PackageCard";
import { UserHeader } from "../Header/UserHeader";
import BackToTop from "./BackToTop";

export default function FavoritePackage() {
  const [favorites, setFavorites] = useState([]);

  // ดึงข้อมูล favorites จาก localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  // ถ้าไม่มี favorites เลย ให้แสดงข้อความแจ้งว่าไม่มีแพ็คเกจ
  if (favorites.length === 0) {
    return (
      <div>
        <h1>Favorite Packages</h1>
        <p>ไม่มีแพ็คเกจที่ได้ทำการกดใจไว้</p>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: "#F6F4F0", 
      minHeight: "100vh", 
      width: "100%",  
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center",
    }}>
      <UserHeader />
      <BackToTop />
      <h1 style={{ display: "flex", justifyContent: "center", width: "100%", color: "#2E5077", marginTop: "20px", marginBottom: "0px", fontSize: "50px" }}>
         Favorite Packages
      </h1>
      <PackageCard filters={{ favorites }} />
    </div>
  );
  
}