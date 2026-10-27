import { useEffect, useState } from 'react'
import './App.css'

const noteColors = [
  { name: 'Yellow', value: '#fff3b0' },
  { name: 'Pink', value: '#ffdede' },
  { name: 'Green', value: '#dff3df' },
  { name: 'Blue', value: '#dceaff' },
]

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article
      className="note-card flex min-h-44 flex-col rounded-xl p-4 text-[#39362f] shadow"
      style={{ backgroundColor: note.color }}
    >
      <h2 className="mb-2 break-words text-lg font-semibold">
        {note.title || 'Untitled note'}
      </h2>
      <p className="flex-1 whitespace-pre-wrap break-words text-sm">{note.content}</p>
      <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
        <span className="text-xs">{new Date(note.date).toLocaleDateString()}</span>
        <div className="note-actions flex gap-2">
          <button
            className="rounded px-2 py-1 text-sm hover:bg-white/50"
            onClick={() => onEdit(note)}
            type="button"
          >
            Edit
          </button>
          <button
            className="rounded px-2 py-1 text-sm text-red-800 hover:bg-white/50"
            onClick={() => onDelete(note.id)}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('my-notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState(noteColors[0].value)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem('my-notes', JSON.stringify(notes))
  }, [notes])

  function clearForm() {
    setTitle('')
    setContent('')
    setColor(noteColors[0].value)
    setEditingId(null)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!content.trim()) {
      setError('Please write something in your note.')
      return
    }

    const note = {
      id: editingId || Date.now(),
      title: title.trim(),
      content: content.trim(),
      color,
      date: new Date().toISOString(),
    }

    if (editingId) {
      setNotes(notes.map((oldNote) => oldNote.id === editingId ? note : oldNote))
    } else {
      setNotes([note, ...notes])
    }

    clearForm()
  }

  function handleEdit(note) {
    setTitle(note.title)
    setContent(note.content)
    setColor(note.color)
    setEditingId(note.id)
    setError('')
  }

  function handleDelete(id) {
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter((note) => note.id !== id))
      if (editingId === id) clearForm()
    }
  }

  const shownNotes = notes.filter((note) =>
    `${note.title} ${note.content}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <main className="notes-app mx-auto min-h-screen max-w-4xl px-5 py-10">
      <header className="mb-8">
        <p className="notes-eyebrow">YOUR SPACE, YOUR THOUGHTS</p>
        <h1 className="text-3xl font-bold text-white">My Notes</h1>
        <p className="mt-2 text-slate-300">A simple place to save your thoughts.</p>
      </header>

      <form className="notes-form mb-8 rounded-xl bg-white p-5 shadow" onSubmit={handleSubmit}>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          {editingId ? 'Edit note' : 'Add a note'}
        </h2>
        <input
          className="notes-field mb-3 w-full rounded border border-slate-300 px-3 py-2"
          maxLength={100}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title (optional)"
          value={title}
        />
        <textarea
          className="notes-field mb-3 min-h-28 w-full rounded border border-slate-300 px-3 py-2"
          maxLength={2000}
          onChange={(event) => {
            setContent(event.target.value)
            setError('')
          }}
          placeholder="Write your note..."
          value={content}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            Note color
            <select
              className="notes-field rounded border border-slate-300 px-2 py-1"
              onChange={(event) => setColor(event.target.value)}
              value={color}
            >
              {noteColors.map((noteColor) => (
                <option key={noteColor.value} value={noteColor.value}>
                  {noteColor.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-red-600">{error}</span>}
            {editingId && (
              <button className="text-sm text-slate-600" onClick={clearForm} type="button">
                Cancel
              </button>
            )}
            <button className="rounded bg-yellow-300 px-4 py-2 font-medium text-slate-900 hover:bg-yellow-400" type="submit">
              {editingId ? 'Save changes' : 'Add note'}
            </button>
          </div>
        </div>
      </form>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">
            Saved notes <span className="notes-count">{shownNotes.length}</span>
          </h2>
          <input
            aria-label="Search notes"
            className="notes-search rounded border border-slate-300 bg-white px-3 py-2"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes"
            value={search}
          />
        </div>

        {shownNotes.length === 0 ? (
          <p className="rounded-xl bg-white/10 p-6 text-center text-slate-200">
            {search ? 'No notes found.' : 'No notes yet. Add your first note above.'}
          </p>
        ) : (
          <div className="note-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shownNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App