"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Compass, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] dark:bg-[#080809] pt-20 pb-10 px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden">
        
        {/* Left Side: Image Showcase */}
        <div className="hidden lg:block relative h-full min-h-[600px] bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('/static/seed/emerald_onyx.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80"></div>
          
          <div className="absolute bottom-0 left-0 p-12 text-white">
            <div className="flex items-center space-x-2 text-gold-500 mb-4">
              <Compass className="w-5 h-5" />
              <span className="text-[10px] tracking-widest uppercase font-bold">
                Aurelia Marmi
              </span>
            </div>
            <h2 className="font-serif text-4xl mb-4 leading-tight">
              Curating <br />
              <span className="font-light italic text-gold-gradient">Excellence</span>
            </h2>
            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              Log in to your account to access your saved collections, manage your quote requests, and explore exclusive natural stone inventories.
            </p>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="bg-white dark:bg-[#0f0f11] p-10 sm:p-16 flex flex-col justify-center relative">
          
          {/* Back to Home */}
          <Link 
            href="/" 
            className="absolute top-8 left-10 flex items-center space-x-2 text-black/40 dark:text-white/40 hover:text-gold-500 transition-colors text-[10px] uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="font-serif text-3xl sm:text-4xl mb-2 text-black dark:text-white">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-sm text-black/60 dark:text-white/60 mb-10">
                {isLogin 
                  ? "Enter your credentials to access your curator dashboard." 
                  : "Join Aurelia Marmi to start building your luxury stone portfolio."}
              </p>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Marco Vianelli" 
                      className="w-full bg-[#fcfcfc] dark:bg-black/50 border border-black/10 dark:border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/60 text-black dark:text-white transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full bg-[#fcfcfc] dark:bg-black/50 border border-black/10 dark:border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/60 text-black dark:text-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70">
                      Password
                    </label>
                    {isLogin && (
                      <button type="button" className="text-[10px] text-gold-500 hover:text-black dark:hover:text-white transition-colors">
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full bg-[#fcfcfc] dark:bg-black/50 border border-black/10 dark:border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/60 text-black dark:text-white transition-colors pr-10"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-gold-500"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gold-500 text-black py-4 text-xs tracking-widest uppercase font-bold hover:bg-black hover:text-gold-500 dark:hover:bg-white dark:hover:text-black transition-all duration-300 flex items-center justify-center space-x-2 group mt-8"
                >
                  <span>{isLogin ? "Sign In" : "Register"}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 text-center border-t border-black/10 dark:border-white/10 pt-6">
                <p className="text-xs text-black/60 dark:text-white/60">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-gold-500 hover:underline focus:outline-none"
                  >
                    {isLogin ? "Create Account" : "Sign In"}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
