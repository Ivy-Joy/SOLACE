"use client";
import Link from "next/link";

import Footer from "@/src/components/footer/Footer";
import Navbar from "@/src/components/navbar/Navbar";
import { motion } from "framer-motion";
import { Globe, Zap, Users, ChevronRight } from "lucide-react";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] },
  },
};

const strategySteps = [
  {
    id: "01",
    title: "Believe",
    label: "Foundation",
    description:
      "Focusing on clear Gospel understanding and the miracle of salvation.",
    scripture: "John",
    theme: "light",
  },
  {
    id: "02",
    title: "Belong",
    label: "Community",
    description:
      "Assurance and integration into church life through relational fellowship.",
    scripture: "Ephesians • Corinthians • Thessalonians",
    theme: "light",
  },
  {
    id: "03",
    title: "Be Sent",
    label: "Mission",
    description:
      "Active deployment into evangelism and marketplace missions.",
    scripture: "Acts • Jonah",
    theme: "light",
  },
  {
    id: "04",
    title: "Become",
    label: "Multiplication",
    description:
      "The ultimate goal: leadership multiplication and spiritual maturity.",
    scripture: "Nehemiah • Revelation",
    theme: "dark",
  },
];

const organs = [
  { id: "01", name: "Ropes & Vuka", type: "Seed-planting & Watering", bible: "Mark & Matthew" },
  { id: "02", name: "Teens Ministry", type: "Soul-saturating", bible: "Navigators & John" },
  { id: "03", name: "High School Missions", type: "Evangelistic", bible: "Navigators & John" },
  { id: "04", name: "Bridge", type: "Discipleship School", bible: "Romans" },
  { id: "05", name: "Young Professionals", type: "City-focused Mission", bible: "Luke & Acts" },
];

/*const stats = [
  { label: "Trained Leaders", value: "40" },
  { label: "Digital Missionaries", value: "70+" },
  { label: "Prayer Intercessions", value: "290+" },
];*/

