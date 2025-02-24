import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PremiumDashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const phone = 2345;  // Assuming phone number is stored in localStorage
console.log("hi")
  useEffect(() => {
    if (!phone) {
      navigate("/");  // If no phone is found, redirect to subscription page
      return;
    }

    const checkPremiumStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/check-premium/${phone}`);
        const data = await response.json();

        if (data.isPremium) {
          setIsPremium(true);
        } else {
          navigate("/");  // Redirect to the subscription page if not premium
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
        navigate("/");  // If there's an error, redirect to subscription page
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, [phone, navigate]);

  if (loading) return <div>Loading...</div>;

  if (!isPremium) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <h1 className="text-xl font-bold">Redirecting...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold">Welcome to Premium Dashboard</h1>
      <p className="text-lg mt-4">Enjoy your exclusive premium features! 🎉</p>
    </div>
  );
};

export default PremiumDashboard;
