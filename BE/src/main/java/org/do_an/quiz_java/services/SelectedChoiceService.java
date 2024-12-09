package org.do_an.quiz_java.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.model.SelectedChoice;
import org.do_an.quiz_java.repositories.SelectedChoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
//@Transactional
@Slf4j
public class SelectedChoiceService {
    private final SelectedChoiceRepository selectedChoiceRepository;

    public void save(SelectedChoice selectedChoice) {
        selectedChoiceRepository.save(selectedChoice);
    }

    public void saveAll(List<SelectedChoice> selectedChoices) {
        selectedChoiceRepository.saveAll(selectedChoices);
    }
}
