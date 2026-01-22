package com.shiksha.model;

import java.util.List;

public class Question {

    private Long id;
    private String subject;   // PHYSICS / CHEMISTRY
    private String question;
    private List<String> options;

    public Question(Long id, String subject, String question, List<String> options) {
        this.id = id;
        this.subject = subject;
        this.question = question;
        this.options = options;
    }

    public Long getId() {
        return id;
    }

    public String getSubject() {
        return subject;
    }

    public String getQuestion() {
        return question;
    }

    public List<String> getOptions() {
        return options;
    }
}
