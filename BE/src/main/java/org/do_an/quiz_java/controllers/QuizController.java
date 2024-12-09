package org.do_an.quiz_java.controllers;

import com.cloudinary.api.exceptions.BadRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.dto.QuizDTO;
import org.do_an.quiz_java.dto.ResultDTO;
import org.do_an.quiz_java.dto.UpdateQuizDTO;
import org.do_an.quiz_java.exceptions.DataNotFoundException;
import org.do_an.quiz_java.model.Category;
import org.do_an.quiz_java.model.Quiz;
import org.do_an.quiz_java.model.User;
import org.do_an.quiz_java.repositories.CategoryRepository;
import org.do_an.quiz_java.repositories.QuizRepository;
import org.do_an.quiz_java.repositories.UserRepository;
import org.do_an.quiz_java.respones.Response;
import org.do_an.quiz_java.respones.category.CategoryQuizResponse;
import org.do_an.quiz_java.respones.quiz.QuizResponse;
import org.do_an.quiz_java.respones.result.ResultResponse;
import org.do_an.quiz_java.services.CloudinaryService;
import org.do_an.quiz_java.services.QuestionService;
import org.do_an.quiz_java.services.QuizService;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${api.v1.prefix:/api/v1}/quizs")
@RequiredArgsConstructor
@Slf4j
public class QuizController {
    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuizService quizService;

    private final QuestionService questionService;
    private final CloudinaryService cloudinaryService;
    private final CategoryRepository categoryRepository;
    @GetMapping("/getAll")
    public Page<Quiz> findAll(Pageable pageable,
                              @RequestParam(required = false, defaultValue = "false") Boolean published) {

        if (published) {
            return quizService.findAllPublished(pageable);
        } else {
            return quizService.findAll(pageable);
        }
    }
    @PostMapping(value = "/create")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.CREATED)
    public QuizResponse save(@AuthenticationPrincipal User user,
                             @RequestBody QuizDTO quizDTO
//                             @ModelAttribute("file") MultipartFile file
    ) throws DataNotFoundException {

//        if(result.hasErrors()){
//            System.out.print("Một hoặc nhiều trường truyền vào không hợp lệ!") ;
//        }
        return QuizResponse.fromEntity(quizService.save(quizDTO, user));
    }
    @PostMapping(value = "/image/{quiz_id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public QuizResponse uploadImage(@AuthenticationPrincipal User user,
                                    @PathVariable Integer quiz_id,
                                    @RequestPart("file") MultipartFile file
    ) throws DataNotFoundException {
        if (!quizService.findByQuizId(quiz_id).getCreatedBy().getId().equals(user.getId())) {
            throw new DataNotFoundException("You are not the owner of this quiz");
        }

        return quizService.updateQuizWithImage(file, quiz_id);
    }
    @GetMapping("search")
    public Page<QuizResponse> searchAll(Pageable pageable, @RequestParam(required = true) String filter,
                                @RequestParam(required = false, defaultValue = "false") Boolean onlyValid) {

        return quizService.search(filter, pageable);
    }

    @GetMapping("/{quiz_id}")
    public QuizResponse find(@PathVariable Integer quiz_id) throws DataNotFoundException {
        Quiz quiz = quizService.findByQuizId(quiz_id);
        QuizResponse quizResponse = QuizResponse.fromEntity(quiz);
        return quizResponse;
    }
