import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
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
  useMapEvents({ click() { onSelectBase(true) } })
  return null
}

function FlyToController({ target }) {
  const map = useMap()
  useEffect(() => {
    if (!target) return
    map.flyTo([target.lat, target.lng], target.zoom ?? 12, { duration: 1.6 })
  }, [target, map])
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
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [flyTarget, setFlyTarget] = useState(null)
  const inputRef = useRef(null)

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
    return () => { cancelled = true }
  }, [])

  const center = useMemo(() => {
    if (!bases?.length) return [22, 15]
    const lat = bases.reduce((a, b) => a + b.lat, 0) / bases.length
    const lng = bases.reduce((a, b) => a + b.lng, 0) / bases.length
    return [lat, lng]
  }, [bases])

  const handleSearch = async (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setSearching(true)
    setSearchError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'tr,en' } }
      )
      const data = await res.json()
      if (!data.length) { setSearchError('Konum bulunamadı.'); return }
      setFlyTarget({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), zoom: 12 })
      setQuery('')
    } catch {
      setSearchError('Arama başarısız.')
    } finally {
      setSearching(false)
    }
  }

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
          <MapContainer
            center={center}
            zoom={2}
            minZoom={1}
            maxZoom={19}
            scrollWheelZoom
            className="hero-map-frame !absolute inset-0 z-0 h-full w-full [&_.leaflet-control-attribution]:rounded [&_.leaflet-control-attribution]:text-[9px] [&_.leaflet-control-attribution]:opacity-50"
            style={{ background: '#060608' }}
          >
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              minZoom={1}
              maxZoom={19}
            />
            <MapClickHandler onSelectBase={onSelectBase} />
            <FlyToController target={flyTarget} />
            {showMarkers && bases.map((b) => {
              const isSelected = selectedBase?.id === b.id
              return (
                <Marker
                  key={b.id}
                  position={[b.lat, b.lng]}
                  icon={createIcon(isSelected)}
                  eventHandlers={{
                    click: (e) => {
                      e.originalEvent?.stopPropagation()
                      onSelectBase?.(isSelected ? null : b)
                    },
                  }}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]} opacity={1} className="space-base-tooltip">
                    {b.name}
                  </Tooltip>
                  <Popup>
                    <div className="min-w-[180px] font-body text-sm text-gray-900">
                      <strong className="font-headline">{b.name}</strong>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        )}

        {/* ── Overlay katmanları ── */}
        {mapReady && (
          <>
            <div className="hero-map-aurora pointer-events-none absolute inset-0 z-[4]" aria-hidden />
            <div className="hero-map-tech-grid pointer-events-none absolute inset-0 z-[5] opacity-85" aria-hidden />
            <div className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-br from-[#0e0e10]/55 via-transparent to-primary/10" aria-hidden />
            <div className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-r from-[#0a0a0f]/9 via-transparent to-[#0e0e10]/45" aria-hidden />
            <div className="map-container-fade pointer-events-none absolute inset-0 z-[7] opacity-90" aria-hidden />
            <div className="hero-map-vignette pointer-events-none z-[8]" aria-hidden />
            <div className="hero-map-scanlines pointer-events-none z-[9]" aria-hidden />
            <div className="hero-map-edge-shimmer pointer-events-none absolute left-6 right-6 top-0 z-[11] md:left-10 md:right-10" aria-hidden />
          </>
        )}

        {/* ── Arama çubuğu — overlay'ların üstünde z-[20] ── */}
        {mapReady && (
          <form
            onSubmit={handleSearch}
            className="absolute left-1/2 top-4 z-[20] -translate-x-1/2 flex w-[min(88vw,400px)] items-center gap-2"
          >
            <div className="relative flex-1">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-white/40">
                search
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearchError('') }}
                placeholder="Ülke veya şehir ara…"
                className="w-full rounded-full border border-white/15 bg-black/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 backdrop-blur-md outline-none transition-colors focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20"
              />
              {searchError && (
                <p className="absolute -bottom-5 left-3 text-[11px] text-red-400">{searchError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={searching}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-cyan-400/30 bg-black/60 px-4 py-2.5 text-sm font-semibold text-cyan-300 backdrop-blur-md transition-colors hover:border-cyan-400/60 hover:text-cyan-200 disabled:opacity-50"
            >
              {searching
                ? <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                : <span className="material-symbols-outlined text-base">arrow_forward</span>}
            </button>
          </form>
        )}

        {/* ── Seçili üs bildirimi ── */}
        {mapReady && selectedBase && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-[20] -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-black/70 px-5 py-2.5 text-sm font-medium text-cyan-300 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              {selectedBase?.name ? `${selectedBase.name} seçildi — ` : ''}aşağı kaydırın
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
