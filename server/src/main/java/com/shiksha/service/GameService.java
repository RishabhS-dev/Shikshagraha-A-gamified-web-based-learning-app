package com.shiksha.service;

import com.shiksha.model.GameSession;
import com.shiksha.repository.GameSessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final GameSessionRepository gameSessionRepository;

    public GameService(GameSessionRepository gameSessionRepository) {
        this.gameSessionRepository = gameSessionRepository;
    }

    // ✅ SAVE GAME SESSION (DB)
    public void saveSession(GameSession session) {
        gameSessionRepository.save(session);
    }

    // ✅ OVERALL STATS (DB)
    public Map<String, Object> getStats(String userEmail) {

        List<GameSession> userSessions =
                gameSessionRepository.findByUserEmail(userEmail);

        int totalGames = userSessions.size();
        if (totalGames == 0) {
            return Map.of(
                    "totalGames", 0,
                    "overallAccuracy", 0,
                    "physicsAccuracy", 0,
                    "chemistryAccuracy", 0,
                    "weakSubject", "NONE"
            );
        }

        int totalCorrect = 0;
        int physicsCorrect = 0;
        int chemistryCorrect = 0;
        int totalQuestions = 0;

        for (GameSession s : userSessions) {
            physicsCorrect += s.getPhysicsCorrect();
            chemistryCorrect += s.getChemistryCorrect();
            totalCorrect += s.getPhysicsCorrect() + s.getChemistryCorrect();
            totalQuestions += s.getTotalQuestions();
        }

        int overallAccuracy = (totalCorrect * 100) / totalQuestions;
        int physicsAccuracy = (physicsCorrect * 100) / totalQuestions;
        int chemistryAccuracy = (chemistryCorrect * 100) / totalQuestions;

        String weakSubject =
                physicsAccuracy < chemistryAccuracy ? "PHYSICS" : "CHEMISTRY";

        return Map.of(
                "totalGames", totalGames,
                "overallAccuracy", overallAccuracy,
                "physicsAccuracy", physicsAccuracy,
                "chemistryAccuracy", chemistryAccuracy,
                "weakSubject", weakSubject
        );
    }

    // ✅ WEEKLY ANALYTICS (DB)
    public List<Map<String, Object>> getWeeklyStats(String userEmail) {

        List<GameSession> userSessions =
                gameSessionRepository.findByUserEmail(userEmail);

        LocalDate today = LocalDate.now();

        return userSessions.stream()
                .filter(s -> s.getPlayedAt().toLocalDate()
                        .isAfter(today.minusDays(7)))
                .collect(Collectors.groupingBy(
                        s -> s.getPlayedAt().toLocalDate()
                ))
                .entrySet()
                .stream()
                .map(entry -> {

                    List<GameSession> daySessions = entry.getValue();

                    int totalCorrect = 0;
                    int totalQuestions = 0;

                    for (GameSession s : daySessions) {
                        totalCorrect += s.getPhysicsCorrect()
                                + s.getChemistryCorrect();
                        totalQuestions += s.getTotalQuestions();
                    }

                    int accuracy =
                            totalQuestions == 0 ? 0 :
                                    (totalCorrect * 100) / totalQuestions;

                    Map<String, Object> map = new HashMap<>();
                    map.put("date", entry.getKey().toString());
                    map.put("games", daySessions.size());
                    map.put("accuracy", accuracy);
                    return map;
                })
                .sorted(Comparator.comparing(a -> a.get("date").toString()))
                .toList();
    }
}
