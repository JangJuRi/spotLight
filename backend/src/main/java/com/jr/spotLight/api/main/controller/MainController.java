package com.jr.spotLight.api.main.controller;

import com.jr.spotLight.api.main.dto.RecommendRouteRequest;
import com.jr.spotLight.api.main.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MainController {
    private final MainService mainService;

    @GetMapping("/api/main/place/load")
    public ResponseEntity<?> loadPlace(String prompt) throws Exception {
        return ResponseEntity.ok(mainService.loadPlace(prompt));
    }

    @PostMapping("/api/main/recommend-route/load")
    public ResponseEntity<?> loadRecommendRoute(@RequestBody RecommendRouteRequest recommendRouteRequest) throws Exception {
        return ResponseEntity.ok(mainService.loadRecommendRoute(recommendRouteRequest));
    }
}
