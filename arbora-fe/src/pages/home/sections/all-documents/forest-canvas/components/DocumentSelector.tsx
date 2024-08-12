import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {Box, Center, CenterProps, HStack, VStack} from "@chakra-ui/react";
import {useDispatch} from "react-redux";
import {Document} from "../../../../../../core/services/documents/types.ts";
import PiPlainText from "../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import {
    collapseDocumentView,
    setActiveDocument,
    setCanvasInteractivity
} from "../../../../../../core/redux/home/home_slice.ts";
import {ARBORA_GREEN} from "../../../../../../core/constants/styling.ts";
import {MdClose} from "react-icons/md";
import React from "react";
import {AnimatePresence, motion} from "framer-motion";

interface DocumentPaneProps extends CenterProps {
    document: Document
}

function DocumentPane({document, ...center_props}: DocumentPaneProps) {
    const dispatch = useDispatch()

    return (
        <HStack
            _hover={{opacity: 0.7}}
            onClick={() => {
                dispatch(setActiveDocument(document))
                dispatch(collapseDocumentView(false))
            }} cursor={'pointer'}
            w={'100%'} h={'100%'} p={'.7rem'} {...center_props}>
            <Box w={'6px'} h={'6px'} rounded={'full'} bg={ARBORA_GREEN.hard}/>
            <PiPlainText align={'left'} fontSize={'14px'} fontWeight={500} value={document.title}/>
        </HStack>
    )
}

function DropdownContent() {
    const {documents: {documents}} = useGlobalHomeState()

    return (
        <VStack className={'arbora-selector-scrollbar'} w={'100%'} maxH={'50vh'}
                overflowY={'scroll'}
                overflowX={'hidden'}>
            {documents.map((document) => (
                <DocumentPane key={document.id} document={document}/>
            ))}
        </VStack>
    )
}

export default function DocumentSelector() {
    const selector_ref = React.useRef<HTMLDivElement | null>(null);
    const [dropdown_open, setDropdownOpen] = React.useState<boolean>(false)
    const {documents: {active_document, active_note, documents}} = useGlobalHomeState()

    console.log('active document is ', active_document, 'active note is ', active_note)

    const dispatch = useDispatch()

    // open dropdown on mouse enter, close on leave
    React.useEffect(() => {
        if (!selector_ref.current) {
            return
        }

        const handleMouseEnter = () => {
            setDropdownOpen(true)
            dispatch(setCanvasInteractivity(false))
        }
        const handleMouseLeave = () => {
            setDropdownOpen(false)
            dispatch(setCanvasInteractivity(true))
        }
        selector_ref.current.addEventListener('mouseenter', handleMouseEnter)
        selector_ref.current.addEventListener('mouseleave', handleMouseLeave)
        return () => {
            selector_ref.current?.removeEventListener('mouseenter', handleMouseEnter)
            selector_ref.current?.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, []);

    return (
        <VStack
            ref={selector_ref}
            transition={'height 0.3s'}
            bg={ARBORA_GREEN.fg} rounded={'10px'} spacing={0} pr={'0.1rem'} w={'100%'}>
            <HStack
                cursor={'pointer'}
                onClick={() => setDropdownOpen(state => !state)}
                w={'100%'} h={'60px'} bg={ARBORA_GREEN.fg} px={'1rem'} rounded={'10px'} justify={'space-between'}>
                <PiPlainText
                    value={
                        active_document?.title ?? 'Documents'
                    } fontSize={'18px'} fontWeight={600} character_limit={28}
                    color={ARBORA_GREEN.hard}/>
                {active_document ? (
                    <Box onClick={() => dispatch(setActiveDocument(null))}>
                        <MdClose
                            fontSize={'22px'} color={ARBORA_GREEN.hard}/>
                    </Box>
                ) : (
                    <Center bg={ARBORA_GREEN.hard} rounded={'30%'} h={'30px'} px={'0.5rem'}>
                        <PiPlainText color={ARBORA_GREEN.soft} value={documents.length ?? 0}/>
                    </Center>
                )}
            </HStack>
            <AnimatePresence mode={'sync'}>
                {dropdown_open && (
                    <motion.div
                        initial={{height: 0}}
                        animate={{height: 'fit-content'}}
                        exit={{height: 0}}
                        transition={{duration: 0.4}}
                        style={{
                            overflow: "hidden",
                            width: '100%'
                        }}
                    >
                        <DropdownContent/>
                    </motion.div>
                )}
            </AnimatePresence>
        </VStack>
    )
}