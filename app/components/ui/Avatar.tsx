export default function Avatar({
  name,
  src,
  size = 64,
}: {
  name: string
  src?: string | null
  size?: number
}) {
  const initial = name?.charAt(0)?.toUpperCase() || 'F'

  return (
    <div
      className="avatarWrap"
      style={{ width: size, height: size, borderRadius: Math.round(size / 3) }}
    >
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <span>{initial}</span>
      )}

      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .avatarWrap {
    flex: 0 0 auto;
    overflow: hidden;
    background: #f1e8ff;
    color: #6d28d9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 950;
    font-size: 24px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`