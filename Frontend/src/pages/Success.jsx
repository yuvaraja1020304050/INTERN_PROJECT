import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const phone = queryParams.get("phone");

  useEffect(() => {
    const checkPremiumStatus = async () => {
      // Check the premium status using the phone number
      if (!phone) {
        setLoading(false);  // If no phone number, skip API call
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/check-premium/${phone}`);
        const data = await response.json();
        setIsPremium(data.isPremium);  // Set premium status based on API response
      } catch (error) {
        console.error("Error checking premium status", error);
      } finally {
        setLoading(false);
      }
    };

    if (phone) {
      checkPremiumStatus();
    } else {
      setLoading(false);  // If no phone param, stop loading
    }
  }, [phone]);

  if (loading) return <div>Loading...</div>;  // Show loading while fetching

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold">Payment Success!</h1>
      <p className="text-lg mt-4">
        {isPremium ? "Congratulations, you're now a premium user!" : "Something went wrong with upgrading your account."}
      </p>
      {isPremium && (
        <button
          onClick={() => navigate("/premium-dashboard")}
          className="bg-green-500 text-white px-6 py-3 mt-4 rounded-lg hover:bg-green-600"
        >
          Go to Premium Dashboard
        </button>
      )}
    </div>
  );
};

export default Success;
