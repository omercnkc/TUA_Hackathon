import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { fetchSpaceBases } from '../services/api'
import { LoadingSpinner } from './LoadingSpinner'

import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapClickHandler({ onSelectBase }) {
  useMapEvents({
    click() {
      onSelectBase(true)
    },
  })
  return null
}

function createIcon(selected) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${selected ? 18 : 13}px;
      height: ${selected ? 18 : 13}px;
      background: ${selected ? '#00cffc' : '#bb9eff'};
      border-radius: 50%;
      border: 2px solid ${selected ? '#fff' : 'rgba(255,255,255,0.4)'};
      box-shadow: 0 0 ${selected ? '14px 4px' : '6px 1px'} ${selected ? '#00cffc' : '#bb9eff'};
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [selected ? 18 : 13, selected ? 18 : 13],
    iconAnchor: [selected ? 9 : 6, selected ? 9 : 6],
  })
}

export function WorldMap({ onSelectBase, selectedBase }) {
  const [bases, setBases] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchSpaceBases()
        if (!cancelled) setBases(data)
      } catch {
        if (!cancelled) setBases([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const center = useMemo(() => {
    if (!bases?.length) return [22, 15]
    const lat = bases.reduce((a, b) => a + b.lat, 0) / bases.length
    const lng = bases.reduce((a, b) => a + b.lng, 0) / bases.length
    return [lat, lng]
  }, [bases])

  const showMarkers = Array.isArray(bases) && bases.length > 0
  const mapReady = bases !== null

  return (
    <section
      id="harita"
      data-map-host
      className="hero-map-shell relative w-full overflow-hidden rounded-xl bg-[#050508] md:rounded-xl"
    >
      <div className="relative z-[1] h-[min(78vh,720px)] min-h-[420px] w-full md:h-[min(82vh,780px)] md:min-h-[560px]">
        {!mapReady ? (
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-surface-container">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <MapContainer
              center={center}
              zoom={2}
              minZoom={1}
              maxZoom={10}
              scrollWheelZoom
              className="hero-map-frame !absolute inset-0 z-0 h-full w-full [&_.leaflet-control-attribution]:rounded [&_.leaflet-control-attribution]:text-[9px] [&_.leaflet-control-attribution]:opacity-50"
              style={{ background: '#060608' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://stadia.com">Stadia Maps</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
                minZoom={1}
                maxZoom={10}
              />
              <MapClickHandler onSelectBase={onSelectBase} />
              {showMarkers &&
                bases.map((b) => {
                  const isSelected = selectedBase?.id === b.id
                  return (
                    <Marker
                      key={b.id}
                      position={[b.lat, b.lng]}
                      icon={createIcon(isSelected)}
                      eventHandlers={{
                        click: () => onSelectBase?.(isSelected ? null : b),
                      }}
                    >
                      <Tooltip
                        permanent
                        direction="top"
                        offset={[0, -10]}
                        opacity={1}
                        className="space-base-tooltip"
                      >
                        {b.name}
                      </Tooltip>
                      <Popup>
                        <div className="min-w-[180px] font-body text-sm text-gray-900">
                          <strong className="font-headline">{b.name}</strong>
                          <p className="mt-1 text-xs text-gray-600">{b.country}</p>
                          <p className="mt-2 text-xs leading-snug text-gray-600">{b.description}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
            </MapContainer>
          </>
        )}

        {mapReady && (
          <>
            <div className="hero-map-aurora pointer-events-none absolute inset-0 z-[4]" aria-hidden />
            <div
              className="hero-map-tech-grid pointer-events-none absolute inset-0 z-[5] opacity-85"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-br from-[#0e0e10]/55 via-transparent to-primary/10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-r from-[#0a0a0f]/9 via-transparent to-[#0e0e10]/45"
              aria-hidden
            />
            <div className="map-container-fade pointer-events-none absolute inset-0 z-[7] opacity-90" aria-hidden />
            <div className="hero-map-vignette z-[8]" aria-hidden />
            <div className="hero-map-scanlines z-[9]" aria-hidden />
            <div
              className="hero-map-edge-shimmer pointer-events-none absolute left-6 right-6 top-0 z-[11] md:left-10 md:right-10"
              aria-hidden
            />

            {selectedBase && (
              <div className="pointer-events-none absolute bottom-6 left-1/2 z-[12] -translate-x-1/2">
                <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#0a0a0f]/80 px-5 py-2.5 text-sm font-medium text-cyan-300 backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                  {selectedBase?.name ? `${selectedBase.name} seçildi — ` : ''}aşağı kaydırın
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
