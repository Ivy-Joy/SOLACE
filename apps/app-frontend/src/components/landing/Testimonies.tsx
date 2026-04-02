"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jemutai",
    role: "MPH Member",
    image: "/images/sarah.png",
    quote:
      "SOLACE didn't just give me a community; it gave me a compass. I found my identity in Christ here, and it changed how I approach my career in tech.",
    highlight: "My Compass",
  },
  {
    id: 2,
    name: "Kevin Omari",
    role: "Youth Leader",
    image: "/images/kevin.png",
    quote:
      "Moving from the Teens class to Young Adults was seamless. The mentorship in ROPEs prepared me for the real-world challenges I face today.",
    highlight: "True Mentorship",
  },
  {
    id: 3,
    name: "Anita Moraa",
    role: "Digital Missions",
    image: "/images/anita.png",
    quote:
      "I never knew my skills in media could be used for the Gospel until I joined the Digital Hub. SOLACE empowered my creative calling.",
    highlight: "Creative Calling",
  },
];

export default function Testimonies() {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#F9F7F2] py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="mb-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-2 block text-[10px] font-black uppercase tracking-[0.45em] text-gold"
          >
            Stories of Grace
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-dark">
            Lives <span className="text-gold uppercase">Transformed.</span>
          </h2>

          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-gold" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-lg border border-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-stretch"
              >
                {/* Image side */}
                <div className="relative h-[220px] md:h-[280px] overflow-hidden">
                  <Image
                    src={testimonials[active].image}
                    alt={testimonials[active].name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-dark backdrop-blur-sm">
                    {testimonials[active].highlight}
                  </div>
                </div>

                {/* Text side */}
                <div className="flex flex-col justify-center p-5 sm:p-6 md:p-8">
                  <Quote className="mb-2 text-gold opacity-15" size={40} strokeWidth={2} />

                  <p className="max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-dark">
                    {testimonials[active].quote}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
                    <div>
                      <h4 className="text-lg font-bold text-dark">
                        {testimonials[active].name}
                      </h4>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-gold">
                        {testimonials[active].role}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActive(i)}
                          aria-label={`Go to testimonial ${i + 1}`}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === active ? "w-8 bg-gold" : "w-2 bg-gray-200 hover:bg-gold/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between gap-4 sm:hidden">
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-8 bg-gold" : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-dark transition-all hover:bg-dark hover:text-white"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-dark transition-all hover:bg-dark hover:text-white"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="mt-4 hidden items-center justify-center gap-2 sm:flex">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-dark transition-all hover:bg-dark hover:text-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-dark transition-all hover:bg-dark hover:text-white"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}