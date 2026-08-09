package com.pennywise.api.auth.controller;

import com.pennywise.api.auth.dto.request.LoginRequest;
import com.pennywise.api.auth.dto.request.RegisterRequest;
import com.pennywise.api.auth.dto.response.LoginResult;
import com.pennywise.api.auth.dto.response.UserResponse;
import com.pennywise.api.auth.security.AuthCookie;
import com.pennywise.api.auth.service.AuthService;
import com.pennywise.api.common.exception.UnauthorizedException;
import com.pennywise.api.common.response.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final AuthCookie authCookie;

    public AuthController(AuthService authService, AuthCookie authCookie) {
        this.authService = authService;
        this.authCookie = authCookie;
    }

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        UserResponse response = authService.register(request);

        return ApiResponse.success(
                "User registered successfully",
                response
        );
    }

    @PostMapping("/login")
    public ApiResponse<UserResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ){
        LoginResult result = authService.login(request);

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                authCookie.accessToken(result.accessToken()).toString()
        );

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                authCookie.refreshToken(result.refreshToken()).toString()
        );

        return ApiResponse.success(
                "User logged in successfully",
                result.user()
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ){
        String refreshToken = getRefreshToken(request);

        String accessToken =
                authService.refresh(refreshToken);

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                authCookie.accessToken(accessToken).toString()
        );

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
        HttpServletRequest request,
        HttpServletResponse response
    ){
        String refreshToken = getRefreshToken(request);

        authService.logout(refreshToken);

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                authCookie.clearAccessToken().toString()
        );

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                authCookie.clearRefreshToken().toString()
        );

        return ResponseEntity.noContent().build();
    }

    private String getRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            throw new UnauthorizedException(
                    "Refresh token is missing"
            );
        }

        for (Cookie cookie : cookies) {

            if ("refresh_token".equals(cookie.getName())) {
                String token = cookie.getValue();

                if (token != null && !token.isBlank()) {
                    return token;
                }
            }
        }

        throw new UnauthorizedException(
                "Refresh token is missing"
        );
    }
}
