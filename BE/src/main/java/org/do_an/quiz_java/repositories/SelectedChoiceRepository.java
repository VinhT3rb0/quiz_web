package org.do_an.quiz_java.repositories;

import org.do_an.quiz_java.model.SelectedChoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SelectedChoiceRepository extends JpaRepository<SelectedChoice, Integer> {
}