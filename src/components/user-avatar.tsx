import { useState } from 'react';

interface UserAvatarProps {
  name: string;
  picture?: string;
  size?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function UserAvatar({ name, picture, size = 'w-9' }: UserAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = picture && !imgFailed;

  return (
    <div className={`avatar ${showImage ? '' : 'placeholder'}`}>
      <div
        className={`${size} rounded-full ${showImage ? '' : 'bg-neutral text-neutral-content flex items-center justify-center'}`}
      >
        {showImage ? (
          <img
            src={picture}
            alt={name}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-xs">{getInitials(name)}</span>
        )}
      </div>
    </div>
  );
}
