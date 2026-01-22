package com.shiksha.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_sessions")
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private int score;
    private int physicsCorrect;
    private int chemistryCorrect;
    private int totalQuestions;
    private int timeSpent;

    private LocalDateTime playedAt = LocalDateTime.now();

    public GameSession() {}

    public GameSession(String userEmail, int score,
                       int physicsCorrect, int chemistryCorrect,
                       int totalQuestions, int timeSpent) {
        this.userEmail = userEmail;
        this.score = score;
        this.physicsCorrect = physicsCorrect;
        this.chemistryCorrect = chemistryCorrect;
        this.totalQuestions = totalQuestions;
        this.timeSpent = timeSpent;
    }

    public String getUserEmail() { return userEmail; }
    public int getScore() { return score; }
    public int getPhysicsCorrect() { return physicsCorrect; }
    public int getChemistryCorrect() { return chemistryCorrect; }
    public int getTotalQuestions() { return totalQuestions; }
    public int getTimeSpent() { return timeSpent; }
    public LocalDateTime getPlayedAt() { return playedAt; }
}
