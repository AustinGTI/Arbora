import React from 'react';
import {Box, BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import {PiButtonIcon, PiButtonVariant} from "../../../../pillars-ui/components/buttons/types.ts";
import PiButton from "../../../../pillars-ui/components/buttons/PiButton.tsx";
import useCollapse, {CollapseTimer} from "../../../../core/helpers/hooks/useCollapse.tsx";
import useGlobalHomeState from "../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {useDispatch} from "react-redux";
import {collapseDocumentView, DocumentViewTabKey, setActiveTab,} from "../../../../core/redux/home/home_slice.ts";
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
import FlashCardsIcon from "../../../../assets/ai/AIFlashCardsAction.svg?react"
// @ts-ignore
import DocumentIcon from "../../../../assets/ai/Document.svg?react"


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
    content: React.ReactElement
    icon: any
}

const DOCUMENT_VIEW_TABS: DocumentViewTab[] = [
    {key: DocumentViewTabKey.EDITOR, title: 'Document', content: <DocumentViewEditorTab/>, icon: DocumentIcon},
    {
        key: DocumentViewTabKey.FLASH_CARDS,
        title: 'Flash Cards',
        content: <DocumentViewFlashCardsTab/>,
        icon: FlashCardsIcon
    },
    {key: DocumentViewTabKey.QA, title: 'Quiz', content: <DocumentViewQuizTab/>, icon: QuizIcon},
    {key: DocumentViewTabKey.EXPLAIN, title: 'Explain', content: <DocumentViewExplainTab/>, icon: ChatIcon},
]

export default function DocumentViewSection({w, width, ...box_props}: SingleDocumentSectionProps) {
    const {
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

    return (
        <Box
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
                transition={'opacity 0.2s'}
                w={'100%'} h={'100%'} overflow={'hidden'}>
                <HStack w={'100%'} px={'1rem'} h={'70px'}>
                    {
                        DOCUMENT_VIEW_TABS.map(({key, title, icon: Icon}) => {
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
                </HStack>

                <Box w={'100%'} h={'calc(100% - 70px)'} overflow={'auto'}>
                    {DOCUMENT_VIEW_TABS.find(tab => tab.key === active_tab)?.content}
                </Box>
            </VStack>
        </Box>
    )
}