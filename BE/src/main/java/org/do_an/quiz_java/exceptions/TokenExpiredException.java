package org.do_an.quiz_java.exceptions;

public class TokenExpiredException extends Exception {
    public TokenExpiredException(String message) {
        super(message);
    }

    public TokenExpiredException(String message, Throwable cause) {
        super(message, cause);
    }
}
