package com.example.backend.controller;

import com.example.backend.domain.Book;
import com.example.backend.domain.Bookmark;
import com.example.backend.domain.User;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.BookmarkRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @PostMapping("/{bookId}")
    public ResponseEntity<String> toggleBookmark(
            @PathVariable Long bookId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(401).body("로그인 필요");

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        return bookmarkRepository.findByUserIdAndBookId(user.getId(), bookId)
                .map(bookmark -> {
                    bookmarkRepository.delete(bookmark);
                    return ResponseEntity.ok("찜 취소");
                })
                .orElseGet(() -> {
                    bookmarkRepository.save(Bookmark.builder().user(user).book(book).build());
                    return ResponseEntity.ok("찜 완료");
                });
    }

    @GetMapping("/me")
    public ResponseEntity<List<Book>> getMyBookmarks(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Book> books = bookmarkRepository.findByUserId(user.getId()).stream()
                .map(Bookmark::getBook)
                .collect(Collectors.toList());

        return ResponseEntity.ok(books);
    }
}