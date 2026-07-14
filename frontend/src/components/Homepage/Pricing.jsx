import React from "react";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started with your personal inventory.",
    features: [
      "Up to 25 laptops",
      "Add, edit & delete entries",
      "Search & filter",
      "JWT-secured account",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For power users managing a growing inventory.",
    features: [
      "Unlimited laptops",
      "Everything in Free",
      "Advanced filtering",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "Share and manage inventory across your whole team.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Role-based access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-4xl bg-[#292929] border-[0.8px] border-[#333333] mt-6 mx-2 p-4 h-full">
      <h2 className="text-4xl text-center mt-4">Simple, transparent pricing</h2>
      <p className="text-center text-[#b0b0b0] mt-2">
        Choose the plan that fits your inventory.
      </p>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-12 mt-8 sm:px-12">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-3xl p-6 border-[0.8px] ${
              plan.highlighted
                ? "bg-[#174160] border-[#396296]"
                : "bg-[#212121] border-[#333333]"
            }`}
          >
            {plan.highlighted && (
              <span className="self-start text-xs font-semibold px-3 py-1 rounded-full bg-[#a5ccff] text-[#284469] mb-3">
                Most Popular
              </span>
            )}

            <h3 className="text-2xl font-medium">{plan.name}</h3>
            <div className="mt-3">
              <span className="text-4xl font-semibold">{plan.price}</span>
              <span className="text-[#b0b0b0]">{plan.period}</span>
            </div>
            <p className="text-sm text-[#b0b0b0] mt-3">{plan.description}</p>

            <ul className="flex flex-col gap-3 mt-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <FaCheck className="text-[#3fb058] mr-3 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                navigate("/register");
              }}
              className={`mt-6 rounded-3xl px-4 py-2 border-[1px] cursor-pointer transition-colors ${
                plan.highlighted
                  ? "bg-[#a5ccff] text-[#284469] font-semibold border-[#396296] hover:bg-[rgb(146,193,255)]"
                  : "bg-[#2b5285] border-[#396296] hover:bg-[#356199]"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
