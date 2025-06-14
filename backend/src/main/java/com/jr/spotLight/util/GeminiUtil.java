package com.jr.spotLight.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GeminiUtil {
    private final Client client = new Client();

    public GenerateContentResponse generateResponse(String prompt) throws JsonProcessingException {
        String basicPrompt = "\n 설명이나 추가 텍스트 없이 데이터만 보내줘. " +
                "데이터가 없거나 추출하기 어려운 경우 빈 배열 형태로 보내줘";
        return client.models.generateContent(
                        "gemini-2.0-flash",
                        prompt + basicPrompt,
                        null);
    }
}
