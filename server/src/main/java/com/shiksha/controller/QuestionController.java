package com.shiksha.controller;

import com.shiksha.model.Question;
import com.shiksha.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // 🎯 Example: /api/questions?count=10
    @GetMapping
    public List<Question> getQuestions(
            @RequestParam(defaultValue = "10") int count) {

        return questionService.getRandomQuestions(count);
    }
}
