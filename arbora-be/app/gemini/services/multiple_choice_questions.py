from gemini import getModel, OutputType
from question import MultipleChoiceQuestion
from string_utils import generateRandomId
import json
import random

INPUT_OUTPUT_EXAMPLES = [
    {
        "input": {
            "no_of_questions": 2,
            "content": "The American Revolution was a colonial revolt that took place between 1765 and 1783. The American Patriots in the Thirteen Colonies rejected the authority of the British Parliament to govern them without elected representation; they rejected the authority of the royal governors and the authority of the King-in-Parliament. The British responded by imposing punitive laws. The conflict escalated to a full-scale war in 1775, and the Declaration of Independence was issued in 1776."
        },
        "output": [
            {
                "question": "When did the American Revolution take place?",
                "answer": "Between 1765 and 1783",
                "wrong_answers": [
                    "Between 1776 and 1789",
                    "Between 1750 and 1770",
                    "Between 1780 and 1800"
                ]
            },
            {
                "question": "What did the American Patriots reject?",
                "answer": "The authority of the British Parliament to govern them without elected representation",
                "wrong_answers": [
                    "The idea of independence from Britain",
                    "The concept of democracy",
                    "The right to bear arms"
                ]
            }
        ]
    }
]

SYSTEM_INSTRUCTION: str = '''
    Your task is to generate multiple choice questions based on the given content and number of questions requested. 
    Each question should have one correct answer and three wrong but plausible answers. 
    The questions should cover important information in the content that would be suitable for testing knowledge and understanding.
    You may use your own knowledge of the content to generate the questions, but prioritize information from the given content.
    
    Here's an example of the input and output format:
''' + '\n'.join([f'INPUT: {ex["input"]}\nOUTPUT: {ex["output"]}\n' for ex in INPUT_OUTPUT_EXAMPLES])

mcq_model = getModel(
    system_instruction=SYSTEM_INSTRUCTION,
    output_type=OutputType.JSON
)


def generateMultipleChoiceQuestions(no_of_questions: int, content: str) -> list[MultipleChoiceQuestion]:
    multiple_choice_questions = []
    model_input = {
        "no_of_questions": no_of_questions,
        "content": content
    }
    model_output = mcq_model.generate_content(str(model_input))
    questions_json = json.loads(model_output.text)

    for question_json in questions_json:
        choices = [question_json["answer"]] + question_json["wrong_answers"]
        random.shuffle(choices)
        correct_choice = choices.index(question_json["answer"])

        mcq = MultipleChoiceQuestion(
            id=generateRandomId(5),
            question=question_json["question"],
            choices=choices,
            correct_choice=correct_choice
        )
        multiple_choice_questions.append(mcq)

    return multiple_choice_questions


if __name__ == '__main__':
    questions = generateMultipleChoiceQuestions(
        3,
        "The Python programming language was created by Guido van Rossum and first released in 1991. Python is known for its simplicity and readability, emphasizing code readability with its notable use of significant whitespace. It supports multiple programming paradigms, including structured, object-oriented, and functional programming. Python is often described as a 'batteries included' language due to its comprehensive standard library."
    )
    for q in questions:
        print(f"Question: {q.question}")
        for i, choice in enumerate(q.choices):
            print(f"  {i + 1}. {choice}")
        print(f"Correct choice: {q.correct_choice + 1}\n")
