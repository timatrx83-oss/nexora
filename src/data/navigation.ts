/** Visible product navigation. Order is the current user journey. */
export const navItems = [
  { id: 'home', to: '/' },
  { id: 'assessment', to: '/assessment' },
  { id: 'profile', to: '/profile' },
  { id: 'explore', to: '/explore' },
  { id: 'mentor', to: '/mentor' },
] as const

export const footerNav = [
  { id: 'home', to: '/' },
  { id: 'assessment', to: '/assessment' },
  { id: 'profile', to: '/profile' },
  { id: 'explore', to: '/explore' },
  { id: 'mentor', to: '/mentor' },
] as const

/** Kept for later stages. Not shown in nav, footer, or home journey. */
export const deferredNavItems = [
  { id: 'path', to: '/roadmap' },
  { id: 'skillGap', to: '/skill-gap' },
  { id: 'projects', to: '/projects' },
] as const

/** Home preview sections for Roadmap and Projects. Toggle when those stages return. */
export const SHOW_DEFERRED_HOME_SECTIONS = false

export const pageKeys = {
  '/': 'home',
  '/assessment': 'assessment',
  '/profile': 'profile',
  '/explore': 'explore',
  '/skill-gap': 'skillGap',
  '/roadmap': 'roadmap',
  '/mentor': 'mentor',
  '/projects': 'projects',
} as const
