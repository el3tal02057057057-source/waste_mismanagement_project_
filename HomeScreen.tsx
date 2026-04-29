import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockZones } from '../../data/mockData';
import { Zone, ZoneStatus } from '../../types';

// Zone state management
interface ZoneState {
  status: ZoneStatus;
  lastAction?: 'report' | 'clean';
  lastActionTime?: number;
}

// Load saved states from localStorage
const loadZoneStates = (): Record<string, ZoneState> => {
  try {
    const saved = localStorage.getItem('zoneStates');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all statuses are valid ZoneStatus
      const result: Record<string, ZoneState> = {};
      Object.keys(parsed).forEach(key => {
        const state = parsed[key];
        if (state.status && ['clean', 'dirty', 'review'].includes(state.status)) {
          result[key] = state as ZoneState;
        }
      });
      return result;
    }
  } catch (e) {
    console.log('Could not load zone states');
  }
  return {};
};

// Save states to localStorage
const saveZoneStates = (states: Record<string, ZoneState>) => {
  try {
    localStorage.setItem('zoneStates', JSON.stringify(states));
  } catch (e) {
    console.log('Could not save zone states');
  }
};

// Zone color mapping
const getZoneColor = (status: ZoneStatus) => {
  switch (status) {
    case 'clean':
      return { fill: '#22C55E', border: '#16A34A', opacity: 0.5 };
    case 'dirty':
      return { fill: '#EF4444', border: '#DC2626', opacity: 0.6 };
    case 'review':
      return { fill: '#EAB308', border: '#CA8A04', opacity: 0.5 };
    default:
      return { fill: '#94A3B8', border: '#64748B', opacity: 0.4 };
  }
};

