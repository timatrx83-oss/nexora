import { PageHeader } from '../components/ui/PageHeader'
import { Container } from '../components/ui/Container'
import { Skeleton } from '../components/ui/Skeleton'
import { useI18n } from '../i18n/I18nProvider'

type PlaceholderPageProps = {
  kicker: string
  title: string
  description: string
}

export function PlaceholderPage({ kicker, title, description }: PlaceholderPageProps) {
  const { t } = useI18n()

  return (
    <>
      <PageHeader kicker={kicker} title={title} description={description} />
      <Container>
        <div className="placeholder-panel">
          <p className="meta">{t.common.laterStage}</p>
          <div className="placeholder-panel__lines" aria-hidden="true">
            <Skeleton height="0.7rem" width="72%" />
            <Skeleton height="0.7rem" width="90%" />
            <Skeleton height="0.7rem" width="58%" />
          </div>
        </div>
      </Container>
    </>
  )
}
