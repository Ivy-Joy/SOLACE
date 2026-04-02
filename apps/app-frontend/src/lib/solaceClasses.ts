// src/lib/solaceClasses.ts

export type SolaceClass = {
  key: string;
  title: string;
  subtitle: string;
  age: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  heroImage?: string;
  cardImage?: string;

  intro: string;

  why: string[];

  pillars: {
    title: string;
    description: string;
  }[];

  gains: string[];

  question: string;
  answer: string;
};

export const solaceClasses: Record<string, SolaceClass> = {
  vuka: {
    key: "vuka",
    title: "Vuka",
    subtitle: "Building Strong Foundations Early",
    age: "12 Years",
    heroImage: "/images/Vuka.png",
    cardImage: "/images/Vuka.png",

    theme: {
      primary: "#2563eb",
      secondary: "#3b82f6",
      accent: "#E0BE53",
    },

    intro:
      "Vuka is a transformational space for teenagers to awaken to purpose, build strong identity, and grow in their walk with Christ during critical formative years.",

    why: [
      "Teen years are filled with identity confusion and peer pressure.",
      "Vuka creates a safe space for growth, questions, and discovery.",
      "Builds spiritual discipline alongside real-life application.",
      "Encourages accountability and mentorship.",
      "Equips teens to stand firm in faith in school and social life.",
    ],

    pillars: [
      {
        title: "Identity",
        description: "Helping teens understand who they are in Christ.",
      },
      {
        title: "Growth",
        description:
          "Developing spiritual habits and personal discipline.",
      },
      {
        title: "Expression",
        description:
          "Encouraging teens to live out and express their faith boldly.",
      },
    ],

    gains: [
      "Clarity of identity and purpose.",
      "Confidence to navigate peer pressure.",
      "Stronger personal relationship with God.",
      "Healthy friendships and community.",
    ],

    question: "Who am I becoming in this season of my life?",
    answer:
      "Vuka helps teenagers step into identity, purpose, and bold faith.",
  },

  ropes: {
    key: "ropes",
    title: "Ropes",
    subtitle: "A Rite of Passage Experience at Good Shepherd AGC",
    age: "For 13 Year Olds",
    heroImage: "/images/Ropes.png",
    cardImage: "/images/Ropes.png",

    theme: {
      primary: "#f26a00",
      secondary: "#ff8a1f",
      accent: "#E0BE53",
    },

    intro:
      "A year-long rite of passage journey designed to guide young people from identity confusion into biblical clarity, confidence, and responsibility.",

    why: [
      "Modern life often leaves young people to figure it out alone.",
      "Ropes replaces identity confusion and peer pressure with biblical truth, mentorship, and intentional growth.",
      "Faith-based foundation blending scripture with real-life application.",
      "A structured year-long journey, not a one-time event.",
      "Strong partnership with families to reinforce values at home.",
    ],

    pillars: [
      {
        title: "Preparation",
        description: "A full year of guided mentorship and self-reflection.",
      },
      {
        title: "Transformation",
        description:
          "Intentional activities shaping identity, faith, and responsibility.",
      },
      {
        title: "Reintegration",
        description:
          "A culminating camp where each child is affirmed and celebrated.",
      },
    ],

    gains: [
      "Strong Christian identity to navigate high school pressures.",
      "Decision-making tools for healthy relationships and moral clarity.",
      "Increased confidence and self-discipline.",
      "Stronger bonds with God, family, and community.",
    ],

    question: "Who am I? Where am I going? Who will help me get there?",
    answer:
      "Ropes provides both the answers and the community to help your child thrive.",
  },

  teens: {
    key: "teens",
    title: "Teens",
    subtitle: "Awakening Purpose and Identity in Teenagers",
    age: "14 – 17 Years",
    heroImage: "/images/Teens.png",
    cardImage: "/images/Teens.png",

    theme: {
      primary: "#9333ea",
      secondary: "#a855f7",
      accent: "#E0BE53",
    },

    intro:
      "The Teens class focuses on building strong spiritual foundations early, shaping character, discipline, and identity in Christ.",

    why: [
      "Early formation determines future direction.",
      "Teens need guidance in navigating modern challenges.",
      "Builds discipline and foundational faith.",
      "Creates a strong sense of belonging.",
      "Encourages growth through mentorship and teaching.",
    ],

    pillars: [
      {
        title: "Foundation",
        description: "Establishing strong biblical understanding.",
      },
      {
        title: "Character",
        description: "Developing integrity and discipline.",
      },
      {
        title: "Community",
        description: "Building healthy friendships and belonging.",
      },
    ],

    gains: [
      "Strong spiritual foundation.",
      "Good character and discipline.",
      "Sense of belonging.",
      "Confidence in faith.",
    ],

    question: "How do I grow strong in my faith early?",
    answer:
      "The Teens class builds a firm foundation for a lifetime of faith.",
  },

  mph: {
    key: "mph",
    title: "MPH",
    subtitle: "Mentorship, Purpose, and Holistic Growth",
    age: "18 – 24 Years",
    heroImage: "/images/MPH.png",
    cardImage: "/images/MPH.png",

    theme: {
      primary: "#16a34a",
      secondary: "#22c55e",
      accent: "#E0BE53",
    },

    intro:
      "MPH is designed for young adults navigating life transitions, equipping them with mentorship, purpose, and spiritual grounding for adulthood.",

    why: [
      "Young adulthood comes with major life decisions and uncertainty.",
      "MPH provides mentorship and direction during this transition.",
      "Bridges faith with career, relationships, and purpose.",
      "Encourages intentional living and accountability.",
      "Builds leaders grounded in Christ.",
    ],

    pillars: [
      {
        title: "Mentorship",
        description: "Guidance from leaders and experienced mentors.",
      },
      {
        title: "Purpose",
        description:
          "Helping young adults discover and pursue their calling.",
      },
      {
        title: "Holistic Growth",
        description:
          "Spiritual, emotional, and personal development.",
      },
    ],

    gains: [
      "Clarity in life direction and purpose.",
      "Stronger decision-making skills.",
      "Spiritual maturity.",
      "Confidence in navigating adulthood.",
    ],

    question: "What does my future look like with God at the center?",
    answer:
      "MPH helps young adults align their lives with purpose, faith, and impact.",
  },

  youngprofessionals: {
    key: "youngprofessionals",
    title: "Young Professionals",
    subtitle: "Faith, Career, and Purpose Alignment",
    age: "25 – 35 Years",
    heroImage: "/images/YoungAdults.png",
    cardImage: "/images/YoungAdults.png",

    theme: {
      primary: "#0f172a",
      secondary: "#1e293b",
      accent: "#E0BE53",
    },

    intro:
      "Young Professionals is a space for individuals navigating careers, leadership, and purpose while staying rooted in faith.",

    why: [
      "Career growth often disconnects people from spiritual growth.",
      "Balancing ambition and faith can be challenging.",
      "Provides a community of like-minded believers.",
      "Encourages leadership and responsibility.",
      "Aligns career success with spiritual purpose.",
    ],

    pillars: [
      {
        title: "Faith",
        description: "Keeping Christ at the center of life decisions.",
      },
      {
        title: "Leadership",
        description: "Developing influence and responsibility.",
      },
      {
        title: "Impact",
        description:
          "Living a life that reflects purpose and service.",
      },
    ],

    gains: [
      "Clarity in career and purpose alignment.",
      "Stronger faith in professional spaces.",
      "Leadership development.",
      "Meaningful community.",
    ],

    question: "How do I live out my faith in my career and life?",
    answer:
      "Young Professionals helps align ambition with purpose and faith.",
  },
};