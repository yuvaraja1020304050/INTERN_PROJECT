import React from "react";
import { useNavigate } from "react-router-dom";

const Subscription = ({ setSelectedPlan }) => {
  const navigate = useNavigate();

  const plans = [
    { name: "Basic", price: "₹100/month", image: "https://media.istockphoto.com/id/1474695217/vector/black-orange-brown-abstract-background-geometric-shape-bronze-color-gradient-glow-light-3d.jpg?s=612x612&w=0&k=20&c=yBRIJ_jL4s_CMsOzgjAhnPnyPQp5_Y0Mmt_NoZ0MWeI=", features: ["✔️ No Ads", "✔️ Basic Insights"] },
    { name: "Standard", price: "₹200/month", image: "https://t3.ftcdn.net/jpg/01/04/29/98/360_F_104299843_wGivOQEUpGNO7TrISPP5S1QR7JqOo4Aa.jpg", features: ["✔️ Advanced Insights", "✔️ Job Recommendations"] },
    { name: "Premium", price: "₹500/month", image: "https://c1.wallpaperflare.com/preview/94/768/1012/vertical-golden-metal-metallized.jpg", features: ["✔️ Priority Support", "✔️ All Features"] },
  ];

  const handleActivate = (plan) => {
    setSelectedPlan(plan);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 p-8">
      <div className="space-y-6">
        {plans.map((plan, index) => (
          <div key={index} className="w-110 bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center transition-transform transform hover:scale-105">
            <img src={plan.image} alt={plan.name} className="w-24 h-24 rounded-full shadow-md mb-4" />
            <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
            <p className="text-lg text-gray-600">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-center">
              {plan.features.map((feature, i) => <li key={i} className="text-gray-700 text-sm">{feature}</li>)}
            </ul>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600" onClick={() => handleActivate(plan)}>
              Activate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
