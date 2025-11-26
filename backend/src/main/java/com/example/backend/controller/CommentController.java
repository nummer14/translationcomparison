package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.dto.CommentDto;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/translations")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    @GetMapping("/{translationId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long translationId) {
        return ResponseEntity.ok(commentService.getComments(translationId));
    }

    @PostMapping("/{translationId}/comments")
    public ResponseEntity<String> addComment(
            @PathVariable Long translationId,
            @RequestBody CommentDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        commentService.addComment(translationId, request, user);
        return ResponseEntity.ok("리뷰가 등록되었습니다.");
    }
}