//    @GetMapping(value = "/{quiz_id}/questions")
//    @ResponseStatus(HttpStatus.OK)
//    public List<Question> findQuestions(@PathVariable Integer quiz_id,
//                                        @RequestParam(required = false, defaultValue = "false") Boolean onlyValid) throws DataNotFoundException {
//
//        Optional<Quiz> quiz = quizService.find(quiz_id);
//
//        if (onlyValid) {
//            return questionService.findValidQuestionsByQuiz(quiz);
//        } else {
//            return questionService.findQuestionsByQuiz(quiz);
//        }
//
//    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user")
    public List<QuizResponse> findQuizByUser(@AuthenticationPrincipal User user) {
        log.info("User: {}", user);
        return quizService.findQuizByUser(user);
    }
    @GetMapping("category/{category_id}")
    public CategoryQuizResponse findQuizByCategory(@PathVariable Integer category_id) {
        return quizService.findQuizByCategory(category_id);
    }

    @GetMapping("/getAllQuiz")
    public List<QuizResponse> findAllQuiz() {

        return quizService.findAllQuiz();
    }
    @GetMapping("/getAllQuizByCategory")
    public List<CategoryQuizResponse> findAllQuizByCategory() {

        return quizService.getAllQuizByCategory();
    }
    @PostMapping(value = "/submit")
    @PreAuthorize("isAuthenticated()")
    public ResultResponse submit(@AuthenticationPrincipal User user,
                                 @RequestBody ResultDTO resultDTO ) {

//        if(result.hasErrors()){
//            System.out.print("Một hoặc nhiều trường truyền vào không hợp lệ!") ;
//        }

        return quizService.submit(resultDTO, user);
    }
    @DeleteMapping("/{quiz_id}")
    @PreAuthorize("isAuthenticated()")
    public void delete(@AuthenticationPrincipal User user, @PathVariable Integer quiz_id) throws DataNotFoundException {
        if (!quizService.findByQuizId(quiz_id).getCreatedBy().getId().equals(user.getId())) {
            throw new DataNotFoundException("You are not the owner of this quiz");
        }
        quizService.delete( quiz_id);
    }
    @PutMapping("/update/{quiz_id}")
    @PreAuthorize("isAuthenticated()")
    public QuizResponse update(@AuthenticationPrincipal User user,
                               @PathVariable Integer quiz_id,
                               @RequestBody UpdateQuizDTO updateQuizDTO) throws DataNotFoundException {
        if (!quizService.findByQuizId(quiz_id).getCreatedBy().getId().equals(user.getId())) {
            throw new DataNotFoundException("You are not the owner of this quiz");
        }
        return quizService.update(updateQuizDTO);
    }

    @PostMapping("/publish/{quiz_id}")
    @PreAuthorize("isAuthenticated()")
    public QuizResponse publishQuiz(@AuthenticationPrincipal User user,
                                   @PathVariable Integer quiz_id
                                   ) throws DataNotFoundException {
        if (!quizService.findByQuizId(quiz_id).getCreatedBy().getId().equals(user.getId())) {
            throw new DataNotFoundException("You are not the owner of this quiz");
        }
        return quizService.publishQuiz(quiz_id);
    }

    @PostMapping("/unpublish/{quiz_id}")
    @PreAuthorize("isAuthenticated()")
    public QuizResponse unPublishQuiz(@AuthenticationPrincipal User user,
                                    @PathVariable Integer quiz_id
    ) throws DataNotFoundException {
        if (!quizService.findByQuizId(quiz_id).getCreatedBy().getId().equals(user.getId())) {
            throw new DataNotFoundException("You are not the owner of this quiz");
        }
        return quizService.unPublishQuiz(quiz_id);
    }

    @GetMapping("/category/search")
    public List<QuizResponse> searchByCategory(@RequestParam(required = true) String filter, @RequestParam Integer categoryId) throws DataNotFoundException {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new DataNotFoundException("Category not found"));
        return quizService.searchByCategory(filter, category.getId());
    }
    @PostMapping("/clearAllQuizCache")
    public void clearAllQuizCache() {
        quizService.clearAllQuizCache();
    }

    @PostMapping("/favorite/{quizId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity addFavoriteQuiz(@AuthenticationPrincipal User user,
                                     @PathVariable Integer quizId) throws DataNotFoundException {
        Quiz quiz = quizService.findByQuizId(quizId);
        if (quiz == null) {
            throw new DataNotFoundException("Quiz not found");
        }
        quizService.addFavoriteQuiz(user, quiz);
        return ResponseEntity.ok(" Add quiz to favorite list successfully " );
    }

    @DeleteMapping("/unfavorite/{quizId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity removeFavoriteQuiz(@AuthenticationPrincipal User user,
                                        @PathVariable Integer quizId) throws DataNotFoundException {
        quizService.removeFavoriteQuiz(user, quizId);
        return ResponseEntity.ok(" Remove quiz from favorite list successfully " );
    }

    @GetMapping ("/favorite/user")
    @PreAuthorize("isAuthenticated()")
    public List<QuizResponse> findFavoriteQuiz(@AuthenticationPrincipal User user) {
        return quizService.findFavoriteQuiz(user);
    }

    @GetMapping("/favorite/{quizId}")
    public boolean isFavorite(@AuthenticationPrincipal User user, @PathVariable Integer quizId) {
        return quizService.isFavorite(user, quizId);
    }

    @GetMapping("/generate")
    public ResponseEntity<Response> generateQuiz(@AuthenticationPrincipal User user, @RequestParam String topic , @RequestParam Integer numberOfQuestions ,@RequestParam String language) {
        if (numberOfQuestions > 2) {
            return ResponseEntity.badRequest().body(new Response("Error","Number of questions must be less than 2", null));
        }
        if(numberOfQuestions > user.getPoint()) {
            return ResponseEntity.badRequest().body(new Response("Error","Number of questions must be more than user point", null));
        }
        String quizzes= quizService.generateQuiz(topic, numberOfQuestions , language);
        user.setPoint(user.getPoint() - numberOfQuestions);
        userRepository.save(user);
        return ResponseEntity.ok(new Response("Success", "Generate quiz successfully", quizzes));
    }
}
