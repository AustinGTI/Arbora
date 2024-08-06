
/**
 * Generates a graph of notes where the key is the note_id and the value is an array of children note_ids.
 * this is done using the fact that note_ids are in the format a.b.c etc... where a.b is the parent of a.b.c
 * @param note_ids
 */
export function generateNotesGraph(note_ids: string[]): Map<string, string[]> {
    const graph = new Map<string, string[]>()
    note_ids.forEach(note_id => {
        // if there is no period in the note_id, it is a root note
        if (!graph.has(note_id)) {
            graph.set(note_id, [])
        }
        // the while loop is necessary for building full graphs even when
        // a filter has been applied to the note_ids and removed many potential parent notes
        while (note_id.includes('.')) {
            const parent = note_id.split('.').slice(0, -1).join('.')
            if (!graph.has(parent)) {
                graph.set(parent, [])
            }
            if (!graph.get(parent)!.includes(note_id)) {
                graph.get(parent)!.push(note_id)
            } else {
                break
            }
            note_id = parent
        }
    })

    return graph
}