export function HomeScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoneStates, setZoneStates] = useState<Record<string, ZoneState>>(loadZoneStates);
  const mapRef = useRef<HTMLDivElement>(null);
  const rectanglesRef = useRef<Record<string, any>>({});
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Reload zone states when component gets focus (when returning from report screen)
  useEffect(() => {
    const handleFocus = () => {
      const savedStates = loadZoneStates();
      setZoneStates(savedStates);

      // Update all rectangle colors
      Object.keys(savedStates).forEach(zoneId => {
        const rect = rectanglesRef.current[zoneId];
        if (rect) {
          const colors = getZoneColor(savedStates[zoneId].status);
          rect.setStyle({
            color: colors.border,
            fillColor: colors.fill,
            fillOpacity: colors.opacity,
          });
        }
      });
    };

    window.addEventListener('focus', handleFocus);
    // Also check periodically in case the user comes back from another tab
    const interval = setInterval(handleFocus, 1000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Generate grid cells - 15x15 grid with ~30m per cell
  const gridCells = useMemo(() => {
    const cells = [];
    const centerLat = 30.0450;
    const centerLng = 31.2370;
    const gridSize = 0.0003; // ~30m per cell
    const rows = 15;
    const cols = 15;
    const startLat = centerLat - (rows * gridSize) / 2;
    const startLng = centerLng - (cols * gridSize) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const zoneId = `z${row * cols + col + 1}`;
        const zone = mockZones.find(z => z.id === zoneId);

        const cellCenterLat = startLat + row * gridSize + gridSize / 2;
        const cellCenterLng = startLng + col * gridSize + gridSize / 2;

        // Get current zone state
        const zoneState = zoneStates[zoneId] as ZoneState | undefined;
        const currentStatus = (zoneState?.status as ZoneStatus) || (zone?.status as ZoneStatus) || 'clean';

        const fullZone: Zone = zone ? {
          ...zone,
          lat: zone.lat || cellCenterLat,
          lng: zone.lng || cellCenterLng,
          cleaningCount: zone.cleaningCount || 0,
          status: currentStatus,
        } : {
          id: zoneId,
          lat: cellCenterLat,
          lng: cellCenterLng,
          status: currentStatus,
          cleaningCount: 0,
        };

        cells.push({
          id: zoneId,
          row,
          col,
          centerLat: cellCenterLat,
          centerLng: cellCenterLng,
          bounds: {
            north: startLat + row * gridSize,
            south: startLat + (row + 1) * gridSize,
            east: startLng + (col + 1) * gridSize,
            west: startLng + col * gridSize,
          },
          zone: fullZone,
        });
      }
    }
    return cells;
  }, [zoneStates]);

  // Update zone rectangle color
  const updateZoneRectangle = useCallback((zoneId: string, status: ZoneStatus) => {
    const rect = rectanglesRef.current[zoneId];
    if (rect) {
      const colors = getZoneColor(status);
      rect.setStyle({
        color: colors.border,
        fillColor: colors.fill,
        fillOpacity: colors.opacity,
      });
    }
  }, []);

  // Handle report action
  const handleReportZone = useCallback((zoneId: string) => {
    // Clear any existing timeout
    if (timeoutsRef.current[zoneId]) {
      clearTimeout(timeoutsRef.current[zoneId]);
    }

    const newState: ZoneState = { status: 'review', lastAction: 'report', lastActionTime: Date.now() };
    const newStates = { ...zoneStates, [zoneId]: newState };
    setZoneStates(newStates);
    saveZoneStates(newStates);
    updateZoneRectangle(zoneId, 'review');

    // After 10 seconds, change to clean (green)
    timeoutsRef.current[zoneId] = setTimeout(() => {
      setZoneStates(prev => {
        const updatedState: ZoneState = { ...(prev[zoneId] as ZoneState), status: 'clean', lastAction: 'clean', lastActionTime: Date.now() };
        const updated = { ...prev, [zoneId]: updatedState };
        saveZoneStates(updated);
        updateZoneRectangle(zoneId, 'clean');
        return updated;
      });
    }, 10000);

    setShowModal(false);
    setSelectedZone(null);
  }, [zoneStates, updateZoneRectangle]);

  // Handle clean action
  const handleCleanZone = useCallback((zoneId: string) => {
    // Clear any existing timeout
    if (timeoutsRef.current[zoneId]) {
      clearTimeout(timeoutsRef.current[zoneId]);
    }

    const newState: ZoneState = { status: 'clean', lastAction: 'clean', lastActionTime: Date.now() };
    const newStates = { ...zoneStates, [zoneId]: newState };
    setZoneStates(newStates);
    saveZoneStates(newStates);
    updateZoneRectangle(zoneId, 'clean');

    setShowModal(false);
    setSelectedZone(null);
  }, [zoneStates, updateZoneRectangle]);

  const handleZoneClick = useCallback((zone: Zone) => {
    setSelectedZone(zone);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedZone(null);
  }, []);

  const handleGoToReport = useCallback(() => {
    if (selectedZone) {
      navigate(`/report?zone=${selectedZone.id}`);
      setShowModal(false);
      setSelectedZone(null);
    }
  }, [selectedZone, navigate]);

  const handleGoToClean = useCallback(() => {
    if (selectedZone) {
      navigate(`/clean?zone=${selectedZone.id}`);
      setShowModal(false);
      setSelectedZone(null);
    }
  }, [selectedZone, navigate]);

  // Load Leaflet dynamically
  useEffect(() => {
    const loadMap = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        const linkEl = document.createElement('link');
        linkEl.rel = 'stylesheet';
        linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(linkEl);

        const scriptEl = document.createElement('script');
        scriptEl.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        scriptEl.async = true;
        scriptEl.onload = () => { initMap(); };
        document.body.appendChild(scriptEl);
      } else if (window.L) {
        initMap();
      }
    };

    const initMap = () => {
      if (mapRef.current && window.L) {
        const isInitialized = mapRef.current.getAttribute('data-leaflet-init');
        if (isInitialized) return;

        const map = window.L.map(mapRef.current, {
          center: [30.0450, 31.2370],
          zoom: 18,
          zoomControl: false,
          attributionControl: false,
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);

        // Add colored rectangles for ALL zones
        gridCells.forEach((cell) => {
          const colors = getZoneColor(cell.zone.status);
          const rect = window.L.rectangle(
            [[cell.bounds.north, cell.bounds.west], [cell.bounds.south, cell.bounds.east]],
            {
              color: colors.border,
              fillColor: colors.fill,
              fillOpacity: colors.opacity,
              weight: 1,
            }
          ).addTo(map);

          // Store reference for updates
          rectanglesRef.current[cell.id] = rect;

          // Make ALL cells clickable immediately
          rect.on('click', () => {
            handleZoneClick(cell.zone);
          });

          rect.on('mouseover', function() {
            this.setStyle({ weight: 2, fillOpacity: colors.opacity + 0.3 });
          });
          rect.on('mouseout', function() {
            this.setStyle({ weight: 1, fillOpacity: colors.opacity });
          });
        });

        setMapLoaded(true);
        if (mapRef.current) {
          mapRef.current.setAttribute('data-leaflet-init', 'true');
        }
      }
    };

    loadMap();

    // Cleanup timeouts on unmount
    return () => {
      Object.values(timeoutsRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, [gridCells, handleZoneClick]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ height: '100vh' }}>
      {/* Header - minimal */}
      <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
              <circle cx="7" cy="6" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="17" cy="18" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <h1 className="font-bold text-slate-900 text-lg">خريطة المناطق</h1>
        </div>
        <Link
          to="/notifications"
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors relative"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Link>
      </header>

      {/* Map Container - full screen */}
      <div className="flex-1 relative min-h-0">
        <div ref={mapRef} className="w-full h-full" />

        {/* Map Loading */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-500 text-sm">جاري تحميل الخريطة...</p>
            </div>
          </div>
        )}
      </div>

      {/* Zone Details Modal */}
      {showModal && selectedZone && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={handleCloseModal}>
          <div className="bg-white w-full sm:w-[90%] sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">تفاصيل المنطقة</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 -mr-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    selectedZone.status === 'clean' ? 'bg-green-100 text-green-700' :
                    selectedZone.status === 'dirty' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedZone.status === 'clean' ? 'نظيف' : selectedZone.status === 'dirty' ? 'مبلّغ عنه' : 'قيد المراجعة'}
                  </span>
                </div>
              </div>

              {/* Zone Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">المنطقة: {selectedZone.id}</p>
                <p className="text-xs text-slate-400">الإحداثيات: {selectedZone.lat?.toFixed(4)}, {selectedZone.lng?.toFixed(4)}</p>
                <p className="text-xs text-slate-400">عدد التنظيفات: {selectedZone.cleaningCount || 0}</p>
              </div>

              {/* Clean Zone Message */}
              {selectedZone.status === 'clean' && (
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <svg className="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-green-700">هذه المنطقة نظيفة</p>
                </div>
              )}

              {/* Dirty Zone Warning */}
              {selectedZone.status === 'dirty' && (
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-red-700">تم الإبلاغ عن هذه المنطقة</p>
                </div>
              )}

              {/* Review Zone Warning */}
              {selectedZone.status === 'review' && (
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <svg className="w-8 h-8 text-yellow-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-yellow-700">قيد المراجعة</p>
                  <p className="text-xs text-yellow-600 mt-1">سيتحول للأخضر خلال 10 ثواني</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {/* Report button - for clean zones - navigates to report screen */}
                {selectedZone.status === 'clean' && (
                  <button
                    onClick={handleGoToReport}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    بلّغ عن مشكلة
                  </button>
                )}

                {/* Clean button - for dirty/review zones */}
                {(selectedZone.status === 'dirty' || selectedZone.status === 'review') && (
                  <button
                    onClick={handleGoToClean}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    أنا نظفت هذه المنطقة
                  </button>
                )}

                {/* Already reported info */}
                {selectedZone.status === 'dirty' && (
                  <div className="bg-slate-100 rounded-xl p-3 text-center">
                    <p className="text-sm text-slate-500">تم الإبلاغ مسبقاً</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    L: any;
  }
}
