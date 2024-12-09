package org.do_an.quiz_java.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.model.Category;
import org.do_an.quiz_java.repositories.CategoryRepository;
import org.do_an.quiz_java.respones.category.CategoryResponse;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CategoryService {
    private  final CategoryRepository categoryRepository;

    public Category find(Integer id){
        if (categoryRepository.findById(id).isPresent()) {
            return categoryRepository.findById(id).get();

        } else {
            System.out.println("No value present in Optional");
            return null;
        }
    }
//    @Cacheable(value = "categories" , key = "#root.methodName")
    public List<CategoryResponse> findAll(){
        return CategoryResponse.fromEntities(categoryRepository.findAll());
    }
}
