package com.example.backend.dto;

import lombok.Data;

public class AuthDto {
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
    @Data
    public static class SignUpRequest {
        private String email;
        private String password;
        private String nickname;
    }
    @Data
    public static class TokenResponse {
        private String accessToken;
        public TokenResponse(String accessToken) { this.accessToken = accessToken; }
    }
}