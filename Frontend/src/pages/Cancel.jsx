import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold">Payment Failed</h1>
      <p className="text-lg mt-4">Your payment was not successful. Please try again.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-red-500 text-white px-6 py-3 mt-4 rounded-lg hover:bg-red-600"
      >
        Try Again
      </button>
    </div>
  );
};

export default Cancel;
