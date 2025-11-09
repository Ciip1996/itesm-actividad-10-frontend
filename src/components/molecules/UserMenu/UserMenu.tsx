import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@atoms/Avatar";
import { Button } from "@atoms/Button";
import { useAuth } from "@/hooks";
import { ROUTES } from "@config/index";
import { useLanguage } from "@/i18n";
import "./UserMenu.scss";

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate(ROUTES.HOME);
      setIsOpen(false);
    } catch (error) {
      // Error handling silently
    }
  };

  if (!user) return null;

  const fullName = `${user.nombre} ${user.apellido}`;

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <Avatar name={fullName} size="md" />
        <div className="user-menu__info">
          <span className="user-menu__name">{fullName}</span>
          <span className="user-menu__role">{user.rol}</span>
        </div>
        <svg
          className={`user-menu__arrow ${
            isOpen ? "user-menu__arrow--open" : ""
          }`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown">
          <div className="user-menu__header">
            <Avatar name={fullName} size="lg" />
            <div className="user-menu__header-info">
              <p className="user-menu__header-name">{fullName}</p>
              <p className="user-menu__header-phone">{user.telefono}</p>
              <p className="user-menu__header-role">
                {t.userMenu.role}: {user.rol}
              </p>
            </div>
          </div>

          <div className="user-menu__divider" />

          <div className="user-menu__actions">
            <Button variant="error" size="sm" fullWidth onClick={handleSignOut}>
              {t.userMenu.logout}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
