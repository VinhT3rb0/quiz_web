package org.do_an.quiz_java.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.model.Category;
import org.do_an.quiz_java.respones.category.CategoryResponse;
import org.do_an.quiz_java.services.CategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.v1.prefix:/api/v1}/category")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {
    public final CategoryService categoryService;

    @GetMapping("/getAll")
    public List<CategoryResponse> getAll(){
        return categoryService.findAll();
    }


}
