package com.jr.spotLight.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class GeminiUtil {
    private final Client client = new Client();

    public List<Map<String, String>> gererateResponse(String prompt) throws JsonProcessingException {
        String detailPrompt = "\n 장소명을 name, 주소를 address로 해서 최대 20개를 json 형태로 내려주라. " +
                "데이터가 몇개든 배열형태로 보내주고, 설명이나 추가 텍스트 없이 JSON 배열만 정확히 보내줘";

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.0-flash",
                        prompt + detailPrompt,
                        null);

        String text = CommonUtil.cleanJsonArray(response.text());
        ObjectMapper mapper = new ObjectMapper();

        List<Map<String, String>> places = mapper.readValue(text, new TypeReference<List<Map<String, String>>>(){});
        return places;
    }
}
