import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { AssessmentIntro } from '../components/assessment/AssessmentIntro'
import { AssessmentProgress } from '../components/assessment/AssessmentProgress'
import { AssessmentQuestion } from '../components/assessment/AssessmentQuestion'
import { AssessmentResultView } from '../components/assessment/AssessmentResultView'
import { AssessmentSkills } from '../components/assessment/AssessmentSkills'
import { useAssessment } from '../assessment/useAssessment'
import '../styles/assessment.css'

type LocationState = { retake?: boolean }

export function AssessmentPage() {
  const flow = useAssessment()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const state = location.state as LocationState | null
    if (!state?.retake) return
    flow.retake()
    navigate('/assessment', { replace: true, state: {} })
  }, [flow.retake, location.state, navigate])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [flow.draft.phase, flow.draft.questionIndex])

  if (flow.draft.phase === 'intro') {
    return (
      <AssessmentIntro
        onStart={flow.start}
        onResume={flow.resume}
        onViewResult={flow.viewResult}
        canResume={flow.canResume}
        hasResult={flow.hasResult}
      />
    )
  }

  if (flow.draft.phase === 'result' && flow.draft.result) {
    return (
      <Container className="assess-wrap">
        <AssessmentResultView result={flow.draft.result} onRetake={flow.retake} />
      </Container>
    )
  }

  return (
    <Container className="assess-wrap">
      <AssessmentProgress
        current={flow.progressCurrent}
        total={flow.progressTotal}
        questionIndex={flow.draft.questionIndex}
        questionTotal={flow.questionTotal}
      />
      {flow.isSkillStep ? (
        <AssessmentSkills
          key="skills"
          values={flow.draft.skills}
          error={flow.error}
          onRate={flow.rateSkill}
          onNext={flow.next}
          onBack={flow.back}
        />
      ) : flow.question ? (
        <AssessmentQuestion
          key={flow.question.id}
          question={flow.question}
          selected={flow.draft.answers[flow.question.id]}
          error={flow.error}
          onSelect={(optionId) => flow.selectOption(flow.question!.id, optionId)}
          onNext={flow.next}
          onBack={flow.back}
        />
      ) : null}
    </Container>
  )
}
