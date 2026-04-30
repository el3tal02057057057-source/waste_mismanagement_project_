import { useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Zone } from '@/types'
import { statusLabels } from '@/data/mockData'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom styled map tile (cleaner look)
const CartoDBtiles = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

interface ZoneCircleProps {
  zone: Zone
  onSelect: () => void
}

function ZoneCircle({ zone, onSelect }: ZoneCircleProps) {
  const color = zone.status === 'clean' ? '#22C55E' : zone.status === 'dirty' ? '#EF4444' : '#EAB308'
  const opacity = 0.4

  return (
    <Circle
      center={[zone.lat, zone.lng]}
      radius={150}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: opacity,
        weight: 2
      }}
      eventHandlers={{
        click: onSelect
      }}
    >
      <Popup>
        <div className="text-center min-w-[150px]" dir="rtl">
          <h3 className="font-bold text-lg mb-1">منطقة {zone.id.split('-')[1]}</h3>
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: color + '20',
              color: color,
              border: `1px solid ${color}`
            }}
          >
            {statusLabels[zone.status]}
          </span>
          <div className="mt-2 text-sm text-gray-600">
            <p>عدد عمليات التنظيف: {zone.cleaningCount}</p>
            {zone.lastReport && (
              <p className="text-xs text-gray-500 mt-1">
                آخر بلاغ: {zone.lastReport.userName}
              </p>
            )}
          </div>
        </div>
      </Popup>
    </Circle>
  )
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

interface GridMapProps {
  zones: Zone[]
  onZoneSelect?: (zone: Zone) => void
  className?: string
}

export function GridMap({ zones, onZoneSelect, className = '' }: GridMapProps) {
  // Default center (Riyadh)
  const defaultCenter: [number, number] = [24.7146, 46.6753]

  const handleZoneClick = (zone: Zone) => {
    onZoneSelect?.(zone)
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={14}
        className="w-full h-full rounded-xl"
        style={{ minHeight: '300px' }}
      >
        <TileLayer
          url={CartoDBtiles}
          attribution={attribution}
        />

        {zones.map(zone => (
          <ZoneCircle
            key={zone.id}
            zone={zone}
            onSelect={() => handleZoneClick(zone)}
          />
        ))}

        <MapController center={defaultCenter} />
      </MapContainer>
    </div>
  )
}

export default GridMap