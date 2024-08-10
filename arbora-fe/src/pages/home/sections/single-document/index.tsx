import React, {MemoExoticComponent} from 'react';
import {Box, BoxProps, Center, HStack, Tooltip, VStack} from "@chakra-ui/react";
import {PiButtonIcon, PiButtonVariant} from "../../../../pillars-ui/components/buttons/types.ts";
import PiButton from "../../../../pillars-ui/components/buttons/PiButton.tsx";
import useCollapse, {CollapseTimer} from "../../../../core/helpers/hooks/useCollapse.tsx";
import useGlobalHomeState from "../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {useDispatch} from "react-redux";
import {
    collapseDocumentView,
    DocumentViewTabKey,
    setActiveTab,
    setCanvasInteractivity,
} from "../../../../core/redux/home/home_slice.ts";
import DocumentViewEditorTab from "./tabs/editor";
import PiPlainText from "../../../../pillars-ui/components/text/PiPlainText.tsx";
import DocumentViewFlashCardsTab from "./tabs/flash-cards";
import DocumentViewQuizTab from "./tabs/quiz";
import DocumentViewExplainTab from "./tabs/explain";
import {ARBORA_GREEN} from "../../../../core/constants/styling.ts";
import {MdOutlineTextSnippet} from "react-icons/md";
// @ts-ignore
import ChatIcon from "../../../../assets/ai/AIChatAction.svg?react"
// @ts-ignore
import QuizIcon from "../../../../assets/ai/AIQuizAction.svg?react"
// @ts-ignore
import FlashCardsIcon from "../../../../assets/ai/AIFlashCardsActionV2.svg?react"
// @ts-ignore
import DocumentIcon from "../../../../assets/ai/Document.svg?react"
import {Note} from "../../../../core/services/documents/types.ts";
import {recallProbabilityToColor} from "../../../../core/tree-rendering/helpers/color.ts";


interface SingleDocumentSectionProps extends BoxProps {
}

const DOCUMENT_VIEW_COLLAPSE_TIMERS: CollapseTimer[] = [
    {key: 'button', collapse_delay: 1000, expand_delay: 0},
    {key: 'width', expand_delay: 0, collapse_delay: 500},
    {key: 'content-opacity', expand_delay: 500, collapse_delay: 0},
    {key: 'content-display', expand_delay: 400, collapse_delay: 100},
]

interface DocumentViewTab {
    key: DocumentViewTabKey,
    title: string,
    content: MemoExoticComponent<() => React.ReactElement>
    icon: any
}

const DOCUMENT_VIEW_TABS: DocumentViewTab[] = [
    {
        key: DocumentViewTabKey.EDITOR,
        title: 'Document',
        // content: <DocumentViewEditorTab/>,
        content: React.memo(DocumentViewEditorTab),
        icon: DocumentIcon
    },
    {
        key: DocumentViewTabKey.FLASH_CARDS,
        title: 'Flash Cards',
        content: React.memo(DocumentViewFlashCardsTab),
        icon: FlashCardsIcon
    },
    {
        key: DocumentViewTabKey.QA,
        title: 'Quiz',
        // content: <DocumentViewQuizTab/>,
        content: React.memo(DocumentViewQuizTab),
        icon: QuizIcon
    },
    {
        key: DocumentViewTabKey.EXPLAIN,
        title: 'Explain',
        // content: <DocumentViewExplainTab/>,
        content: React.memo(DocumentViewExplainTab),
        icon: ChatIcon
    },
]

interface NoteRecallProbabilityViewProps {
    note_id: string
    note: Note
}

function NoteRecallProbabilityView({note_id, note}: NoteRecallProbabilityViewProps) {
    const [prob, color] = React.useMemo(() => {
        // the probability should be 3 characters, . then 2 decimal values
        const prob = '.' + note.recall_probability.toFixed(2).split('.')[1]

        const color = recallProbabilityToColor(note.recall_probability, note_id)
        return [prob, color]
    }, [note.recall_probability, note_id]);

    return (
        <Tooltip label={`
                    Recall : The estimated probability you remember the information in this note based on your flash-card reviews, quizzes taken and chats with Arby
                            `} placement={'bottom-end'}>
            <HStack cursor={'pointer'} flex={1} justify={'flex-end'} pr={'2.5rem'} pb={'7px'}>
                <Box h={'22px'} aspectRatio={1} rounded={'7px'} bg={color}/>
                <PiPlainText value={prob} fontSize={'22px'}
                             fontWeight={700} color={'black'}/>
            </HStack>
        </Tooltip>
    )
}

