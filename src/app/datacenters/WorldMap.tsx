'use client';

import React, { useState } from 'react';
import { PROVIDER_INFRA, GEOGRAPHIES } from '@/config/datacenter_data';

// Build region-code → geography lookup from static data
const GEO_BY_CODE: Record<string, string> = {};
PROVIDER_INFRA.forEach(p => {
  p.regionList.forEach(r => { GEO_BY_CODE[r.code] = r.geography; });
});

const W = 960;
const H = 480;

function toXY(lat: number, lng: number): [number, number] {
  return [(lng + 180) / 360 * W, (90 - lat) / 180 * H];
}

// Keep in sync with src/config/index.ts PROVIDERS and page.tsx PROVIDER_COLORS
const PROVIDER_COLORS: Record<string, string> = {
  aws: '#FF9900',
  azure: '#00BCFF',
  gcp: '#34A853',
  oracle: '#F80000',
  digitalocean: '#0069FF',
  alibaba: '#FF6A00',
};

// Simplified continent polygons in equirectangular projection (W=960, H=480)
// x = (lng+180)/360*960,  y = (90-lat)/180*480
const CONTINENTS = [
  // North America
  '26,48 320,48 347,114 261,171 240,200 254,213 226,186 186,181 165,150 146,112 120,88 40,80',
  // South America
  '266,208 320,208 387,253 387,386 298,386 280,346',
  // Europe
  '453,80 587,53 613,80 587,114 560,141 520,144 467,144 456,138',
  // Africa
  '432,141 582,141 616,200 592,333 528,333 507,253 434,200',
  // Asia (main)
  '587,53 960,53 960,107 880,147 840,174 800,181 747,227 747,240 693,213 626,181 587,141 546,128 560,93',
  // Australia
  '786,299 891,299 891,344 867,344 826,325 786,325',
  // Greenland
  '347,34 427,34 427,80 360,85',
  // New Zealand (tiny)
  '891,360 910,360 910,375 891,375',
  // Japan (rough)
  '863,133 880,125 887,138 870,150 856,145',
  // UK / Ireland
  '453,80 462,68 475,68 480,80 467,90',
  // Scandinavia peninsula (rough)
  '520,53 533,40 553,40 560,53 547,67 533,67',
  // Indian subcontinent bump
  '693,160 720,160 733,213 707,227 693,213',
  // SE Asia peninsula (Indochina)
  '747,180 760,173 773,187 760,213 747,200',
];

