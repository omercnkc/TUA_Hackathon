/**
 * Mock prediction from manual parameters.
 */
export function predict(req, res) {
  const { temperature, population, logisticsScore, extra } = req.body ?? {}

  const t = Number(temperature)
  const pop = Number(population)
  const logistics = Number(logisticsScore)

  const baseConf =
    85 +
    (Number.isFinite(logistics) ? Math.min(logistics * 1.2, 12) : 6) +
    (Number.isFinite(t) && t > 15 && t < 35 ? 4 : 0) -
    (Number.isFinite(pop) && pop > 1_000_000 ? 2 : 0)

  const confidence = Math.min(99.9, Math.max(70, baseConf + Math.random() * 3))
  const riskSigma = Math.max(0.01, (100 - confidence) / 400 + Math.random() * 0.02)

  const status = confidence >= 90 ? 'SUCCESS' : confidence >= 80 ? 'CAUTION' : 'RISK'

  res.json({
    confidence: Number(confidence.toFixed(1)),
    riskFactor: Number(riskSigma.toFixed(2)),
    status,
    atmosphericStability: Math.min(100, Math.round(70 + (Number.isFinite(logistics) ? logistics * 2 : 10))),
    geopoliticalFit: Math.min(100, Math.round(75 + (Number.isFinite(t) ? (30 - Math.abs(22 - t)) : 8))),
    summary:
      typeof extra === 'string' && extra.trim()
        ? `Girdi “${extra.trim()}” dahil edildi. Tahmini başarı olasılığı yüksek.`
        : 'Model çıktısı güncel parametrelere göre üretildi.',
    engineVersion: 'Derin Öğrenme Motoru v4.2',
  })
}
