
interface SelectionCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  detail: string;
  isLocked?: boolean;
  onClick: () => void;
}

export function SelectionCard({
  title,
  description,
  icon,
  difficulty,
  detail,
  isLocked = false,
  onClick,
}: SelectionCardProps) {
  return (
    <div
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isLocked
          ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
          : "border-purple-200 bg-white hover:border-purple-300 hover:shadow-md"
      }`}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="text-center">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex justify-between items-center text-xs">
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
            {difficulty}
          </span>
          <span className="text-gray-500">{detail}</span>
        </div>
      </div>
    </div>
  );
}
