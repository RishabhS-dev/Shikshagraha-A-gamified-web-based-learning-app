package com.shiksha.repository;

import com.shiksha.model.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameSessionRepository
        extends JpaRepository<GameSession, Long> {

    List<GameSession> findByUserEmail(String userEmail);
}
