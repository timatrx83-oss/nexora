import { useEffect, useState } from 'react'
import { getStoredResult, subscribeToAssessmentResult } from './storage'
import type { AssessmentResult } from './types'

export function useAssessmentResult() {
  const [result, setResult] = useState<AssessmentResult | null>(() => getStoredResult())

  useEffect(() => {
    const sync = () => setResult(getStoredResult())
    return subscribeToAssessmentResult(sync)
  }, [])

  return result
}
