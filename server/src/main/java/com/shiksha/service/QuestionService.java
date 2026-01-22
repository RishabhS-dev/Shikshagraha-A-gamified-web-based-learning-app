package com.shiksha.service;

import com.shiksha.model.Question;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    // 🔒 MASTER QUESTION BANK
    private final List<Question> questionBank = List.of(

        /* ---------- PHYSICS ---------- */
        new Question(1L, "PHYSICS", "The SI unit of electric current is:",
                List.of("Ampere", "Volt", "Ohm", "Watt")),

        new Question(2L, "PHYSICS", "Which law gives the relation F = ma?",
                List.of("Newton’s First Law", "Newton’s Second Law",
                        "Newton’s Third Law", "Law of Gravitation")),

        new Question(3L, "PHYSICS", "The resistance of a wire depends on:",
                List.of("Length", "Area of cross-section",
                        "Material", "All of the above")),

        new Question(4L, "PHYSICS", "The focal length of a concave mirror is:",
                List.of("Positive", "Negative", "Zero", "Infinite")),

        new Question(5L, "PHYSICS", "The unit of electric power is:",
                List.of("Volt", "Ampere", "Watt", "Ohm")),

        /* ---------- CHEMISTRY ---------- */
        new Question(6L, "CHEMISTRY", "pH value of a neutral solution is:",
                List.of("0", "7", "14", "10")),

        new Question(7L, "CHEMISTRY", "Which acid is present in lemon?",
                List.of("Acetic acid", "Citric acid",
                        "Sulphuric acid", "Hydrochloric acid")),

        new Question(8L, "CHEMISTRY", "The chemical formula of washing soda is:",
                List.of("Na2CO3·10H2O", "NaHCO3", "CaCO3", "NaCl")),

        new Question(9L, "CHEMISTRY",
                "Which gas is evolved during reaction of zinc with HCl?",
                List.of("Oxygen", "Carbon dioxide", "Hydrogen", "Nitrogen")),

        new Question(10L, "CHEMISTRY", "Rusting of iron is an example of:",
                List.of("Reduction", "Oxidation",
                        "Displacement", "Neutralization"))
    );

    /**
     * 🎮 Returns randomized questions per game
     */
    public List<Question> getRandomQuestions(int totalCount) {

        int half = totalCount / 2;

        List<Question> physics = questionBank.stream()
                .filter(q -> q.getSubject().equals("PHYSICS"))
                .collect(Collectors.toList());

        List<Question> chemistry = questionBank.stream()
                .filter(q -> q.getSubject().equals("CHEMISTRY"))
                .collect(Collectors.toList());

        Collections.shuffle(physics);
        Collections.shuffle(chemistry);

        List<Question> selected = new ArrayList<>();
        selected.addAll(physics.stream().limit(half).toList());
        selected.addAll(chemistry.stream().limit(half).toList());

        Collections.shuffle(selected); // final mix
        return selected;
    }
}
