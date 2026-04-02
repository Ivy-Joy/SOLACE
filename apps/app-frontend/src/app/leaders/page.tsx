"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Instagram, Linkedin, Mail, ArrowDown, Send, CheckCircle } from "lucide-react"; 
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import api from "@/src/lib/api";

const E164_REGEX = /^\+[1-9]\d{1,14}$/;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.21, 0.45, 0.32, 0.9] 
    },
  },
};

const leaders = [
  {
    name: "Pastor Gad Kwibuka Cedrick",
    role: "Overall Lead Pastor & Visionary",
    image: "/leaders/PastorGad2.png", 
    bio: "Focused on marketplace theology and raising the next generation of global disciples.",
    social: { instagram: "#", linkedin: "#", email: "gadcedrick@solace.org" },
  },
  {
    name: "Pastor Maxwell",
    role: "Lead Pastor for Vuka, Ropes and Teens",
    image: "/leaders/PastorMax1.png",
    bio: "Oversees the three category of Solace Classes with a heart for youth development.",
    social: { instagram: "#", linkedin: "#", email: "maxwell@solace.org" },
  },
  {
    name: "Marcus Vane",
    role: "Head of Global Missions",
    image: "/leaders/leader3.png",
    bio: "Leading the 'Be Sent' initiative across high school and professional spheres.",
    social: { instagram: "#", linkedin: "#", email: "marcus@solace.org" },
  },
  {
    name: "Sarah Jenkins",
    role: "Director of Worship",
    image: "/leaders/leader4.png",
    bio: "Cultivating a culture of authentic worship and creative excellence at Solace.",
    social: { instagram: "#", linkedin: "#", email: "sarah@solace.org" },
  },
];

