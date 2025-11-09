import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@atoms/Button";
import { Card } from "@atoms/Card";
import { useAuth } from "@hooks/useAuth";
import "./Home.scss";

export const Home: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="home">
      <div className="container">
        <section className="home__hero">
          <h1 className="home__title">Sistema de Reservaciones</h1>
          <p className="home__subtitle">
            Reserva tu mesa de manera fácil y rápida en nuestro restaurante
          </p>
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
                  Nueva Reservación
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="primary" size="lg">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="home__features">
          <h2 className="home__section-title">
            ¿Por qué reservar con nosotros?
          </h2>
          <div className="home__features-grid">
            <Card className="home__feature" padding="lg" shadow="md">
              <div className="home__feature-icon">🕐</div>
              <h3 className="home__feature-title">Reserva Instantánea</h3>
              <p className="home__feature-description">
                Confirma tu reservación en segundos y recibe notificaciones
                inmediatas
              </p>
            </Card>

            <Card className="home__feature" padding="lg" shadow="md">
              <div className="home__feature-icon">📱</div>
              <h3 className="home__feature-title">Gestión Fácil</h3>
              <p className="home__feature-description">
                Administra tus reservaciones desde cualquier dispositivo
              </p>
            </Card>

            <Card className="home__feature" padding="lg" shadow="md">
              <div className="home__feature-icon">🎯</div>
              <h3 className="home__feature-title">Sin Complicaciones</h3>
              <p className="home__feature-description">
                Proceso simple y rápido, sin necesidad de llamadas telefónicas
              </p>
            </Card>
          </div>
        </section>

        <section className="home__cta">
          <Card className="home__cta-card" padding="lg" shadow="lg">
            <h2 className="home__cta-title">¿Listo para reservar?</h2>
            <p className="home__cta-description">
              Únete a miles de clientes satisfechos que disfrutan de una
              experiencia sin complicaciones
            </p>
            {loading ? (
              <div className="home__button-skeleton home__button-skeleton--full"></div>
            ) : (
              <Link to={isAuthenticated ? "/reservations/new" : "/register"}>
                <Button variant="secondary" size="lg" fullWidth>
                  {isAuthenticated ? "Hacer una Reservación" : "Comenzar Ahora"}
                </Button>
              </Link>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
};
