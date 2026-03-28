export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No Header/Footer for presentations — full viewport
  return <>{children}</>
}
