import { useState } from 'react';
import { DollarSign, Plus, Edit2, Trash2, Clock, Zap } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  baseRate: number;
  perMinuteRate: number;
  unlockFee: number;
  freeMinutes: number;
  maxRidesPerDay: number;
  isPopular: boolean;
}

interface PricingRule {
  id: string;
  name: string;
  type: 'discount' | 'surcharge';
  value: number;
  condition: string;
  active: boolean;
}

const mockPricingPlans: PricingPlan[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'Perfect for occasional riders',
    baseRate: 2.00,
    perMinuteRate: 0.20,
    unlockFee: 1.00,
    freeMinutes: 0,
    maxRidesPerDay: 0,
    isPopular: false,
  },
  {
    id: '2',
    name: 'Premium',
    description: 'Best value for regular commuters',
    baseRate: 0,
    perMinuteRate: 0.15,
    unlockFee: 0,
    freeMinutes: 30,
    maxRidesPerDay: 4,
    isPopular: true,
  },
  {
    id: '3',
    name: 'Student',
    description: 'Special rates for students',
    baseRate: 1.00,
    perMinuteRate: 0.10,
    unlockFee: 0.50,
    freeMinutes: 15,
    maxRidesPerDay: 2,
    isPopular: false,
  },
];

const mockPricingRules: PricingRule[] = [
  {
    id: '1',
    name: 'Weekend Discount',
    type: 'discount',
    value: 20,
    condition: 'Applies on weekends',
    active: true,
  },
  {
    id: '2',
    name: 'Peak Hours Surcharge',
    type: 'surcharge',
    value: 15,
    condition: 'Applies during 8-10 AM and 5-7 PM',
    active: true,
  },
  {
    id: '3',
    name: 'First Ride Discount',
    type: 'discount',
    value: 50,
    condition: 'Applies to first-time riders',
    active: true,
  },
];

export default function PricingManagementPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Pricing Management
        </h1>
        <button className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </button>
      </div>

      {/* Pricing Plans */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Pricing Plans</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockPricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                selectedPlan === plan.id ? 'bg-primary-50' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {plan.name}
                    </h3>
                    {plan.isPopular && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Base Rate: ${plan.baseRate.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Per Minute: ${plan.perMinuteRate.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Zap className="w-4 h-4 mr-2" />
                      Unlock Fee: ${plan.unlockFee.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Free Minutes: {plan.freeMinutes}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-500">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Rules */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Pricing Rules</h2>
          <button className="btn btn-secondary flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {mockPricingRules.map((rule) => (
            <div key={rule.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-base font-medium text-gray-900">
                      {rule.name}
                    </h3>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        rule.type === 'discount'
                          ? 'text-green-700 bg-green-100'
                          : 'text-yellow-700 bg-yellow-100'
                      }`}
                    >
                      {rule.type === 'discount'
                        ? `${rule.value}% off`
                        : `${rule.value}% extra`}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{rule.condition}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary-600"
                      checked={rule.active}
                      onChange={() => {}}
                    />
                    <span className="ml-2 text-sm text-gray-600">Active</span>
                  </label>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-500">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 