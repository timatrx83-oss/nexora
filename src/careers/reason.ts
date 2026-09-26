import type { Messages } from '../i18n/en'
import type { MatchReason } from './match'

export function formatMatchReason(reason: MatchReason, t: Messages) {
  let text = t.explore.reasons[reason.id]
  if (reason.theme) text = text.replaceAll('{theme}', t.assessment.themeNames[reason.theme])
  if (reason.interest) text = text.replaceAll('{interest}', t.assessment.interestNames[reason.interest])
  if (reason.interestB) text = text.replaceAll('{interestB}', t.assessment.interestNames[reason.interestB])
  if (reason.skill) text = text.replaceAll('{skill}', t.assessment.skillNames[reason.skill])
  if (reason.field) text = text.replaceAll('{field}', t.explore.fields[reason.field])
  return text.replaceAll(/\{[a-zA-Z]+\}/g, '').replaceAll(/\s+/g, ' ').trim()
}
