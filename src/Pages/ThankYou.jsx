import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-16"
      style={{
        background: "radial-gradient(circle at center, rgba(30, 0, 0, 0.5) 0%, rgba(10, 0, 0, 0.2) 100%)"
      }}
    >
      <div className="w-full max-w-md p-8 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col items-center text-center">
        <CheckCircle className="w-16 h-16 text-[#ff5757]" />
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ff5757] to-[#b91c1c]">
          Message Sent!
        </h1>
        
        <p className="text-gray-300 mb-8">
          Thank you for reaching out. I'll get back to you as soon as possible.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#ff5757] to-[#b91c1c] text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#ff5757]/20 active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;