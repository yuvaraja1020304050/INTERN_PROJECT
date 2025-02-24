import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Subscription from "./pages/Subscription";
import Checkout from "./pages/Checkout";
import PremiumDashboard from "./pages/PremiumDashboard";
import Success from "./pages/Success";  // Import Success page
import Cancel from "./pages/Cancel";  // Import Cancel page
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QvgE2PttfWc6sY22QCNXZxhr3X3pXiMTAqX5qoymMcb3o2GlGoCc2fuSJqLjzSvKMxddPapUqMSc7VChIojThTc00srKxCx4T");

const App = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [phone, setPhone] = useState("");  // Hardcoding phone number for now
  console.log(phone)
  // Function to check if user is premium based on phone
  const checkPremiumStatus = async (phone) => {
    try {
      const response = await fetch(`http://localhost:5000/check-premium/${phone}`);
      const data = await response.json();
      setIsPremiumUser(data.isPremium);
      console.log(isPremiumUser)  // Set the premium status based on response
    } catch (error) {
      console.error("Error checking premium status", error);
    }
  };

  useEffect(() => {
    setPhone("2345")
    checkPremiumStatus(phone);
  }, []);  
 
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Subscription setSelectedPlan={setSelectedPlan} />} />
        <Route
          path="/checkout"
          element={
            selectedPlan ? (
              <Elements stripe={stripePromise}>
                <Checkout selectedPlan={selectedPlan} setIsPremiumUser={setIsPremiumUser} />
              </Elements>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        {/* Redirect to Premium Dashboard if user is premium */}
        <Route
          path="/premium-dashboard"
          element={isPremiumUser ? <PremiumDashboard /> : <Navigate to="/" />}
        />
        {/* Add routes for Success and Cancel */}
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </Router>
  );
};

export default App;
