import { ChangeEvent, FormEvent, useState } from "react"
import * as Dialog from '@radix-ui/react-dialog'
import { CircleIcon, Plus, X } from "lucide-react"
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnBoarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === "") {
      setShouldShowOnBoarding(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content === '') {
      return
    }

    onNoteCreated(content)

    setContent('')
    setShouldShowOnBoarding(true)

    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording() {
    setIsRecording(true)

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a API de gravação!')
      return
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.log(event)
    }

    speechRecognition.start()
    setShouldShowOnBoarding(false)
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="p-3 rounded-full text-left bg-slate-700 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 md:hover:w-48 md:flex md:items-center md:justify-center md:gap-2 group">
        <p className="text-sm font-medium text-slate-200 hidden md:group-hover:flex">
          Adicionar nota
        </p>
        <Plus size={20} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute top-0 right-0 p-5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300 text-center">
                Adicionar nota
              </span>
              {shouldShowOnBoarding ? (
                <>
                  <p className="text-sm leading-6 text-slate-400">Escolha uma das opções:</p>

                  <div className="flex flex-col items-baseline top-8 gap-2">
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="font-medium text-sm text-lime-400 hover:underline"
                    >
                      <li>Gravar uma nota usando áudio</li>
                    </button>
                    <button
                      type="button"
                      onClick={handleStartEditor}
                      className="font-medium text-sm text-lime-400 hover:underline"
                    >
                      <li> Utilizar apenas texto</li>
                    </button>
                  </div>
                </>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            {shouldShowOnBoarding && (
              <p className="text-sm p-5 leading-6 text-slate-400">
                Grave uma nota em áudio que será convertida para texto automaticamente.
              </p>
            )}

            {isRecording ? (
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                onClick={handleStopRecording}
              >
                <CircleIcon size="15" strokeWidth="0" className="fill-red-500 animate-pulse" />
                Gravando! (clique p/ interroper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  )
}