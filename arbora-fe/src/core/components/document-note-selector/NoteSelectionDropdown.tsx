import {Box, HStack, StackProps, VStack} from "@chakra-ui/react";
import {Document, Note} from "../../services/documents/types.ts";
import React from "react";
import PiPlainText from "../../../pillars-ui/components/text/PiPlainText.tsx";
import {PiDropdownButtonContext} from "../../../pillars-ui/components/buttons/modal-buttons/PiDropdownButton.tsx";
import {ARBORA_GREEN} from "../../constants/styling.ts";
import {generateNotesGraph} from "../../services/documents/helpers.ts";
import PiButton from "../../../pillars-ui/components/buttons/PiButton.tsx";
import {PiButtonIcon, PiButtonVariant} from "../../../pillars-ui/components/buttons/types.ts";
import {BsArrowsCollapse} from "react-icons/bs";
import {MdExpand} from "react-icons/md";
import PiSearchBar from "../../../pillars-ui/components/data_views/helper_components/search-bar/PiSearchBar.tsx";

interface NoteSelectionDropdownProps {
    document: Document
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
    },
    dropdown_ui: {
        all_collapsed: boolean
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
    },
    dropdown_ui: {
        all_collapsed: false
    }
})

interface NotePaneProps extends StackProps {
    note_id: string
}


function NotePane({note_id, ...stack_props}: NotePaneProps) {
    const {
        note_data: {notes_graph, notes},
        selection: {selected_note, setSelectedNote},
        dropdown_ui: {all_collapsed}
    } = React.useContext(NoteSelectionDropdownContext)

    const {dropdown_controls: {closeDropdown}} = React.useContext(PiDropdownButtonContext)

    const pane_dropdown_ref = React.useRef<HTMLDivElement | null>(null);

    const [collapsed, setCollapsed] = React.useState<boolean>(false)

    React.useEffect(() => {
        setCollapsed(all_collapsed)
    }, [all_collapsed]);
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
                bg={'white'} _hover={{bg: ARBORA_GREEN.soft}} rounded={'full'}>
                <HStack cursor={'pointer'} flex={1} onClick={onSelectNote}>
                    <PiPlainText
                        align={'left'}
                        value={notes[note_id]?.title ?? note_id}
                        fontWeight={selected_note === note_id ? 700 : 400}
                        color={selected_note === note_id ? ARBORA_GREEN.hard : 'black'}/>
                </HStack>
                <PiButton
                    icon={collapsed ? PiButtonIcon.DOWN : PiButtonIcon.UP}
                    variant={PiButtonVariant.ICON}
                    icon_props={{
                        fontSize: '1rem'
                    }}
                    onClick={() => setCollapsed(!collapsed)}/>
            </HStack>
            {children.length ? (
                <HStack ref={pane_dropdown_ref} w={'100%'} h={'fit-content'} p={0} m={0} spacing={0}>
                    <VStack w={'1rem'} alignSelf={'stretch'} align={'center'}>
                        <Box
                            bg={ARBORA_GREEN.hard}
                            borderRadius={'2px'}
                            w={'5px'} h={'100%'} mx={'0.5rem'}
                            onClick={() => setCollapsed(true)}
                            _hover={{bg: ARBORA_GREEN.mid}}
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
     document, selected_note, setSelectedNote
 }: NoteSelectionDropdownProps) {
    const [search_query, setSearchQuery] = React.useState<string>('')
    const [all_collapsed, setAllCollapsed] = React.useState<boolean>(false)

    const notes_graph: Map<string, string[]> = React.useMemo(() => {
        const visible_note_ids = Object.keys(document.notes).filter(note_id => {
            return !search_query || (document.notes[note_id].title ?? note_id).toLowerCase().includes(search_query.toLowerCase())
        })
        return generateNotesGraph(visible_note_ids)
    }, [document.notes, search_query]);

    const root_notes: string[] = React.useMemo(() => {
        const root_notes: Set<string> = new Set<string>(notes_graph.keys())
        notes_graph.forEach((children) => {
            children.forEach(child => {
                root_notes.delete(child)
            })
        })
        return Array.from(root_notes)
    }, [notes_graph]);

    const context: NoteSelectionDropdownContextProps = React.useMemo(() => {
        return {
            selection: {
                selected_note,
                setSelectedNote
            },
            note_data: {
                notes: document.notes,
                notes_graph
            },
            dropdown_ui: {
                all_collapsed
            }
        }
    }, [selected_note, setSelectedNote, document.notes, notes_graph, all_collapsed]);

    return (
        <NoteSelectionDropdownContext.Provider value={context}>
            <VStack w={'100%'} h={'100%'}>
                <HStack w={'100%'} h={'25px'} justify={'flex-end'} spacing={0}>
                    <HStack flex={1}>
                        <PiSearchBar placeholder={'Search Notes...'} onSearch={(curr_search_query) => {
                            setSearchQuery(curr_search_query)
                        }}/>
                    </HStack>
                    <PiButton
                        icon={BsArrowsCollapse}
                        variant={PiButtonVariant.ICON}
                        with_tooltip
                        tooltip_label={'Collapse All'}
                        icon_props={{fontSize: '1.5rem'}}
                        onClick={() => setAllCollapsed(true)}/>
                    <PiButton
                        icon={MdExpand}
                        variant={PiButtonVariant.ICON}
                        with_tooltip
                        tooltip_label={'Expand All'}
                        icon_props={{fontSize: '1.5rem'}}
                        onClick={() => setAllCollapsed(false)}/>
                </HStack>
                <VStack
                    className={'document-note-selector-dropdown'}
                    w={'100%'} h={'calc(100% - 25px)'} overflow={'auto'} spacing={1} maxH={'40vh'}>
                    {root_notes.map(note_id => (
                        <NotePane key={note_id} note_id={note_id} width={'100%'}/>
                    ))}
                </VStack>
            </VStack>
        </NoteSelectionDropdownContext.Provider>
    )
}