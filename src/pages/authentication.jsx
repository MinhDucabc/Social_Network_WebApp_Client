import React, { useState } from "react";
import LoginForm from "../components/auth/login.jsx";
import SignupForm from "../components/auth/signup.jsx";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div
      className="w-full h-screen flex bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/authentication_background_image.jpg')",
      }}
    >
      {/* Bên trái để ảnh hoặc bỏ trống */}
      <div className="w-1/2 hidden md:block"></div>
      {/* Bên phải chứa form */}
      <div className="w-1/2 md:w-1/2 bg-white/90 backdrop-blur-sm flex flex-col justify-center items-center p-8">
        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab("login")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === "login"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === "signup"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Đăng ký
          </button>
        </div>

        <div className="w-full max-w-md">
          {activeTab === "login" ? <LoginForm setActiveTab={setActiveTab}/> : <SignupForm setActiveTab={setActiveTab}/>}
        </div>
      </div>
    </div>
  );
}
