export default function CoraRobot({ size = 200, className = '' }) {
  return (
    <img
      src="/cora.png"
      alt="Cora, your CARE Coach robot"
      width={size}
      style={{
        width: size,
        height: 'auto',
        filter: 'drop-shadow(0 6px 14px rgba(42, 27, 138, 0.20))',
      }}
      className={className}
      draggable={false}
    />
  )
}
