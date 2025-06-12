package com.jr.spotLight.api.main.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jr.spotLight.api.main.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MainController {
    private final MainService mainService;

    @GetMapping("/api/main/gemini/generate")
    public ResponseEntity<?> generateGemini(String prompt) throws JsonProcessingException {
        return ResponseEntity.ok(mainService.generateGemini(prompt));
    }
}
