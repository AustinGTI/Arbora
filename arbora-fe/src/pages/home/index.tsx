import {useNavigate} from "react-router-dom";
import {Box, HStack, VStack} from "@chakra-ui/react";
import ArboraLogo from "../../core/graphics/ArboraLogo.tsx";
import ArboraBanner from "../../core/graphics/ArboraBanner.tsx";
import PiButton from "../../pillars-ui/components/buttons/PiButton.tsx";
import {BiExit} from "react-icons/bi";
import {PiButtonVariant} from "../../pillars-ui/components/buttons/types.ts";
import {StandardConsole} from "../../core/helpers/logging.ts";
import useGlobalAuthState from "../../core/redux/auth/useGlobalAuthState.tsx";
import AllDocumentsSection from "./sections/documents";
import SingleDocumentSection from "./sections/single-document";
import React from "react";
import PiLinkButton from "../../pillars-ui/components/buttons/PiLinkButton.tsx";
import {Document} from "../../core/services/documents/types.ts";
import useDocuments from "../../core/services/documents/hooks/useDocuments.tsx";

interface ArboraHomePageContext {
    control: {
        single_doc_section_collapsed: boolean
        setSingleDocSectionCollapsed: (collapsed: boolean) => void
    },
    single_doc_section: {
        active_document: Document | null
        setActiveDocument: (document: Document | null) => void
    },
    all_documents_section: {
        all_documents: Document[]
        reloadDocuments: () => void
    }
}

export const ArboraHomePageContext = React.createContext<ArboraHomePageContext>({
    control: {
        single_doc_section_collapsed: false,
        setSingleDocSectionCollapsed: (_collapsed: boolean) => null
    },
    single_doc_section: {
        active_document: null,
        setActiveDocument: (_document: Document | null) => null
    },
    all_documents_section: {
        all_documents: [],
        reloadDocuments: () => null
    }
})

export default function ArboraHomePage() {
    const auth_data = useGlobalAuthState()

    const [single_doc_view_collapsed, setSingleDocViewCollapsed] = React.useState<boolean>(false)
    const [active_document, setActiveDocument] = React.useState<Document | null>(null)
    const {documents, documents_loading, reloadDocuments} = useDocuments()

    // when the documents update, check if the active document is still in the list and update it
    React.useEffect(() => {
        if (active_document) {
            const updated_active_document = documents.find((document) => document.id === active_document.id)
            if (!updated_active_document) {
                setActiveDocument(null)
            } else {
                setActiveDocument(updated_active_document)
            }
        }
    }, [documents])

    const context: ArboraHomePageContext = React.useMemo(() => {
        return {
            control: {
                single_doc_section_collapsed: single_doc_view_collapsed,
                setSingleDocSectionCollapsed: setSingleDocViewCollapsed
            },
            single_doc_section: {
                active_document,
                setActiveDocument
            },
            all_documents_section: {
                all_documents: documents,
                reloadDocuments
            }
        }
    }, [single_doc_view_collapsed, setSingleDocViewCollapsed, active_document, setActiveDocument, documents, reloadDocuments]);

    return (
        <ArboraHomePageContext.Provider value={context}>
            <Box position={'absolute'} top={0} left={0} bg={'green.300'} w={'100vw'} h={'100vh'} p={0} m={0}>
                <VStack w={'100%'} h={'100%'}>
                    <HStack w={'100%'} h={'100px'} align={'center'} justify={'space-between'} px={'1rem'}>
                        <Box w={'100px'}>
                            <ArboraLogo size={'50px'}/>
                        </Box>
                        <HStack pt={'1rem'}>
                            <ArboraBanner size={'70px'}/>
                        </HStack>
                        <HStack w={'100px'} justify={'flex-end'}>
                            <PiLinkButton
                                to={'/login'}
                                variant={PiButtonVariant.ICON}
                                icon={BiExit} icon_props={{fontSize: '40px'}}/>
                        </HStack>
                    </HStack>
                    {/*<Box w={'70%'} h={'70%'} marginTop={'5vh'} borderColor={'green.500'} borderWidth={'4px'}*/}
                    {/*     borderRadius={'1rem'} overflow={'hidden'}>*/}
                    {/*    <MarkdownEditor initial_content={''} updateContent={async (content) => {*/}
                    {/*        StandardConsole.log('current content in editor is ', content)*/}
                    {/*    }}/>*/}
                    {/*</Box>*/}
                    <HStack w={'100%'} h={'calc(100% - 100px)'}>
                        <AllDocumentsSection flex={1} h={'100%'}/>
                        <SingleDocumentSection h={'100%'}/>
                    </HStack>
                </VStack>
            </Box>
        </ArboraHomePageContext.Provider>
    )
}
