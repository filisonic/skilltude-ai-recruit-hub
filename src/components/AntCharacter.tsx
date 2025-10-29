import React from 'react';

interface AntCharacterProps {
  size?: 'small' | 'medium' | 'large';
  pose?: 'default' | 'pointing' | 'presenting' | 'thinking' | 'celebrating' | 'flying';
  className?: string;
  animate?: boolean;
}

const AntCharacter: React.FC<AntCharacterProps> = ({ 
  size = 'medium', 
  pose = 'default', 
  className = '',
  animate = true 
}) => {
  const sizeClasses = {
    small: 'w-12 h-16',
    medium: 'w-16 h-20',
    large: 'w-24 h-32'
  };

  const getArmPosition = () => {
    switch (pose) {
      case 'pointing':
        return {
          left: 'absolute top-6 -left-1 w-2 h-4 bg-amber-700 rounded-full transform -rotate-12',
          right: 'absolute top-4 -right-1 w-3 h-1.5 bg-amber-700 rounded-full transform rotate-45'
        };
      case 'presenting':
        return {
          left: 'absolute top-6 -left-1 w-2 h-4 bg-amber-700 rounded-full transform -rotate-45',
          right: 'absolute top-6 -right-1 w-2 h-4 bg-amber-700 rounded-full transform rotate-45'
        };
      case 'celebrating':
        return {
          left: 'absolute top-4 -left-1 w-2 h-4 bg-amber-700 rounded-full transform -rotate-12',
          right: 'absolute top-4 -right-1 w-2 h-4 bg-amber-700 rounded-full transform rotate-12'
        };
      case 'flying':
        return {
          left: 'absolute top-5 -left-1 w-2 h-4 bg-amber-700 rounded-full transform rotate-12',
          right: 'absolute top-5 -right-1 w-2 h-4 bg-amber-700 rounded-full transform -rotate-12'
        };
      case 'thinking':
        return {
          left: 'absolute top-6 -left-1 w-2 h-4 bg-amber-700 rounded-full transform rotate-45',
          right: 'absolute top-5 -right-1 w-2 h-3 bg-amber-700 rounded-full transform -rotate-12'
        };
      default:
        return {
          left: 'absolute top-6 -left-1 w-2 h-4 bg-amber-700 rounded-full',
          right: 'absolute top-6 -right-1 w-2 h-4 bg-amber-700 rounded-full'
        };
    }
  };

  const arms = getArmPosition();

  return (
    <div className={`${sizeClasses[size]} ${className} ${animate ? 'animate-bounce' : ''} relative`}>
      {/* Golden Cape */}
      <div className="absolute top-1 -left-1 w-6 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-bl-2xl transform -rotate-12 opacity-90"></div>
      
      {/* Teal Superhero Ant Body */}
      <div className="relative w-full h-full flex flex-col items-center z-10">
        
        {/* Head - Teal like reference */}
        <div className="w-8 h-8 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full relative border-2 border-teal-700">
          
          {/* Large Eyes - like reference */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-7 h-5 bg-teal-600 rounded-full">
            {/* Big cute eyes */}
            <div className="absolute top-0.5 left-1 w-2.5 h-2.5 bg-white rounded-full">
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-black rounded-full">
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="absolute top-0.5 right-1 w-2.5 h-2.5 bg-white rounded-full">
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-black rounded-full">
                <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Cute mouth area - peach like reference */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2.5 bg-orange-200 rounded-full">
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
          
          {/* Teal Antennae */}
          <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="w-0.5 h-3 bg-teal-700 rounded-full transform -rotate-12">
              <div className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-teal-500 rounded-full"></div>
            </div>
            <div className="w-0.5 h-3 bg-teal-700 rounded-full transform rotate-12">
              <div className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-teal-500 rounded-full"></div>
            </div>
          </div>

          {/* Thinking bubble */}
          {pose === 'thinking' && (
            <div className="absolute -top-6 -right-8 bg-white rounded-lg p-1.5 shadow-lg border border-gray-200">
              <div className="text-sm">💡</div>
            </div>
          )}
        </div>
        
        {/* Teal Superhero Body */}
        <div className="w-6 h-8 bg-gradient-to-b from-teal-500 to-teal-600 rounded-xl relative border border-teal-700">
          {/* "S" Logo - Diamond shaped like reference */}
          <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-lg rotate-45 flex items-center justify-center border border-yellow-600">
            <span className="text-teal-800 font-bold text-xs transform -rotate-45">S</span>
          </div>
          
          {/* Yellow Belt */}
          <div className="absolute bottom-0.5 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
          
          {/* Teal Arms */}
          <div className={`${arms.left} bg-gradient-to-b from-teal-500 to-teal-600 rounded-full`}>
            <div className="absolute -bottom-0.5 -left-0.5 w-2 h-1.5 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
          </div>
          <div className={`${arms.right} bg-gradient-to-b from-teal-500 to-teal-600 rounded-full`}>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-1.5 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Teal Lower Body */}
        <div className="w-5 h-4 bg-gradient-to-b from-teal-500 to-teal-600 rounded-xl border border-teal-700"></div>
        
        {/* Teal Legs with Golden Boots */}
        <div className="absolute bottom-0 -left-1 flex flex-col">
          <div className="w-1.5 h-3 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
          <div className="w-2 h-1 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 -right-1 flex flex-col">
          <div className="w-1.5 h-3 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
          <div className="w-2 h-1 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AntCharacter;