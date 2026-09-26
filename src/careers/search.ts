import type { Messages } from '../i18n/en'
import type { Career, CareerFieldId } from './types'

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export function careerSearchText(career: Career, t: Messages) {
  const copy = t.careers[career.id]
  const skills = career.skillTags.map((tag) => t.explore.skillTags[tag]).join(' ')
  return normalize(
    [copy?.title, copy?.summary, copy?.about, t.explore.fields[career.field], skills].filter(Boolean).join(' '),
  )
}

export function matchesCareerQuery(career: Career, query: string, t: Messages) {
  const needle = normalize(query)
  if (!needle) return true
  return careerSearchText(career, t).includes(needle)
}

export function filterCareers(
  careers: Career[],
  field: CareerFieldId | 'all',
  query: string,
  t: Messages,
) {
  return careers.filter((career) => {
    if (field !== 'all' && career.field !== field) return false
    return matchesCareerQuery(career, query, t)
  })
}
