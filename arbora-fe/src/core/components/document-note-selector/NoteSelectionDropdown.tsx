import {Box, HStack, StackProps, VStack} from "@chakra-ui/react";
import {Note} from "../../services/documents/types.ts";
import React from "react";
import PiPlainText from "../../../pillars-ui/components/text/PiPlainText.tsx";
import {PiDropdownButtonContext} from "../../../pillars-ui/components/buttons/modal-buttons/PiDropdownButton.tsx";

interface NoteSelectionDropdownProps {
    notes: { [key: string]: Note }
    selected_note: string | null
    setSelectedNote: (note_id: string | null) => void
}

interface NoteSelectionDropdownContextProps {
    selection: {
        selected_note: string | null
        setSelectedNote: (note_id: string | null) => void
    },
    note_data: {
        notes: { [key: string]: Note }
        notes_graph: Map<string, string[]>
    }
}

const NoteSelectionDropdownContext = React.createContext<NoteSelectionDropdownContextProps>({
    selection: {
        selected_note: null,
        setSelectedNote: () => {
        }
    },
    note_data: {
        notes: {},
        notes_graph: new Map<string, string[]>()
    }
})

interface NotePaneProps extends StackProps {
    note_id: string
}


function NotePane({note_id, ...stack_props}: NotePaneProps) {
    const {
        note_data: {notes_graph, notes},
        selection: {selected_note, setSelectedNote}
    } = React.useContext(NoteSelectionDropdownContext)

    const {dropdown_controls: {closeDropdown}} = React.useContext(PiDropdownButtonContext)

    const pane_dropdown_ref = React.useRef<HTMLDivElement | null>(null);

    const [collapsed, setCollapsed] = React.useState<boolean>(false)

    const children: string[] = React.useMemo(() => {
        return notes_graph.has(note_id) ? notes_graph.get(note_id)! : []
    }, [notes_graph, note_id]);

    const onSelectNote = React.useCallback(() => {
        setSelectedNote(note_id)
        closeDropdown()
    }, [setSelectedNote, note_id, closeDropdown]);

    return (
        <VStack spacing={1} {...stack_props}>
            <HStack
                w={'100%'} p={'.2rem'} pb={0}
                bg={'white'} _hover={{bg: 'green.100'}}>
                <HStack flex={1} onClick={onSelectNote}>
                    <PiPlainText
                        value={notes[note_id].title}
                        textDecoration={selected_note === note_id ? 'underline' : 'none'}/>
                </HStack>
                {collapsed && (
                    <Box
                        w={'10px'} h={'10px'} bg={'green.300'}
                        rounded={'full'} _hover={{bg: 'green.500'}}
                        onClick={() => setCollapsed(false)}/>
                )}
            </HStack>
            {children.length ? (
                <HStack ref={pane_dropdown_ref} w={'100%'} h={'fit-content'} p={0} m={0} spacing={0}>
                    <VStack w={'1rem'} alignSelf={'stretch'} align={'center'}>
                        <Box
                            bg={'green.500'}
                            borderRadius={'2px'}
                            w={'5px'} h={'100%'} mx={'0.5rem'}
                            onClick={() => setCollapsed(true)}
                            _hover={{bg: 'green.300'}}
                        />
                    </VStack>
                    <VStack w={'calc(100% - 1rem)'} h={'fit-content'}
                            opacity={collapsed ? 0 : 1}
                            transition={'opacity 0.2s, height 0.2s ease-in-out;'}
                            display={collapsed ? 'none' : 'flex'}>
                        {children.map(child_id => (
                            <NotePane key={child_id} note_id={child_id} width={'100%'}/>
                        ))}
                    </VStack>
                </HStack>
            ) : null}
        </VStack>
    )
}

export default function NoteSelectionDropdown
({
     notes, selected_note, setSelectedNote
 }: NoteSelectionDropdownProps) {
    const notes_graph: Map<string, string[]> = React.useMemo(() => {
        const graph = new Map<string, string[]>()

        // note keys are of the format a.b.c etc.. parent is a.b etc...
        Object.keys(notes).forEach(note_id => {
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
    }, [notes]);

    const root_notes: string[] = React.useMemo(() => {
        return Array.from(notes_graph.keys()).filter(note_id => !note_id.includes('.'))
    }, [notes_graph]);

    const context: NoteSelectionDropdownContextProps = React.useMemo(() => {
        return {
            selection: {
                selected_note,
                setSelectedNote
            },
            note_data: {
                notes,
                notes_graph
            }
        }
    }, [selected_note, setSelectedNote, notes]);

    return (
        <NoteSelectionDropdownContext.Provider value={context}>
            <VStack w={'100%'} h={'100%'} overflow={'auto'} spacing={1}>
                {root_notes.map(note_id => (
                    <NotePane key={note_id} note_id={note_id} width={'100%'}/>
                ))}
            </VStack>
        </NoteSelectionDropdownContext.Provider>
    )
}