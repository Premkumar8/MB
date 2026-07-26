"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, User } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const details = [
    {
      icon: MapPin,
      label: "Visit Our Yard",
      value: "370, Thadagam Main Road, K.N.G. Pudur, Coimbatore - 641 025",
    },
    {
      icon: Mail,
      label: "Email Us",
      value: "sharma_marbles@yahoo.in",
      href: "mailto:sharma_marbles@yahoo.in",
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon - Sat: 9:30 AM - 7:30 PM",
    },
  ];

  const team = [
    { name: "O.P. Sharma", role: "Marketing Partner", phone: "+91 99408 82939", tel: "+919940882939" },
    { name: "Ranjeet", role: "Marketing", phone: "+91 88707 80734", tel: "+918870780734" },
    { name: "Manish", role: "Sales", phone: "+91 86108 27837", tel: "+918610827837" },
  ];

  return (
    <div className="bg-[#fcfcfc] dark:bg-[#080809] min-h-screen text-black dark:text-white">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 border-b border-black/5 dark:border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold">Get In Touch</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mt-4 mb-6">
            Let&apos;s Talk <span className="text-gold-gradient font-light italic">Stone</span>
          </h1>
          <p className="text-black/60 dark:text-white/60 max-w-xl mx-auto leading-relaxed">
            Have a project in mind or a question about our collections? Reach out and our team at Sharma Marble Trading Co. will get back to you.
          </p>
        </div>
      </section>

      {/* Our Team */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 lg:pt-20">
        <div className="text-center mb-10 space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold">Our Team</span>
          <h2 className="font-serif text-2xl sm:text-3xl">Speak Directly With Us</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member) => (
            <a
              key={member.name}
              href={`tel:${member.tel}`}
              className="group flex flex-col items-center text-center gap-3 border border-black/10 dark:border-white/10 hover:border-gold-500/40 p-8 transition-colors duration-300"
            >
              <div className="w-14 h-14 flex items-center justify-center border border-gold-500/30 text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-colors duration-300">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="font-serif text-lg text-black dark:text-white">{member.name}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-black/50 dark:text-white/40 font-semibold mt-1">
                  {member.role}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-black/80 dark:text-white/80 group-hover:text-gold-500 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                {member.phone}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Details + Map */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              {details.map((d) => {
                const Icon = d.icon;
                const content = (
                  <div className="flex items-start gap-4 p-5 border border-black/10 dark:border-white/10 hover:border-gold-500/40 transition-colors duration-300 group">
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-gold-500/30 text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-black/50 dark:text-white/40 font-semibold mb-1">
                        {d.label}
                      </div>
                      <div className="text-sm font-medium text-black/90 dark:text-white/90 leading-relaxed">
                        {d.value}
                      </div>
                    </div>
                  </div>
                );
                return d.href ? (
                  <a key={d.label} href={d.href} className="block">{content}</a>
                ) : (
                  <div key={d.label}>{content}</div>
                );
              })}
            </div>

            <div className="aspect-[4/3] w-full border border-black/10 dark:border-white/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
              <iframe
                title="Sharma Marble Trading Co. Location"
                src="https://www.google.com/maps?q=370,+Thadagam+Main+Road,+K.N.G.Pudur,+Coimbatore+-+641025&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0 }}
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="border border-black/10 dark:border-white/10 p-8 sm:p-12 bg-white dark:bg-[#0c0c0e] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-700 via-gold-400 to-gold-700" />

              <h2 className="font-serif text-2xl sm:text-3xl mb-2">Send Us a Message</h2>
              <p className="text-sm text-black/50 dark:text-white/50 mb-8">
                Tell us about your space and requirements — we typically respond within one business day.
              </p>

              {sent && (
                <div className="mb-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Thank you — your message has been received. We&apos;ll be in touch shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-black/60 dark:text-white/50 mb-2">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold-500 px-4 py-3 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-black/60 dark:text-white/50 mb-2">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91"
                      className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold-500 px-4 py-3 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-black/60 dark:text-white/50 mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold-500 px-4 py-3 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-black/60 dark:text-white/50 mb-2">
                    Your Message
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, preferred stone, and quantity required..."
                    className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-gold-500 px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white transition-colors duration-300"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Our Showroom */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="text-center mb-10 space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold">Come See Us</span>
          <h2 className="font-serif text-2xl sm:text-3xl">Visit Our Showroom</h2>
          <p className="text-black/60 dark:text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
            Browse tiles, marbles and sanitaryware from India&apos;s leading brands, all under one roof at our Coimbatore showroom.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { src: "/static/real/showroom-interior-corridor.jpg", label: "Showroom Corridor" },
            { src: "/static/real/showroom-interior-tiles-1.jpg", label: "Tile Display Wall" },
            { src: "/static/real/showroom-interior-tiles-2.jpg", label: "Sanitaryware & Tile Range" },
          ].map((item) => (
            <div key={item.src} className="group relative aspect-[4/5] overflow-hidden">
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute bottom-4 left-4 text-white text-[10px] sm:text-xs uppercase tracking-[0.15em] font-bold">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
