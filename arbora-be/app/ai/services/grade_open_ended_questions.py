from ai import getModel, OutputType
import json

from question import OpenEndedQuestionAnswer

INPUT_OUTPUT_EXAMPLES = [
    {
        "input": {
            "content": "Climate change is the long-term alteration of temperature and typical weather patterns in a place. Climate change could refer to a particular location or the planet as a whole. Climate change may cause weather patterns to be less predictable. These unexpected weather patterns can make it difficult to maintain and grow crops in regions that rely on farming because expected temperature and rainfall levels can no longer be relied on. Climate change has also been connected with other damaging weather events such as more frequent and more intense hurricanes, floods, downpours, and winter storms.",
            "answers": [
                {
                    "id": "q1",
                    "question": "Explain how climate change affects agriculture and food production.",
                    "answer": "Climate change makes weather patterns unpredictable, which affects farming. Farmers can't rely on expected temperatures and rainfall, making it harder to grow crops."
                },
                {
                    "id": "q2",
                    "question": "Describe the relationship between climate change and extreme weather events.",
                    "answer": "Climate change causes more hurricanes and floods."
                }
            ]
        },
        "output": [
            {
                "id": "q1",
                "grade": 4,
                "comment": "Good answer! You've correctly identified the link between climate change, unpredictable weather patterns, and difficulties in farming. To improve, you could mention specific examples of how changing temperatures or rainfall patterns affect different crops or regions."
            },
            {
                "id": "q2",
                "grade": 3,
                "comment": "Your answer is on the right track, but it's quite brief. While you've correctly mentioned hurricanes and floods, you could improve by explaining how climate change increases their frequency and intensity. Also, consider mentioning other extreme weather events like droughts or winter storms."
            }
        ]
    }
]

SYSTEM_INSTRUCTION: str = '''
    Your task is to grade open-ended question answers based on the given content and the user's responses. 
    For each answer, provide:
    1. A grade from 1 to 5, where 5 is perfect and 1 is incorrect.
    2. A short comment explaining the grade and offering guidance for improvement.
    
    Grading should be based on the content provided and should be firm but not overly strict. 
    The goal is to encourage understanding without frustrating users with unreasonably high standards.
    Even for correct answers, provide a comment to elaborate or congratulate the user on their understanding.
    
    Here's an example of the input and output format:
''' + '\n'.join([f'INPUT: {ex["input"]}\nOUTPUT: {ex["output"]}\n' for ex in INPUT_OUTPUT_EXAMPLES])

grading_model = getModel(
    system_instruction=SYSTEM_INSTRUCTION,
    output_type=OutputType.JSON
)


def gradeOpenEndedQuestions(content: str, answers: list[dict]) -> list[OpenEndedQuestionAnswer]:
    graded_answers = []
    model_input = {
        "content": content,
        "answers": answers
    }
    model_output = grading_model.generate_content(str(model_input))
    grades_json = json.loads(model_output.text)

    for grade_json in grades_json:
        graded_answer = OpenEndedQuestionAnswer(
            id=grade_json["id"],
            grade=grade_json["grade"],
            comment=grade_json["comment"]
        )
        graded_answers.append(graded_answer)

    return graded_answers


if __name__ == '__main__':
    content = "Robert James Fischer (March 9, 1943 – January 17, 2008) was an American chess grandmaster and the eleventh World Chess Champion. A chess prodigy, he won his first of a record eight US Championships at the age of 14. In 1964, he won with an 11–0 score, the only perfect score in the history of the tournament. Qualifying for the 1972 World Championship, Fischer swept matches with Mark Taimanov and Bent Larsen by 6–0 scores. After winning another qualifying match against Tigran Petrosian, Fischer won the title match against Boris Spassky of the USSR, in Reykjavík, Iceland. Publicized as a Cold War confrontation between the US and USSR, the match attracted more worldwide interest than any chess championship before or since."

    answers = [
        {
            "id": "q1",
            "question": "Explain the significance of Fischer during the Cold War?",
            "answer": "Fischer was very good at negotiating with the Soviets over the course of chess matches leading to the resolution of many conflicts"
        },
        {
            "id": "q2",
            "question": "What is Bobby Fischer's legacy in your own words?",
            "answer": "Bobby Fischer's prodigious skill and longevity in competitive chess are the most legendary aspects of his career"
            # does not call me out for referring to Fischer's "longevity" though he only played 1 World Championship match... needs better prompting.
        }
    ]

    graded_answers = gradeOpenEndedQuestions(content, answers)
    for answer in graded_answers:
        print(f"Answer ID: {answer.id}")
        print(f"Grade: {answer.grade}")
        print(f"Comment: {answer.comment}\n")
