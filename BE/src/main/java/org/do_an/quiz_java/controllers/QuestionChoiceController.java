//package org.do_an.quiz_java.controllers;
//
//import org.do_an.quiz_java.model.QuestionChoice;
//import org.do_an.quiz_java.services.QuestionChoiceService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/question-choices")
//public class QuestionChoiceController {
//
//    private QuestionChoiceService questionChoiceService;
//
//
////    @PostMapping
////    public ResponseEntity<List<QuestionChoice>> createChoices(@RequestBody List<QuestionChoice> choices) {
////        List<QuestionChoice> createdChoices = questionChoiceService.saveAll(choices);
////        return ResponseEntity.ok(createdChoices);
////    }
//
//    @GetMapping("/{questionId}")
//    public ResponseEntity<List<QuestionChoice>> getChoicesByQuestionId(@PathVariable Integer questionId) {
//        List<QuestionChoice> choices = questionChoiceService.findByQuestionId(questionId);
//        return ResponseEntity.ok(choices);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<QuestionChoice> getChoiceById(@PathVariable Integer id) {
//        QuestionChoice choice = questionChoiceService.findById(id);
//        return choice != null ? ResponseEntity.ok(choice) : ResponseEntity.notFound().build();
//    }
//
//    @PutMapping
//    public ResponseEntity<QuestionChoice> updateChoice(@RequestBody QuestionChoice choice) {
//        QuestionChoice updatedChoice = questionChoiceService.update(choice);
//        return ResponseEntity.ok(updatedChoice);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteChoice(@PathVariable Integer id) {
//        questionChoiceService.deleteById(id);
//        return ResponseEntity.noContent().build();
//    }
//}
