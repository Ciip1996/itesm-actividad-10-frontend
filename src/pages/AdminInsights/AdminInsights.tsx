import React, { useState } from "react";
import { Card } from "@atoms/Card";
import { Button } from "@atoms/Button";
import { Input } from "@atoms/Input";
import { Spinner } from "@atoms/Spinner";
import { Alert } from "@atoms/Alert";
import { useAdmin } from "@hooks/useAdmin";
import { useLanguage } from "@/i18n";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "./AdminInsights.scss";

interface AIInsight {
  id?: number;
  tipo_insight: string;
  titulo: string;
  contenido: string;
  periodo_inicio: string;
  periodo_fin: string;
  metadatos?: {
    categoria?: string;
    impacto?: string;
    [key: string]: unknown;
  };
  confianza_score: number;
  created_at?: string;
}

export const AdminInsights: React.FC = () => {
  const { t } = useLanguage();
  const { generateReport, loading, error } = useAdmin();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [formData, setFormData] = useState({
    fecha_desde: "",
    fecha_hasta: ""
  });

  // Set default date range (last 30 days)
  React.useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setFormData({
      fecha_desde: thirtyDaysAgo.toISOString().split('T')[0],
      fecha_hasta: today.toISOString().split('T')[0]
    });
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateInsights = async () => {
    if (!formData.fecha_desde || !formData.fecha_hasta) {
      return;
    }

    try {
      const result = await generateReport({
        tipo_reporte: "insights_ia",
        fecha_desde: formData.fecha_desde,
        fecha_hasta: formData.fecha_hasta
      });

      if (result.data?.insights) {
        setInsights(result.data.insights);
        setHasGenerated(true);
      }
    } catch (err) {
      console.error('Error generating insights:', err);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceText = (score: number) => {
    if (score >= 0.8) return 'Alta';
    if (score >= 0.6) return 'Media';
    return 'Baja';
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria?.toLowerCase()) {
      case 'operacional': return '⚙️';
      case 'estratégico': return '🎯';
      case 'financiero': return '💰';
      case 'cliente': return '👥';
      case 'marketing': return '📈';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="admin-insights">
        <div className="container">
          <div className="admin-insights__loading">
            <Spinner size="lg" />
            <p>Generando insights de IA...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-insights">
      <div className="container">
        <div className="admin-insights__header">
          <h1 className="admin-insights__title">Insights de Inteligencia Artificial</h1>
          <p className="admin-insights__subtitle">
            Análisis automático de patrones y tendencias en las reservas
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Generation Form */}
        <Card className="admin-insights__generator" padding="lg">
          <h3 className="admin-insights__generator-title">Generar Nuevos Insights</h3>
          <p className="admin-insights__generator-description">
            Selecciona un rango de fechas para analizar los datos de reservas y generar insights con IA
          </p>
          
          <div className="admin-insights__form">
            <div className="admin-insights__form-group">
              <label className="admin-insights__form-label">Fecha Desde</label>
              <Input
                type="date"
                name="fecha_desde"
                value={formData.fecha_desde}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="admin-insights__form-group">
              <label className="admin-insights__form-label">Fecha Hasta</label>
              <Input
                type="date"
                name="fecha_hasta"
                value={formData.fecha_hasta}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <Button
              variant="primary"
              onClick={handleGenerateInsights}
              disabled={!formData.fecha_desde || !formData.fecha_hasta}
            >
              🤖 Generar Insights
            </Button>
          </div>
        </Card>

        {/* Results */}
        {hasGenerated && (
          <div className="admin-insights__results">
            <div className="admin-insights__results-header">
              <h2 className="admin-insights__results-title">
                Insights Generados para el período
              </h2>
              <div className="admin-insights__results-dates">
                {format(new Date(formData.fecha_desde), 'dd/MM/yyyy', { locale: es })} - {format(new Date(formData.fecha_hasta), 'dd/MM/yyyy', { locale: es })}
              </div>
            </div>

            {insights.length > 0 ? (
              <div className="admin-insights__grid">
                {insights.map((insight, index) => (
                  <Card key={index} className="admin-insights__insight-card" padding="lg">
                    <div className="admin-insights__insight-header">
                      <div className="admin-insights__insight-title-section">
                        <span className="admin-insights__insight-icon">
                          {getCategoryIcon(insight.metadatos?.categoria || '')}
                        </span>
                        <h3 className="admin-insights__insight-title">{insight.titulo}</h3>
                      </div>
                      <div className="admin-insights__insight-confidence">
                        <span className={`admin-insights__confidence-score admin-insights__confidence-score--${getConfidenceColor(insight.confianza_score)}`}>
                          {getConfidenceText(insight.confianza_score)} ({Math.round(insight.confianza_score * 100)}%)
                        </span>
                      </div>
                    </div>
                    
                    <div className="admin-insights__insight-content">
                      <p className="admin-insights__insight-text">{insight.contenido}</p>
                    </div>
                    
                    <div className="admin-insights__insight-footer">
                      <div className="admin-insights__insight-meta">
                        <span className="admin-insights__insight-type">
                          {insight.tipo_insight}
                        </span>
                        {insight.metadatos?.categoria && (
                          <span className="admin-insights__insight-category">
                            {insight.metadatos.categoria}
                          </span>
                        )}
                        {insight.metadatos?.impacto && (
                          <span className="admin-insights__insight-impact">
                            Impacto: {insight.metadatos.impacto}
                          </span>
                        )}
                      </div>
                      {insight.created_at && (
                        <div className="admin-insights__insight-date">
                          {format(new Date(insight.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="admin-insights__no-insights" padding="lg">
                <div className="admin-insights__no-insights-content">
                  <span className="admin-insights__no-insights-icon">🤖</span>
                  <h3 className="admin-insights__no-insights-title">No se generaron insights</h3>
                  <p className="admin-insights__no-insights-text">
                    No se pudieron generar insights para el período seleccionado. 
                    Intenta con un rango de fechas más amplio o verifica que existan datos de reservas.
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Previous Insights Section */}
        <Card className="admin-insights__previous" padding="lg">
          <h3 className="admin-insights__previous-title">Consejos para obtener mejores insights</h3>
          <ul className="admin-insights__tips">
            <li>Usa rangos de fechas de al menos 2 semanas para obtener patrones significativos</li>
            <li>Incluye fines de semana para capturar diferencias en el comportamiento de reservas</li>
            <li>Los insights de mayor confianza ({'>'}80%) son más confiables para tomar decisiones</li>
            <li>Compara insights de diferentes períodos para identificar tendencias a largo plazo</li>
            <li>Considera eventos especiales (feriados, promociones) al interpretar los datos</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};