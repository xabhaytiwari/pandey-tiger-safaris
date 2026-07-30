// Pure TypeScript EXIF GPS Metadata Extractor for JPEGs
export function getExifGPS(file: File): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) return resolve(null);

      const view = new DataView(buffer);
      if (view.getUint16(0, false) !== 0xFFD8) return resolve(null); // Not a JPEG

      let length = view.byteLength, offset = 2;
      while (offset < length) {
        if (offset + 4 > length) break;
        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xFFE1) { // APP1 Marker (Exif)
          if (view.getUint32(offset + 2, false) !== 0x45786966) return resolve(null); // "Exif"
          
          const littleEndian = view.getUint16(offset + 8, false) === 0x4949;
          const tiffOffset = offset + 8;
          const firstIFD = view.getUint32(tiffOffset + 4, littleEndian);

          if (firstIFD < 8) return resolve(null);

          const gpsIFDOffset = findGPSIFD(view, tiffOffset, firstIFD, littleEndian);
          if (!gpsIFDOffset) return resolve(null);

          const coords = extractGPSCoords(view, tiffOffset, gpsIFDOffset, littleEndian);
          return resolve(coords);
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      return resolve(null);
    };
    reader.readAsArrayBuffer(file);
  });
}

function findGPSIFD(view: DataView, tiffOffset: number, ifdOffset: number, littleEndian: boolean): number | null {
  try {
    const entries = view.getUint16(tiffOffset + ifdOffset, littleEndian);
    for (let i = 0; i < entries; i++) {
      const entryOffset = tiffOffset + ifdOffset + 2 + i * 12;
      const tag = view.getUint16(entryOffset, littleEndian);
      if (tag === 0x8825) { // GPS Info IFD Pointer Tag
        return view.getUint32(entryOffset + 8, littleEndian);
      }
    }
  } catch {
    return null;
  }
  return null;
}

function extractGPSCoords(view: DataView, tiffOffset: number, gpsOffset: number, littleEndian: boolean): { lat: number; lng: number } | null {
  try {
    const entries = view.getUint16(tiffOffset + gpsOffset, littleEndian);
    let lat: number | null = null, lng: number | null = null;
    let latRef = "N", lngRef = "E";

    for (let i = 0; i < entries; i++) {
      const entryOffset = tiffOffset + gpsOffset + 2 + i * 12;
      const tag = view.getUint16(entryOffset, littleEndian);

      if (tag === 1) latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
      else if (tag === 2) lat = parseRationalDegrees(view, tiffOffset, view.getUint32(entryOffset + 8, littleEndian), littleEndian);
      else if (tag === 3) lngRef = String.fromCharCode(view.getUint8(entryOffset + 8));
      else if (tag === 4) lng = parseRationalDegrees(view, tiffOffset, view.getUint32(entryOffset + 8, littleEndian), littleEndian);
    }

    if (lat !== null && lng !== null) {
      if (latRef === "S") lat = -lat;
      if (lngRef === "W") lng = -lng;
      return { lat, lng };
    }
  } catch {
    return null;
  }
  return null;
}

function parseRationalDegrees(view: DataView, tiffOffset: number, offset: number, littleEndian: boolean): number {
  const degNum = view.getUint32(tiffOffset + offset, littleEndian);
  const degDen = view.getUint32(tiffOffset + offset + 4, littleEndian);
  const minNum = view.getUint32(tiffOffset + offset + 8, littleEndian);
  const minDen = view.getUint32(tiffOffset + offset + 12, littleEndian);
  const secNum = view.getUint32(tiffOffset + offset + 16, littleEndian);
  const secDen = view.getUint32(tiffOffset + offset + 20, littleEndian);

  const deg = degNum / (degDen || 1);
  const min = minNum / (minDen || 1);
  const sec = secNum / (secDen || 1);

  return deg + (min / 60) + (sec / 3600);
}

// Haversine Distance Geofencer: Automatically identifies nearest MP National Park
export function findNearestPark(lat: number, lng: number): string {
  const PARKS = [
    { name: "Bandhavgarh National Park", lat: 23.7024, lng: 81.0253 },
    { name: "Kanha National Park", lat: 22.3345, lng: 80.6115 },
    { name: "Pench National Park", lat: 21.6582, lng: 79.3006 },
    { name: "Panna National Park", lat: 24.6300, lng: 80.0000 },
    { name: "Satpura National Park", lat: 22.4833, lng: 78.4333 },
  ];

  let closestPark = PARKS[0].name;
  let minDistance = Infinity;

  for (const park of PARKS) {
    const dLat = (park.lat - lat) * (Math.PI / 180);
    const dLng = (park.lng - lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(park.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = 6371 * c; // Distance in Km

    if (dist < minDistance) {
      minDistance = dist;
      closestPark = park.name;
    }
  }

  return closestPark;
}
