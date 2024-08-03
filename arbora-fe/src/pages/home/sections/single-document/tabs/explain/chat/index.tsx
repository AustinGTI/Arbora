import React from 'react';
import {Box, BoxProps, VStack} from "@chakra-ui/react";
import {ChatMessage, ChatSource} from "../types.ts";
import ChatMessageDisplay from "./ChatMessageDisplay.tsx";
import ChatMessageInput from "./ChatMessageInput.tsx";

interface ExplainTabChatSectionProps extends BoxProps {

}

const INITIAL_MESSAGE: ChatMessage = {
    id: 'initial-message',
    source: ChatSource.ARBY,
    message: 'Hello! I am Arby, Would you like to explain this document to me?',
    unix_timestamp: Math.round(Date.now() / 1000)
}

export default function ExplainTabChatSection({...box_props}: ExplainTabChatSectionProps) {
    const chat_box_ref = React.useRef<HTMLDivElement | null>(null);
    const cancel_response_flag = React.useRef<boolean>(false);

    const [chat_messages, setChatMessages] = React.useState<ChatMessage[]>([INITIAL_MESSAGE])

    const sendPrompt = React.useCallback(async (_prompt: string) => {
        // add a dummy message to be used to display the loader
        setChatMessages(prev_message => {
                return [...prev_message, {
                    id: Math.random().toString(),
                    source: ChatSource.ARBY,
                    message: 'awaiting response...',
                    unix_timestamp: Math.round(Date.now() / 1000),
                    is_loading: true
                }]
            }
        )
        // todo: send the prompt to the server to get a response
        await new Promise(resolve => setTimeout(resolve, 2000))

        if (cancel_response_flag.current) {
            cancel_response_flag.current = false
            return
        }

        setChatMessages(prev_message => {
            // remove the dummy message and add the response
            return [...prev_message.slice(0, -1), {
                id: Math.random().toString(),
                source: ChatSource.ARBY,
                message: 'I am a response to your prompt',
                unix_timestamp: Math.round(Date.now() / 1000)
            }]
        })

    }, [setChatMessages, cancel_response_flag.current]);

    React.useEffect(() => {
        // chat message box should scroll to the bottom when new messages are added
        if (chat_box_ref.current) {
            chat_box_ref.current.scrollTop = chat_box_ref.current.scrollHeight
        }
    }, [chat_messages]);


    const processUserInput = React.useCallback((input: string) => {
        // first create a new chat message for the user and add it to the chat messages
        const user_chat_message: ChatMessage = {
            id: Math.random().toString(),
            source: ChatSource.USER,
            message: input,
            unix_timestamp: Math.round(Date.now() / 1000)
        }
        setChatMessages(prev_message => [...prev_message, user_chat_message])

        // then send a prompt to the server
        sendPrompt(input).then()
    }, [setChatMessages, sendPrompt]);

    const cancelResponse = React.useCallback(() => {
        if (chat_messages.slice(-1)[0].is_loading) {
            cancel_response_flag.current = true
            // remove the dummy message
            setChatMessages(prev_message => prev_message.slice(0, -1))
        }
    }, [setChatMessages, cancel_response_flag.current, chat_messages]);

    return (
        <Box w={'100%'} h={'100%'} {...box_props}>
            <VStack h={'95%'} w={'100%'}>
                <Box flex={1}/>
                <VStack ref={chat_box_ref} w={'100%'} maxH={'85%'} h={'fit-content'} spacing={'1rem'} p={'1rem'}
                        overflowY={'auto'}>
                    {
                        chat_messages.map((chat_message) => (
                            <ChatMessageDisplay key={chat_message.id} chat_message={chat_message}/>
                        ))
                    }
                </VStack>
                <ChatMessageInput h={'10%'} setInputValue={processUserInput} cancelResponse={cancelResponse}
                                  is_disabled={chat_messages.slice(-1)[0].is_loading}/>
            </VStack>
        </Box>
    )
}