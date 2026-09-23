import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import { ProjectMaster } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Filter,
  Search,
  Eye,
  Layers,
  Building,
  Activity,
  ArrowUpRight,
  Maximize2,
  RotateCcw,
  Compass,
  Map as MapIcon
} from 'lucide-react';

// Gujarat geographic bounds and center
const GUJARAT_CENTER: [number, number] = [22.40, 71.75];
const GUJARAT_DEFAULT_ZOOM = 7;

// Tile Layer options
const TILE_LAYERS = {
  carto: {
    name: 'Administrative GIS',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
};

export const GisProjectMap: React.FC = () => {
  const { projects, setSelectedProjectId } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePinProject, setActivePinProject] = useState<ProjectMaster | null>(projects[0] || null);
  const [activeMapLayer, setActiveMapLayer] = useState<'carto' | 'osm' | 'satellite'>('carto');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const districts = useMemo(() => Array.from(new Set(projects.map(p => p.district))).sort(), [projects]);
  const categories = useMemo(() => Array.from(new Set(projects.map(p => p.category))).sort(), [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchDist = selectedDistrict === 'All' || p.district === selectedDistrict;
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchDist && matchCat;
    });
  }, [projects, selectedDistrict, selectedCategory]);

  const getPinColorHex = (status: string) => {
    switch (status) {
      case 'In Execution':
        return '#059669'; // emerald-600
      case 'Delayed':
        return '#d97706'; // amber-600
      case 'Under RFP':
        return '#9333ea'; // purple-600
      case 'Awarded':
        return '#2563eb'; // blue-600
      case 'Completed':
        return '#0d9488'; // teal-600
      default:
        return '#1e3a8a'; // blue-900
    }
  };

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent re-initialization
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: GUJARAT_CENTER,
        zoom: GUJARAT_DEFAULT_ZOOM,
        minZoom: 6,
        maxZoom: 17,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom Control at bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add default tile layer
      const initialLayer = L.tileLayer(TILE_LAYERS[activeMapLayer].url, {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      tileLayerRef.current = initialLayer;

      // Add Markers Layer Group
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      mapInstanceRef.current = map;

      // Ensure proper map sizing
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when layer switch state changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(TILE_LAYERS[activeMapLayer].url, {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [activeMapLayer]);

  // Update Markers whenever filtered projects or active pin changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredProjects.forEach(prj => {
      const isSelected = activePinProject?.id === prj.id;
      const color = getPinColorHex(prj.currentStatus);

      // Coordinates validation
      const lat = Number(prj.coordinates?.lat) || 22.3;
      const lng = Number(prj.coordinates?.lng) || 71.8;

      // Create Custom SVG Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-gis-pin',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${
              isSelected
                ? `<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background-color: ${color}44; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : ''
            }
            <div style="
              width: ${isSelected ? '32px' : '26px'};
              height: ${isSelected ? '32px' : '26px'};
              background-color: ${color};
              border: 2.5px solid #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
              transition: all 0.2s ease-in-out;
            ">
              <svg width="${isSelected ? '16' : '13'}" height="${isSelected ? '16' : '13'}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -17]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Click handler
      marker.on('click', () => {
        setActivePinProject(prj);
      });

      // Tooltip on hover
      marker.bindTooltip(`
        <div style="font-family: inherit; font-size: 11px; line-height: 1.3;">
          <strong style="color: #0f172a;">${prj.district}</strong> &bull; <span style="color: ${color}; font-weight: 600;">${prj.currentStatus}</span>
          <div style="color: #475569; font-weight: 500; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${prj.name}</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -12],
        opacity: 0.96
      });

      markersGroup.addLayer(marker);
    });
  }, [filteredProjects, activePinProject]);

  // Handle fly-to when activePinProject changes
  const handleSelectProject = (prj: ProjectMaster) => {
    setActivePinProject(prj);
    if (mapInstanceRef.current && prj.coordinates) {
      const lat = Number(prj.coordinates.lat);
      const lng = Number(prj.coordinates.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapInstanceRef.current.flyTo([lat, lng], Math.max(mapInstanceRef.current.getZoom(), 11), {
          duration: 0.8
        });
      }
    }
  };

  // Reset View to Gujarat
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(GUJARAT_CENTER, GUJARAT_DEFAULT_ZOOM, {
        duration: 0.8
      });
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="GIS Project Map" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Geographic Information System (GIS) State Map</h2>
          <p className="text-xs text-slate-600">
            Spatial distribution, geo-tagged site footprints and district infrastructure coverage across Gujarat
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-600">Active Map Pins:</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold font-mono">
            {filteredProjects.length} Schemes
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-700">District:</span>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="border border-slate-300 rounded p-1 bg-white font-medium"
            >
              <option value="All">All Gujarat ({districts.length})</option>
              {districts.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-700">Sector:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="border border-slate-300 rounded p-1 bg-white font-medium"
            >
              <option value="All">All Sectors ({categories.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-600">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Execution</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Delayed</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span>RFP / Tender</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Awarded</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Main Map Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Gujarat Spatial Canvas */}
        <div className="lg:col-span-2 bg-[#F1F5F9] rounded-lg border border-slate-300 relative min-h-[540px] h-[540px] overflow-hidden flex flex-col justify-between shadow-inner">
          {/* Actual Leaflet Gujarat Map */}
          <div
            ref={mapContainerRef}
            className="absolute inset-0 w-full h-full z-0"
            style={{ background: '#f8fafc' }}
          />

          {/* Top Floating Controls on Map */}
          <div className="relative z-10 p-3 flex items-center justify-between pointer-events-none">
            {/* Left: Gujarat Identification Badge */}
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-800 shadow-sm pointer-events-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[#0E355C]">State of Gujarat GIS</span>
              <span className="text-slate-400 font-mono">|</span>
              <span className="text-slate-600 font-medium">EPSG:4326 WGS84</span>
            </div>

            {/* Right: Layer Switcher & Reset Button */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* Map Layer Mode Switcher */}
              <div className="bg-white/95 backdrop-blur-md p-1 rounded-lg border border-slate-200 shadow-sm flex items-center text-[11px] font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveMapLayer('carto')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeMapLayer === 'carto'
                      ? 'bg-[#0E355C] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  GIS Map
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMapLayer('osm')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeMapLayer === 'osm'
                      ? 'bg-[#0E355C] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Street
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMapLayer('satellite')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeMapLayer === 'satellite'
                      ? 'bg-[#0E355C] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Satellite
                </button>
              </div>

              {/* Reset to Gujarat Center */}
              <button
                type="button"
                onClick={handleResetView}
                title="Reset view to whole Gujarat"
                className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Bottom Floating Info Overlay */}
          <div className="relative z-10 p-3 flex items-center justify-between pointer-events-none">
            <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-300 text-[10px] text-slate-700 shadow-2xs pointer-events-auto">
              <strong>Gujarat Urban Development Mission</strong> &bull; Spatial Infrastructure Portal
            </div>
            <div className="bg-white/90 backdrop-blur-xs px-2 py-1 rounded border border-slate-300 text-[10px] text-slate-700 shadow-2xs pointer-events-auto">
              Pan & Zoom Active &bull; Interactive Markers
            </div>
          </div>
        </div>

        {/* Right Side: Selected Pin Project Profile */}
        <div className="space-y-4">
          {activePinProject ? (
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 text-xs space-y-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {activePinProject.id}
                  </span>
                  <StatusBadge status={activePinProject.currentStatus} size="sm" />
                  <StatusBadge risk={activePinProject.riskLevel} size="sm" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{activePinProject.name}</h3>
                <p className="text-slate-600 text-[11px] mt-0.5">{activePinProject.description}</p>
              </div>

              {/* Spatial Attributes */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">District & ULB:</span>
                  <span className="font-bold text-slate-800">{activePinProject.district} &bull; {activePinProject.ulb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GIS Coordinates:</span>
                  <span className="font-mono text-slate-700 font-semibold">
                    {typeof activePinProject.coordinates?.lat === 'number' ? activePinProject.coordinates.lat.toFixed(4) : (Number(activePinProject.coordinates?.lat) || 0).toFixed(4)}° N,{' '}
                    {typeof activePinProject.coordinates?.lng === 'number' ? activePinProject.coordinates.lng.toFixed(4) : (Number(activePinProject.coordinates?.lng) || 0).toFixed(4)}° E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Site Location:</span>
                  <span className="font-medium text-slate-800">{activePinProject.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved Outlay:</span>
                  <span className="font-bold text-slate-900">
                    ₹ {(Number(activePinProject.approvedCost) || 0).toFixed(2)} Cr
                  </span>
                </div>
              </div>

              {/* Progress Gauges */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Physical Completion</span>
                    <span className="font-bold text-slate-800">{activePinProject.physicalProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-700 h-full rounded-full" style={{ width: `${activePinProject.physicalProgress}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Financial Expenditure Released</span>
                    <span className="font-bold text-emerald-800">
                      ₹ {(Number(activePinProject.expenditure) || 0).toFixed(2)} Cr ({activePinProject.financialProgress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${activePinProject.financialProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => setSelectedProjectId(activePinProject.id)}
                className="w-full py-2 bg-[#0E355C] text-white rounded font-semibold text-xs hover:bg-[#092644] transition-colors flex items-center justify-center shadow-xs cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 mr-1.5" />
                Open Full Project Master Record
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-xs text-slate-500">
              Click any project pin on the Gujarat map to inspect field details.
            </div>
          )}

          {/* Quick List of Displayed Schemes */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              Schemes in View ({filteredProjects.length})
            </div>
            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto text-xs">
              {filteredProjects.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className={`p-2.5 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                    activePinProject?.id === p.id ? 'bg-blue-50 font-bold' : ''
                  }`}
                >
                  <div className="truncate max-w-[200px]">
                    <span className="font-mono text-[10px] text-blue-900 block">{p.id}</span>
                    <span className="truncate block text-slate-800">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{p.district}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
