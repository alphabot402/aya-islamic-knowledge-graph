/**
 * Prayer Times Calculator
 * "My Mercy encompasses all things" - The Spiritual Clock
 *
 * This module calculates the current prayer time based on the system clock
 * and provides the "spiritual state" that drives the lighting engine.
 *
 * Note: This is a simplified calculation for demonstration.
 * For production, use a library like 'adhan' for accurate calculations
 * based on geographic location and proper astronomical calculations.
 */

export type PrayerTime = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'night'

export interface PrayerTimeInfo {
  current: PrayerTime
  arabic: string // Arabic name for current prayer
  progress: number // 0-1, how far through current prayer period
  nextPrayer: PrayerTime
  spiritualState: 'dawn' | 'day' | 'dusk' | 'night'
}

/**
 * Get Arabic name for prayer time
 */
export function getPrayerNameArabic(prayerTime: PrayerTime): string {
  switch (prayerTime) {
    case 'fajr':
      return 'الفجر'
    case 'sunrise':
      return 'الشروق'
    case 'dhuhr':
      return 'الظهر'
    case 'asr':
      return 'العصر'
    case 'maghrib':
      return 'المغرب'
    case 'isha':
      return 'العشاء'
    case 'night':
      return 'الليل'
    default:
      return ''
  }
}

/**
 * Simplified prayer time calculation based on hour of day
 * In production, replace with proper astronomical calculations
 */
export function getCurrentPrayerTime(date: Date = new Date()): PrayerTimeInfo {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const timeInMinutes = hour * 60 + minute

  // Simplified prayer times (adjust based on location/season in production)
  const times = {
    fajr: 5 * 60,      // 5:00 AM
    sunrise: 6 * 60 + 30, // 6:30 AM
    dhuhr: 12 * 60 + 30,  // 12:30 PM
    asr: 15 * 60 + 30,    // 3:30 PM
    maghrib: 18 * 60,     // 6:00 PM
    isha: 19 * 60 + 30,   // 7:30 PM
    night: 21 * 60        // 9:00 PM
  }

  // Determine current prayer period
  let current: PrayerTime
  let nextPrayer: PrayerTime
  let periodStart: number
  let periodEnd: number
  let spiritualState: 'dawn' | 'day' | 'dusk' | 'night'

  if (timeInMinutes >= times.fajr && timeInMinutes < times.sunrise) {
    current = 'fajr'
    nextPrayer = 'sunrise'
    periodStart = times.fajr
    periodEnd = times.sunrise
    spiritualState = 'dawn'
  } else if (timeInMinutes >= times.sunrise && timeInMinutes < times.dhuhr) {
    current = 'sunrise'
    nextPrayer = 'dhuhr'
    periodStart = times.sunrise
    periodEnd = times.dhuhr
    spiritualState = 'day'
  } else if (timeInMinutes >= times.dhuhr && timeInMinutes < times.asr) {
    current = 'dhuhr'
    nextPrayer = 'asr'
    periodStart = times.dhuhr
    periodEnd = times.asr
    spiritualState = 'day'
  } else if (timeInMinutes >= times.asr && timeInMinutes < times.maghrib) {
    current = 'asr'
    nextPrayer = 'maghrib'
    periodStart = times.asr
    periodEnd = times.maghrib
    spiritualState = 'day'
  } else if (timeInMinutes >= times.maghrib && timeInMinutes < times.isha) {
    current = 'maghrib'
    nextPrayer = 'isha'
    periodStart = times.maghrib
    periodEnd = times.isha
    spiritualState = 'dusk'
  } else if (timeInMinutes >= times.isha && timeInMinutes < times.night) {
    current = 'isha'
    nextPrayer = 'night'
    periodStart = times.isha
    periodEnd = times.night
    spiritualState = 'night'
  } else {
    // Between night (9 PM) and fajr (5 AM)
    current = 'night'
    nextPrayer = 'fajr'
    periodStart = times.night
    periodEnd = times.fajr + 24 * 60 // Next day's fajr
    spiritualState = 'night'
  }

  // Calculate progress through current period
  const periodDuration = periodEnd - periodStart
  const elapsed = timeInMinutes >= periodStart
    ? timeInMinutes - periodStart
    : (24 * 60 - periodStart) + timeInMinutes // Handle overnight period
  const progress = Math.min(1, Math.max(0, elapsed / periodDuration))

  return {
    current,
    arabic: getPrayerNameArabic(current),
    progress,
    nextPrayer,
    spiritualState
  }
}