// Coordinates [lat, lng] per provider → region code
const REGION_COORDS: Record<string, Array<[number, number, string, string]>> = {
  aws: [
    [38.9, -77.0, 'us-east-1', 'N. Virginia'],
    [39.9, -83.0, 'us-east-2', 'Ohio'],
    [37.4, -122.1, 'us-west-1', 'N. California'],
    [45.5, -122.7, 'us-west-2', 'Oregon'],
    [45.4, -75.7, 'ca-central-1', 'Canada (Central)'],
    [51.0, -114.1, 'ca-west-1', 'Canada (West)'],
    [20.5, -100.4, 'mx-central-1', 'Mexico'],
    [-23.5, -46.6, 'sa-east-1', 'São Paulo'],
    [53.3, -6.3, 'eu-west-1', 'Ireland'],
    [51.5, -0.1, 'eu-west-2', 'London'],
    [48.9, 2.4, 'eu-west-3', 'Paris'],
    [50.1, 8.7, 'eu-central-1', 'Frankfurt'],
    [47.4, 8.5, 'eu-central-2', 'Zurich'],
    [59.3, 18.1, 'eu-north-1', 'Stockholm'],
    [45.5, 9.2, 'eu-south-1', 'Milan'],
    [40.4, -3.7, 'eu-south-2', 'Spain'],
    [35.7, 139.7, 'ap-northeast-1', 'Tokyo'],
    [37.6, 127.0, 'ap-northeast-2', 'Seoul'],
    [34.7, 135.5, 'ap-northeast-3', 'Osaka'],
    [1.4, 103.8, 'ap-southeast-1', 'Singapore'],
    [-33.9, 151.2, 'ap-southeast-2', 'Sydney'],
    [-6.2, 106.8, 'ap-southeast-3', 'Jakarta'],
    [-37.8, 144.9, 'ap-southeast-4', 'Melbourne'],
    [19.1, 72.9, 'ap-south-1', 'Mumbai'],
    [17.4, 78.5, 'ap-south-2', 'Hyderabad'],
    [22.3, 114.2, 'ap-east-1', 'Hong Kong'],
    [13.8, 100.5, 'ap-southeast-7', 'Thailand'],
    [3.1, 101.7, 'ap-southeast-5', 'Malaysia'],
    [26.2, 50.6, 'me-south-1', 'Bahrain'],
    [25.2, 55.3, 'me-central-1', 'UAE'],
    [31.8, 35.2, 'il-central-1', 'Israel'],
    [-33.9, 18.4, 'af-south-1', 'Cape Town'],
  ],
  azure: [
    [37.3, -79.4, 'eastus', 'East US'],
    [36.6, -78.4, 'eastus2', 'East US 2'],
    [37.3, -120.7, 'westus', 'West US'],
    [47.5, -122.2, 'westus2', 'West US 2'],
    [33.4, -112.1, 'westus3', 'West US 3'],
    [41.6, -93.6, 'centralus', 'Central US'],
    [41.9, -87.6, 'northcentralus', 'North Central US'],
    [29.4, -98.5, 'southcentralus', 'South Central US'],
    [43.7, -79.4, 'canadacentral', 'Canada Central'],
    [46.8, -71.2, 'canadaeast', 'Canada East'],
    [-23.5, -46.6, 'brazilsouth', 'Brazil South'],
    [-22.9, -43.2, 'brazilsoutheast', 'Brazil Southeast'],
    [-33.4, -70.6, 'chilecentral', 'Chile Central'],
    [20.6, -101.4, 'mexicocentral', 'Mexico Central'],
    [53.3, -6.3, 'northeurope', 'North Europe'],
    [52.4, 4.9, 'westeurope', 'West Europe'],
    [51.5, -0.1, 'uksouth', 'UK South'],
    [51.5, -3.2, 'ukwest', 'UK West'],
    [48.9, 2.4, 'francecentral', 'France Central'],
    [43.3, 5.4, 'francesouth', 'France South'],
    [50.1, 8.7, 'germanywestcentral', 'Germany West Central'],
    [53.1, 8.8, 'germanynorth', 'Germany North'],
    [47.5, 8.5, 'switzerlandnorth', 'Switzerland North'],
    [60.7, 17.2, 'swedencentral', 'Sweden Central'],
    [59.9, 10.8, 'norwayeast', 'Norway East'],
    [45.5, 9.2, 'italynorth', 'Italy North'],
    [40.4, -3.7, 'spaincentral', 'Spain Central'],
    [52.2, 21.0, 'polandcentral', 'Poland Central'],
    [22.3, 114.2, 'eastasia', 'East Asia'],
    [1.4, 103.8, 'southeastasia', 'Southeast Asia'],
    [35.7, 139.7, 'japaneast', 'Japan East'],
    [34.7, 135.5, 'japanwest', 'Japan West'],
    [37.6, 127.0, 'koreacentral', 'Korea Central'],
    [18.5, 73.9, 'centralindia', 'Central India'],
    [13.1, 80.3, 'southindia', 'South India'],
    [-6.2, 106.8, 'indonesiacentral', 'Indonesia Central'],
    [3.1, 101.7, 'malaysiawest', 'Malaysia West'],
    [25.0, 121.5, 'taiwannorth', 'Taiwan North'],
    [-33.9, 151.2, 'australiaeast', 'Australia East'],
    [-37.8, 144.9, 'australiasoutheast', 'Australia Southeast'],
    [25.2, 55.3, 'uaenorth', 'UAE North'],
    [25.3, 51.5, 'qatarcentral', 'Qatar Central'],
    [32.0, 34.9, 'israelcentral', 'Israel Central'],
    [-26.2, 28.0, 'southafricanorth', 'South Africa North'],
  ],
  gcp: [
    [41.3, -93.6, 'us-central1', 'Iowa'],
    [33.7, -81.0, 'us-east1', 'South Carolina'],
    [38.9, -77.0, 'us-east4', 'N. Virginia'],
    [40.0, -83.0, 'us-east5', 'Columbus'],
    [32.8, -96.8, 'us-south1', 'Dallas'],
    [45.6, -122.7, 'us-west1', 'Oregon'],
    [34.1, -118.2, 'us-west2', 'Los Angeles'],
    [40.8, -111.9, 'us-west3', 'Salt Lake City'],
    [36.2, -115.1, 'us-west4', 'Las Vegas'],
    [-23.5, -46.6, 'southamerica-east1', 'São Paulo'],
    [-33.4, -70.6, 'southamerica-west1', 'Santiago'],
    [20.6, -101.4, 'northamerica-south1', 'Mexico'],
    [50.4, 3.7, 'europe-west1', 'Belgium'],
    [51.5, -0.1, 'europe-west2', 'London'],
    [50.1, 8.7, 'europe-west3', 'Frankfurt'],
    [52.0, 4.4, 'europe-west4', 'Netherlands'],
    [47.4, 8.5, 'europe-west6', 'Zurich'],
    [45.5, 9.2, 'europe-west8', 'Milan'],
    [48.9, 2.4, 'europe-west9', 'Paris'],
    [52.5, 13.4, 'europe-west10', 'Berlin'],
    [45.1, 7.7, 'europe-west12', 'Turin'],
    [60.7, 27.3, 'europe-north1', 'Finland'],
    [52.2, 21.0, 'europe-central2', 'Warsaw'],
    [25.0, 121.5, 'asia-east1', 'Taiwan'],
    [22.3, 114.2, 'asia-east2', 'Hong Kong'],
    [35.7, 139.7, 'asia-northeast1', 'Tokyo'],
    [34.7, 135.5, 'asia-northeast2', 'Osaka'],
    [37.6, 127.0, 'asia-northeast3', 'Seoul'],
    [19.1, 72.9, 'asia-south1', 'Mumbai'],
    [28.6, 77.2, 'asia-south2', 'Delhi'],
    [1.4, 103.8, 'asia-southeast1', 'Singapore'],
    [-6.2, 106.8, 'asia-southeast2', 'Jakarta'],
    [3.1, 101.7, 'asia-southeast3', 'Malaysia'],
    [-33.9, 151.2, 'australia-southeast1', 'Sydney'],
    [32.1, 34.8, 'me-west1', 'Tel Aviv'],
    [25.3, 51.5, 'me-central1', 'Qatar'],
    [-26.2, 28.0, 'africa-south1', 'Johannesburg'],
  ],
  oracle: [
    [39.0, -77.5, 'us-ashburn-1', 'Ashburn, VA'],
    [33.4, -112.1, 'us-phoenix-1', 'Phoenix, AZ'],
    [37.3, -121.9, 'us-sanjose-1', 'San Jose, CA'],
    [41.9, -87.6, 'us-chicago-1', 'Chicago, IL'],
    [45.5, -73.6, 'ca-montreal-1', 'Montreal'],
    [49.3, -123.1, 'ca-vancouver-1', 'Vancouver'],
    [20.6, -100.4, 'mx-queretaro-1', 'Querétaro'],
    [-23.5, -46.6, 'sa-saopaulo-1', 'São Paulo'],
    [-23.0, -46.9, 'sa-vinhedo-1', 'Vinhedo'],
    [-33.4, -70.6, 'sa-santiago-1', 'Santiago'],
    [50.1, 8.7, 'eu-frankfurt-1', 'Frankfurt'],
    [52.4, 4.9, 'eu-amsterdam-1', 'Amsterdam'],
    [51.5, -0.1, 'uk-london-1', 'London'],
    [47.4, 8.5, 'eu-zurich-1', 'Zurich'],
    [43.3, 5.4, 'eu-marseille-1', 'Marseille'],
    [45.5, 9.2, 'eu-milan-1', 'Milan'],
    [40.4, -3.7, 'eu-madrid-1', 'Madrid'],
    [59.3, 18.1, 'eu-stockholm-1', 'Stockholm'],
    [52.2, 21.0, 'eu-warsaw-1', 'Warsaw'],
    [37.9, 23.7, 'eu-athens-1', 'Athens'],
    [35.7, 139.7, 'ap-tokyo-1', 'Tokyo'],
    [34.7, 135.5, 'ap-osaka-1', 'Osaka'],
    [37.6, 127.0, 'ap-seoul-1', 'Seoul'],
    [37.9, 127.7, 'ap-chuncheon-1', 'Chuncheon'],
    [19.1, 72.9, 'ap-mumbai-1', 'Mumbai'],
    [17.4, 78.5, 'ap-hyderabad-1', 'Hyderabad'],
    [1.4, 103.8, 'ap-singapore-1', 'Singapore'],
    [1.5, 103.9, 'ap-singapore-2', 'Singapore 2'],
    [-33.9, 151.2, 'ap-sydney-1', 'Sydney'],
    [-37.8, 144.9, 'ap-melbourne-1', 'Melbourne'],
    [25.2, 55.3, 'me-dubai-1', 'Dubai'],
    [21.5, 39.2, 'me-jeddah-1', 'Jeddah'],
    [31.8, 35.2, 'il-jerusalem-1', 'Jerusalem'],
    [-26.2, 28.0, 'af-johannesburg-1', 'Johannesburg'],
  ],
  digitalocean: [
    [40.7, -74.0, 'nyc1', 'New York 1'],
    [40.7, -74.1, 'nyc3', 'New York 3'],
    [37.7, -122.4, 'sfo3', 'San Francisco'],
    [43.7, -79.4, 'tor1', 'Toronto'],
    [-23.5, -46.6, 'bra1', 'São Paulo'],
    [52.4, 4.9, 'ams3', 'Amsterdam'],
    [50.1, 8.7, 'fra1', 'Frankfurt'],
    [51.5, -0.1, 'lon1', 'London'],
    [1.4, 103.8, 'sgp1', 'Singapore'],
    [12.9, 77.6, 'blr1', 'Bangalore'],
    [17.4, 78.5, 'hyd1', 'Hyderabad'],
    [34.7, 135.5, 'osa1', 'Osaka'],
    [-33.9, 151.2, 'syd1', 'Sydney'],
    [25.2, 55.3, 'dub1', 'Dubai'],
  ],
  alibaba: [
    [30.3, 120.2, 'cn-hangzhou', 'Hangzhou'],
    [31.2, 121.5, 'cn-shanghai', 'Shanghai'],
    [39.9, 116.4, 'cn-beijing', 'Beijing'],
    [22.5, 114.1, 'cn-shenzhen', 'Shenzhen'],
    [30.7, 104.1, 'cn-chengdu', 'Chengdu'],
    [23.7, 114.7, 'cn-heyuan', 'Heyuan'],
    [41.0, 111.2, 'cn-wulanchabu', 'Wulanchabu'],
    [22.3, 114.2, 'cn-hongkong', 'Hong Kong'],
    [1.4, 103.8, 'ap-southeast-1', 'Singapore'],
    [3.1, 101.7, 'ap-southeast-3', 'Kuala Lumpur'],
    [-6.2, 106.8, 'ap-southeast-5', 'Jakarta'],
    [14.6, 121.0, 'ap-southeast-6', 'Manila'],
    [13.8, 100.5, 'ap-southeast-7', 'Bangkok'],
    [35.7, 139.7, 'ap-northeast-1', 'Tokyo'],
    [37.6, 127.0, 'ap-northeast-2', 'Seoul'],
    [19.1, 72.9, 'ap-south-1', 'Mumbai'],
    [32.1, 118.8, 'cn-nanjing', 'Nanjing'],
    [39.0, -77.5, 'us-east-1', 'Virginia'],
    [37.4, -122.1, 'us-west-1', 'Silicon Valley'],
    [-23.5, -46.6, 'sa-east-1', 'São Paulo'],
    [50.1, 8.7, 'eu-central-1', 'Frankfurt'],
    [51.5, -0.1, 'eu-west-1', 'London'],
    [48.9, 2.4, 'eu-west-2', 'Paris'],
    [-33.9, 151.2, 'ap-southeast-2', 'Sydney'],
    [25.2, 55.3, 'me-east-1', 'Dubai'],
    [-26.2, 28.0, 'af-south-1', 'Johannesburg'],
  ],
};

