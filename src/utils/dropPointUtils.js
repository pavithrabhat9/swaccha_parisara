const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "09:00" -> "9:00 am" */
export function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** "Mon–Sat · 9:00 am – 6:00 pm" */
export function formatHoursSummary(point) {
  const openDays = DAY_NAMES.map((_, i) => i).filter(d => !point.closedDays.includes(d));
  let days;
  if (openDays.length === 7) days = 'Daily';
  else if (point.closedDays.length === 1 && point.closedDays[0] === 0) days = 'Mon–Sat';
  else days = openDays.map(d => DAY_NAMES[d]).join(', ');
  return `${days} · ${formatTime(point.opensAt)} – ${formatTime(point.closesAt)}`;
}

/**
 * Is the drop point open at `now`?
 * Returns { isOpen, time } where `time` is the closing time (when open) or the next opening
 * time (when closed; prefixed with the weekday if it is not today).
 */
export function getOpenStatus(point, now = new Date()) {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const opens = toMinutes(point.opensAt);
  const closes = toMinutes(point.closesAt);
  const closedToday = point.closedDays.includes(day);

  if (!closedToday && minutes >= opens && minutes < closes) {
    return { isOpen: true, time: formatTime(point.closesAt) };
  }

  // Opens later today
  if (!closedToday && minutes < opens) {
    return { isOpen: false, time: formatTime(point.opensAt) };
  }

  // Next open day
  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = (day + offset) % 7;
    if (!point.closedDays.includes(nextDay)) {
      const label = offset === 1 ? 'tomorrow' : DAY_NAMES[nextDay];
      return { isOpen: false, time: `${label} ${formatTime(point.opensAt)}` };
    }
  }
  return { isOpen: false, time: formatTime(point.opensAt) };
}

export function sortByDistance(points) {
  return [...points].sort((a, b) => a.distanceKm - b.distanceKm);
}

/** Nearest open drop point, falling back to the nearest one overall. */
export function getNearestDropPoint(points, now = new Date()) {
  const sorted = sortByDistance(points || []);
  return sorted.find(p => getOpenStatus(p, now).isOpen) || sorted[0] || null;
}

/** Google Maps directions link for a drop point. */
export function getDirectionsUrl(point) {
  return `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
}

