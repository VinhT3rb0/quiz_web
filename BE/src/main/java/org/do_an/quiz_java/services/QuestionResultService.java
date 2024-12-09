package org.do_an.quiz_java.services;

import lombok.RequiredArgsConstructor;
import org.do_an.quiz_java.model.QuestionResult;
import org.do_an.quiz_java.repositories.QuestionResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionResultService {
    private final QuestionResultRepository questionResultRepository;

    public void saveAll(List<QuestionResult> questionResults) {
        questionResultRepository.saveAll(questionResults);
    }

    public void save(QuestionResult questionResult) {
        questionResultRepository.save(questionResult);
    }
}
