package com.example.backend.repository;

import com.example.backend.domain.ApprovalStatus;
import com.example.backend.domain.Translation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TranslationRepository extends JpaRepository<Translation, Long> {
    List<Translation> findByBookIdAndStatus(Long bookId, ApprovalStatus status);
    List<Translation> findByUploaderId(Long uploaderId);
}