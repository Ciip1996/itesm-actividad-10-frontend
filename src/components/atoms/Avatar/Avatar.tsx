import React from "react";
import "./Avatar.scss";

export interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  imageUrl?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = "md",
  imageUrl,
  className = "",
}) => {
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`avatar avatar--${size} ${className}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="avatar__image" />
      ) : (
        <div className="avatar__initials">{getInitials(name)}</div>
      )}
    </div>
  );
};
