import useGlobalHomeState from "./useGlobalHomeState.tsx";

export default function useActiveContent(): string | undefined {

    const {documents: {active_document, active_note}} = useGlobalHomeState()

    return active_note ? active_document?.notes[active_note].content : active_document?.content
}