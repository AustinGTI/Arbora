import {Document} from "./types.ts";

export function generateNotesGraph(document: Document): Map<string, string[]> {
    const graph = new Map<string, string[]>()

    // note keys are of the format a.b.c etc.. parent is a.b etc...
    Object.keys(document.notes).forEach(note_id => {
        // if there is no period in the note_id, it is a root note
        if (!graph.has(note_id)) {
            graph.set(note_id, [])
        }
        if (note_id.includes('.')) {
            const parent = note_id.split('.').slice(0, -1).join('.')
            if (!graph.has(parent)) {
                graph.set(parent, [])
            }
            graph.get(parent)!.push(note_id)
        }
    })

    return graph
}