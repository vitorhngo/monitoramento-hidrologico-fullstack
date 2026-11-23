import type { Measurement } from '../types/summary'

type MeasurementCardProps = {
  title: string
  measurement: Measurement
  unit: string
}

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
  unit,
}: MeasurementCardProps) {
  const hasValue = measurement.value !== null

  const formattedValue = hasValue
    ? measurement.value!.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : 'Indisponível'

  return (
    <article className="measurement-card">
      <h3>{title}</h3>

      <p className="measurement-value">
        {formattedValue}
        {hasValue && <span> {unit}</span>}
      </p>

      <p className="measurement-time">
        {formatTimestamp(measurement.timestamp)}
      </p>
    </article>
  )
}

export default MeasurementCard
