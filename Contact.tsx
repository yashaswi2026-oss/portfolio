import React, { useState } from 'react';
import { ArrowRight, Check, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollReveal from './ScrollReveal';

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [sqlInstructions, setSqlInstructions] = useState<string | null>(null);

  const validate = (): boolean => {
    const tempErrors: Partial<FormData> = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{8,20}$/.test(formData.phone.trim())) {
      tempErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on type
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionError(null);
    setSqlInstructions(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.error === 'table_missing' || responseData.error === 'rls_violation') {
          setSubmissionError(responseData.message);
          setSqlInstructions(responseData.instructions);
        } else {
          setSubmissionError(responseData.message || responseData.error || 'Failed to submit inquiry to Supabase.');
        }
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      console.error(err);
      setSubmissionError('An unexpected server connection error occurred. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" id="contact" style={{ background: 'var(--canvas)' }}>
      <div className="contact-glow" />
      <div className="wrap max-w-xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <span className="section-tag mb-4 inline-block">Get in touch</span>
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <h2 className="mb-2">Let's create something remarkable.</h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-neutral-500 mb-12 text-center max-w-sm mx-auto">
            Please fill in your details below. If you would like to collaborate on custom website designs of similar high quality, we would love to bring your vision to life.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <div className="w-full text-left bg-white border border-[#E1DBD2] shadow-2xl shadow-neutral-200/50 p-8 md:p-10 rounded-2xl relative overflow-hidden">
            {/* Ambient pattern border top */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  noValidate
                >
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                      Your Name <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Liam Sterling"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-[#FAF6F0]/20 border ${
                        errors.name ? 'border-red-400 focus:ring-red-100' : 'border-neutral-200/80 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)]'
                      } text-neutral-900 rounded-lg text-sm transition-all focus:outline-none focus:ring-4 placeholder-neutral-400 font-sans`}
                    />
                    {errors.name && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-sans mt-1">
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Grid for Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email field */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                        Email Address <span className="text-[var(--accent)]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. liam@luxury.com"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 bg-[#FAF6F0]/20 border ${
                          errors.email ? 'border-red-400 focus:ring-red-100' : 'border-neutral-200/80 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)]'
                        } text-neutral-900 rounded-lg text-sm transition-all focus:outline-none focus:ring-4 placeholder-neutral-400 font-sans`}
                      />
                      {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-sans mt-1">
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    {/* Phone field */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                        Phone Number <span className="text-[var(--accent)]">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 bg-[#FAF6F0]/20 border ${
                          errors.phone ? 'border-red-400 focus:ring-red-100' : 'border-neutral-200/80 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)]'
                        } text-neutral-00 rounded-lg text-sm transition-all focus:outline-none focus:ring-4 placeholder-neutral-400 font-sans`}
                      />
                      {errors.phone && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-sans mt-1">
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                      Project Details & Tell us how we can help
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="e.g. We want to design a premium, distraction-free branding architecture for our newly launched studio..."
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-[#FAF6F0]/20 border border-neutral-200/80 text-neutral-900 rounded-lg text-sm transition-all focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] placeholder-neutral-400 font-sans resize-y"
                    />
                  </div>

                  {/* Error & Instructions Board */}
                  {submissionError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl space-y-3 font-sans text-xs"
                    >
                      <div className="flex items-start gap-2 text-amber-900 font-semibold">
                        <span className="text-sm shrink-0 mt-0.5">⚠️</span>
                        <span>{submissionError}</span>
                      </div>
                      
                      {sqlInstructions && (
                        <div className="space-y-2 mt-2">
                          <p className="text-amber-800 text-[11px] leading-relaxed">
                            To fix this, please navigate to your **Supabase Dashboard** &rarr; **SQL Editor**, click **New Query**, paste the code below, run it, and then try submitting again:
                          </p>
                          <pre className="font-mono p-3 bg-neutral-900 text-neutral-100 overflow-x-auto rounded-lg text-[10px] select-all border border-amber-900/15 leading-normal">
                            {sqlInstructions}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 bg-[var(--ink)] hover:bg-[var(--accent-2)] text-white rounded-xl text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                          Processing Inquiry...
                        </>
                      ) : (
                        <>
                          Submit Details
                          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="py-12 text-center flex flex-col items-center justify-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
                    className="w-16 h-16 bg-[var(--ink)] text-white rounded-full flex items-center justify-center shadow-xl shadow-neutral-100"
                  >
                    <Check size={28} strokeWidth={2.5} />
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="font-sans font-semibold text-lg text-neutral-900">Inquiry Received Successfully!</h3>
                    <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                      Thank you for your response, <strong className="text-neutral-800 font-semibold">{formData.name}</strong>. Your details have been recorded securely.
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl space-y-1 max-w-sm text-left font-sans">
                    <div className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider font-semibold">Our Next Step</div>
                    <div className="text-xs text-neutral-600 leading-relaxed">
                      Lead Designer and Architect <strong className="text-neutral-900 font-medium">Yashaswi Vasamsetti</strong> will contact you shortly using your details:
                    </div>
                    <div className="text-xs text-neutral-900 font-mono mt-2 bg-white px-3 py-2 rounded-lg border border-neutral-100/50 space-y-1">
                      <div>📧 {formData.email}</div>
                      <div>📞 {formData.phone}</div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({ name: '', phone: '', email: '', message: '' });
                      setIsSuccess(false);
                    }}
                    className="text-xs text-neutral-400 hover:text-neutral-900 underline underline-offset-4 cursor-pointer font-sans transition-colors pt-2"
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
