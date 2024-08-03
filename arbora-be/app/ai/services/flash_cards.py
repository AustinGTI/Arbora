from ai import getModel, OutputType
from flash_card import FlashCard
from string_utils import generateRandomId
import json

INPUT_OUTPUT_EXAMPLES = [
    {
        "input": {
            "no_of_flashcards": 3,
            "flashcard_content": " The Colony of Kenya and the Protectorate of Kenya each came to an end on 12 December 1963, with independence conferred on all of Kenya. The U.K. ceded sovereignty over the Colony of Kenya. The Sultan of Zanzibar agreed that simultaneous with independence for the colony, he would cease to have sovereignty over the Protectorate of Kenya so that all of Kenya would become one sovereign state. In this way, Kenya became an independent country under the Kenya Independence Act 1963 of the United Kingdom. On 12 December 1964, Kenya became a republic under the name 'Republic of Kenya'"
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
            "no_of_flashcards": 3,
            "flashcard_content": '''
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
            "no_of_flashcards": 2,
            "flashcard_content": '''
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
     Your purpose is to generate flashcards based on the given content and number of flashcards, the flashcards should cover important information in the 
     content that would be complex enough to require memorization. You may use your own knowledge of said content to generate the cards but the first cards 
     should prioritize the content and cards with additional information should not stray too far from the content. The answer should be concise and to the point.
     
     Here are a few example pairs of prompts and answers:
    ''' + '\n'.join([f'INPUT: {ex["input"]}\nOUTPUT: {ex["output"]}\n' for ex in INPUT_OUTPUT_EXAMPLES])

flash_cards_model = getModel(
    system_instruction=SYSTEM_INSTRUCTION,
    output_type=OutputType.JSON
)


def generateFlashCards(no_of_flashcards: int, flashcard_content: str) -> list[FlashCard]:
    flash_cards = []
    model_input = {
        "no_of_flashcards": no_of_flashcards,
        "flashcard_content": flashcard_content
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
        'In 27 BC, Octavian became princeps civitatis and took the title of Augustus, founding the principate, a diarchy between the princeps and the senate. During the reign of Nero, two thirds of the city was ruined after the Great Fire of Rome, and the persecution of Christians commenced. Rome was established as a de facto empire, which reached its greatest expansion in the second century under the Emperor Trajan. Rome was confirmed as caput Mundi, i.e. the capital of the known world, an expression which had already been used in the Republican period. During its first two centuries, the empire was ruled by emperors of the Julio-Claudian, Flavian (who also built an eponymous amphitheatre, known as the Colosseum), and Antonine dynasties. This time was also characterised by the spread of the Christian religion, preached by Jesus Christ in Judea in the first half of the first century (under Tiberius) and popularised by his apostles through the empire and beyond. The Antonine age is considered the zenith of the Empire, whose territory ranged from the Atlantic Ocean to the Euphrates and from Britain to Egypt.'
    )
