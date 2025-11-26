package com.example.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Translation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    private String translator;
    private String publisher;
    private Integer publishedYear;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "external_link", columnDefinition = "TEXT")
    private String externalLink;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id")
    private User uploader;

    @Column(name = "image_path")
    private String imagePath;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "translation", cascade = CascadeType.REMOVE)
    private List<Comment> comments;

    public void approve() { this.status = ApprovalStatus.APPROVED; }
    public void reject() { this.status = ApprovalStatus.REJECTED; }
}