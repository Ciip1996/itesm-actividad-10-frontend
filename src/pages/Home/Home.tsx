import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@atoms/Button";
import { Card } from "@atoms/Card";
import { useAuth } from "@hooks/useAuth";
import { useLanguage } from "@/i18n";
import "./Home.scss";

export const Home: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="home">
      <div className="container">
        <section className="home__hero">
          <h1 className="home__title">{t.home.title}</h1>
          <p className="home__subtitle">{t.home.subtitle}</p>
          <div className="home__actions">
            {loading ? (
              // Skeleton de botones mientras carga la sesión
              <div className="home__actions-skeleton">
                <div className="home__button-skeleton"></div>
                <div className="home__button-skeleton"></div>
              </div>
            ) : isAuthenticated ? (
              <Link to="/reservations/new">
                <Button variant="primary" size="lg">
                  {t.home.newReservation}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="primary" size="lg">
                    {t.home.login}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    {t.home.register}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="home__features">
          <h2 className="home__section-title">{t.home.whyReserve}</h2>
          <div className="home__features-grid">
            <Card className="home__feature" padding="lg" shadow="md">
              <div className="home__feature-icon">🕐</div>
              <h3 className="home__feature-title">{t.home.feature1Title}</h3>
              <p className="home__feature-description">
                {t.home.feature1Description}
              </p>
            </Card>

            <Card className="home__feature" padding="lg" shadow="md">
              <div className="home__feature-icon">📱</div>
              <h3 className="home__feature-title">{t.home.feature2Title}</h3>
              <p className="home__feature-description">
                {t.home.feature2Description}
              </p>
            </Card>

            <Card className="home__feature" padding="lg" shadow="md">
              <div className="home__feature-icon">🎯</div>
              <h3 className="home__feature-title">{t.home.feature3Title}</h3>
              <p className="home__feature-description">
                {t.home.feature3Description}
              </p>
            </Card>
          </div>
        </section>

        <section className="home__cta">
          <Card className="home__cta-card" padding="lg" shadow="lg">
            <h2 className="home__cta-title">{t.home.ctaTitle}</h2>
            <p className="home__cta-description">{t.home.ctaDescription}</p>
            {loading ? (
              <div className="home__button-skeleton home__button-skeleton--full"></div>
            ) : (
              <Link to={isAuthenticated ? "/reservations/new" : "/register"}>
                <Button variant="secondary" size="lg" fullWidth>
                  {isAuthenticated ? t.home.makeReservation : t.home.startNow}
                </Button>
              </Link>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
};
