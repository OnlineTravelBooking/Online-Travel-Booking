import React, { useEffect, useState } from "react";
import PackageCard from "./PackageCard";

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
    <div>
      <h1>Favorite Packages</h1>
      {/* ส่ง favorites ไปที่ filters ใน PackageCard */}
      <PackageCard filters={{ favorites }} />
    </div>
  );
}