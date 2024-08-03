import React from 'react';
import {Box, BoxProps, HStack, VStack} from "@chakra-ui/react";
import {ChatMessage, ChatSource} from "../types.ts";
import ChatMessageDisplay from "./ChatMessageDisplay.tsx";
import ChatMessageInput from "./ChatMessageInput.tsx";
import ActiveDocumentNoteSelector from "../../../../../../../core/components/document-note-selector";
import {chatWithArbyService} from "../../../../../../../core/services/ai/AIServices.ts";
import useActiveContent from "../../../../../../../core/redux/home/hooks/useActiveContent.tsx";
import {StandardConsole} from "../../../../../../../core/helpers/logging.ts";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import useGlobalHomeState from "../../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {recordNoteReviewService} from "../../../../../../../core/services/documents/DocumentsCRUDServices.ts";
import {NoteReviewType} from "../../../../../../../core/services/documents/types.ts";

interface ExplainTabChatSectionProps extends BoxProps {

}

export default function ExplainTabChatSection({...box_props}: ExplainTabChatSectionProps) {
    const active_content = useActiveContent()
    const {documents: {active_document, active_note}} = useGlobalHomeState()

    const initial_message: ChatMessage = React.useMemo(() => {
        const title = active_note ? active_document!.notes[active_note].title : active_document!.title
        return {
            id: 'initial-message',
            source: ChatSource.ARBY,
            message: `Hello! I am Arby, Would you like to explain "${title}" to me?`,
            unix_timestamp: Math.round(Date.now() / 1000)
        }
    }, [active_note, active_document]);

    const chat_box_ref = React.useRef<HTMLDivElement | null>(null);
    const cancel_response_flag = React.useRef<boolean>(false);
    const [chat_complete, setChatComplete] = React.useState<boolean>(false)

    const [chat_messages, setChatMessages] = React.useState<ChatMessage[]>([initial_message])

    const sendPrompt = React.useCallback(async (_prompt: string) => {
        if (!active_content) {
            StandardConsole.warn('No active content to send prompt in explain chat section')
            return
        }

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
        const response = await chatWithArbyService({
            content: active_content,
            conversation: chat_messages.map(
                ({source, message}) => `${source === ChatSource.ARBY ? 'ai :' : 'user :'} ${message}`
            ),
            curiosity: 1,
            limit: 5
        })

        // await new Promise(resolve => setTimeout(resolve, 2000))

        if (cancel_response_flag.current) {
            cancel_response_flag.current = false
            return
        }

        if (response.is_successful) {
            setChatMessages(prev_message => {
                // remove the dummy message and add the response
                return [...prev_message.slice(0, -1), {
                    id: Math.random().toString(),
                    source: ChatSource.ARBY,
                    message: response.data!.response.message,
                    unix_timestamp: Math.round(Date.now() / 1000)
                }]
            })
            if (response.data!.response.is_last) {
                setChatComplete(true)
                recordNoteReviewService({
                    document_id: active_document!.id,
                    note_id: active_note ?? '1',
                    review_type: NoteReviewType.CHAT,
                    score: 1
                }).then()
            }
        }

    }, [setChatMessages, cancel_response_flag.current, active_content, chat_messages, setChatComplete, active_document, active_note]);

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
                <HStack w={'100%'}>
                    <ActiveDocumentNoteSelector w={'100%'} py={'1rem'}/>
                    <PiButton
                        label={'Restart Chat'}
                        onClick={() => {
                            setChatMessages([initial_message])
                            setChatComplete(false)
                        }}
                    />
                </HStack>
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
                                  is_disabled={chat_messages.slice(-1)[0].is_loading || chat_complete}/>
            </VStack>
        </Box>
    )
}