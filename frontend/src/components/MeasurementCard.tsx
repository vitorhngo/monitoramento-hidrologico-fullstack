import type { LatestReading } from '../types/summary'

type MeasurementCardProps = {
  title: string
  measurement: LatestReading | null
}

// Formata o horário da última leitura utilizando UTC.
function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) {
    return 'Horário indisponível'
  }

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return 'Horário inválido'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date) + ' UTC'
}

function MeasurementCard({
  title,
  measurement,
}: MeasurementCardProps) {

  // Verifica se existe uma leitura disponível.
  const hasValue = measurement !== null

  // Formata o valor numérico para apresentação.
  const formattedValue = hasValue
    ? measurement.value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : 'Indisponível'

  return (
    <article className="measurement-card">
      <h3>{title}</h3>

      <p className="measurement-value">
        {formattedValue}
        {hasValue && <span> {measurement.unit}</span>}
      </p>

      <p className="measurement-time">
        {formatTimestamp(measurement?.observed_at ?? null)}
      </p>
    </article>
  )
}

export default MeasurementCard