package com.jr.spotLight.api.main.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jr.spotLight.util.ApiResponse;
import com.jr.spotLight.util.GeminiUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MainService {
    private final GeminiUtil geminiUtil;

    public ApiResponse generateGemini(String prompt) throws JsonProcessingException {
        List<Map<String, String>> response = geminiUtil.gererateResponse(prompt);
        return ApiResponse.ok(response);
    }
}
