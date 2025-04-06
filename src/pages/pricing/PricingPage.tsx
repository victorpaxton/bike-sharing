import { Crown, Check } from 'lucide-react';
import { PRICING_PLANS } from '../../utils/pricing';

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the plan that works best for you. All plans include access to our entire bike network.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Standard Plan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Standard Plan</h2>
          <div className="flex items-baseline mb-8">
            <span className="text-4xl font-bold text-gray-900">${PRICING_PLANS.STANDARD.baseRate}</span>
            <span className="text-gray-500 ml-2">base rate</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>First {PRICING_PLANS.STANDARD.freeMinutes} minutes included in base rate</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>${PRICING_PLANS.STANDARD.perMinuteRate.toFixed(2)}/minute after first {PRICING_PLANS.STANDARD.freeMinutes} minutes</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>Access to all bikes and stations</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>24/7 customer support</span>
            </li>
          </ul>

          <button className="w-full bg-gray-900 text-white rounded-lg py-3 px-4 hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-primary-50 rounded-2xl shadow-sm border border-primary-100 p-8 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>

          <div className="flex items-center mb-4">
            <Crown className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Premium Plan</h2>
          </div>

          <div className="flex items-baseline mb-8">
            <span className="text-4xl font-bold text-gray-900">${PRICING_PLANS.PREMIUM.baseRate}</span>
            <span className="text-gray-500 ml-2">base rate</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>First {PRICING_PLANS.PREMIUM.freeMinutes} minutes free</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>${PRICING_PLANS.PREMIUM.perMinuteRate.toFixed(2)}/minute after {PRICING_PLANS.PREMIUM.freeMinutes} minutes</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>First {PRICING_PLANS.PREMIUM.maxFreeRidesPerDay} rides under {PRICING_PLANS.PREMIUM.freeMinutes} minutes are free each day</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>10% discount on all other rides (up to $2)</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>Priority customer support</span>
            </li>
          </ul>

          <button className="w-full bg-primary-600 text-white rounded-lg py-3 px-4 hover:bg-primary-700 transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Example Pricing */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Example Pricing</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Ride Duration</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Standard Plan</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Premium Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">5 minutes</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">${PRICING_PLANS.STANDARD.baseRate.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">$0.00*</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">15 minutes</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  ${(PRICING_PLANS.STANDARD.baseRate + (10 * PRICING_PLANS.STANDARD.perMinuteRate)).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">$0.00*</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">30 minutes</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  ${(PRICING_PLANS.STANDARD.baseRate + (25 * PRICING_PLANS.STANDARD.perMinuteRate)).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">$0.00*</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">90 minutes</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  ${(PRICING_PLANS.STANDARD.baseRate + (85 * PRICING_PLANS.STANDARD.perMinuteRate)).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  ${(PRICING_PLANS.PREMIUM.baseRate + (30 * PRICING_PLANS.PREMIUM.perMinuteRate) * 0.9).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          * First {PRICING_PLANS.PREMIUM.maxFreeRidesPerDay} rides under {PRICING_PLANS.PREMIUM.freeMinutes} minutes are free each day with Premium Plan
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">How is the ride cost calculated?</h3>
            <p className="text-gray-600">
              The cost consists of a base rate plus a per-minute rate after the included free minutes. Premium members get additional benefits like free rides and discounts.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">What happens if I go over the free minutes?</h3>
            <p className="text-gray-600">
              After your free minutes, you'll be charged the per-minute rate for your plan. Premium members enjoy a lower per-minute rate.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Can I change plans?</h3>
            <p className="text-gray-600">
              Yes, you can upgrade to Premium or switch back to Standard at any time. Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 