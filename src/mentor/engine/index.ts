import type { StrengthThemeId } from '../../assessment/types'
import { CAREERS } from '../../careers'
import type { Messages } from '../../i18n/en'
import type { Career } from '../../careers/types'
import {
  buildEngineContext,
  joinList,
  namedCareerFacts,
  overlapScore,
  skillTagsFor,
  type MentorCareerFact,
  type MentorEngineContext,
} from './context'
import { resolveIntent, type MentorIntent } from './intent'
import type { MentorSnapshot } from '../snapshot'
import type { MentorReply, MentorRequest } from '../types'

function fill(template: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, value), template)
}

function bullets(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n')
}

function themeLines(ids: StrengthThemeId[], t: Messages) {
  return ids
    .slice(0, 4)
    .map((id) => t.mentor.engine.themeFocus[id])
    .filter(Boolean)
}

function combos(ids: StrengthThemeId[], t: Messages) {
  const has = (id: StrengthThemeId) => ids.includes(id)
  const copy = t.mentor.engine.combo
  const lines: string[] = []
  if (has('creator') && has('problemSolver')) lines.push(copy.makeSolve)
  if (has('researcher') && has('criticalThinker')) lines.push(copy.investigate)
  if (has('empath') && has('communicator')) lines.push(copy.people)
  if (has('organizer') && has('achiever')) lines.push(copy.planExecute)
  if (has('impact')) lines.push(copy.impact)
  return lines
}

function needProfile(ctx: MentorEngineContext) {
  return ctx.t.mentor.engine.noProfile
}

function matchLine(item: MentorCareerFact, t: Messages) {
  const level =
    item.level === 'strong' ? t.explore.strong : item.level === 'good' ? t.explore.good : t.explore.low
  const extra = item.reason ? ` — ${item.reason}` : ''
  return `**${item.title}** (${level}, ${item.field})${extra}`
}

function careerConnect(item: MentorCareerFact, ctx: MentorEngineContext) {
  const e = ctx.t.mentor.engine
  const parts: string[] = []
  if (item.sharedInterests.length) {
    parts.push(fill(e.connectInterests, { interests: joinList(item.sharedInterests, ctx.locale) }))
  }
  if (item.sharedThemes.length) {
    parts.push(fill(e.connectThemes, { themes: joinList(item.sharedThemes, ctx.locale) }))
  }
  if (item.sharedWork.length) {
    parts.push(fill(e.connectWork, { work: joinList(item.sharedWork, ctx.locale) }))
  }
  return parts.join(' ')
}

function pickComparePair(careers: Career[], ctx: MentorEngineContext): MentorCareerFact[] {
  if (careers.length >= 2) return namedCareerFacts(careers.slice(0, 2), ctx)
  if (ctx.saved.length >= 2) return ctx.saved.slice(0, 2)
  const pool = [...ctx.strong, ...ctx.good]
  if (pool.length >= 2) return pool.slice(0, 2)
  if (pool.length === 1 && ctx.low[0]) return [pool[0], ctx.low[0]]
  return namedCareerFacts(CAREERS.slice(0, 2), ctx)
}

function replyFit(ctx: MentorEngineContext) {
  const e = ctx.t.mentor.engine
  if (!ctx.assessment) return needProfile(ctx)
  const lines = [
    e.basedOn,
    combos(ctx.stronger, ctx.t).join(' '),
    themeLines(ctx.stronger, ctx.t).slice(0, 3).join(' '),
    ctx.interests.length ? fill(e.interestLead, { interests: joinList(ctx.interests, ctx.locale) }) : '',
    ctx.strong.length ? `**${e.strongHead}**\n${bullets(ctx.strong.slice(0, 5).map((item) => matchLine(item, ctx.t)))}` : e.noStrong,
    ctx.good.length
      ? `**${e.goodHead}**\n${bullets(ctx.good.slice(0, 4).map((item) => `**${item.title}** (${item.field})`))}`
      : '',
    e.notAssigned,
  ]
  return lines.filter(Boolean).join('\n\n')
}

function replyWhyMatch(ctx: MentorEngineContext) {
  const e = ctx.t.mentor.engine
  if (!ctx.assessment) return needProfile(ctx)
  const items = [...ctx.strong, ...ctx.good].slice(0, 6)
  if (!items.length) return [e.basedOn, e.noStrong, e.notAssigned].join('\n\n')
  return [
    e.whyMatchLead,
    fill(e.whyMatchSignals, {
      interests: joinList(ctx.interests, ctx.locale) || e.none,
      themes: joinList(ctx.strongerNames, ctx.locale) || e.none,
      work: joinList(ctx.workStyle, ctx.locale) || e.none,
    }),
    bullets(items.map((item) => matchLine(item, ctx.t))),
    e.currentMatching,
  ].join('\n\n')
}

