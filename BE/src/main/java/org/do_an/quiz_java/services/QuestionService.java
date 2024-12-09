package org.do_an.quiz_java.services;

import lombok.RequiredArgsConstructor;
import org.do_an.quiz_java.dto.QuestionDTO;
import org.do_an.quiz_java.model.Question;
import org.do_an.quiz_java.model.QuestionChoice;
import org.do_an.quiz_java.model.Quiz;
import org.do_an.quiz_java.repositories.QuestionChoiceRepository;
import org.do_an.quiz_java.repositories.QuestionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;

    private final QuestionChoiceRepository questionChoiceRepository;

    private final QuestionChoiceService questionChoiceService;
    @Autowired
    private ModelMapper modelMapper;
    public List<Question> save(List<QuestionDTO> questionDTOs , Quiz quiz) {

        List<Question> questions = questionDTOs.stream().map((element) -> modelMapper.map(element, Question.class)).collect(Collectors.toList());

        for (Question question : questions) {
                question.setQuiz(quiz);
                questionChoiceService.saveAll(question.getQuestionChoice(), question);
        }
        return questionRepository.saveAll(questions);
    }
    private Question convertToEntity(QuestionDTO questionDTO) {
        // Sử dụng ModelMapper để chuyển đổi
        return modelMapper.map(questionDTO, Question.class);
    }
    public Question find(Integer id){
        return questionRepository.findById(id).get();
    }

    public Boolean checkAnswer(Integer questionId, Integer choiceId) {
        Question question = questionRepository.findById(questionId).get();
        return question.getQuestionChoice().stream().anyMatch(choice -> choice.getId().equals(choiceId) && choice.getIsCorrect());
    }

    public List<Question> update(List<Question> questions, Quiz quiz) {
        List<Question> existingQuestions = questionRepository.findByQuiz(quiz);
        List<Question> updateQuestions = questions.stream().map((element) -> modelMapper.map(element, Question.class)).collect(Collectors.toList());

        for (Question question : updateQuestions) {
            questionChoiceService.saveAll(question.getQuestionChoice(), question);
            question.setQuiz(quiz);
        }
        return questionRepository.saveAll(questions);
    }
    public List<Integer> getCorrectAnswerChoices(Integer questionId) {
        return questionChoiceRepository.findByQuestionIdAndIsCorrect(questionId, true)
                .stream()
                .map(QuestionChoice::getId)
                .collect(Collectors.toList());
    }

    public Question findById(Integer id) {
        return questionRepository.findById(id).get();
    }

}
