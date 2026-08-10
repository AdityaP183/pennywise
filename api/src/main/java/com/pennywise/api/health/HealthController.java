package com.pennywise.api.health;

import com.pennywise.api.common.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {
    @GetMapping
    public ApiResponse<HealthResponse> health(){
        return ApiResponse.success(
                "Pennywise API is running",
                new HealthResponse("ok")
        );
    }
}
