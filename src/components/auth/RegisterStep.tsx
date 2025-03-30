import { Check } from 'lucide-react';

type RegisterStepProps = {
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  children: React.ReactNode;
};

const RegisterStep = ({
  title,
  description,
  isActive,
  isCompleted,
  children,
}: RegisterStepProps) => (
  <div className="relative">
    <div className="flex items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted
            ? 'bg-success text-white'
            : isActive
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {isCompleted ? (
          <Check className="w-4 h-4" />
        ) : (
          <span className="text-sm font-medium">
            {isActive ? '1' : '2'}
          </span>
        )}
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

export default RegisterStep; 