/**
 * Get color scheme based on prayer time
 * Returns colors for sky gradient interpolation
 */
export function getPrayerTimeColors(prayerTime: PrayerTime): {
  top: string
  middle: string
  bottom: string
  ambient: string
  sunLight: string
} {
  switch (prayerTime) {
    case 'fajr':
      return {
        top: '#1a1a3e',      // Deep sapphire
        middle: '#4a5568',    // Gray-blue
        bottom: '#ed64a6',    // Pink dawn
        ambient: '#4a5568',
        sunLight: '#fbbf24'   // Golden
      }

    case 'sunrise':
      return {
        top: '#3b82f6',       // Bright blue
        middle: '#fbbf24',    // Golden
        bottom: '#f59e0b',    // Amber
        ambient: '#fef3c7',
        sunLight: '#fbbf24'
      }

    case 'dhuhr':
      return {
        top: '#ffffff',       // Blinding white (Nur)
        middle: '#fbbf24',    // Pure gold
        bottom: '#fef3c7',    // Cream
        ambient: '#ffffff',
        sunLight: '#ffffff'
      }

    case 'asr':
      return {
        top: '#60a5fa',       // Light blue
        middle: '#fbbf24',    // Gold
        bottom: '#f59e0b',    // Amber
        ambient: '#fef3c7',
        sunLight: '#f59e0b'
      }

    case 'maghrib':
      return {
        top: '#7c3aed',       // Purple
        middle: '#f59e0b',    // Amber
        bottom: '#dc2626',    // Deep red
        ambient: '#7c3aed',
        sunLight: '#f59e0b'
      }

    case 'isha':
      return {
        top: '#1e1b4b',       // Deep indigo
        middle: '#312e81',    // Indigo
        bottom: '#1f2937',    // Dark gray
        ambient: '#1f2937',
        sunLight: '#6366f1'   // Soft indigo
      }

    case 'night':
      return {
        top: '#000000',       // Pure black (The Void)
        middle: '#1a1a3e',    // Very dark blue
        bottom: '#1f2937',    // Dark gray
        ambient: '#1f2937',
        sunLight: '#4f46e5'   // Deep purple
      }

    default:
      return {
        top: '#1a1a3e',
        middle: '#4a5568',
        bottom: '#1f2937',
        ambient: '#4a5568',
        sunLight: '#fbbf24'
      }
  }
}

/**
 * Get sun position based on prayer time
 * Returns elevation angle (-90 to 90 degrees)
 * -90 = below horizon (night), 0 = horizon (sunrise/sunset), 90 = zenith (noon)
 */
export function getSunElevation(prayerTimeInfo: PrayerTimeInfo): number {
  const { current, progress } = prayerTimeInfo

  switch (current) {
    case 'night':
      return -90 // Below horizon

    case 'fajr':
      // From -90 to -10 (approaching horizon)
      return -90 + (progress * 80)

    case 'sunrise':
      // From -10 to 30 (rising)
      return -10 + (progress * 40)

    case 'dhuhr':
      // From 30 to 90 to 60 (ascending to zenith then descending slightly)
      if (progress < 0.5) {
        return 30 + (progress * 2 * 60) // 30 to 90
      } else {
        return 90 - ((progress - 0.5) * 2 * 30) // 90 to 60
      }

    case 'asr':
      // From 60 to 20 (descending)
      return 60 - (progress * 40)

    case 'maghrib':
      // From 20 to -10 (setting)
      return 20 - (progress * 30)

    case 'isha':
      // From -10 to -90 (going below horizon)
      return -10 - (progress * 80)

    default:
      return 0
  }
}

/**
 * Get ambient light intensity based on prayer time
 * Returns value from 0 (darkest) to 1 (brightest)
 */
export function getAmbientIntensity(prayerTimeInfo: PrayerTimeInfo): number {
  const sunElevation = getSunElevation(prayerTimeInfo)

  // Map sun elevation to intensity
  // -90 to 0: 0.1 to 0.4 (night to sunrise)
  // 0 to 90: 0.4 to 1.0 (sunrise to noon)
  if (sunElevation < 0) {
    return 0.1 + (Math.max(-90, sunElevation) + 90) / 90 * 0.3
  } else {
    return 0.4 + (sunElevation / 90) * 0.6
  }
}
