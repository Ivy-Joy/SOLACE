'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, User, Mail, DollarSign, Smartphone } from 'lucide-react';
import Navbar from "@/src/components/navbar/Navbar";
import Footer from '@/src/components/footer/Footer';

interface DonationResponse {
  clientSecret: string;
}

const api = { 
  post: async (_url: string, _data: unknown): Promise<DonationResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ clientSecret: 'mock_secret_123' }), 1000);
    });
  } 
};

const predefAmounts = [10, 25, 50, 100, 250, 500];

export default function GivePage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [selectedAmount, setSelectedAmount] = useState<number>(predefAmounts[2]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalDonation = customAmount ? (parseFloat(customAmount) || 0) : selectedAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalPayment = async () => {
    if (!formData.name || !formData.email || totalDonation < 5) {
      alert('Please fill required details and enter a minimum $5 donation.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/donate/create-intent', {
        amount: totalDonation * 100,
        details: formData,
        method: paymentMethod
      });

      // --- CLEAR FORM DATA AFTER SUCCESS ---
      setFormData({ name: '', email: '', phone: '' });
      setCustomAmount('');
      setSelectedAmount(predefAmounts[2]);
      // --------------------------------------

      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-gray-100"
        >
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-3 p-8 md:p-12">
              <header className="mb-10">
                <h1 className="text-3xl font-black text-black tracking-tight uppercase">Support Our Cause</h1>
                <p className="text-gray-400 mt-2 text-sm font-medium">Your generosity makes a difference in our global mission.</p>
              </header>

              {/* Amount Selection */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {predefAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                    className={`py-4 rounded-xl border-2 font-black text-xs transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'border-[#C6A15A] bg-[#C6A15A]/5 text-[#C6A15A] shadow-sm' 
                        : 'border-gray-50 text-gray-300 hover:border-gray-200'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative mb-10">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6A15A]">
                  <DollarSign size={18} />
                </div>
                <input
                  type="number"
                  placeholder="Other Amount"
                  value={customAmount || ''}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-50 focus:border-[#C6A15A] focus:ring-0 outline-none transition-all font-bold text-black placeholder:text-gray-200"
                />
              </div>

              {/* Payment Methods */}
              <div className="flex gap-4 mb-10">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card' ? 'border-[#C6A15A] bg-[#C6A15A]/5' : 'border-gray-50'
                  }`}
                >
                  <div className="flex gap-2 mb-2">
                    <CreditCard size={18} className={paymentMethod === 'card' ? 'text-[#C6A15A]' : 'text-gray-300'} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'card' ? 'text-black' : 'text-gray-300'}`}>Card / GPay</span>
                  </div>
                  <div className="flex gap-1 opacity-60">
                    <span className="text-[8px] font-bold text-gray-400">VISA • MC • GPAY</span>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`flex-1 flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'mpesa' ? 'border-[#C6A15A] bg-[#C6A15A]/5' : 'border-gray-50'
                  }`}
                >
                  <div className="flex gap-2 mb-2">
                    <Smartphone size={18} className={paymentMethod === 'mpesa' ? 'text-[#C6A15A]' : 'text-gray-300'} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'mpesa' ? 'text-black' : 'text-gray-300'}`}>M-Pesa</span>
                  </div>
                  <span className="text-[8px] font-bold text-gray-400">MOBILE MONEY</span>
                </button>
              </div>

              {/* Donor Fields - Controlled components using 'value' */}
              <div className="space-y-4 mb-8">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6A15A]" size={18} />
                  <input 
                    name="name" 
                    placeholder="Full Name" 
                    value={formData.name || ''} // Wired to state
                    onChange={handleInputChange} 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 outline-none focus:border-[#C6A15A] text-black font-semibold" 
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6A15A]" size={18} />
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email || ''} // Wired to state
                    onChange={handleInputChange} 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 outline-none focus:border-[#C6A15A] text-black font-semibold" 
                  />
                </div>
                {paymentMethod === 'mpesa' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6A15A]" size={18} />
                    <input 
                      name="phone" 
                      placeholder="254..." 
                      value={formData.phone || ''} // Wired to state
                      onChange={handleInputChange} 
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 outline-none focus:border-[#C6A15A] text-black font-semibold" 
                    />
                  </motion.div>
                )}
              </div>

              <button
                onClick={handleFinalPayment}
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-gray-200"
              >
                {loading ? 'Processing...' : `Complete Donation`}
                {!loading && <Check size={16} className="text-[#C6A15A]" />}
              </button>
            </div>

            <div className="md:col-span-2 bg-black p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
               <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4 italic font-serif text-[#C6A15A]">The Impact</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">Your contribution directly supports our local outreach and digital infrastructure.</p>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                     <p className="text-[10px] uppercase tracking-widest text-[#C6A15A] font-black mb-2">Total Amount</p>
                     <p className="text-5xl font-black text-white">${totalDonation.toLocaleString()}</p>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C6A15A]/10 blur-[80px]" />
            </div>
          </div>

          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-20 h-20 bg-[#C6A15A]/10 rounded-full flex items-center justify-center mb-6 border border-[#C6A15A]/20">
                  <Check size={40} className="text-[#C6A15A]" />
                </div>
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Generosity Received</h2>
                <p className="text-gray-400 max-w-xs text-sm">Thank you for your partnership. Your stewardship is highly valued.</p>
                <button onClick={() => setSuccess(false)} className="mt-8 text-[#C6A15A] font-black text-xs uppercase tracking-widest underline">Make another donation</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}