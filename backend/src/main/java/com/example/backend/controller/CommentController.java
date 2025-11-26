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
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    @GetMapping("/translations/{translationId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long translationId) {
        return ResponseEntity.ok(commentService.getComments(translationId));
    }

    @PostMapping("/translations/{translationId}/comments")
    public ResponseEntity<String> addComment(
            @PathVariable Long translationId,
            @RequestBody CommentDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUser(userDetails);
        commentService.addComment(translationId, request, user);
        return ResponseEntity.ok("리뷰가 등록되었습니다.");
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<String> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUser(userDetails);
        commentService.updateComment(commentId, request, user);
        return ResponseEntity.ok("수정되었습니다.");
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUser(userDetails);
        commentService.deleteComment(commentId, user);
        return ResponseEntity.ok("삭제되었습니다.");
    }

    private User getUser(UserDetails userDetails) {
        if (userDetails == null) throw new RuntimeException("로그인이 필요합니다.");
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}