export default function AboutPage() {
  /*const [stats, setStats] = useState([
    { label: "Trained Leaders", value: "..." }, // Placeholder while loading
    { label: "Digital Missionaries", value: "..." },
    { label: "Prayer Intercessions", value: "..." },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImpactStats() {
      try {
        // Replace with your actual API endpoint (e.g., /api/impact)
        const response = await fetch('/api/stats'); 
        const data = await response.json();
        
        // Map your API response to your UI structure
        setStats([
          { label: "Trained Leaders", value: data.leaders || "0" },
          { label: "Digital Missionaries", value: `${data.missionaries}+` || "0" },
          { label: "Prayer Intercessions", value: `${data.prayers}+` || "0" },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchImpactStats();
  }, []);*/

  return (
    <main className="bg-white text-[#1a1a1b] overflow-hidden">
      <Navbar/>

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-28 bg-[#F9F7F2]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-5xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold text-[10px] uppercase tracking-[0.5em] font-black mb-5 block"
          >
            Our Genesis
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-7xl lg:text-8xl font-serif font-black tracking-tighter leading-[0.92] text-dark italic"
          >
            Faith is not a <br />
            <span className="text-gold not-italic">Sunday</span> event.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-gray-500 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            SOLACE was born out of a hunger to bridge the gap between the altar
            and the marketplace.{" "}
            <span className="text-dark font-medium italic">
              Serving Our Lord And Christ Everyday.
            </span>
          </motion.p>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="py-12 md:py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-10 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-0.5 w-10 bg-gold" />
                <span className="text-gold text-[10px] uppercase font-black tracking-[0.25em]">
                  The Vision
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif italic font-black mb-5 tracking-tight text-dark leading-tight">
                To glorify God by making{" "}
                <span className="text-gold not-italic">
                  disciples of young people.
                </span>
              </h2>
              <p className="text-gray-600 leading-relaxed font-light text-base md:text-lg">
                We envision a generation so{" "}
                <span className="border-b border-gold/30 text-dark font-medium">
                  saturated in Scripture
                </span>{" "}
                and transformed by the Gospel that they reflect Christ’s glory
                in every sphere. Our dream is to see young leaders who don’t
                just follow Jesus, but{" "}
                <span className="text-dark font-semibold italic">
                  multiply His life
                </span>{" "}
                across the globe.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-0.5 w-10 bg-gold" />
                <span className="text-gold text-[10px] uppercase font-black tracking-[0.25em]">
                  The Mission
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif italic font-black mb-5 tracking-tight text-dark leading-tight">
                To raise{" "}
                <span className="text-gold not-italic">
                  Gospel-centered, God-loving, people-loving young disciples.
                </span>
              </h2>
              <p className="text-gray-600 leading-relaxed font-light text-base md:text-lg">
                We achieve this through{" "}
                <span className="text-dark font-semibold">
                  relational discipleship
                </span>{" "}
                and{" "}
                <span className="text-dark font-semibold">
                  family-supported faith
                </span>
                . By prioritizing{" "}
                <span className="italic">Gospel clarity</span> and{" "}
                <span className="italic">leadership multiplication</span>, we
                equip mature believers to serve God and love people effectively.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-130 lg:h-155 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gold/10"
          >
            <Image
              src="/mission-visual.png"
              alt="Mission"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-18 md:py-22 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-14">
            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black">
              How We Work
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-dark italic mt-3">
              Our Core Values
            </h2>
            <div className="h-1 w-12 bg-gold mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Globe size={26} />,
                title: "Gospel clarity",
                desc: "Foundational message that Christ died for our sins according to the Scriptures, was buried, and rose again on the third day, presenting salvation as a finished gift of grace received by faith.",
              },
              {
                icon: <Users size={26} />,
                title: "Scripture saturation",
                desc: "Deeply immersing your mind and heart in the Bible so that God's Word permeates every area of your life and shapes your thoughts, words, and actions.",
              },
              {
                icon: <Zap size={26} />,
                title: "Relational discipleship",
                desc: "A life-on-life process of following Jesus where spiritual growth occurs through deep, intentional relationships rather than just the transfer of information.",
              },
              {
                icon: <Users size={26} />,
                title: "Leadership multiplication",
                desc: "The intentional process of developing leaders who, in turn, develop other leaders, shifting the focus from personal addition to kingdom multiplication.",
              },
              {
                icon: <Zap size={26} />,
                title: "Family-supported faith",
                desc: "Having the biblical conviction that the home, not the church building, is the primary greenhouse for a child’s spiritual formation.",
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="p-8 rounded-4xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gold/5 transition-all duration-500 group"
              >
                <div className="text-gold mb-6 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-black mb-3 text-dark uppercase tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4BS STRATEGY */}
      <section className="py-14 md:py-16 px-6 lg:px-12 bg-[#FDFDFD]">
  <div className="max-w-4xl mx-auto">
    
    {/* Header */}
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px w-10 bg-gold" />
        <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black">
          Backbone
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-serif italic font-black text-dark">
        The 4Bs <span className="text-gold not-italic">Journey</span>
      </h2>
    </div>

    {/* Timeline */}
    <div className="relative">
      
      {/* Vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />

      <div className="space-y-8">
        {strategySteps.map((step) => (
          <div key={step.id} className="relative flex items-start gap-6">
            
            {/* Dot */}
            <div className="relative z-10 w-6 h-6 rounded-full bg-white border border-gold flex items-center justify-center">
              <span className="text-[9px] font-bold text-gold">
                {step.id}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg md:text-xl font-semibold text-dark">
                  {step.title}
                </h3>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {step.label}
                </span>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                {step.description}
              </p>

              <div className="mt-2 text-[10px] text-gray-400 uppercase tracking-widest">
                {step.scripture}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
      
      {/* 4. MINISTRY ORGANS - The Pipeline */}
<section className="py-20 bg-white px-6">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
      <div className="max-w-xl">
        <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black block mb-2">Structure</span>
        <h2 className="text-4xl md:text-5xl font-serif italic font-black text-dark leading-none">The Ministry Organs</h2>
      </div>
      <p className="text-gray-400 text-sm font-light max-w-xs">
        A strategic pipeline designed to move hearts from first seeds to city-wide impact.
      </p>
    </div>

    {/* The Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {organs.map((organ) => (
        <div 
          key={organ.id} 
          className="group p-8 bg-[#F9F7F2] border border-transparent hover:border-gold/20 hover:bg-white hover:shadow-xl hover:shadow-gold/5 transition-all duration-500 rounded-[2.5rem] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-gold font-black text-xs">{organ.id}</span>
              <div className="h-px w-full bg-gold/10 group-hover:bg-gold/30 transition-colors" />
            </div>
            
            <h4 className="text-xl font-bold text-dark mb-2 tracking-tight leading-tight group-hover:text-gold transition-colors">
              {organ.name}
            </h4>
            <p className="text-gray-500 text-xs font-light leading-relaxed mb-6">
              {organ.type}
            </p>
          </div>

          <div className="mt-auto">
            <div className="text-[9px] uppercase tracking-widest font-black py-2 px-3 bg-white border border-gray-100 inline-block rounded-full italic text-dark/40 group-hover:text-dark/80 transition-colors">
              {organ.bible}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* NEW: Join Link Paragraph */}
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 text-center"
    >
      <p className="text-gray-500 text-sm font-light">
        Ready to take the next step in your spiritual growth?{" "}
        <Link 
          href="/join" 
          className="text-dark font-black uppercase tracking-widest border-b-2 border-gold hover:text-gold hover:border-dark transition-all duration-300 ml-1 pb-1"
        >
          Click here to join any of these above classes →
        </Link>
      </p>
    </motion.div>
  </div>
</section>

      {/* IMPACT 
      <section className="py-16 md:py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-10 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl md:text-6xl font-serif italic font-black text-dark mb-2 group-hover:text-gold transition-colors">
                {stat.value}
              </div>
              <div className="text-gray-400 text-[10px] uppercase tracking-[0.4em] font-black">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section> */}
      {/* IMPACT SECTION 
      <section className="py-16 md:py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-10 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className={`text-center group transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              <div className="text-4xl md:text-6xl font-serif italic font-black text-dark mb-2 group-hover:text-gold transition-colors">
                {stat.value}
              </div>
              <div className="text-gray-400 text-[10px] uppercase tracking-[0.4em] font-black">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* LEADERSHIP TEAM LINK SECTION */}
      <section className="py-12 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-serif italic font-black text-dark">The Shepherds</h3>
            <p className="text-gray-400 text-sm font-light">Meet the Team of Lead Pastors driving the Solace vision.</p>
          </div>
          <Link href="/leaders" className="group flex items-center gap-4 bg-dark text-white px-8 py-4 rounded-full hover:bg-gold transition-all duration-500">
            <span className="text-xs font-black uppercase tracking-widest">Meet the Leaders</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}