export default function LeadersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "", //// Ministry Organ
    serviceArea: "", // Area comfortable to serve
    needsSupport: "", // How church can serve them
    message: "",
    otherServiceArea: "", 
    otherNeedsSupport: ""
  });

  /* --- Verification States --- */
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  /* --- Verification Handlers --- */
  async function handleRequestOtp() {
    if (!E164_REGEX.test(formData.phone)) {
      alert("Please enter a valid phone number (e.g., +254...)");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post<{ verificationId: string }>("/verify/phone/request", { 
        phone: formData.phone 
      });
      setVerificationId(res.verificationId);
      setShowOtpModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmOtp() {
    if (!verificationId) return;
    try {
      setLoading(true);
      const res = await api.post<{ verified: boolean }>("/verify/phone/confirm", {
        verificationId,
        code: otpCode,
      });
      if (res.verified) {
        setPhoneVerified(true);
        setShowOtpModal(false);
        setOtpError(null);
      } else {
        setOtpError("Invalid code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setOtpError("Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneVerified) {
      //alert("Please verify your phone number first.");
      return; //Guard clause
    }
    // Final submission logic to /admin/leads or /leads
    try {
      setLoading(true);
        const payload = {
            ...formData,
            serviceArea: formData.serviceArea === "other" ? formData.otherServiceArea : formData.serviceArea,
            churchSupport: formData.needsSupport === "other" ? formData.otherNeedsSupport : formData.needsSupport,
        };
        //await api.post("/leads", payload);
        await api.post("/public/leads/apply", payload);
        //alert("Thank you! Your leadership application has been submitted successfully!");
        // ADD THIS TO CLEAR THE STATE:
       // 1. Reset the main form object
      setFormData({
        name: "",
        email: "",
        phone: "", // IMPORTANT: Don't forget to clear the phone string!
        category: "",
        serviceArea: "",
        needsSupport: "",
        message: "",
        otherServiceArea: "",
        otherNeedsSupport: ""
      });

      // 2. Reset the verification logic states
      setPhoneVerified(false); // Allows the user to verify a new number if needed
      setVerificationId(null); // Clears the stale MongoDB ID from memory
      setOtpCode("");          // Clears the modal input for the next time
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    try {
      const response = await fetch(`${API_URL}/api/public/leads/apply`, { // for public/leadController
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you! Your leadership application has been sent successfully!");
        // Reset form or redirect
        setFormData({
          name: "",
          email: "",
          phone: "",
          category: "",
          serviceArea: "",
          needsSupport: "",
          message: "",
          otherServiceArea: "", 
          otherNeedsSupport: ""
        });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  }; */

  return (
    <main className="bg-[#FDFDFD] text-dark overflow-hidden">
      <Navbar />

      {/* HERO SECTION - COMPACT & REFINED */}
    <section className="relative min-h-[60vh] flex items-center px-6 pt-24 pb-12 overflow-hidden bg-[#FDFDFD]">
    {/* Background Decorative Element - Reduced font size */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none">
        <span className="text-[10vw] font-serif italic font-black text-gray-100/40 leading-none">
        Shepherds
        </span>
    </div>

    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Typography */}
        <div className="lg:col-span-7 flex flex-col items-start">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
        >
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-[9px] uppercase tracking-[0.4em] font-black">
            Our Leadership
            </span>
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif italic font-black text-dark leading-none tracking-tighter"
        >
            Guided by <br />
            <span className="text-gold not-italic relative">
            Grace & Vision
            </span>
        </motion.h1>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 flex flex-col md:flex-row gap-6 items-start md:items-center"
        >
          <p>&quot;Leadership is not an <span className="text-gold not-italic">elevation</span>, but a deeper level of <span className="text-gold not-italic">submission</span>.&quot;</p>
            <p className="text-gray-500 text-base max-w-sm font-light leading-relaxed border-l border-gray-200 pl-5">
              At SOLACE, we believe the greatest among us is the servant of all. Our leaders are spiritual gardeners, 
            tending to the growth of young souls in a digital age.
            Meet the visionary team dedicated to bridging the gap between the altar and the marketplace.
            </p>
            
            {/* Quick Action Circle */}
              <button 
                onClick={() => document.getElementById('serve-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
              >
                <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-gold group-hover:bg-gold transition-all duration-500">
                  <ArrowDown size={20} className="text-dark group-hover:text-white group-hover:animate-bounce" />
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 group-hover:text-gold">Join Us</span>
              </button>
        </motion.div>
        </div>

        {/* Right Column: Visual Accent - Updated for Visibility */}
        <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-5 relative mt-12 lg:mt-0" // Removed 'hidden lg:block', added margin for mobile
        >
        <div className="relative w-full aspect-square max-w-[320px] md:max-w-md mx-auto rounded-[3rem] overflow-hidden shadow-xl hover:grayscale-0 transition-all duration-700 group">
            <Image 
            src="/leaders/hero-leadership-accent.jpeg" 
            alt="Vision" 
            fill 
            priority // Added priority to load it faster
            className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[1.5s]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-dark/20 to-transparent" />
        </div>

        {/* Refined Floating Badge - Adjusted for mobile position */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 lg:left-0 lg:-translate-x-4 bg-white p-4 rounded-2xl shadow-lg border border-gray-50 min-w-35">
            <p className="text-[8px] leading-tight font-light text-gray-400 uppercase tracking-tighter">
                Equipping <br/><span className="text-dark font-black text-sm italic font-serif">100+ Leaders</span>
            </p>
        </div>
        </motion.div>

    </div>
    </section>

      {/* LEADERS GRID */}
      <section className="py-24 px-6 border-t border-gray-50">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {leaders.map((leader, i) => (
            <motion.div key={i} variants={itemVariants} className="group">
              <div className="relative h-80 w-full rounded-2xl overflow-hidden mb-6 bg-gray-100 shadow-lg shadow-gray-200/30">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover  group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                  <a href={leader.social.instagram} className="text-white hover:text-gold transition-colors"><Instagram size={18} /></a>
                  <a href={leader.social.linkedin} className="text-white hover:text-gold transition-colors"><Linkedin size={18} /></a>
                  <a href={`mailto:${leader.social.email}`} className="text-white hover:text-gold transition-colors"><Mail size={18} /></a>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-gold text-[9px] uppercase tracking-widest font-black block">{leader.role}</span>
                <h3 className="text-xl font-serif italic font-black text-dark group-hover:text-gold transition-colors">{leader.name}</h3>
                <p className="text-gray-500 text-xs font-light leading-relaxed line-clamp-2">{leader.bio}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FORM SECTION */}
      <section id="serve-form" className="py-24 bg-[#111111] text-white px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
          <div className="lg:sticky lg:top-32">
            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-4">Engagement</span>
            <h2 className="text-4xl md:text-6xl font-serif italic font-black mb-6 leading-tight">Step into <br /> <span className="text-gold not-italic">Leadership.</span></h2>
            <p className="text-gray-400 font-light leading-relaxed max-w-md mb-8">We are looking for kingdom-minded individuals ready to multiply their faith. Tell us where you feel called to serve.</p>
            <div className="space-y-4">
              {["Apply for a specific organ", "Undergo leadership training", "Commit to the 4Bs journey"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            className="bg-white p-8 md:p-12 rounded-[2.5rem] text-dark shadow-2xl min-h-[500px] flex flex-col justify-center"
          >
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-serif italic font-black text-dark mb-4">Application Received</h3>
                <p className="text-gray-500 text-sm max-w-xs mb-8 font-light leading-relaxed">
                  Thank you for your heart to serve at Solace. Our team will review your application and reach out shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-[10px] uppercase font-black tracking-widest text-gold hover:underline transition-all"
                >
                  Submit another response
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Full Name</label>
                    <input required type="text" className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none text-sm text-dark bg-transparent" value={formData.name} placeholder="John Doe" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Email Address</label>
                    <input required type="email" className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none text-sm text-dark bg-transparent" value={formData.email} placeholder="john@example.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                {/* Phone Verification Row */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Phone Number</label>
                  <div className="flex items-center gap-4">
                    <input 
                      required 
                      type="tel" 
                      disabled={phoneVerified}
                      className="flex-1 border-b border-gray-200 py-2 focus:border-gold outline-none text-sm text-dark bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed" 
                      value={formData.phone} 
                      placeholder="+254..." 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    />
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={phoneVerified || !formData.phone || loading}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        phoneVerified ? "bg-green-100 text-green-600" : "bg-dark text-white hover:bg-gold disabled:opacity-50"
                      }`}
                    >
                      {phoneVerified ? "Verified" : loading ? "..." : "Verify"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Select a Ministry Organ</label>
                  <select required className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none text-sm bg-transparent cursor-pointer text-dark" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Organ...</option>
                    <option value="ropes-vuka">Ropes & Vuka</option>
                    <option value="teens">Teens Ministry</option>
                    <option value="high-school">High School Missions</option>
                    <option value="bridge">The Bridge (Discipleship)</option>
                    <option value="young-pros">Young Professionals</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Please select an area where you would be comfortable to serve:</label>
                  <select required className="w-full border-b border-gray-200 py-2 focus:border-gold outline-none text-sm bg-transparent cursor-pointer text-dark" value={formData.serviceArea} onChange={(e) => setFormData({...formData, serviceArea: e.target.value})}>
                    <option value="">Select Service Area...</option>
                    <option value="worship">Youth Worship Team</option>
                    <option value="ushering">Youth Ushering</option>
                    <option value="media">Media Teams</option>
                    <option value="young-pros">Young Professionals Team</option>
                    <option value="mentors">Mentors / Counselling Team</option>
                    <option value="cleaning">Cleaning Team</option>
                    <option value="ppi">Teach PPI</option>
                    <option value="other">Other...</option>
                  </select>
                  {formData.serviceArea === "other" && (
                    <motion.input initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} type="text" placeholder="Please specify your service area..." className="w-full border-b border-gold/50 py-2 outline-none text-sm italic text-gold mt-2 bg-transparent" value={formData.otherServiceArea} onChange={(e) => setFormData({...formData, otherServiceArea: e.target.value})} required />
                  )}
                </div>

                {formData.serviceArea && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-6 bg-gold/5 rounded-2xl border border-gold/10 space-y-4">
                    <label className="text-[10px] uppercase font-black tracking-widest text-gold block">How can the church serve you?</label>
                    <select required className="w-full border-b border-gold/20 py-2 focus:border-gold outline-none text-sm bg-transparent cursor-pointer text-dark" value={formData.needsSupport} onChange={(e) => setFormData({...formData, needsSupport: e.target.value})}>
                      <option value="">Select a Resource...</option>
                      <option value="mental-health">Mental Health Support</option>
                      <option value="marital">Marital Resources</option>
                      <option value="parenting">Parenting Resources</option>
                      <option value="discipleship">One-on-one Discipleship</option>
                      <option value="small-groups">Small Groups</option>
                      <option value="bible-study">Bible Study Materials</option>
                      <option value="food">Food / Basic Needs</option>
                      <option value="prayer">Prayer</option>
                      <option value="counselling">Counselling</option>
                      <option value="other">Other...</option>
                    </select>
                    {formData.needsSupport === "other" && (
                      <motion.input initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} type="text" placeholder="How can we specifically support you?" className="w-full border-b border-gold py-2 outline-none text-sm text-dark mt-2 bg-white/50 px-2" value={formData.otherNeedsSupport} onChange={(e) => setFormData({...formData, otherNeedsSupport: e.target.value})} required />
                    )}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Your Heart for Solace</label>
                  <textarea required rows={3} className="w-full border border-gray-100 p-4 rounded-2xl focus:border-gold outline-none text-sm resize-none bg-gray-50 text-dark" value={formData.message} placeholder="Tell us about your heart for this generation..." onChange={(e) => setFormData({...formData, message: e.target.value})} />
                </div>

                <button 
                  type="submit" 
                  disabled={!phoneVerified}
                  className="w-full bg-dark text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-gold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Application <Send size={14} />
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* OTP MODAL */}
        {showOtpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-dark shadow-2xl">
              <h3 className="font-serif italic text-2xl mb-2 text-dark">Confirm Identity</h3>
              <p className="text-xs text-gray-500 mb-6">Enter the code sent to {formData.phone}</p>
              <input autoFocus className="w-full border-b-2 border-gray-100 py-3 text-center text-2xl tracking-[0.5em] focus:border-gold outline-none mb-4" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
              {otpError && <p className="text-[10px] text-red-500 uppercase font-bold mb-4">{otpError}</p>}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-dark text-white rounded-xl font-bold text-xs uppercase" onClick={handleConfirmOtp}>Confirm</button>
                <button className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-xs uppercase" onClick={() => setShowOtpModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
/*Key Implementation Details
State Separation: Just like in JoinForm, the phoneVerified boolean determines if the final Submit button is active.
Disabled Inputs: Once a phone number is verified, I’ve disabled the input to prevent a user from verifying one number and then changing it before hitting submit.*/