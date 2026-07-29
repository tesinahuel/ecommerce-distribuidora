// Deterministic star positions (no hydration mismatch)
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: seededRand(i * 3.1) * 100,
  y: seededRand(i * 7.3) * 100,
  size: seededRand(i * 11.7) * 2 + 0.5,
  opacity: seededRand(i * 13.9) * 0.5 + 0.2,
  delay: seededRand(i * 17.2) * 4,
  duration: seededRand(i * 19.5) * 3 + 2,
}))

export default function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {STARS.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
