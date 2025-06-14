package com.jr.spotLight.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jr.spotLight.util.dto.HttpResponseDto;
import org.springframework.stereotype.Component;
import okhttp3.*;

import java.util.Map;

@Component
public class HttpUtil {

    public HttpResponseDto post(String url, RequestBody body, Headers headers) throws Exception {
        OkHttpClient client = new OkHttpClient();

        Request _request = new Request.Builder()
                .url(url)
                .headers(headers)
                .post(body)
                .build();

        Response _response = client.newCall(_request).execute();
        String responseBody = _response.body().string();

        ObjectMapper objectMapper = new ObjectMapper();
        Map json = objectMapper.readValue(responseBody, Map.class);

        return new HttpResponseDto(
                _response.code(),
                json
        );
    }

    public HttpResponseDto get(String url, Headers headers) throws Exception {
        OkHttpClient client = new OkHttpClient();

        Request _request = new Request.Builder()
                .url(url)
                .headers(headers)
                .get()
                .build();

        Response _response = client.newCall(_request).execute();
        String responseBody = _response.body().string();

        ObjectMapper objectMapper = new ObjectMapper();
        Map json = objectMapper.readValue(responseBody, Map.class);

        return new HttpResponseDto(
                _response.code(),
                json
        );
    }
}
