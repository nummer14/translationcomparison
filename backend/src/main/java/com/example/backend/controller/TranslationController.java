package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.dto.TranslationDto;
import com.example.backend.repository.UserRepository; // 필수 추가
import com.example.backend.service.TranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails; // 필수 추가
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TranslationController {

    private final TranslationService translationService;
    private final UserRepository userRepository;

    @GetMapping("/books/{bookId}/translations")
    public ResponseEntity<List<TranslationDto>> getTranslations(@PathVariable Long bookId) {
        return ResponseEntity.ok(translationService.getApprovedTranslations(bookId));
    }

    @PostMapping("/books/{bookId}/translations")
    public ResponseEntity<String> proposeTranslation(
            @PathVariable Long bookId,
            @ModelAttribute TranslationDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        translationService.proposeTranslation(bookId, request, user);
        return ResponseEntity.ok("번역본 등록 요청이 완료되었습니다. 관리자 승인을 기다리세요.");
    }
}