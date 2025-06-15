package com.jr.spotLight.api.main.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecommendRouteRequest {
    private String location;
    private List<String> courseIdList;
    private String selectedTargetId;
    private String selectedCombinationId;
}
