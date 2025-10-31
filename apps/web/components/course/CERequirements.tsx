"use client";
interface CERequirementsProps {
  course: any;
  onUpdate: (updates: any) => void;
}

export function CERequirements({ course, onUpdate }: CERequirementsProps) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Texas LPC CE Requirements</h3>
      
      <div className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium">CE Hours</span>
          <input 
            type="number" 
            step="0.5" 
            min="0.5" 
            max="40"
            className="input mt-1"
            value={course.ce_hours || ''}
            onChange={(e) => onUpdate({ ce_hours: e.target.value })}
          />
          <span className="text-xs text-gray-500">
            Min 0.5 hours, increments of 0.5
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Provider Number</span>
          <input 
            type="text"
            className="input mt-1"
            placeholder="Texas BHEC Provider #"
            value={course.provider_number || ''}
            onChange={(e) => onUpdate({ provider_number: e.target.value })}
          />
        </label>

        <label className="flex items-center gap-2">
          <input 
            type="checkbox"
            checked={course.requires_quiz || false}
            onChange={(e) => onUpdate({ 
              requires_quiz: e.target.checked,
              passing_score: e.target.checked ? 70 : null 
            })}
          />
          <span className="text-sm">
            Requires quiz completion (70% passing score)
          </span>
        </label>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            ✓ TSBEP Approved Provider<br/>
            ✓ BHEC Compliant<br/>
            ✓ Automatic certificate generation<br/>
            ✓ 4-year record retention
          </p>
        </div>
      </div>
    </div>
  );
}
