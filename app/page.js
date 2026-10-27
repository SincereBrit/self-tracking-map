'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const TrackingMap = dynamic(() => import('@/components/TrackingMap'), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      Loading map...
    </div>
  ),
});

const STORAGE_KEY = 'self-tracking-sessions';

const formatDuration = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
};

const calculateDistance = (pointA, pointB) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(pointB.lat - pointA.lat);
  const dLng = toRadians(pointB.lng - pointA.lng);

  const lat1 = toRadians(pointA.lat);
  const lat2 = toRadians(pointB.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 1000;
};

const calculateStats = (points) => {
  if (points.length < 2) {
    return {
      distanceMeters: 0,
      durationMs: 0,
      avgSpeedKmh: 0,
      maxSpeedKmh: 0,
    };
  }

  let distanceMeters = 0;
  let maxSpeedKmh = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previousPoint = points[index - 1];
    const currentPoint = points[index];
    const segmentDistance = calculateDistance(previousPoint, currentPoint);
    distanceMeters += segmentDistance;

    const timeDeltaMs = currentPoint.timestamp - previousPoint.timestamp;
    if (timeDeltaMs > 0) {
      const speedKmh = ((segmentDistance / 1000) / (timeDeltaMs / 3600000)) || 0;
      maxSpeedKmh = Math.max(maxSpeedKmh, speedKmh);
    }
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const durationMs = Math.max(0, lastPoint.timestamp - firstPoint.timestamp);
  const avgSpeedKmh = durationMs > 0 ? (distanceMeters / 1000 / (durationMs / 3600000)) : 0;

  return {
    distanceMeters,
    durationMs,
    avgSpeedKmh,
    maxSpeedKmh,
  };
};

export default function HomePage() {
  const [isTracking, setIsTracking] = useState(false);
  const [status, setStatus] = useState('Ready to track');
  const [position, setPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [watchId, setWatchId] = useState(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setSessions(savedSessions);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by this browser.');
      return;
    }

    const newWatchId = navigator.geolocation.watchPosition(
      (geoPosition) => {
        const timestamp = Date.now();
        const nextPoint = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
          accuracy: geoPosition.coords.accuracy,
          speed: geoPosition.coords.speed || 0,
          timestamp,
        };

        setPosition(nextPoint);
        setRoute((previousRoute) => {
          const nextRoute = [...previousRoute, nextPoint];
          return nextRoute;
        });
      },
      () => {
        setStatus('Location access was denied. Please allow location permissions.');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 15000,
      }
    );

    setWatchId(newWatchId);
    setIsTracking(true);
    setStatus('Tracking in progress');
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    if (route.length === 0) {
      setIsTracking(false);
      setStatus('No tracking data captured');
      return;
    }

    const stats = calculateStats(route);
    const session = {
      id: Date.now(),
      startedAt: route[0].timestamp,
      endedAt: route[route.length - 1].timestamp,
      points: route,
      ...stats,
    };

    setSessions((previousSessions) => [session, ...previousSessions]);
    setIsTracking(false);
    setStatus('Tracking saved');
    setRoute([]);
    setPosition(null);
  };

  const resetTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    setIsTracking(false);
    setRoute([]);
    setPosition(null);
    setStatus('Ready to track');
  };

  const activeStats = useMemo(() => calculateStats(route), [route]);

  const latestPosition = position || route[route.length - 1] || null;

  return (
    <main className="page-shell">
      <div className="page-container">
        <header className="topbar">
          <div>
            <span className="eyebrow">Self tracking</span>
            <h1>RouteTracker</h1>
          </div>
          <div className={`status-pill ${isTracking ? 'live' : ''}`}>
            {isTracking ? 'Live' : 'Idle'}
          </div>
        </header>

        <section className="hero-panel">
          <div className="hero-copy">
            <p className="status-text">{status}</p>
            <div className="controls">
              <button className="primary-button" onClick={startTracking} disabled={isTracking}>
                Start tracking
              </button>
              <button className="secondary-button" onClick={stopTracking} disabled={!isTracking}>
                Stop tracking
              </button>
              <button className="ghost-button" onClick={resetTracking}>
                Reset
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Distance</span>
              <strong>{(activeStats.distanceMeters / 1000).toFixed(2)} km</strong>
            </div>
            <div className="stat-card">
              <span>Duration</span>
              <strong>{formatDuration(activeStats.durationMs)}</strong>
            </div>
            <div className="stat-card">
              <span>Avg speed</span>
              <strong>{activeStats.avgSpeedKmh.toFixed(1)} km/h</strong>
            </div>
            <div className="stat-card">
              <span>Points</span>
              <strong>{route.length}</strong>
            </div>
          </div>
        </section>

        <section className="map-panel">
          <TrackingMap route={route} latestPosition={latestPosition} />
        </section>

        <section className="sessions-panel">
          <div className="section-header">
            <h2>Recent sessions</h2>
          </div>

          {sessions.length === 0 ? (
            <div className="empty-state">No saved sessions yet. Start a route to create your first trip.</div>
          ) : (
            <div className="session-list">
              {sessions.slice(0, 5).map((session) => (
                <article key={session.id} className="session-card">
                  <div>
                    <p className="session-date">
                      {new Date(session.startedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <h3>{(session.distanceMeters / 1000).toFixed(2)} km route</h3>
                  </div>
                  <div className="session-meta">
                    <span>{formatDuration(session.durationMs)}</span>
                    <span>{session.avgSpeedKmh.toFixed(1)} km/h avg</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
