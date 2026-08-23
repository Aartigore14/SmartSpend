package com.smartspend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_insights")
public class AiInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "insight_type", nullable = false, length = 50)
    private String insightType;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    public AiInsight() {
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }
    public String getInsightType() {
        return insightType;
    }
    public String getContent() {
        return content;
    }
    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public void setInsightType(String insightType) {
        this.insightType = insightType;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}