function replyWhyCareer(ctx: MentorEngineContext, careers: Career[]) {
  const e = ctx.t.mentor.engine
  const item = namedCareerFacts(careers, ctx)[0]
  if (!item) return e.careerMissing
  if (!ctx.assessment) {
    return [fill(e.careerBare, { title: item.title, field: item.field, about: ctx.t.careers[item.career.id]?.about ?? '' }), e.noProfile].join(
      '\n\n',
    )
  }
  const connect = careerConnect(item, ctx)
  const levelNote =
    item.level === 'strong' ? fill(e.whyStrong, { title: item.title }) : item.level === 'good' ? fill(e.whyGood, { title: item.title }) : fill(e.whyLow, { title: item.title })
  return [
    levelNote,
    item.reason,
    connect,
    fill(e.careerWork, { about: ctx.t.careers[item.career.id]?.summary ?? '' }),
    e.currentMatching,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function replyCareer(ctx: MentorEngineContext, careers: Career[]) {
  const e = ctx.t.mentor.engine
  const item = namedCareerFacts(careers, ctx)[0]
  if (!item) return e.careerMissing
  const copy = ctx.t.careers[item.career.id]
  const related = item.career.related
    .map((id) => ctx.t.careers[id]?.title)
    .filter(Boolean)
    .slice(0, 3)
  const lines = [
    fill(e.careerBare, { title: item.title, field: item.field, about: copy?.about ?? '' }),
    copy?.enjoyIf ? fill(e.careerEnjoy, { enjoy: copy.enjoyIf }) : '',
    item.skillTags.length ? fill(e.careerSkills, { skills: joinList(item.skillTags, ctx.locale) }) : '',
    ctx.assessment ? careerConnect(item, ctx) : '',
    related.length ? fill(e.careerRelated, { related: joinList(related as string[], ctx.locale) }) : '',
    e.exploreFurther,
  ]
  return lines.filter(Boolean).join('\n\n')
}

function replyTraits(ctx: MentorEngineContext) {
  const e = ctx.t.mentor.engine
  if (!ctx.assessment) return needProfile(ctx)
  return [
    e.basedOn,
    fill(e.strongerHead, { themes: joinList(ctx.strongerNames, ctx.locale) }),
    ...combos(ctx.stronger, ctx.t),
    ...themeLines(ctx.stronger, ctx.t),
    e.notDiagnosis,
  ].join('\n\n')
}

function replyDevelop(ctx: MentorEngineContext) {
  const e = ctx.t.mentor.engine
  if (!ctx.assessment) return needProfile(ctx)
  return [
    e.developLead,
    ctx.developingNames.length ? fill(e.developingHead, { themes: joinList(ctx.developingNames.slice(0, 5), ctx.locale) }) : '',
    e.developMeaning,
    ctx.exploreNames.length ? fill(e.exploreHead, { themes: joinList(ctx.exploreNames.slice(0, 5), ctx.locale) }) : '',
    ctx.skillGrow.length ? fill(e.skillGrow, { skills: joinList(ctx.skillGrow, ctx.locale) }) : '',
    e.notWeakness,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function replyExplore(ctx: MentorEngineContext) {
  const e = ctx.t.mentor.engine
  if (!ctx.assessment) return needProfile(ctx)
  const fields = [...ctx.strong, ...ctx.good].map((item) => item.field)
  const uniqueFields = [...new Set(fields)].slice(0, 5)
  return [
    e.exploreNextLead,
    ctx.interests.length ? fill(e.interestLead, { interests: joinList(ctx.interests, ctx.locale) }) : '',
    uniqueFields.length ? fill(e.fieldsLead, { fields: joinList(uniqueFields, ctx.locale) }) : '',
    ctx.strong.length
      ? fill(e.tryCareers, { careers: joinList(ctx.strong.slice(0, 4).map((item) => item.title), ctx.locale) })
      : '',
    ctx.exploreNames.length ? fill(e.exploreThemes, { themes: joinList(ctx.exploreNames.slice(0, 4), ctx.locale) }) : '',
    ctx.saved.length
      ? fill(e.savedNote, { careers: joinList(ctx.saved.slice(0, 4).map((item) => item.title), ctx.locale) })
      : '',
    e.exploreFurther,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function replyCompare(ctx: MentorEngineContext, careers: Career[]) {
  const e = ctx.t.mentor.engine
  const pair = pickComparePair(careers, ctx)
  if (pair.length < 2) return e.compareNeed
  const [a, b] = pair
  const copyA = ctx.t.careers[a.career.id]
  const copyB = ctx.t.careers[b.career.id]
  const scoreA = overlapScore(a)
  const scoreB = overlapScore(b)
  const closer =
    !ctx.assessment || scoreA === scoreB ? e.compareEven : scoreA > scoreB ? fill(e.compareCloser, { title: a.title }) : fill(e.compareCloser, { title: b.title })
  return [
    fill(e.compareHead, { a: a.title, b: b.title, aField: a.field, bField: b.field }),
    fill(e.compareAbout, { a: a.title, aAbout: copyA?.summary ?? '', b: b.title, bAbout: copyB?.summary ?? '' }),
    ctx.assessment ? fill(e.compareA, { title: a.title, link: careerConnect(a, ctx) || e.compareNoLink }) : '',
    ctx.assessment ? fill(e.compareB, { title: b.title, link: careerConnect(b, ctx) || e.compareNoLink }) : '',
    closer,
    e.notEitherOr,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function replySkills(ctx: MentorEngineContext, careers: Career[]) {
  const e = ctx.t.mentor.engine
  const focus = careers[0] ?? ctx.strong[0]?.career ?? ctx.saved[0]?.career
  const lines = [e.skillsLead]
  if (ctx.skillHigh.length) lines.push(fill(e.skillHigh, { skills: joinList(ctx.skillHigh, ctx.locale) }))
  if (ctx.skillGrow.length) lines.push(fill(e.skillGrow, { skills: joinList(ctx.skillGrow, ctx.locale) }))
  if (focus) {
    const title = ctx.t.careers[focus.id]?.title ?? focus.id
    const tags = skillTagsFor([focus], ctx.t)
    lines.push(fill(e.skillsCareer, { title, skills: joinList(tags, ctx.locale) }))
  } else if (ctx.strong.length) {
    lines.push(
      fill(e.skillsMatches, {
        skills: joinList(skillTagsFor(ctx.strong.map((item) => item.career), ctx.t), ctx.locale),
      }),
    )
  }
  if (!ctx.assessment) lines.push(e.noProfile)
  lines.push(e.skillsMap)
  return lines.filter(Boolean).join('\n\n')
}

function replyProfile(ctx: MentorEngineContext) {
  const e = ctx.t.mentor.engine
  if (!ctx.assessment) return needProfile(ctx)
  return [
    e.profileLead,
    fill(e.strongerHead, { themes: joinList(ctx.strongerNames, ctx.locale) }),
    ...combos(ctx.stronger, ctx.t),
    ctx.developingNames.length ? fill(e.developingHead, { themes: joinList(ctx.developingNames.slice(0, 5), ctx.locale) }) : '',
    ctx.exploreNames.length ? fill(e.exploreHead, { themes: joinList(ctx.exploreNames.slice(0, 5), ctx.locale) }) : '',
    ctx.interests.length ? fill(e.interestLead, { interests: joinList(ctx.interests, ctx.locale) }) : '',
    ctx.workStyle.length ? fill(e.workLead, { work: joinList(ctx.workStyle, ctx.locale) }) : '',
    e.notDiagnosis,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function replyGeneric(ctx: MentorEngineContext) {
  const e = ctx.t.mentor.engine
  if (!ctx.assessment) return [e.genericEmpty, e.noProfile].join('\n\n')
  const sample = [...ctx.strong, ...ctx.good].slice(0, 3).map((item) => item.title)
  return [
    e.genericHelp,
    ctx.interests.length ? fill(e.interestLead, { interests: joinList(ctx.interests, ctx.locale) }) : '',
    sample.length ? fill(e.tryCareers, { careers: joinList(sample, ctx.locale) }) : '',
    e.genericAsk,
  ]
    .filter(Boolean)
    .join('\n\n')
}

const HANDLERS: Record<MentorIntent, (ctx: MentorEngineContext, careers: Career[]) => string> = {
  fit: (ctx) => replyFit(ctx),
  whyMatch: (ctx) => replyWhyMatch(ctx),
  whyCareer: (ctx, careers) => replyWhyCareer(ctx, careers),
  traits: (ctx) => replyTraits(ctx),
  develop: (ctx) => replyDevelop(ctx),
  explore: (ctx) => replyExplore(ctx),
  compare: (ctx, careers) => replyCompare(ctx, careers),
  skills: (ctx, careers) => replySkills(ctx, careers),
  profile: (ctx) => replyProfile(ctx),
  career: (ctx, careers) => replyCareer(ctx, careers),
  generic: (ctx) => replyGeneric(ctx),
}

export function composeLocalMentorReply(request: MentorRequest, snapshot: MentorSnapshot, t: Messages) {
  const ctx = buildEngineContext(snapshot, t, request.locale)
  const resolved = resolveIntent(request, snapshot)
  let careers = resolved.careers
  if (resolved.intent === 'whyCareer' && careers.length === 0 && resolved.fields[0]) {
    const ranked = [...ctx.strong, ...ctx.good, ...ctx.low].filter((item) => item.career.field === resolved.fields[0])
    careers = (ranked[0] ? [ranked[0].career] : CAREERS.filter((item) => item.field === resolved.fields[0]).slice(0, 1))
  }
  return HANDLERS[resolved.intent](ctx, careers)
}

export function runLocalMentorEngine(request: MentorRequest, snapshot: MentorSnapshot, t: Messages): MentorReply {
  return { text: composeLocalMentorReply(request, snapshot, t) }
}
