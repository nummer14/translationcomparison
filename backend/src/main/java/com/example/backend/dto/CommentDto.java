package com.example.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private Long id;
    private Long translationId;
    private Long userId;
    private String userNickname;
    private String content;
    private int rating;
    private LocalDateTime createdAt;
}