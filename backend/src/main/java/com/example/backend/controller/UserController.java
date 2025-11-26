package com.example.backend.controller;

import com.example.backend.domain.Comment;
import com.example.backend.domain.Translation;
import com.example.backend.domain.User;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.TranslationRepository;
import com.example.backend.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final TranslationRepository translationRepository;

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = getUser(userDetails);
        return ResponseEntity.ok(new UserInfoResponse(user));
    }

    @GetMapping("/me/comments")
    public ResponseEntity<List<MyCommentDto>> getMyComments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);

        List<MyCommentDto> list = commentRepository.findByUserId(user.getId()).stream()
                .map(c -> new MyCommentDto(c))
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @GetMapping("/me/translations")
    public ResponseEntity<List<MyTranslationDto>> getMyTranslations(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);

        List<MyTranslationDto> list = translationRepository.findByUploaderId(user.getId()).stream()
                .map(t -> new MyTranslationDto(t))
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    private User getUser(UserDetails userDetails) {
        if (userDetails == null) throw new RuntimeException("Unauthorized");
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Data
    static class UserInfoResponse {
        private Long id; private String email; private String nickname; private String role;
        public UserInfoResponse(User user) { this.id=user.getId(); this.email=user.getEmail(); this.nickname=user.getNickname(); this.role=user.getRole().name(); }
    }

    @Data
    static class MyCommentDto {
        private Long id;
        private String content;
        private int rating;
        private String bookTitle;
        private String publisher;
        private Long translationId;
        private String createdAt;

        public MyCommentDto(Comment c) {
            this.id = c.getId();
            this.content = c.getContent();
            this.rating = c.getRating();
            this.bookTitle = c.getTranslation().getBook().getTitle();
            this.publisher = c.getTranslation().getPublisher();
            this.translationId = c.getTranslation().getId();
            this.createdAt = c.getCreatedAt().toString();
        }
    }

    @Data
    static class MyTranslationDto {
        private Long id;
        private String bookTitle;
        private String translator;
        private String publisher;
        private String status;

        public MyTranslationDto(Translation t) {
            this.id = t.getId();
            this.bookTitle = t.getBook().getTitle();
            this.translator = t.getTranslator();
            this.publisher = t.getPublisher();
            this.status = t.getStatus().name();
        }
    }
}