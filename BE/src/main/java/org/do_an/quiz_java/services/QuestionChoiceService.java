package org.do_an.quiz_java.services;

import lombok.RequiredArgsConstructor;
import org.do_an.quiz_java.model.Question;
import org.do_an.quiz_java.model.QuestionChoice;
import org.do_an.quiz_java.repositories.QuestionChoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional
public class QuestionChoiceService {
    private final   QuestionChoiceRepository questionChoiceRepository;



    // Lưu danh sách lựa chọn câu hỏi
    public List<QuestionChoice> saveAll(List<QuestionChoice> choices , Question question) {
        for (QuestionChoice questionChoice : choices) {
            questionChoice.setQuestion(question);
        }
        return questionChoiceRepository.saveAll(choices);
    }

    // Tìm tất cả các lựa chọn của một câu hỏi theo ID câu hỏi
    public List<QuestionChoice> findByQuestionId(Integer questionId) {
        return questionChoiceRepository.findAll()
                .stream()
                .filter(choice -> choice.getQuestion().getId().equals(questionId))
                .toList();
    }

    // Tìm lựa chọn theo ID
    public QuestionChoice findById(Integer id) {
        return questionChoiceRepository.findById(id).orElse(null);
    }

    // Xóa lựa chọn theo ID
    public void deleteById(Integer id) {
        questionChoiceRepository.deleteById(id);
    }

    // Cập nhật lựa chọn
    public QuestionChoice update(QuestionChoice choice) {
        return questionChoiceRepository.save(choice);
    }
}
