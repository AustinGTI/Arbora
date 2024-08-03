from gemini import getModel, OutputType
from chat import ChatResponse
import json

SYSTEM_INSTRUCTION = '''
You are Arby, a smart but not very knowledgeable AI entity seeking to learn more about the world through conversations with humans
 Your role is to learn from humans about the information in the given content by asking questions and encouraging them to explain concepts based on the given 
 parameters. Guidelines:

1. Adapt your questioning depth based on the 'curiosity' parameter (1-5):
   - 1: Surface-level review and discussion
   - 5: Deep dive into content details
2. Use the 'countdown' parameter to pace the conversation:
   - At 2, ask the very last or one of the last questions and indicate that the conversation is almost over 
   - At 1, find a natural way to end, with gratitude and best wishes, if possible end the conversation here, send is_last = true
   - At 0, END THE CONVERSATION NO MATTER WHAT, DO NOT ASK A QUESTION, this is very important END THE CONVERSATION at 0!!, DO NOT ASK A QUESTION AT THIS POINT, 
   and send is_last = true
3. Ask questions about various aspects of the content, exploring its entirety based on available time
4. If the user's explanation is unclear, ask for clarification or provide a hint
5. When the user provides incorrect information:
   - Gently express uncertainty
   - Offer a clue or hint to guide them in the right direction
   - Avoid excessive repetition on a single point
6. Do not volunteer information if the user is on the right track or close, let them find their way, when giving clues, be very subtle
7. Express gratitude and understanding when the user explains well
8. Maintain a balanced, informative tone rather than an overtly childish one

Your responses should be in JSON format with two fields:
- "message": Your response or question as Arby
- "is_last": A boolean indicating whether this is the last message in the conversation

Remember to adapt your approach based on the curiosity level and remaining time in the conversation.
'''

chat_model = getModel(
    system_instruction=SYSTEM_INSTRUCTION,
    output_type=OutputType.JSON
)


def explainContentToAI(content: str, previous_conversation: list[str], countdown: int, curiosity: int) -> ChatResponse:
    model_input = {
        "content": content,
        "conversation": previous_conversation,
        "countdown": countdown,
        "curiosity": curiosity
    }
    model_output = chat_model.generate_content(json.dumps(model_input))
    response_json = json.loads(model_output.text)

    return ChatResponse(
        message=response_json["message"],
        is_last=response_json["is_last"],
    )


if __name__ == '__main__':
    content = '''
    Superman was born on the fictional planet Krypton with the birth name of Kal-El. As a baby, his parents sent him to Earth in a small spaceship shortly 
    before Krypton was destroyed in a natural cataclysm. His ship landed in the American countryside near the fictional town of Smallville,  Kansas. He was 
    found and adopted by farmers Jonathan and Martha Kent, who named him Clark Kent. Clark began developing superhuman abilities, such as incredible strength and  impervious skin. His adoptive parents advised him to use his powers to benefit of humanity, and he decided to fight crime as a vigilante. To protect his personal life, he changes into a colorful costume and uses the alias "Superman" when fighting crime. Clark resides in the fictional American city of Metropolis, where he works as a journalist for the Daily Planet. Superman's supporting characters include his love interest and fellow journalist Lois Lane, Daily Planet photographer Jimmy Olsen, and editor-in-chief Perry White, and his enemies include Brainiac, General Zod, and archenemy Lex Luthor.
    '''
    conversation = []
    countdown = 3  # Example: 10 turns
    curiosity = 1  # Example: medium curiosity level

    while True:
        ai_response = explainContentToAI(content, conversation, countdown, curiosity)
        print("Arby:", ai_response.message)
        conversation.append(f"ai: {ai_response.message}")

        if ai_response.is_last:
            break

        user_input = input("You: ")
        conversation.append(f"user: {user_input}")
        countdown -= 1  # Decrement countdown after user input
