package com.jr.spotLight.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Component
public class PromptUtil {
    private static final String PROMPT_BASE_PATH = "prompts/";

    public String load(String fileName) {
        try {
            ClassPathResource resource = new ClassPathResource(PROMPT_BASE_PATH + fileName);
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                return reader.lines().collect(Collectors.joining("\n"));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load prompt file: " + fileName, e);
        }
    }
}
