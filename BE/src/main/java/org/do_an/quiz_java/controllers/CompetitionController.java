package org.do_an.quiz_java.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.dto.CompetitionDTO;
import org.do_an.quiz_java.dto.QuizDTO;
import org.do_an.quiz_java.exceptions.DataNotFoundException;
import org.do_an.quiz_java.model.Competition;
import org.do_an.quiz_java.model.CompetitionQuiz;
import org.do_an.quiz_java.model.Quiz;
import org.do_an.quiz_java.model.User;
import org.do_an.quiz_java.repositories.CompetitionRepository;
import org.do_an.quiz_java.repositories.QuizRepository;
import org.do_an.quiz_java.respones.competition.CompetitionResponse;
import org.do_an.quiz_java.services.CompetitionService;
import org.do_an.quiz_java.services.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.v1.prefix:/api/v1}/competitions")
@RequiredArgsConstructor
@Slf4j
public class CompetitionController {
    private final CompetitionRepository competitionRepository;
    private final CompetitionService competitionService;
    private final QuizService   quizService;
    private final QuizRepository quizRepository;
    @GetMapping("/getAll")
    public List<CompetitionResponse> findAll() {
        return competitionService.findAll();
    }

    @GetMapping("/getById/{id}")
    public CompetitionResponse findById(@AuthenticationPrincipal User user,@PathVariable Integer id) {
        return competitionService.findByIdAndUser(id,user);
    }

    @GetMapping("/getByCode/{code}")
    public CompetitionResponse findById(@AuthenticationPrincipal User user,@PathVariable String code) {
        return competitionService.findByCode(code,user);
    }

    @PostMapping("/create")
    public CompetitionResponse create(@AuthenticationPrincipal User user, @RequestBody CompetitionDTO competitionDTO) throws DataNotFoundException {
        return competitionService.create(competitionDTO, user);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) {
        competitionService.delete(id);
    }

    @PutMapping("/update/{id}")
    public CompetitionResponse update(@PathVariable Integer id, @RequestBody CompetitionDTO competitionDTO) throws DataNotFoundException {
        return competitionService.update(id, competitionDTO);
    }

    @PostMapping("/clearAllQuizCache")
    public void clearAllQuizCache() {
        competitionService.clearAllQuizCache();
    }

    @PostMapping("/quiz/create/{competition_id}")
    public ResponseEntity createQuizForCompetition(@AuthenticationPrincipal User user,
                                                   @PathVariable Integer competition_id,
                                                   @RequestBody QuizDTO quizDTO) throws DataNotFoundException {
        Competition competition = competitionRepository.findById(competition_id).orElseThrow( () -> new DataNotFoundException("Competition not found"));
        competitionService.createQuizForCompetition(user, competition_id, quizDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/quiz/add/{competition_id}")
    public CompetitionResponse addQuizForCompetition(@AuthenticationPrincipal User user,
                                                @PathVariable Integer competition_id,
                                                @RequestParam Integer quizId) throws DataNotFoundException {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow( () -> new DataNotFoundException("Quiz not found"));
        Competition competition = competitionRepository.findById(competition_id).orElseThrow( () -> new DataNotFoundException("Competition not found"));
        if(competition.getOrganizedBy().getId() != user.getId()) {
            throw new DataNotFoundException("You are not the owner of this competition");
        }
        List<CompetitionQuiz> competitionQuizs = competition.getCompetitionQuizzes();
        for(CompetitionQuiz competitionQuiz : competitionQuizs) {
            if(competitionQuiz.getQuiz().getId() == quizId) {
                throw new DataNotFoundException("Quiz already added to this competition");
            }
        }
        competitionService.addQuizForCompetition( competition_id, quiz);
        return CompetitionResponse.fromEntity(competitionService.findById(competition_id));

    }

    @GetMapping("/user")
    public List<CompetitionResponse> findByUser(@AuthenticationPrincipal User user) {
        return competitionService.findByUser(user);
    }
}
