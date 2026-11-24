import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  Metric,
  ObservationPoint,
} from '../types/series'

type HistoryChartProps = {
  observations: ObservationPoint[]
  metric: Metric
}

// Formata a data e o horário da observação em UTC.
function formatDate(timestamp: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(new Date(timestamp))
}

function HistoryChart({
  observations,
  metric,
}: HistoryChartProps) {

  // Adapta os pontos da API ao formato esperado pelo Recharts.
  const chartData = observations.map((observation) => ({
    time: formatDate(observation.observed_at),
    value: observation.value,
  }))

  // Verifica se existem medições numéricas disponíveis.
  const hasReadings = chartData.some(
    (point) => Number.isFinite(point.value)
  )

  if (!hasReadings) {
    return <p>Não há medições para o período selecionado.</p>
  }

  const commonMargin = {
    top: 15,
    right: 20,
    left: 0,
    bottom: 10,
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        {metric === 'level' ? (
          <LineChart data={chartData} margin={commonMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              minTickGap={30}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              width={55}
              tick={{ fontSize: 12 }}
              unit=" m"
              domain={[0, 'auto']}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              name="Nível (m)"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={commonMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              minTickGap={30}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              width={65}
              tick={{ fontSize: 12 }}
              unit=" mm/h"
              domain={[0, 'auto']}
            />
            <Tooltip />
            <Bar
              dataKey="value"
              name="Chuva (mm/h)"
              fill="#0891b2"
              isAnimationActive={false}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default HistoryChart