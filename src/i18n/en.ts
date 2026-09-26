import { assessmentEn } from './assessmentEn'
import { careersEn } from './careersEn'
import { exploreEn } from './exploreEn'
import { mentorEn } from './mentorEn'
import { profileEn } from './profileEn'

export const en = {
  common: {
    skip: 'Skip to content',
    startJourney: 'Start Your Journey',
    exploreCareers: 'Explore Careers',
    language: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    logoHome: 'NEXORA home',
    laterStage: 'Coming in a later stage',
    skills: 'Skills',
  },
  nav: {
    home: 'Home',
    discover: 'Discover',
    assessment: 'Assessment',
    profile: 'My Profile',
    explore: 'Explore',
    path: 'My Path',
    mentor: 'AI Mentor',
    projects: 'Projects',
  },
  footer: {
    tagline: 'Your skills. Your future. Your next move.',
    note: 'AI supports exploration. Your decisions are your own.',
    home: 'Home',
    assessment: 'Assessment',
    explore: 'Explore',
    profile: 'My Profile',
    path: 'My Path',
    mentor: 'AI Mentor',
    projects: 'Projects',
  },
  meta: {
    homeTitle: 'NEXORA — Your skills. Your future. Your next move.',
    pageTitle: '{page} — NEXORA',
  },
  pages: {
    home: { title: 'Home' },
    assessment: {
      title: 'Assessment',
      kicker: 'Discover',
      heading: 'Assessment',
      description:
        'This is where interests and strengths will be mapped. The assessment flow is not implemented yet.',
    },
    profile: {
      title: 'My Profile',
      kicker: 'Profile',
      heading: 'My Profile',
      description: 'Your personal snapshot based on your NEXORA assessment.',
    },
    explore: {
      title: 'Explore',
      kicker: exploreEn.kicker,
      heading: exploreEn.heading,
      description: exploreEn.lede,
    },
    skillGap: {
      title: 'Skill gaps',
      kicker: 'Skills',
      heading: 'Skill gaps',
      description:
        'Later, this space will show what to learn next. No calculations run in the foundation.',
    },
    roadmap: {
      title: 'Roadmap',
      kicker: 'My Path',
      heading: 'Roadmap',
      description: 'A sequenced plan from today to the next move will appear here in a later stage.',
    },
    mentor: {
      title: 'AI Mentor',
      kicker: mentorEn.kicker,
      heading: mentorEn.heading,
      description: mentorEn.lede,
    },
    projects: {
      title: 'Projects',
      kicker: 'Projects',
      heading: 'Projects',
      description:
        'Practice work that builds evidence of skill will be listed here later. This is structure only.',
    },
  },
  home: {
    hero: {
      eyebrow: 'Career intelligence',
      wordmark: 'NEXORA',
      heading: 'Your skills. Your future. Your next move.',
      lede: 'Discover your strengths, explore what’s possible, and find the skills that can move you forward.',
      ctaPrimary: 'Start Your Journey',
    },
    viz: {
      skills: 'Creativity',
      creativity: 'Creativity',
      communication: 'Communication',
      communicationValue: 'Strong',
      analytical: 'Analytical',
      profile: 'Profile signal',
      persona: 'Creative Strategist',
      personaHint: 'Illustrative fragment',
      direction: 'AI & Business',
      directionValue: 'AI & Business',
      alignment: 'Illustrative alignment',
      growth: 'Skill growth',
      growthHint: 'Example marker',
      caption: 'Interface preview — not live user data',
    },
    trust: {
      heading: 'Career exploration is changing.',
      support:
        'AI can help you understand your options. NEXORA helps you turn that understanding into action.',
    },
    journey: {
      kicker: 'The path',
      title: 'From uncertainty to clarity.',
      lede: 'NEXORA turns a vague question about the future into a practical next step.',
      stages: [
        {
          title: 'Interests',
          copy: 'Name what draws you — questions, fields, and the work that holds your attention.',
        },
        {
          title: 'Strengths',
          copy: 'See the themes that show up in how you think, create, and collaborate.',
        },
        {
          title: 'Exploration',
          copy: 'Compare career fields that connect with your current NEXORA profile.',
        },
        {
          title: 'Your next move',
          copy: 'Turn the profile into a conversation with your Mentor — not a final verdict.',
        },
      ],
    },
    careers: {
      kicker: 'Directions',
      title: 'Explore what’s possible.',
      lede: 'Career paths are no longer defined by a single job title. Explore fields, skills and possibilities.',
      skillsLabel: 'Skills',
      impactLabel: 'AI impact',
      impactNote: 'Illustrative label',
      cards: {
        business: {
          field: 'Business',
          line: 'Build. Lead. Grow.',
          skills: 'Strategy · Leadership · Finance',
          impact: 'High',
        },
        tech: {
          field: 'AI + Technology',
          line: 'Build what’s next.',
          skills: 'AI · Data · Technology',
          impact: 'Very High',
        },
        marketing: {
          field: 'Marketing',
          line: 'Understand. Create. Influence.',
          skills: 'Communication · Creativity · Analytics',
          impact: 'High',
        },
        creative: {
          field: 'Creative',
          line: 'Turn ideas into experiences.',
          skills: 'Design · Storytelling · Creativity',
          impact: 'High',
        },
        finance: {
          field: 'Finance',
          line: 'Understand how value moves.',
          skills: 'Analysis · Economics · Decision-making',
          impact: 'High',
        },
      },
    },
    skills: {
      kicker: 'Capability',
      title: 'Skills are the new starting point.',
      lede: 'Your future is not only about choosing a career. It is also about building the skills that let you move between opportunities.',
      caption: 'Example skill map — preview data, not a personal score',
      items: {
        communication: 'Communication',
        creativity: 'Creativity',
        leadership: 'Leadership',
        analytical: 'Analytical Thinking',
        adaptability: 'Adaptability',
        digital: 'Digital Skills',
      },
    },
    roadmap: {
      kicker: 'Roadmap',
      title: 'Turn direction into action.',
      lede: 'Once you know what you want to explore, NEXORA helps you turn that direction into a practical 30-day plan.',
      caption: 'Visual preview — plans are not generated yet.',
      days: {
        d01: { day: 'Day 01', title: 'Understand' },
        d07: { day: 'Day 07', title: 'Practice' },
        d14: { day: 'Day 14', title: 'Build' },
        d30: { day: 'Day 30', title: 'Apply' },
      },
    },
    mentor: {
      kicker: 'Guidance',
      title: 'Meet your AI Mentor.',
      lede: 'Ask questions, challenge your ideas, and get guidance based on your interests, skills and goals.',
      idea: 'Your profile is not just a result. You can explore it with your Mentor.',
      prompts: [
        'What careers match my strengths?',
        'What should I explore next?',
        'Which skills could I build?',
      ],
      open: 'Open AI Mentor',
      context: 'Context',
      profileLabel: 'User profile',
      profileValue: 'Creative Strategist',
      exploringLabel: 'Exploring',
      exploringValue: 'Business + AI',
      focusLabel: 'Focus',
      focusValue: 'Analytical Thinking',
      exchange: 'Illustrative exchange',
      you: 'You',
      mentor: 'Mentor',
      userMessage: 'I like business and technology. What could I explore?',
      mentorMessage:
        'Start by exploring areas where strategy and technology overlap — such as product management, business analytics, or AI-driven entrepreneurship.',
    },
    projects: {
      kicker: 'Practice',
      title: 'Don’t just explore. Build.',
      lede: 'Turn your interests into something real.',
      caption: 'Example briefs — not completed user work.',
      skillsLabel: 'Skills',
      items: {
        p01: {
          field: 'AI + Business',
          title: 'Design an AI solution for a problem students face.',
          skills: 'Research · Strategy · AI',
        },
        p02: {
          field: 'Marketing',
          title: 'Create a campaign for a product you believe in.',
          skills: 'Creativity · Communication · Analytics',
        },
        p03: {
          field: 'Data',
          title: 'Find a real-world question and turn data into an insight.',
          skills: 'Analysis · Research · Visualization',
        },
      },
    },
    cta: {
      kicker: 'Begin',
      title: 'Your next move starts here.',
      lede: 'You don’t need to have your whole future figured out. You just need a place to start.',
    },
  },
  assessment: assessmentEn,
  profile: profileEn,
  explore: exploreEn,
  careers: careersEn,
  mentor: mentorEn,
}

export type Messages = typeof en
