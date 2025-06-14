package com.jr.spotLight.util.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class HttpResponseDto {
    private Integer code;
    private Map<String, Object> data;

    public HttpResponseDto(Integer code, Map<String, Object> data) {
        this.code = code;
        this.data = data;
    }
}
