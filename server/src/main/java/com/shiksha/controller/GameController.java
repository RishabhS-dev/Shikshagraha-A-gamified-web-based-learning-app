package com.shiksha.controller;

import com.shiksha.dto.GameSessionRequest;
import com.shiksha.model.GameSession;
import com.shiksha.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }
@GetMapping("/weekly")
public ResponseEntity<?> getWeeklyStats(Authentication auth) {
    String userEmail = auth.getName();
    return ResponseEntity.ok(gameService.getWeeklyStats(userEmail));
}

    @PostMapping("/save")
    public ResponseEntity<?> saveGame(Authentication auth,
                                      @RequestBody GameSessionRequest request) {

        String userEmail = auth.getName();

        GameSession session = new GameSession(
                userEmail,
                request.getScore(),
                request.getPhysicsCorrect(),
                request.getChemistryCorrect(),
                request.getTotalQuestions(),
                request.getTimeSpent()
        );

        gameService.saveSession(session);
        return ResponseEntity.ok(Map.of("status", "saved"));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication auth) {
        String userEmail = auth.getName();
        return ResponseEntity.ok(gameService.getStats(userEmail));
    }
}
