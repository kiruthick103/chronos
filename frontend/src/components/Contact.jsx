import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Private Viewing Request",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#090A0E] text-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[0.68rem] tracking-[0.3em] uppercase font-bold text-[#D4AF37] inline-block">
            Private Client Services
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Concierge &amp; Showroom
          </h1>
          <p className="text-white/60 text-base font-light">
            Schedule a private vault viewing, discuss bespoke horological acquisitions, or inquire about watch authentication.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Salons (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl bg-[#0F1118] border border-white/10 space-y-6">
              <h3 className="font-display text-xl font-bold text-white border-b border-white/10 pb-4">
                Global Salons
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold text-[#E5C378] tracking-wider uppercase text-xs">Geneva Salon</p>
                  <p className="text-white/70">Rue du Rhône 42, 1204 Genève, Switzerland</p>
                  <p className="text-white/40 text-xs mt-0.5">+41 22 819 9000 &bull; By Appointment Only</p>
                </div>

                <div>
                  <p className="font-bold text-[#E5C378] tracking-wider uppercase text-xs">New York Vault</p>
                  <p className="text-white/70">745 Fifth Avenue, Suite 1900, New York, NY 10151</p>
                  <p className="text-white/40 text-xs mt-0.5">+1 (212) 555-0198 &bull; By Appointment Only</p>
                </div>

                <div>
                  <p className="font-bold text-[#E5C378] tracking-wider uppercase text-xs">London Boutique</p>
                  <p className="text-white/70">14 New Bond Street, Mayfair, London W1S 3PF</p>
                  <p className="text-white/40 text-xs mt-0.5">+44 20 7946 0912 &bull; By Appointment Only</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-[#0F1118] border border-white/10 space-y-4">
              <h4 className="font-display font-bold text-lg text-white">Instant VIP Concierge</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Connect directly with our master horologists via secure WhatsApp or encrypted wire channel.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wider uppercase hover:bg-emerald-600/30 transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#0D0E14] border border-[#D4AF37]/30 shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Inquire or Schedule Viewing
            </h3>
            <p className="text-sm text-white/50 mb-8">
              Our horological advisors respond to all inquiries within 60 minutes during business hours.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center space-y-3">
                <svg className="w-10 h-10 text-[#D4AF37] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <h4 className="font-display font-bold text-xl text-white">Inquiry Received</h4>
                <p className="text-xs text-white/70">
                  Thank you, {formData.name}. A Dedicated Chronolux Advisor has been assigned to your request and will contact you promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Lord / Lady / Mr / Ms..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@luxury.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Private Viewing Request">Private Viewing Request</option>
                    <option value="Sourcing Specific Reference">Sourcing Specific Reference</option>
                    <option value="Authentication & Valuation">Authentication &amp; Valuation</option>
                    <option value="Wire / Escrow Assistance">Wire / Escrow Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Message / Watch Reference
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide reference numbers, preferred salon location, or specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#C5A059] text-[#090A0E] text-xs font-bold tracking-[0.2em] uppercase shadow-lg hover:shadow-xl transition-all"
                >
                  Send Confidential Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
