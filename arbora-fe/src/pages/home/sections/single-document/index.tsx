import React from 'react';
import {Box, BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import {PiButtonIcon, PiButtonVariant} from "../../../../pillars-ui/components/buttons/types.ts";
import PiButton from "../../../../pillars-ui/components/buttons/PiButton.tsx";
import {BsBodyText} from "react-icons/bs";
import useCollapse, {CollapseTimer} from "../../../../core/helpers/hooks/useCollapse.tsx";
import useGlobalHomeState from "../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {useDispatch} from "react-redux";
import {collapseDocumentView, DocumentViewTabKey, setActiveTab,} from "../../../../core/redux/home/home_slice.ts";
import DocumentViewEditorTab from "./tabs/editor";
import PiPlainText from "../../../../pillars-ui/components/text/PiPlainText.tsx";
import DocumentViewFlashCardsTab from "./tabs/flash-cards";
import DocumentViewQATab from "./tabs/qa";
import DocumentViewExplainTab from "./tabs/explain";

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
}

const DOCUMENT_VIEW_TABS: DocumentViewTab[] = [
    {key: DocumentViewTabKey.EDITOR, title: 'Editor', content: <DocumentViewEditorTab/>},
    {key: DocumentViewTabKey.FLASH_CARDS, title: 'Flash Cards', content: <DocumentViewFlashCardsTab/>},
    {key: DocumentViewTabKey.QA, title: 'Q&A', content: <DocumentViewQATab/>},
    {key: DocumentViewTabKey.EXPLAIN, title: 'Explain', content: <DocumentViewExplainTab/>},
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
                    icon={!collapse_state.get('button') ? PiButtonIcon.CLOSE : BsBodyText}
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
            position={'relative'}
            bg={'rgba(255, 0, 0, 0.2)'}
            w={!collapse_state.get('width') ? w ?? width ?? '50vw' : 'calc(32px + 2rem)'}
            transition={'width 0.5s'}
            {...box_props}>
            {collapse_button}
            <VStack
                opacity={collapse_state.get('content-opacity') ? 0 : 1}
                display={collapse_state.get('content-display') ? 'none' : 'flex'}
                transition={'opacity 0.2s'}
                w={'100%'} h={'100%'} overflow={'hidden'}>
                <HStack w={'100%'}>
                    {
                        DOCUMENT_VIEW_TABS.map(tab => {
                            return (
                                <Center key={tab.key} py={'1rem'} px={'2rem'} cursor={'pointer'}
                                        onClick={() => {
                                            dispatch(setActiveTab(tab.key))
                                        }}>
                                    <PiPlainText
                                        value={tab.title}
                                        fontSize={active_tab === tab.key ? '20px' : '16px'}
                                        color={active_tab === tab.key ? 'black' : 'gray'}/>
                                </Center>
                            )
                        })
                    }
                </HStack>

                <Box w={'100%'} h={'calc(100% - 2rem)'} overflow={'auto'}>
                    {DOCUMENT_VIEW_TABS.find(tab => tab.key === active_tab)?.content}
                </Box>
            </VStack>
        </Box>
    )
}