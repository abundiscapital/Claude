import { useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Send, ArrowLeft, Car } from 'lucide-react'
import { CONVERSATIONS } from '../../data/messages.js'
import './Messages.css'

export default function Messages() {
  const [convos, setConvos] = useState(CONVERSATIONS)
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id)
  const [draft, setDraft] = useState('')
  const [mobileThread, setMobileThread] = useState(false)

  const active = convos.find((c) => c.id === activeId)

  const openConvo = (id) => {
    setActiveId(id)
    setMobileThread(true)
    setConvos((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
  }

  const send = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setConvos((cs) =>
      cs.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: Date.now(), from: 'me', text, at: 'À l’instant' },
              ],
            }
          : c
      )
    )
    setDraft('')
  }

  return (
    <div className="container section">
      <h1 className="msg__pagetitle">Messagerie</h1>
      <div className={`msg ${mobileThread ? 'msg--thread' : ''}`}>
        {/* ---------- LISTE ---------- */}
        <aside className="msg__list" aria-label="Conversations">
          {convos.map((c) => (
            <button
              key={c.id}
              className={`msg__convo ${c.id === activeId ? 'is-active' : ''}`}
              onClick={() => openConvo(c.id)}
            >
              <span className={`msg__avatar msg__avatar--${c.accent}`} aria-hidden="true">
                {c.with.charAt(0)}
              </span>
              <span className="msg__convo-body">
                <span className="msg__convo-top">
                  <strong>{c.with}</strong>
                  {c.verified && <BadgeCheck size={14} className="msg__verified" aria-hidden="true" />}
                </span>
                <span className="msg__convo-car text-muted"><Car size={12} aria-hidden="true" /> {c.car}</span>
                <span className="msg__preview text-muted">
                  {c.messages[c.messages.length - 1].text}
                </span>
              </span>
              {c.unread > 0 && <span className="msg__badge" aria-label={`${c.unread} non lu`}>{c.unread}</span>}
            </button>
          ))}
        </aside>

        {/* ---------- FIL ---------- */}
        <section className="msg__thread" aria-label={`Conversation avec ${active.with}`}>
          <header className="msg__thread-head">
            <button className="msg__back" onClick={() => setMobileThread(false)} aria-label="Retour">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <span className={`msg__avatar msg__avatar--${active.accent}`} aria-hidden="true">
              {active.with.charAt(0)}
            </span>
            <div>
              <p className="msg__thread-name">
                {active.with}
                {active.verified && <BadgeCheck size={15} className="msg__verified" aria-hidden="true" />}
              </p>
              <p className="text-muted msg__thread-car">{active.car}</p>
            </div>
          </header>

          <div className="msg__feed">
            {active.messages.map((m) => (
              <motion.div
                key={m.id}
                className={`bubble bubble--${m.from}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p>{m.text}</p>
                <span className="bubble__time">{m.at}</span>
              </motion.div>
            ))}
          </div>

          <form className="msg__composer" onSubmit={send}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Écrire un message…"
              aria-label="Votre message"
            />
            <button type="submit" className="btn btn--primary msg__send" aria-label="Envoyer">
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
