import React from 'react';

interface SuperAntCharacterProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  animate?: boolean;
  pose?: 'default' | 'power' | 'working' | 'flying' | 'greeting';
}

const SuperAntCharacter: React.FC<SuperAntCharacterProps> = ({ 
  size = 'medium', 
  className = '',
  animate = true,
  pose = 'default'
}) => {
  // Get the appropriate media file based on pose
  const getMediaSrc = () => {
    switch (pose) {
      case 'working':
      case 'power':
      case 'default':
        return { type: 'video', src: '/images/flying_6mb.mp4' }; // Optimized 6MB Flying MP4 for Hero
      case 'flying':
        return { type: 'video', src: '/images/multitasking_scaledup.mp4' }; // Multitasking MP4 for Services
      case 'greeting':
        return { type: 'video', src: '/images/hello_4mb.mp4' }; // Optimized 4MB Hello MP4 for Why Choose Us
      default:
        return { type: 'image', src: '/images/fly1video1.gif' };
    }
  };

  const getAnimationClass = () => {
    if (!animate) return '';
    
    switch (pose) {
      case 'flying':
        return ''; // Video has its own animation
      case 'greeting':
        return 'animate-bounce'; // Friendly bouncing
      default:
        return 'animate-bounce';
    }
  };

  const media = getMediaSrc();

  return (
    <div className={`${className} ${getAnimationClass()} relative w-full h-full`}>
      {media.type === 'video' ? (
        <video 
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
          style={{ imageRendering: 'crisp-edges' }}
        >
          <source src={media.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img 
          src={media.src}
          alt="Skilly - SkillTude AI Assistant" 
          className="w-full h-full object-contain"
          style={{ 
            imageRendering: 'crisp-edges',
            backgroundColor: 'transparent'
          }}
        />
      )}
    </div>
  );
};

export default SuperAntCharacter;