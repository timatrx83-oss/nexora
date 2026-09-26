import { Card } from '../ui/Card'
import { useI18n } from '../../i18n/I18nProvider'

export function ProductViz() {
  const { t } = useI18n()
  const viz = t.home.viz

  return (
    <div className="viz" aria-hidden="true">
      <div className="viz__frame">
        <div className="viz__glow" />
        <span className="viz__dot viz__dot--1" />
        <span className="viz__dot viz__dot--2" />
        <span className="viz__dot viz__dot--3" />
        <svg className="viz__lines" viewBox="0 0 560 460" fill="none">
          <path d="M90 90 C180 140, 240 80, 340 128" stroke="url(#vizStroke)" strokeWidth="1" />
          <path d="M120 340 C220 280, 300 360, 430 300" stroke="rgba(139,124,255,0.28)" strokeWidth="1" />
          <defs>
            <linearGradient id="vizStroke" x1="90" y1="90" x2="340" y2="128">
              <stop stopColor="#3EC8E0" stopOpacity="0.55" />
              <stop offset="1" stopColor="#8B7CFF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        <Card className="viz-card viz-card--skills" elevated>
          <p className="card__label">{viz.creativity}</p>
          <p className="card__value">92%</p>
          <div className="progress">
            <span style={{ width: '92%' }} />
          </div>
        </Card>

        <Card className="viz-card viz-card--direction" elevated>
          <p className="card__label">{viz.direction}</p>
          <p className="card__value">87%</p>
          <p className="card__hint">{viz.alignment}</p>
        </Card>

        <Card className="viz-card viz-card--profile">
          <p className="card__label">{viz.communication}</p>
          <p className="card__title viz-card__status">{viz.communicationValue}</p>
          <p className="card__hint">{viz.personaHint}</p>
        </Card>

        <Card className="viz-card viz-card--growth">
          <p className="card__label">{viz.growth}</p>
          <p className="card__value viz-card__delta">+12%</p>
          <p className="card__hint">{viz.growthHint}</p>
        </Card>

        <p className="viz__caption">{viz.caption}</p>
      </div>
    </div>
  )
}
