package com.shiksha.dto;

public class GameSessionRequest {

    private int score;
    private int physicsCorrect;
    private int chemistryCorrect;
    private int totalQuestions;
    private int timeSpent; // seconds

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getPhysicsCorrect() {
        return physicsCorrect;
    }

    public void setPhysicsCorrect(int physicsCorrect) {
        this.physicsCorrect = physicsCorrect;
    }

    public int getChemistryCorrect() {
        return chemistryCorrect;
    }

    public void setChemistryCorrect(int chemistryCorrect) {
        this.chemistryCorrect = chemistryCorrect;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(int timeSpent) {
        this.timeSpent = timeSpent;
    }
}
