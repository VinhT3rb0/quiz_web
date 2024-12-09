package org.do_an.quiz_java;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class QuizJavaApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuizJavaApplication.class, args);
	}

}
