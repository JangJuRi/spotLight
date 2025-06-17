package com.jr.spotLight.builder;

import com.jr.spotLight.util.PromptUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringSubstitutor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class PromptBuilder {

    private final PromptUtil promptUtil;

    public String recommendPlaceFilterPrompt() {
        StringBuilder prompt = new StringBuilder();

        prompt.append(promptUtil.load("place/recommend_prompt.txt")).append("\n");

        return prompt.toString();
    }

    public String recommendRouteFilterPrompt(String location) {
        StringBuilder prompt = new StringBuilder();

        prompt.append(promptUtil.load("route/recommend_prompt.txt")).append("\n");

        Map<String, String> values = Map.of(
                "location", location
        );

        return new StringSubstitutor(values).replace(prompt.toString());
    }

    public String recommendRouteDescriptionPrompt() {
        return promptUtil.load("route/description_prompt.txt");
    }
}