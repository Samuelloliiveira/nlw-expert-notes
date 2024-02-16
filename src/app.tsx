import { ChangeEvent, useState } from "react"
import { NoteCard } from "./components/note-card"
import { NewNoteCard } from "./components/new-note-card"

import logo from './assets/logo-nlw-expert.svg'

interface Note {
  id: string,
  date: Date,
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }

    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW expert" />
      <div className="flex items-center justify-center gap-4">
        <form className="w-full">
          <input
            className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-slate-500 md:text-3xl md:pb-3"
            type="text"
            placeholder="Busque em suas notas..."
            onChange={handleSearch}
          />
        </form>
        <NewNoteCard onNoteCreated={onNoteCreated} />
      </div>

      <div className="h-px bg-slate-700" />

      <div className="grid gap-6 grid-cols-1 auto-rows-[250px] md:grid-cols-2 lg:grid-cols-3 ">
        {filteredNotes.map(note => {
          return <NoteCard
            key={note.id}
            note={note}
            onNoteDeleted={onNoteDeleted}
          />
        })}
      </div>
    </div>
  )
}