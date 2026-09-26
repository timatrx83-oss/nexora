import { useCallback, useEffect, useState } from 'react'
import { getSavedCareerIds, subscribeToSavedCareers, toggleSavedCareer } from './storage'

export function useSavedCareers() {
  const [ids, setIds] = useState<string[]>(() => getSavedCareerIds())

  useEffect(() => subscribeToSavedCareers(() => setIds(getSavedCareerIds())), [])

  const toggle = useCallback((id: string) => {
    setIds(toggleSavedCareer(id))
  }, [])

  return { ids, isSaved: (id: string) => ids.includes(id), toggle }
}
