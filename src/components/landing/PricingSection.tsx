"use client";

import { useRef } from "react";
import { useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, Zap, Crown, Building } from "lucide-react";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: { monthly: 0, annual: 0 },
    description: "Perfect for getting started",
    badge: null,
    featured: false,
    features: [
      "5 AI interviews per month",
      "Basic resume analysis",
      "HR & Behavioral interviews",
      "Performance dashboard",
      "50K AI tokens/month",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/signup",
  },
  {
    name: "Pro",
    icon: Crown,
    price: { monthly: 29, annual: 19 },
    description: "For serious job seekers",
    badge: "Most Popular",
    featured: true,
    features: [
      "100 AI interviews per month",
      "Advanced resume & JD matching",
      "All interview types",
      "Voice & Video interviews",
      "Company-specific modes",
      "2M AI tokens/month",
      "PDF report downloads",
      "Priority AI models",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/signup?plan=pro",
  },
  {
    name: "Enterprise",
    icon: Building,
    price: { monthly: 99, annual: 79 },
    description: "For teams and organizations",
    badge: null,
    featured: false,
    features: [
      "Unlimited interviews",
      "Unlimited AI tokens",
      "Team management",
      "Admin analytics",
      "API access",
      "Custom company branding",
      "SSO / SAML support",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="section-padding relative" ref={ref}>
      <div className="container-xl">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">Simple Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Invest in Your{" "}
            <span className="gradient-text">Career</span>
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 glass rounded-xl p-1">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !annual
                  ? "bg-primary text-white shadow-glow-sm"
                  : "text-text-secondary hover:text-white"
              }`}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                annual
                  ? "bg-primary text-white shadow-glow-sm"
                  : "text-text-secondary hover:text-white"
              }`}
              onClick={() => setAnnual(true)}
            >
              Annual
              <span className="ml-2 text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                Save 35%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const price = annual ? plan.price.annual : plan.price.monthly;
            return (
              <motion.div
                key={plan.name}
                className={`pricing-card relative ${plan.featured ? "featured" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-primary text-xs font-semibold px-4 py-1">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.featured
                          ? "bg-primary text-white"
                          : "bg-white/8 text-text-secondary"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold font-heading">{plan.name}</h3>
                      <p className="text-text-secondary text-xs">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-bold font-heading">
                      ${price}
                    </span>
                    <span className="text-text-secondary text-sm">
                      {price === 0 ? "forever" : "/month"}
                    </span>
                  </div>
                  {annual && price > 0 && (
                    <p className="text-xs text-text-secondary mt-1">
                      Billed annually (${price * 12}/year)
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={plan.featured ? "btn-primary w-full justify-center" : "btn-secondary w-full justify-center"}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
