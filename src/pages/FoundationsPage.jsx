import { useParams, Link } from 'react-router-dom'
import { useFoundationsProgress } from '../hooks/useFoundationsProgress'
import { FOUNDATIONS_CONTENT } from '../data/foundationsContent'
import NoteReadingModule from '../components/noteReading/NoteReadingModule'
import EmbouchureModule from '../components/embouchure/EmbouchureModule'
import TonguingModule from '../components/tonguing/TonguingModule'
import FirstNotesModule from '../components/firstNotes/FirstNotesModule'

function FoundationsHub() {
  const { completedModules } = useFoundationsProgress()
  const { modules } = FOUNDATIONS_CONTENT

  const anyComplete =
    completedModules.noteReading ||
    completedModules.embouchure ||
    completedModules.tonguing ||
    completedModules.firstNotes

  const isComplete = (key) => completedModules[key]

  return (
    <div
      style={{
        background: '#FAF4EE',
        minHeight: '100dvh',
        padding: '24px 16px',
        paddingBottom: 'calc(96px + env(safe-area-inset-bottom))',
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: '36px',
            color: '#2D2D2D',
            marginBottom: '8px',
            marginTop: 0,
          }}
        >
          Before You Play
        </h1>
        <p
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 400,
            fontSize: '18px',
            color: '#666666',
            marginBottom: '32px',
            marginTop: 0,
          }}
        >
          Three quick lessons. About 15 minutes. You'll be ready to play.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {modules.map((mod) => {
            const complete = isComplete(mod.key)

            const cardContent = (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                {/* Emoji circle */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    minWidth: '48px',
                    borderRadius: '50%',
                    background: '#FFF8EE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}
                >
                  {mod.emoji}
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 700,
                      fontSize: '18px',
                      color: '#2D2D2D',
                      marginBottom: '2px',
                    }}
                  >
                    {mod.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      color: '#666666',
                      marginBottom: '2px',
                    }}
                  >
                    {mod.subtitle}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '14px',
                      color: '#999999',
                    }}
                  >
                    ~{mod.estimatedMinutes} min
                  </div>
                </div>

                {/* Status */}
                <div>
                  {complete ? (
                    <span
                      style={{
                        background: '#4CAF50',
                        color: '#FFFFFF',
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '999px',
                        padding: '4px 10px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Done ✓
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '22px',
                        color: '#006EE9',
                        fontWeight: 700,
                      }}
                    >
                      ›
                    </span>
                  )}
                </div>
              </div>
            )

            return (
              <Link
                key={mod.key}
                to={mod.route}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  padding: '20px 24px',
                }}
              >
                {cardContent}
              </Link>
            )
          })}
        </div>

        {anyComplete && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '32px',
            }}
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center py-4 px-5 rounded-lg text-sm font-semibold text-[#006EE9] bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors"
              style={{ fontFamily: 'Nunito, sans-serif', minHeight: 56 }}
            >
              Skip to Level 1 →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FoundationsPage() {
  const { module } = useParams()

  if (!module) {
    return <FoundationsHub />
  }

  if (module === 'noteReading') {
    return <NoteReadingModule />
  }

  if (module === 'embouchure') {
    return <EmbouchureModule />
  }

  if (module === 'tonguing') {
    return <TonguingModule />
  }

  if (module === 'firstNotes') {
    return <FirstNotesModule />
  }

  return <FoundationsHub />
}
