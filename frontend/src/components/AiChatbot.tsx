"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, User, Bot, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Welcome to Aurelia Marmi. I am your digital stone curator. How may I assist you with your natural stone selection today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chats
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const presetQuestions = [
    { q: "Which marble is best for kitchen countertops?", a: "For high-traffic kitchens, we recommend Taj Mahal Quartzite due to its superior hardness and resistance to etching, or Calacatta Viola if protected with a premium penetrating sealer." },
    { q: "How do I clean and maintain Carrara marble?", a: "Use only pH-neutral stone cleaners. Wipe spills immediately. Avoid acidic substances like vinegar, lemon, or wine, which will etch polished calcite surfaces." },
    { q: "How do I estimate slab quantity?", a: "To estimate: multiply your countertop width by length in inches, divide by 144 to get square feet, then add a 15% wastage allowance. For bookmatching, add 20%." },
    { q: "Can I inspect physical lots?", a: "Absolutely. You can request a physical sample through our collection pages, or log into our Admin Portal to inspect high-definition block photos." },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Bot Response Simulation
    setTimeout(() => {
      let botResponse = "That is an excellent design question. Let me consult our stone library. For custom project inquiries, please submit a Request Quote form, and our design studio will contact you directly with prices and availability.";
      
      const lower = text.toLowerCase();
      if (lower.includes("kitchen") || lower.includes("best")) {
        botResponse = "For kitchen countertops, Taj Mahal Quartzite is the most durable luxury choice. If you prefer classic marble veins, Calacatta Viola offers breathtaking burgundy contrasts that look magnificent as a waterfall island.";
      } else if (lower.includes("clean") || lower.includes("maintain") || lower.includes("care")) {
        botResponse = "To preserve polished marble surfaces, seal them annually with a solvent-based impregnator. Daily cleaning should only use warm water and pH-neutral stone soaps. Avoid acidic cleansers, citrus, or vinegar.";
      } else if (lower.includes("quantity") || lower.includes("estimate") || lower.includes("calculate")) {
        botResponse = "Calculate square footage by multiplying length × width (in inches) and dividing by 144. For bookmatching veins, we advise adding 15–20% extra slab buffer to align details.";
      } else if (lower.includes("price") || lower.includes("cost")) {
        botResponse = "Our luxury stones range from $140/sqft (Nero Marquina) up to $320/sqft (Emerald Onyx). Please use the Quote Request form to upload your drawing plans for an exact estimation.";
      } else if (lower.includes("backlight") || lower.includes("onyx")) {
        botResponse = "Our translucent Emerald Onyx is ideal for backlighting. We recommend using 4000K CRI LED panels spaced 2 inches behind the stone slab for a uniform, warm glow without hot-spots.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botResponse,
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[360px] md:w-[400px] h-[520px] rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gold-500/20 glass-premium flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-black/90 dark:bg-black/90 px-5 py-4 flex justify-between items-center border-b border-gold-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white">
                    Aurelia Guide
                  </h3>
                  <span className="text-[9px] uppercase tracking-widest text-gold-400 font-light">
                    AI Stone Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-gold-500 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={scrollRef}
              className="flex-grow p-4 overflow-y-auto space-y-4 bg-white/5 dark:bg-black/5"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${
                    msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] ${
                      msg.sender === "user"
                        ? "bg-gold-500 text-black border-gold-500"
                        : "bg-white/10 text-white border-white/10"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`max-w-[75%] p-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gold-500/10 text-black dark:text-white border border-gold-500/30"
                        : "bg-black/40 text-black/80 dark:text-white/80 border border-white/5"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 text-white border border-white/10 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-black/40 p-3 rounded-none border border-white/5 flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/10">
              <div className="flex items-center space-x-1 mb-1.5">
                <HelpCircle className="w-3 h-3 text-gold-500" />
                <span className="text-[9px] uppercase tracking-wider text-black/50 dark:text-white/40 font-semibold">
                  Common Queries:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[75px] overflow-y-auto">
                {presetQuestions.map((pq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(pq.q)}
                    className="text-[10px] bg-white/5 hover:bg-gold-500/10 hover:border-gold-500/40 border border-white/10 text-black/70 dark:text-white/70 px-2 py-1 transition-all duration-300 rounded-none text-left truncate max-w-full"
                  >
                    {pq.q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 border-t border-white/10 bg-black/80 dark:bg-black/85 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about design, cleaning, estimation..."
                className="bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-500/60 grow rounded-none"
              />
              <button
                type="submit"
                className="bg-gold-500 text-black p-2 hover:bg-white hover:text-black transition-colors duration-300 rounded-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-black border border-gold-500/40 hover:border-gold-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-gold-500/20 text-gold-500 hover:text-white transition-all duration-300"
        aria-label="Toggle AI Curator"
      >
        <MessageSquare className="w-6 h-6 text-gold-500" />
      </motion.button>
    </div>
  );
}