export default function DocumentViewSection({w, width, ...box_props}: SingleDocumentSectionProps) {
    const document_view_box_ref = React.useRef<HTMLDivElement | null>(null);

    const {
        documents: {active_document, active_note: active_note_id},
        document_view: {collapsed, active_tab},
    } = useGlobalHomeState()
    const dispatch = useDispatch()

    const collapse_state = useCollapse(collapsed, DOCUMENT_VIEW_COLLAPSE_TIMERS)
    const collapse_button = React.useMemo(() => {
        return (
            <Box zIndex={200} p={'1rem'} position={'absolute'}
                 right={0} top={0}>
                <PiButton
                    variant={PiButtonVariant.ICON}
                    icon={!collapse_state.get('button') ? PiButtonIcon.CLOSE : MdOutlineTextSnippet}
                    icon_props={{fontSize: '30px'}}
                    onClick={() => {
                        dispatch(collapseDocumentView(!collapsed))
                    }}
                />
            </Box>
        )
    }, [collapse_state, dispatch, collapsed]);


    const tabs: DocumentViewTab[] = React.useMemo(() => {
        if (collapse_state.get('content-display')) {
            return []
        } else {
            return DOCUMENT_VIEW_TABS
        }
    }, [collapse_state]);

    const active_note: Note | null = React.useMemo(() => {
        if (!active_note_id) return null
        return active_document?.notes[active_note_id] ?? null
    }, [active_document?.notes, active_note_id]);

    React.useEffect(() => {
        if (!document_view_box_ref.current) {
            return
        }

        const handleMouseEnter = () => {
            dispatch(setCanvasInteractivity(false))
        }
        const handleMouseLeave = () => {
            dispatch(setCanvasInteractivity(true))
        }

        document_view_box_ref.current.addEventListener('mouseenter', handleMouseEnter)
        document_view_box_ref.current.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            document_view_box_ref.current?.removeEventListener('mouseenter', handleMouseEnter)
            document_view_box_ref.current?.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, []);

    return (
        <Box
            ref={document_view_box_ref}
            position={'absolute'}
            top={0}
            right={0}
            bg={ARBORA_GREEN.fg}
            rounded={'1rem'}
            mr={'1rem'}
            w={!collapse_state.get('width') ? w ?? width ?? '50vw' : 'calc(32px + 2rem)'}
            transition={'width 0.5s'}
            {...box_props}>
            {collapse_button}
            <VStack
                opacity={collapse_state.get('content-opacity') ? 0 : 1}
                display={collapse_state.get('content-display') ? 'none' : 'flex'}
                transition={'opacity 0.2s ease-in-out'}
                w={'100%'} h={'100%'} overflow={'hidden'}>
                <HStack w={'100%'} px={'1rem'} h={'70px'}>
                    {
                        tabs.map(({key, title, icon: Icon}) => {
                            const is_active_tab = key === active_tab
                            const icon_size = is_active_tab ? '30px' : '20px'
                            return (
                                <Center key={key} py={'1rem'} px={'0.5rem'} cursor={'pointer'}
                                        onClick={() => {
                                            dispatch(setActiveTab(key))
                                        }}>
                                    <HStack>
                                        <Icon style={{
                                            width: icon_size,
                                            height: icon_size,
                                            fill: is_active_tab ? 'black' : ARBORA_GREEN.hard
                                        }}/>
                                        <PiPlainText
                                            value={title}
                                            fontSize={active_tab === key ? '24px' : '20px'}
                                            fontWeight={active_tab === key ? 700 : 500}
                                            transition={'font-size 0.3s, font-weight 0.3s,color 0.3s'}
                                            _hover={{
                                                color: 'black'
                                            }}
                                            color={active_tab === key ? 'black' : ARBORA_GREEN.hard}/>
                                    </HStack>
                                </Center>
                            )
                        })
                    }
                    {active_note && (
                        <NoteRecallProbabilityView note_id={active_note_id!} note={active_note}/>
                    )}
                </HStack>

                <Box w={'100%'} h={'calc(100% - 70px)'} overflow={'auto'}>
                    {/*{DOCUMENT_VIEW_TABS.find(tab => tab.key === active_tab)?.content}*/}
                    {DOCUMENT_VIEW_TABS.map(({key, content: TabContent}) => (
                        <Box
                            h={'100%'} w={'100%'}
                            key={key} display={key === active_tab ? 'block' : 'none'}>
                            <TabContent/>
                        </Box>
                    ))}
                </Box>
            </VStack>
        </Box>
    )
}