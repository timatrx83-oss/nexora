import { useSavedCareers } from '../../careers/useSavedCareers'
import { useI18n } from '../../i18n/I18nProvider'

type CareerSaveButtonProps = {
  careerId: string
  title: string
  className?: string
}

export function CareerSaveButton({ careerId, title, className = '' }: CareerSaveButtonProps) {
  const { t } = useI18n()
  const { isSaved, toggle } = useSavedCareers()
  const saved = isSaved(careerId)

  return (
    <button
      type="button"
      className={`career-save ${saved ? 'is-saved' : ''} ${className}`.trim()}
      aria-pressed={saved}
      aria-label={(saved ? t.explore.unsaveAria : t.explore.saveAria).replace('{title}', title)}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle(careerId)
      }}
    >
      <span aria-hidden="true">{saved ? '✓' : '♡'}</span>
      {saved ? t.explore.saved : t.explore.save}
    </button>
  )
}
