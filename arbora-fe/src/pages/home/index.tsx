import {Box, HStack, VStack} from "@chakra-ui/react";
import ArboraLogo from "../../core/graphics/ArboraLogo.tsx";
import ArboraBanner from "../../core/graphics/ArboraBanner.tsx";
import {BiExit} from "react-icons/bi";
import {PiButtonVariant} from "../../pillars-ui/components/buttons/types.ts";
import DocumentViewSection from "./sections/single-document";
import PiLinkButton from "../../pillars-ui/components/buttons/PiLinkButton.tsx";
import useDocuments from "../../core/services/documents/hooks/useDocuments.tsx";
import AllDocumentsSection from "./sections/all-documents";
import {ARBORA_GREEN} from "../../core/constants/styling.ts";
import TreeAnimationLoaderV2 from "../../core/graphics/loaders/TreeAnimationLoaderV2.tsx";


function ArboraHomePageHeader() {
    return (
        <HStack w={'100%'} h={'100px'} align={'center'} justify={'space-between'} px={'1rem'}>
            <Box w={'100px'}>
                <ArboraLogo size={'50px'}/>
            </Box>
            <HStack pt={'1rem'}>
                <ArboraBanner size={'70px'}/>
            </HStack>
            <HStack w={'100px'} justify={'flex-end'}>
                <PiLinkButton
                    to={'/logout'}
                    variant={PiButtonVariant.ICON}
                    icon={BiExit} icon_props={{fontSize: '40px'}}/>
            </HStack>
        </HStack>
    )
}

export default function ArboraHomePage() {
    const {documents_loading} = useDocuments()

    return (
        <Box position={'absolute'} top={0} left={0} bg={ARBORA_GREEN.soft} w={'100vw'} h={'100vh'} p={0} m={0}>
            <VStack w={'100%'} h={'100%'}>
                <ArboraHomePageHeader/>
                <Box position={'relative'} w={'100%'} h={'calc(100% - 100px)'}>
                    {!documents_loading ? (
                        <HStack w={'100%'} h={'100%'}>
                            <AllDocumentsSection w={'100%'} h={'100%'}/>
                            <DocumentViewSection h={'97%'}/>
                        </HStack>
                    ) : (
                        <TreeAnimationLoaderV2 w={'100%'} h={'100%'} text={'Documents Loading'}/>
                    )}
                </Box>
            </VStack>
        </Box>
    )
}
