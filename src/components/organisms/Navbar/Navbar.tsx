import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@atoms/Button";
import { LanguageSwitch } from "@atoms/LanguageSwitch";
import { UserMenu } from "@molecules/UserMenu";
import { useAuth } from "@/hooks";
import { useLanguage } from "@/i18n";
import { ROUTES } from "@config/index";
import "./Navbar.scss";

export const Navbar: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar__wrapper">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="navbar__logo"
            onClick={closeMobileMenu}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="white" />
              <path
                d="M16 8L8 14V24H13V19H19V24H24V14L16 8Z"
                fill="currentColor"
              />
            </svg>
            <span className="navbar__brand">{t.navbar.brand}</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="navbar__nav navbar__nav--desktop">
              <Link
                to={ROUTES.HOME}
                className={`navbar__link ${
                  isActive(ROUTES.HOME) ? "navbar__link--active" : ""
                }`}
              >
                {t.navbar.home}
              </Link>
              <Link
                to={ROUTES.RESERVATIONS}
                className={`navbar__link ${
                  isActive(ROUTES.RESERVATIONS) ? "navbar__link--active" : ""
                }`}
              >
                {t.navbar.myReservations}
              </Link>
              <Link
                to={ROUTES.NEW_RESERVATION}
                className={`navbar__link ${
                  isActive(ROUTES.NEW_RESERVATION) ? "navbar__link--active" : ""
                }`}
              >
                {t.navbar.newReservation}
              </Link>
            </div>
          )}

          {/* Desktop Actions */}
          <div className="navbar__actions navbar__actions--desktop">
            <LanguageSwitch />
            {loading ? (
              <div className="navbar__skeleton">
                <div className="navbar__skeleton-avatar"></div>
                <div className="navbar__skeleton-info">
                  <div className="navbar__skeleton-line navbar__skeleton-line--name"></div>
                  <div className="navbar__skeleton-line navbar__skeleton-line--role"></div>
                </div>
              </div>
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    {t.navbar.login}
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">
                    {t.navbar.register}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`navbar__hamburger ${
              isMobileMenuOpen ? "navbar__hamburger--open" : ""
            }`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="navbar__mobile-menu">
            {loading ? (
              <div className="navbar__skeleton navbar__skeleton--mobile">
                <div className="navbar__skeleton-avatar"></div>
                <div className="navbar__skeleton-info">
                  <div className="navbar__skeleton-line navbar__skeleton-line--name"></div>
                  <div className="navbar__skeleton-line navbar__skeleton-line--role"></div>
                </div>
              </div>
            ) : isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.HOME}
                  className={`navbar__mobile-link ${
                    isActive(ROUTES.HOME) ? "navbar__mobile-link--active" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  {t.navbar.home}
                </Link>
                <Link
                  to={ROUTES.RESERVATIONS}
                  className={`navbar__mobile-link ${
                    isActive(ROUTES.RESERVATIONS)
                      ? "navbar__mobile-link--active"
                      : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  {t.navbar.myReservations}
                </Link>
                <Link
                  to={ROUTES.NEW_RESERVATION}
                  className={`navbar__mobile-link ${
                    isActive(ROUTES.NEW_RESERVATION)
                      ? "navbar__mobile-link--active"
                      : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  {t.navbar.newReservation}
                </Link>
                <div className="navbar__mobile-divider" />
                <UserMenu />
              </>
            ) : (
              <div className="navbar__mobile-actions">
                <Link to={ROUTES.LOGIN} onClick={closeMobileMenu}>
                  <Button variant="ghost" size="md" fullWidth>
                    {t.navbar.login}
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER} onClick={closeMobileMenu}>
                  <Button variant="primary" size="md" fullWidth>
                    {t.navbar.register}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
