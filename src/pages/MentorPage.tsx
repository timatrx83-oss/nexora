import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { CosmicField } from '../components/home/CosmicField'
import { MentorMarkdown } from '../mentor/MentorMarkdown'
import { useMentor } from '../mentor/useMentor'
import { featuredThemes } from '../assessment/score'
import { useI18n } from '../i18n/I18nProvider'
import '../styles/mentor.css'

export function MentorPage() {
  const { t } = useI18n()
  const copy = t.mentor
  const mentor = useMentor()
  const [draft, setDraft] = useState('')
  const bottom = useRef<HTMLDivElement>(null)
  const assessment = mentor.snapshot.assessment

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mentor.messages, mentor.loading])

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    const text = draft.trim()
    if (!text) return
    setDraft('')
    void mentor.send(text)
  }

  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  const highThemes = assessment
    ? featuredThemes(assessment.strengthThemes, assessment.signals?.themes).filter((item) => item.level === 'high')
    : []

  return (
    <div className="mentor-page">
      <CosmicField />
      <header className="mentor-hero">
        <Container>
          <div className="mentor-hero__panel">
            <div className="mentor-thread-path" aria-hidden="true">
              <span />
              <i />
              <span />
              <i />
              <span />
              <i />
              <span />
            </div>
            <p className="kicker">{copy.kicker}</p>
            <h1>{copy.heading}</h1>
            <p className="lede">{copy.lede}</p>
          </div>
        </Container>
      </header>

      <Container>
        <div className="mentor-shell">
          <aside className="mentor-side">
            <p className="mentor-hello">{copy.hello}</p>
            <p className="mentor-hello__body">{copy.helloBody}</p>

            <section className="mentor-context" aria-labelledby="mentor-context-title">
              <h2 id="mentor-context-title">{copy.context}</h2>
              {assessment ? (
                <dl>
                  <div>
                    <dt>{copy.interests}</dt>
                    <dd>{assessment.interests.map((id) => t.assessment.interestNames[id]).join(' · ')}</dd>
                  </div>
                  <div>
                    <dt>{copy.strengths}</dt>
                    <dd>{assessment.strengths.map((id) => t.assessment.strengthNames[id]).join(' · ')}</dd>
                  </div>
                  {highThemes.length > 0 ? (
                    <div>
                      <dt>{copy.themes}</dt>
                      <dd>{highThemes.map((item) => t.assessment.themeNames[item.id]).join(' · ')}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>{copy.saved}</dt>
                    <dd>{String(mentor.snapshot.savedIds.length)}</dd>
                  </div>
                </dl>
              ) : (
                <div className="mentor-context__empty">
                  <p>{copy.emptyContext}</p>
                  <Button to="/assessment">{copy.emptyCta}</Button>
                </div>
              )}
            </section>
          </aside>

          <div className="mentor-main">
            {!mentor.hasChat ? (
              <div className="mentor-starters">
                {mentor.starters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="mentor-starter"
                    disabled={mentor.loading}
                    onClick={() => void mentor.send(item.label, item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mentor-thread" role="log" aria-live="polite">
              {mentor.messages.length === 0 && !mentor.loading ? (
                <p className="mentor-thread__empty">{copy.emptyChat}</p>
              ) : null}
              {mentor.messages.map((item) => (
                <figure
                  key={item.id}
                  className={item.role === 'user' ? 'mentor-bubble mentor-bubble--user' : 'mentor-bubble mentor-bubble--mentor'}
                >
                  <figcaption>{item.role === 'user' ? copy.you : copy.mentor}</figcaption>
                  {item.role === 'mentor' ? <MentorMarkdown text={item.text} /> : <p>{item.text}</p>}
                </figure>
              ))}
              {mentor.loading ? (
                <figure className="mentor-bubble mentor-bubble--mentor is-loading">
                  <figcaption>{copy.mentor}</figcaption>
                  <p>{copy.thinking}</p>
                </figure>
              ) : null}
              {mentor.error && !mentor.loading ? (
                <div className="mentor-error" role="alert">
                  <p>{copy.error}</p>
                  <Button variant="secondary" type="button" onClick={mentor.retry}>
                    {copy.retry}
                  </Button>
                </div>
              ) : null}
              <div ref={bottom} />
            </div>

            <form className="mentor-composer" onSubmit={submit}>
              <label className="sr-only" htmlFor="mentor-input">
                {copy.inputLabel}
              </label>
              <textarea
                id="mentor-input"
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={onKey}
                placeholder={copy.placeholder}
                disabled={mentor.loading}
              />
              <div className="mentor-composer__row">
                {mentor.hasChat ? (
                  <Button variant="ghost" type="button" onClick={mentor.clear}>
                    {copy.clear}
                  </Button>
                ) : (
                  <span />
                )}
                <Button type="submit" disabled={mentor.loading || !draft.trim()}>
                  {copy.send}
                </Button>
              </div>
            </form>
            <p className="mentor-disclaimer">{copy.disclaimer}</p>
          </div>
        </div>
      </Container>
    </div>
  )
}
