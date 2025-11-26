package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @GetMapping("/login-success")
    public String loginSuccess(@RequestParam String token) {
        return "<h1>Login Success!</h1>" +
                "<p>Your Token: <b>" + token + "</b></p>" +
                "<p>Copy this token and use it in Postman.</p>";
    }
}