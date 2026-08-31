interface TechTagProps {
  name: string;
  isActive?: boolean;
  isSubdued?: boolean;
  onClick?: () => void;
}

export function TechTag({ name, isActive = false, isSubdued = false, onClick }: TechTagProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium tracking-wide rounded-full border transition-all duration-300 ${
        isActive
          ? 'bg-gray-900 text-white border-gray-900'
          : isSubdued
          ? 'bg-transparent text-gray-400 border-gray-300 opacity-50'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 hover:text-gray-900'
      }`}
    >
      {name}
    </button>
  );
}