interface Tooltip {
  x: number;
  y: number;
  providerId: string;
  regionCode: string;
  regionName: string;
}

export default function WorldMap() {
  const allProviderIds = PROVIDER_INFRA.map(p => p.id);
  const [selected, setSelected] = useState<Set<string>>(new Set(allProviderIds));
  const [selectedGeos, setSelectedGeos] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const toggleGeo = (geo: string) => {
    setSelectedGeos(prev =>
      prev.includes(geo) ? prev.filter(g => g !== geo) : [...prev, geo]
    );
  };

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectOnly(id: string) {
    setSelected(new Set([id]));
  }

  function selectAll() {
    setSelected(new Set(allProviderIds));
  }

  // Collect all dots to render, filtered by provider and geography
  const dots: Array<{ x: number; y: number; providerId: string; color: string; code: string; name: string }> = [];
  for (const pid of allProviderIds) {
    if (!selected.has(pid)) continue;
    const coords = REGION_COORDS[pid] ?? [];
    const color = PROVIDER_COLORS[pid] ?? '#888';
    for (const [lat, lng, code, name] of coords) {
      if (selectedGeos.length > 0) {
        const geo = GEO_BY_CODE[code];
        if (!geo || !selectedGeos.includes(geo)) continue;
      }
      const [x, y] = toXY(lat, lng);
      dots.push({ x, y, providerId: pid, color, code, name });
    }
  }

  return (
    <div className="mt-8 border border-[#dde0f0] dark:border-[#1e1e38] rounded overflow-hidden bg-white dark:bg-[#0a0a18]">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-[#dde0f0] dark:border-[#1e1e38] bg-[#eef0fc] dark:bg-[#0c0c1e]">
        <h2 className="text-[12px] font-bold text-[#1a1a2e] dark:text-[#f7f8ff]">Global Region Map</h2>
        <p className="text-[11px] text-[#737373] mt-0.5">Click to toggle providers · Double-click to isolate one</p>
      </div>

      {/* Provider toggles */}
      <div className="px-5 py-3 flex flex-wrap gap-2 items-center border-b border-[#dde0f0] dark:border-[#1e1e38]">
        {PROVIDER_INFRA.map(p => {
          const active = selected.has(p.id);
          const color = PROVIDER_COLORS[p.id] ?? '#888';
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              onDoubleClick={() => selectOnly(p.id)}
              title={`Click to toggle · Double-click to show only ${p.name}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold border transition-all ${
                active
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-[#dde0f0] dark:bg-[#1e1e38] text-[#737373] border-[#dde0f0] dark:border-[#1e1e38] opacity-60 hover:opacity-90'
              }`}
              style={active ? { backgroundColor: color, borderColor: color } : {}}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.85)' : color }}
              />
              {p.nameShort}
            </button>
          );
        })}
        <button
          onClick={selectAll}
          className="ml-auto text-[10px] font-bold text-[#737373] hover:text-[#1a1a2e] dark:hover:text-[#f7f8ff] transition-colors"
        >
          All
        </button>
      </div>

      {/* Geography filter */}
      <div className="px-5 py-3 flex flex-wrap gap-2 items-center border-b border-[#dde0f0] dark:border-[#1e1e38]">
        <span className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mr-1">Geography</span>
        {GEOGRAPHIES.map(geo => (
          <button
            key={geo}
            onClick={() => toggleGeo(geo)}
            className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
              selectedGeos.includes(geo)
                ? 'bg-black dark:bg-[#f7f8ff] text-[#f7f8ff] dark:text-black border-black dark:border-[#f7f8ff]'
                : 'bg-[#dde0f0] dark:bg-[#1e1e38] text-[#737373] border-[#dde0f0] dark:border-[#1e1e38] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
            }`}
          >
            {geo}
          </button>
        ))}
        <button
          onClick={() => setSelectedGeos([])}
          className={`ml-auto text-[10px] font-bold uppercase transition-colors ${
            selectedGeos.length > 0 ? 'text-[#1a1a2e] dark:text-[#f7f8ff]' : 'text-[#737373]'
          }`}
        >
          {selectedGeos.length > 0 ? 'Clear' : 'All'}
        </button>
      </div>

      {/* Map */}
      <div className="relative w-full" style={{ paddingBottom: `${(H / W) * 100}%` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'var(--map-ocean)' }}
        >
          <style>{`
            :root { --map-ocean: #c8d8e8; --map-land: #d4dce8; --map-land-stroke: #b0b8c8; }
            .dark { --map-ocean: #0e1a2a; --map-land: #1a2840; --map-land-stroke: #2a3850; }
            @keyframes pulse-ring {
              0% { r: 4; opacity: 0.8; }
              70% { r: 9; opacity: 0; }
              100% { r: 9; opacity: 0; }
            }
          `}</style>

          {/* Ocean background */}
          <rect width={W} height={H} fill="var(--map-ocean)" />

          {/* Continent polygons */}
          {CONTINENTS.map((pts, i) => (
            <polygon
              key={i}
              points={pts}
              fill="var(--map-land)"
              stroke="var(--map-land-stroke)"
              strokeWidth="0.7"
            />
          ))}

          {/* Graticule lines (faint grid) */}
          {[-60, -30, 0, 30, 60].map(lat => {
            const y = (90 - lat) / 180 * H;
            return (
              <line
                key={`lat-${lat}`}
                x1={0} y1={y} x2={W} y2={y}
                stroke="var(--map-land-stroke)"
                strokeWidth="0.3"
                opacity="0.4"
              />
            );
          })}
          {[-120, -60, 0, 60, 120].map(lng => {
            const x = (lng + 180) / 360 * W;
            return (
              <line
                key={`lng-${lng}`}
                x1={x} y1={0} x2={x} y2={H}
                stroke="var(--map-land-stroke)"
                strokeWidth="0.3"
                opacity="0.4"
              />
            );
          })}

          {/* Region dots */}
          {dots.map((d, i) => (
            <g key={`${d.providerId}-${d.code}-${i}`}>
              {/* Pulsing ring */}
              <circle
                cx={d.x}
                cy={d.y}
                r={4}
                fill="none"
                stroke={d.color}
                strokeWidth="1.5"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  from="3"
                  to="10"
                  dur="2.5s"
                  begin={`${(i * 0.12) % 2.5}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.7"
                  to="0"
                  dur="2.5s"
                  begin={`${(i * 0.12) % 2.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Dot */}
              <circle
                cx={d.x}
                cy={d.y}
                r={3.5}
                fill={d.color}
                stroke="white"
                strokeWidth="0.8"
                opacity="0.92"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const svgEl = (e.target as SVGCircleElement).closest('svg')!;
                  const rect = svgEl.getBoundingClientRect();
                  const svgX = (d.x / W) * rect.width;
                  const svgY = (d.y / H) * rect.height;
                  setTooltip({
                    x: svgX,
                    y: svgY,
                    providerId: d.providerId,
                    regionCode: d.code,
                    regionName: d.name,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {tooltip && (() => {
          const provider = PROVIDER_INFRA.find(p => p.id === tooltip.providerId);
          const color = PROVIDER_COLORS[tooltip.providerId] ?? '#888';
          const containerEl = document.querySelector('.relative.w-full');
          const containerWidth = containerEl ? (containerEl as HTMLElement).offsetWidth : W;
          const containerHeight = containerEl ? (containerEl as HTMLElement).offsetHeight : H;
          const flipX = tooltip.x > containerWidth * 0.65;
          const flipY = tooltip.y > containerHeight * 0.7;
          return (
            <div
              className="absolute z-10 pointer-events-none px-2.5 py-2 rounded-lg shadow-lg border text-xs"
              style={{
                left: flipX ? undefined : tooltip.x + 10,
                right: flipX ? containerWidth - tooltip.x + 10 : undefined,
                top: flipY ? undefined : tooltip.y - 8,
                bottom: flipY ? containerHeight - tooltip.y - 8 : undefined,
                background: 'var(--tt-bg, #fff)',
                borderColor: 'var(--tt-border, #dde0f0)',
                color: 'var(--tt-text, #1a1a2e)',
              }}
            >
              <style>{`.dark { --tt-bg: #1a1a2e; --tt-border: #1e1e38; --tt-text: #f7f8ff; }`}</style>
              <div className="flex items-center gap-1.5 font-semibold mb-0.5">
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {provider?.nameShort ?? tooltip.providerId}
              </div>
              <div className="text-[11px] opacity-80">{tooltip.regionName}</div>
              <div className="text-[10px] opacity-50 font-mono mt-0.5">{tooltip.regionCode}</div>
            </div>
          );
        })()}
      </div>

      {/* Footer note */}
      <div className="px-5 py-2 text-[10px] text-[#737373] border-t border-[#dde0f0] dark:border-[#1e1e38] bg-[#f7f8ff] dark:bg-[#06060f] flex justify-between">
        <span className="font-bold">{dots.length} regions shown</span>
        <span>Equirectangular projection · approximate coordinates</span>
      </div>
    </div>
  );
}
