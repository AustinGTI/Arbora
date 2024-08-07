import React from 'react';
import {Box, HStack} from "@chakra-ui/react";
import {ChatMessage, ChatSource} from "../types.ts";
import PiPlainText from "../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import {ARBORA_GREEN} from "../../../../../../../core/constants/styling.ts";
import TreeAnimationLoaderV2 from "../../../../../../../core/graphics/loaders/TreeAnimationLoaderV2.tsx";

interface ChatMessageDisplayProps {
    chat_message: ChatMessage
}

export default function ChatMessageDisplay({chat_message}: ChatMessageDisplayProps) {
    const {text_alignment, row_justify} = React.useMemo(() => {
        switch (chat_message.source) {
            case ChatSource.USER:
                return {
                    text_alignment: 'right',
                    row_justify: 'flex-end'
                }
            case ChatSource.ARBY:
                return {
                    text_alignment: 'left',
                    row_justify: 'flex-start'
                }
            default:
                throw new Error('Invalid chat message source')
        }
    }, [chat_message.source]);

    const bg_color = React.useMemo(() => {
        switch (chat_message.source) {
            case ChatSource.USER:
                return 'gray.100'
            case ChatSource.ARBY:
                return ARBORA_GREEN.soft
            default:
                throw new Error('Invalid chat message source')
        }
    }, [chat_message.source]);

    return (
        <HStack w={'100%'} p={'0.5rem'} justify={row_justify}>
            <Box p={'0.5rem'} borderRadius={'0.5rem'} bg={bg_color} maxW={'80%'}>
                {!chat_message.is_loading ? (
                    <PiPlainText value={chat_message.message} align={text_alignment as "left" | "right"}/>
                ) : (
                    <TreeAnimationLoaderV2 tree_size={30}/>
                )}
            </Box>
        </HStack>
    )
}