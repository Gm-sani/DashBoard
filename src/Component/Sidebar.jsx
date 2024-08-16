import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate =useNavigate();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white  ">
      <div className="p-4 text-xl font-bold">Admin Dashboard</div>
      <div className="flex-1 px-2 py-4">
        <div onClick={()=>{navigate("Dashboard")}} className=" py-2 px-4 rounded hover:bg-gray-700 cursor-pointer ">
        Dashboard
        </div>
        <div onClick={()=>{navigate("Products")}} className=" py-2 px-4 rounded hover:bg-gray-700 cursor-pointer">
        Products
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
