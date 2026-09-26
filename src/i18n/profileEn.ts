export const profileEn = {
  kicker: 'You',
  heading: 'My Profile',
  lede: 'Your personal snapshot based on your NEXORA assessment.',
  idea: 'Understand yourself first. Then explore what comes next.',
  status: 'Assessment completed',
  current: 'Your current profile',
  empty: {
    heading: 'Your profile starts with your assessment.',
    lede: 'Complete the short assessment to discover your interests, strengths and skills.',
    cta: 'Take the assessment',
  },
  overview: {
    interests: 'Top interests',
    strengths: 'Top strengths',
    workStyle: 'Work style',
    skills: 'Strongest skills',
    empty: 'Not enough signal yet',
  },
  strengths: {
    title: 'Your strengths',
    lede: 'These are areas that stood out in your assessment — a starting point, not a ceiling.',
    copy: {
      communication: 'Expressing ideas clearly and working effectively with others.',
      creativity: 'Generating new ideas and finding different ways to approach problems.',
      leadership: 'Helping a group move forward and making decisions when needed.',
      analyticalThinking: 'Breaking down information and seeing how pieces connect.',
      adaptability: 'Adjusting when plans change and staying useful in new situations.',
      digitalSkills: 'Using digital tools to learn, create and get work done.',
    },
  },
  interests: {
    title: 'Your interests',
    lede: 'Themes that showed up most clearly in your answers.',
  },
  workStyle: {
    title: 'Your work style',
    lede: 'Preferences from your assessment — not fixed personality traits.',
    prefer: 'You may prefer',
    axes: {
      social: {
        left: 'Working independently',
        right: 'Working with others',
        leftHint: 'quiet focus and self-directed work',
        rightHint: 'conversation and shared momentum',
        balancedHint: 'a mix of solo time and collaboration, depending on the task',
      },
      structure: {
        left: 'A clear structure',
        right: 'Room to adapt',
        leftHint: 'defined goals, timelines and delivery',
        rightHint: 'flexibility when the situation shifts',
        balancedHint: 'enough structure to move, with space to adjust',
      },
      pace: {
        left: 'Steady and planned',
        right: 'New and fast-changing',
        leftHint: 'predictable progress toward a finish line',
        rightHint: 'unfamiliar briefs and evolving problems',
        balancedHint: 'a blend of planned delivery and new questions',
      },
      role: {
        left: 'Taking the lead',
        right: 'Contributing in a group',
        leftHint: 'steering direction and decisions',
        rightHint: 'supporting the work without always owning the lead',
        balancedHint: 'leading when useful, contributing when that serves the work',
      },
    },
  },
  skills: {
    title: 'Skills snapshot',
    lede: 'How you rated yourself today. These are self-views, not test scores.',
    scale: '{value} of 5',
    developTitle: 'Skills to develop',
    developLede: 'Worth growing next — an opening, not a weakness.',
  },
  explore: {
    title: 'Explore next',
    lede: 'Areas you may want to explore. These are directions, not a final career choice.',
    cardHint: 'This area may be worth exploring based on your interests and strengths.',
    later: 'Full exploration comes in a later stage.',
  },
  retake: 'Retake assessment',
  source: 'This profile is generated from your latest NEXORA assessment.',
}

export type ProfileCopy = typeof profileEn
