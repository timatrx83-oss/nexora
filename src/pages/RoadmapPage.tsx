import { PlaceholderPage } from './PlaceholderPage'
import { useI18n } from '../i18n/I18nProvider'

export function RoadmapPage() {
  const { t } = useI18n()
  const page = t.pages.roadmap
  return <PlaceholderPage kicker={page.kicker} title={page.heading} description={page.description} />
}
