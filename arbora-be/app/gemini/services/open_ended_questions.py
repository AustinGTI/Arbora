from gemini import getModel, OutputType
from question import OpenEndedQuestion
from string_utils import generateRandomId
import json

INPUT_OUTPUT_EXAMPLES = [
    {
        "input": {
            "no_of_questions": 2,
            "content": "The Industrial Revolution was a period of major industrialization and innovation that took place during the late 1700s and early 1800s. It began in Great Britain and quickly spread throughout Western Europe and North America. This revolution was characterized by a transition from hand production methods to machines, new chemical manufacturing and iron production processes, improved efficiency of water power, the increasing use of steam power, and the development of machine tools. It also included the change from wood and other bio-fuels to coal. The Industrial Revolution marked a major turning point in history; almost every aspect of daily life was influenced in some way."
        },
        "output": [
            {
                "question": "Explain how the transition from hand production to machine-based manufacturing during the Industrial Revolution impacted society and the economy."
            },
            {
                "question": "Discuss the environmental consequences of the shift from bio-fuels to coal during the Industrial Revolution and its long-term effects on climate change."
            }
        ]
    }
]

SYSTEM_INSTRUCTION: str = '''
    Your task is to generate open-ended questions based on the given content and number of questions requested. 
    These questions should test the user's understanding of the content and require detailed, thoughtful responses.
    The questions should be designed to elicit answers of at least several words, encouraging critical thinking and analysis.
    Focus on creating questions that explore the deeper implications, connections, or applications of the information provided.
    You may use your own knowledge to formulate questions, but prioritize information from the given content.
    
    Here's an example of the input and output format:
''' + '\n'.join([f'INPUT: {ex["input"]}\nOUTPUT: {ex["output"]}\n' for ex in INPUT_OUTPUT_EXAMPLES])

open_ended_model = getModel(
    system_instruction=SYSTEM_INSTRUCTION,
    output_type=OutputType.JSON
)


def generateOpenEndedQuestions(no_of_questions: int, content: str) -> list[OpenEndedQuestion]:
    open_ended_questions = []
    model_input = {
        "no_of_questions": no_of_questions,
        "content": content
    }
    model_output = open_ended_model.generate_content(str(model_input))
    questions_json = json.loads(model_output.text)

    for question_json in questions_json:
        open_ended_question = OpenEndedQuestion(
            id=generateRandomId(5),
            question=question_json["question"]
        )
        open_ended_questions.append(open_ended_question)

    return open_ended_questions


if __name__ == '__main__':
    questions = generateOpenEndedQuestions(
        3,
        "Climate change is the long-term alteration of temperature and typical weather patterns in a place. Climate change could refer to a particular location or the planet as a whole. Climate change may cause weather patterns to be less predictable. These unexpected weather patterns can make it difficult to maintain and grow crops in regions that rely on farming because expected temperature and rainfall levels can no longer be relied on. Climate change has also been connected with other damaging weather events such as more frequent and more intense hurricanes, floods, downpours, and winter storms."
    )
    for q in questions:
        print(f"Question ID: {q.id}")
        print(f"Question: {q.question}\n")
