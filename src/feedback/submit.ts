import { supabase } from '../lib/supabase'
import type { FeedbackDraft } from './storage'

const TEXT_LIMIT = 2000

function optionalText(value: string) {
  const trimmed = value.trim().slice(0, TEXT_LIMIT)
  return trimmed.length > 0 ? trimmed : null
}

export async function insertFeedback(draft: FeedbackDraft): Promise<boolean> {
  const { error } = await supabase.from('feedback').insert({
    overall_rating: draft.ratings.overallExperience,
    ease_rating: draft.ratings.easeOfUse,
    design_rating: draft.ratings.visualDesign,
    assessment_rating: draft.ratings.assessmentExperience,
    reuse_rating: draft.ratings.likelihoodToUseAgain,
    liked_most: optionalText(draft.likedMost),
    improve: optionalText(draft.improve),
    recommendation: draft.recommendation,
  })

  return !error
}
