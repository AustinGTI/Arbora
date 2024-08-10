from note import NoteReview, Note
from datetime import datetime

# the amount of time in days it takes for a user to forget 50% of the information given
# they reviewed it using the given review type
HALF_LIFE = {
    'flash_cards': 2,
    'multiple_choice_questions': 7,
    'open_ended_questions': 16,
    'chat': 25
}

DEPTH_DECAY = 0.9


# recall probability is calculated by iterating over every note review sorted by date and for each review,

# calculating the probability that the user remembers the information and multiplying it by the
# probability they have forgotten the information by that point, then adding this to the
# cumulative recall probability
#
# todo: use note content size and edits made made to make this more accurate
def calculateRecallProbability(note_reviews: list[NoteReview]) -> float:
    recall = 0
    now_timestamp = datetime.now().timestamp()
    # convert the iso timestamp strings to datetime objects
    note_reviews.sort(key=lambda x: datetime.fromisoformat(x.timestamp).timestamp())
    for review in note_reviews:
        review_recall = (0.5 ** (
                ((now_timestamp - datetime.fromisoformat(note_reviews[0].timestamp).timestamp()) / (60 * 60 * 24)) / HALF_LIFE[review.review_type]) *
                         review.score)
        recall += (1 - recall) * review_recall
    return recall


# the recall of each note is influenced by its parent notes
# the parent recall is multiplied by the probability that the note has been forgotten and added to the current note recall
def updateNotesRecallProbabilities(notes: dict[str, Note]) -> None:
    root_note_ids = [key for key in notes.keys() if '.' not in key]

    def updateRecallProbabilities(note_id: str, parent_recall: float) -> None:
        note = notes[note_id]
        note['recall_probability'] = calculateRecallProbability([NoteReview(**review) for review in (note['reviews'] if note['reviews'] else [])])
        note['recall_probability'] += (parent_recall * DEPTH_DECAY) * (1 - note['recall_probability'])
        for child_id in note['children']:
            updateRecallProbabilities(child_id, note['recall_probability'])

    for root_note_id in root_note_ids:
        updateRecallProbabilities(root_note_id, 0)
