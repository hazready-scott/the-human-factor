export default function GradientOrb({ accentColor }: { accentColor?: string }) {
  const color = accentColor || '#06b6d4'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          top: '10%',
          right: '-5%',
          animation: 'orbFloat1 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          bottom: '15%',
          left: '-3%',
          animation: 'orbFloat2 25s ease-in-out infinite',
        }}
      />
    </div>
  )
}
