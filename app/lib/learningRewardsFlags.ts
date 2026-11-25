// Feature stays off until Fountain Prep's migration is applied and verified.
// Rewards must never block lesson, payment, or booking flows.
export const LEARNING_REWARDS_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_LEARNING_REWARDS === 'true'
