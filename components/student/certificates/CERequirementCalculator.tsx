'use client'

import { useState } from 'react'
import { Calculator, Award, TrendingUp } from 'lucide-react'

interface CERequirementCalculatorProps {
  currentHours: number
}

export default function CERequirementCalculator({ currentHours }: CERequirementCalculatorProps) {
  const [licenseType, setLicenseType] = useState<'LPC' | 'LPC-S'>('LPC')
  const [renewalCycle, setRenewalCycle] = useState<2 | 1>(2)

  // Texas LPC requirements
  const requirements = {
    'LPC': { twoYear: 30, oneYear: 15 },
    'LPC-S': { twoYear: 30, oneYear: 15 }
  }

  const requiredHours = renewalCycle === 2 
    ? requirements[licenseType].twoYear 
    : requirements[licenseType].oneYear

  const remainingHours = Math.max(0, requiredHours - currentHours)
  const progressPercentage = Math.min(100, (currentHours / requiredHours) * 100)

  return (
    <div className="rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Calculator className="h-6 w-6 text-accent" />
        <h3 className="text-xl font-semibold text-neutral-dark">
          CE Requirement Calculator
        </h3>
      </div>
      <p className="mb-6 text-sm text-neutral-medium">
        Track your progress toward Texas LPC license renewal
      </p>

      {/* License Type and Renewal Cycle Selection */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-dark">
            License Type
          </label>
          <select
            value={licenseType}
            onChange={(e) => setLicenseType(e.target.value as 'LPC' | 'LPC-S')}
            className="w-full rounded-lg border border-neutral-light bg-white px-4 py-2 text-neutral-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="LPC">LPC (Licensed Professional Counselor)</option>
            <option value="LPC-S">LPC-S (Supervisor)</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-dark">
            Renewal Cycle
          </label>
          <select
            value={renewalCycle}
            onChange={(e) => setRenewalCycle(Number(e.target.value) as 2 | 1)}
            className="w-full rounded-lg border border-neutral-light bg-white px-4 py-2 text-neutral-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value={2}>2-Year Cycle</option>
            <option value={1}>1-Year Cycle</option>
          </select>
        </div>
      </div>

      {/* Progress Visual */}
      <div className="mb-6 rounded-lg bg-white p-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-neutral-medium">Your Progress</p>
            <p className="text-3xl font-bold text-primary">
              {currentHours.toFixed(1)} / {requiredHours}
            </p>
            <p className="text-sm text-neutral-medium">CE Hours</p>
          </div>
          <div className="text-right">
            {remainingHours > 0 ? (
              <>
                <p className="text-2xl font-bold text-neutral-dark">
                  {remainingHours.toFixed(1)}
                </p>
                <p className="text-sm text-neutral-medium">Hours Remaining</p>
              </>
            ) : (
              <div className="flex flex-col items-end">
                <Award className="mb-1 h-8 w-8 text-secondary" />
                <p className="text-sm font-semibold text-secondary">Complete!</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
          {progressPercentage >= 10 && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {Math.round(progressPercentage)}%
            </div>
          )}
        </div>

        {/* Milestone Markers */}
        <div className="mt-4 flex justify-between text-xs text-neutral-medium">
          <span>0 hrs</span>
          <span>{(requiredHours / 2).toFixed(0)} hrs</span>
          <span>{requiredHours} hrs</span>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        {remainingHours > 0 ? (
          <>
            <div className="flex items-start gap-3 rounded-lg bg-white p-4">
              <TrendingUp className="h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-neutral-dark">
                  Suggested Action Plan
                </p>
                <p className="mt-1 text-sm text-neutral-medium">
                  {remainingHours <= 6
                    ? `You're almost there! Complete one more 6-hour course to meet your requirement.`
                    : remainingHours <= 12
                    ? `Consider enrolling in 2-3 courses to meet your ${requiredHours}-hour requirement.`
                    : `Plan to complete ${Math.ceil(remainingHours / 6)} courses over the next few months to meet your requirement.`}
                </p>
              </div>
            </div>

            {/* Texas-Specific Requirements Note */}
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
              <p className="text-xs text-neutral-dark">
                <strong>Texas LPC Reminder:</strong> At least 3 hours must be in ethics content. 
                {licenseType === 'LPC' && ' 3 hours in cultural diversity is also required.'}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-start gap-3 rounded-lg bg-secondary/10 p-4">
            <Award className="h-5 w-5 flex-shrink-0 text-secondary" />
            <div>
              <p className="text-sm font-medium text-secondary">
                Congratulations!
              </p>
              <p className="mt-1 text-sm text-neutral-medium">
                You've met your CE requirements for this renewal cycle. Keep learning to stay ahead!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
