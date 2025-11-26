package com.example.backend.service;

import com.example.backend.domain.Comment;
import com.example.backend.domain.Translation;
import com.example.backend.domain.User;
import com.example.backend.dto.CommentDto;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.TranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TranslationRepository translationRepository;

    @Transactional
    public void addComment(Long translationId, CommentDto request, User user) {
        Translation translation = translationRepository.findById(translationId)
                .orElseThrow(() -> new RuntimeException("Translation not found"));

        Comment comment = Comment.builder()
                .translation(translation)
                .user(user)
                .content(request.getContent())
                .rating(request.getRating())
                .createdAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getComments(Long translationId) {
        Translation translation = translationRepository.findById(translationId)
                .orElseThrow(() -> new RuntimeException("Translation not found"));

        return commentRepository.findAll().stream()
                .filter(c -> c.getTranslation().getId().equals(translationId))
                .map(c -> CommentDto.builder()
                        .id(c.getId())
                        .translationId(c.getTranslation().getId())
                        .userNickname(c.getUser().getNickname())
                        .content(c.getContent())
                        .rating(c.getRating())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}