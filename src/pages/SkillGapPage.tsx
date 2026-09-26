import { PlaceholderPage } from './PlaceholderPage'
import { useI18n } from '../i18n/I18nProvider'

export function SkillGapPage() {
  const { t } = useI18n()
  const page = t.pages.skillGap
  return <PlaceholderPage kicker={page.kicker} title={page.heading} description={page.description} />
}
