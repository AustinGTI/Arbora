import random
import string


def generateRandomId(n: int) -> str:
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=n))
