export interface PricingPlan {
  name: string;
  baseRate: number;
  perMinuteRate: number;
  freeMinutes: number;
  maxFreeRidesPerDay: number;
}

export interface RideDetails {
  durationMinutes: number;
  distanceKm: number;
  isPremiumUser: boolean;
  ridesCompletedToday: number;
}

// Define pricing plans
export const PRICING_PLANS = {
  STANDARD: {
    name: 'Standard',
    baseRate: 1.00,        // Base rate for starting a ride
    perMinuteRate: 0.15,   // Rate per minute after free minutes
    freeMinutes: 5,        // First 5 minutes are included in base rate
    maxFreeRidesPerDay: 0  // No free rides for standard plan
  },
  PREMIUM: {
    name: 'Premium',
    baseRate: 0.50,        // Reduced base rate for premium users
    perMinuteRate: 0.10,   // Reduced per-minute rate
    freeMinutes: 60,       // First 60 minutes are free
    maxFreeRidesPerDay: 2  // 2 completely free rides per day
  }
} as const;

/**
 * Calculate the cost of a ride based on duration, distance, and user plan
 */
export function calculateRideCost(rideDetails: RideDetails): {
  totalCost: number;
  breakdown: {
    baseRate: number;
    minutesCost: number;
    discount: number;
  };
} {
  const plan = rideDetails.isPremiumUser ? PRICING_PLANS.PREMIUM : PRICING_PLANS.STANDARD;
  
  // Check if this ride qualifies for free ride (Premium users only)
  if (rideDetails.isPremiumUser && 
      rideDetails.ridesCompletedToday < plan.maxFreeRidesPerDay && 
      rideDetails.durationMinutes <= plan.freeMinutes) {
    return {
      totalCost: 0,
      breakdown: {
        baseRate: 0,
        minutesCost: 0,
        discount: plan.baseRate // Show how much they saved
      }
    };
  }

  // Calculate base components
  const baseRate = plan.baseRate;
  const chargableMinutes = Math.max(0, rideDetails.durationMinutes - plan.freeMinutes);
  const minutesCost = chargableMinutes * plan.perMinuteRate;

  // Calculate total before any discounts
  const subtotal = baseRate + minutesCost;
  
  // Apply premium discount if applicable
  const discount = rideDetails.isPremiumUser ? Math.min(2, subtotal * 0.1) : 0; // 10% discount up to $2

  return {
    totalCost: Math.max(0, subtotal - discount),
    breakdown: {
      baseRate,
      minutesCost,
      discount
    }
  };
}

/**
 * Format price in USD
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Get estimated ride cost for display
 */
export function getEstimatedCost(durationMinutes: number, isPremiumUser: boolean): string {
  const estimate = calculateRideCost({
    durationMinutes,
    distanceKm: 0, // Distance doesn't affect price currently
    isPremiumUser,
    ridesCompletedToday: 0 // Assume first ride of day for estimate
  });
  
  return formatPrice(estimate.totalCost);
}

/**
 * Get a human-readable explanation of pricing
 */
export function getPricingExplanation(isPremiumUser: boolean): string {
  const plan = isPremiumUser ? PRICING_PLANS.PREMIUM : PRICING_PLANS.STANDARD;
  
  let explanation = `${plan.name} Plan: $${plan.baseRate} base rate includes first ${plan.freeMinutes} minutes. `;
  explanation += `$${plan.perMinuteRate.toFixed(2)}/minute after that.`;
  
  if (isPremiumUser) {
    explanation += ` First ${plan.maxFreeRidesPerDay} rides under ${plan.freeMinutes} minutes are free each day. 10% discount on other rides (up to $2).`;
  }
  
  return explanation;
} 