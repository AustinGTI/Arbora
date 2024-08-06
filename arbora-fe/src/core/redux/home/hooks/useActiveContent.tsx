import useGlobalHomeState from "./useGlobalHomeState.tsx";
import {generateNotesGraph} from "../../../services/documents/helpers.ts";
import {StandardConsole} from "../../../helpers/logging.ts";

export default function useActiveContent(): string | undefined {

    const {documents: {active_document, active_note}} = useGlobalHomeState()

    if (!active_document) {
        StandardConsole.warn('No active document to get content from')
        return undefined
    }

    if (!active_note) {
        StandardConsole.warn('No active note to get content from, passing in the whole document content')
        return active_document.content
    }

    // recursively iterate through the children of the active document to get the content of the active note
    const note_graph = generateNotesGraph(Object.keys(active_document.notes))

    function getNoteContent(note_id: string): string {
        let content = active_document!.notes[note_id].content
        note_graph.get(note_id)!.forEach(child_id => {
            content += getNoteContent(child_id)
        })
        return content
    }

    return getNoteContent(active_note)
}