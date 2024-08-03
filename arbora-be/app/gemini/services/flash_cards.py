from gemini import getModel, OutputType
from flash_card import FlashCard
from string_utils import generateRandomId
import json

INPUT_OUTPUT_EXAMPLES = [
    {
        "input": {
            "no_of_flash_cards": 3,
            "content": " The Colony of Kenya and the Protectorate of Kenya each came to an end on 12 December 1963, with independence conferred on all of Kenya. The U.K. ceded sovereignty over the Colony of Kenya. The Sultan of Zanzibar agreed that simultaneous with independence for the colony, he would cease to have sovereignty over the Protectorate of Kenya so that all of Kenya would become one sovereign state. In this way, Kenya became an independent country under the Kenya Independence Act 1963 of the United Kingdom. On 12 December 1964, Kenya became a republic under the name 'Republic of Kenya'"
        },
        "output": [
            {
                "prompt": "When did Kenya become an independent country?",
                "answer": "Kenya became an independent country on 12 December 1963."
            },
            {
                "prompt": "When did Kenya become a republic?",
                "answer": "Kenya became a republic on 12 December 1964."
            },
            {
                "prompt": "Who did Kenya gain independence from?",
                "answer": "Kenya gained independence from the United Kingdom."
            }
        ]
    },
    {
        "input": {
            "no_of_flash_cards": 3,
            "content": '''
                The conjugation of the word 'to be' in French is:
                    - Je suis (I am)
                    - Tu es (You are)
                    - Il/Elle/On est (He/She/One is)
                    - Nous sommes (We are)
                    - Vous êtes (You are)
                    - Ils/Elles sont (They are)
            '''
        },
        "output": [
            {
                "prompt": "I am",
                "answer": "Je suis"
            },
            {
                "prompt": "You are",
                "answer": "Tu es"
            },
            {
                "prompt": "He/She/One is",
                "answer": "Il/Elle/On est"
            },
        ]
    },
    {
        "input": {
            "no_of_flash_cards": 2,
            "content": '''
       Decorators are a very powerful and useful tool in Python since it allows programmers to modify the behaviour of a function or class. Decorators allow us to wrap another function in order to extend the behaviour of the wrapped function, without permanently modifying it. But before diving deep into decorators let us understand some concepts that will come in handy in learning the decorators.

        First Class Objects
        In Python, functions are first class objects which means that functions in Python can be used or passed as arguments.
        Properties of first class functions:
        A function is an instance of the Object type.
        You can store the function in a variable.
        You can pass the function as a parameter to another function.
        You can return the function from a function.
        You can store them in data structures such as hash tables, lists, … 
        '''
        },
        "output": [
            {
                "prompt": "What are first class objects?",
                "answer": "Functions in Python are first class objects which means that functions in Python can be used or passed as arguments."
            },
            {
                "prompt": "What is a decorator?",
                "answer": "Decorators are syntax in python that allow you to modify the behaviour of a function or a class"
            }
        ]
    }
]

SYSTEM_INSTRUCTION: str = '''
    A flashcard is an object consisting of a prompt string and an answer string. They are used to help memorize information by practicing
     associating the prompt with the answer.
     Your purpose is to generate flash_cards based on the given content and number of flash_cards, the flash_cards should cover important information in the 
     content that would be complex enough to require memorization. You may use your own knowledge of said content to generate the cards but the first cards 
     should prioritize the content and cards with additional information should not stray too far from the content. The answer should be concise and to the point.
     
     Here are a few example pairs of prompts and answers:
    ''' + '\n'.join([f'INPUT: {ex["input"]}\nOUTPUT: {ex["output"]}\n' for ex in INPUT_OUTPUT_EXAMPLES])

flash_cards_model = getModel(
    system_instruction=SYSTEM_INSTRUCTION,
    output_type=OutputType.JSON
)


def generateFlashCards(no_of_flash_cards: int, content: str) -> list[FlashCard]:
    flash_cards = []
    model_input = {
        "no_of_flash_cards": no_of_flash_cards,
        "content": content
    }
    model_output = flash_cards_model.generate_content(str(model_input))
    flash_cards_json = json.loads(model_output.text)
    for flash_card_json in flash_cards_json:
        flash_card = FlashCard(
            id=generateRandomId(5),
            prompt=flash_card_json["prompt"],
            answer=flash_card_json["answer"]
        )
        flash_cards.append(flash_card)

    return flash_cards


if __name__ == '__main__':
    cards = generateFlashCards(
        5,
        '''Superman was born on the fictional planet Krypton with the birth name of Kal-El. As a baby, his parents sent him to Earth in a small spaceship 
        shortly before Krypton was destroyed in a natural cataclysm. His ship landed in the American countryside near the fictional town of Smallville, Kansas. He was found and adopted by farmers Jonathan and Martha Kent, who named him Clark Kent. Clark began developing superhuman abilities, such as incredible strength and impervious skin. His adoptive parents advised him to use his powers to benefit of humanity, and he decided to fight crime as a vigilante. To protect his personal life, he changes into a colorful costume and uses the alias "Superman" when fighting crime. Clark resides in the fictional American city of Metropolis, where he works as a journalist for the Daily Planet. Superman's supporting characters include his love interest and fellow journalist Lois Lane, Daily Planet photographer Jimmy Olsen, and editor-in-chief Perry White, and his enemies include Brainiac, General Zod, and archenemy Lex Luthor.'''
    )
