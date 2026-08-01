const POSE_SRC = {
  wave: '/cora.png',
  thumbs: '/cora-thumbs.png',
  present: '/cora-present.png',
  think: '/cora-think.png',
  arms: '/cora-arms.png',
  wink: '/cora-wink.png',
}

export default function CoraRobot({ size = 200, pose = 'wave', className = '', shadow = true }) {
  return (
    <img
      src={POSE_SRC[pose] || POSE_SRC.wave}
      alt="Cora, your CARE Coach robot"
      width={size}
      style={{
        width: size,
        height: 'auto',
        filter: shadow ? 'drop-shadow(0 6px 14px rgba(42, 27, 138, 0.20))' : 'none',
      }}
      className={className}
      draggable={false}
    />
  )
}
