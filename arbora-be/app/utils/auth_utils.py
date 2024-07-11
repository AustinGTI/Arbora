import bcrypt


def hashPassword(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(14))
