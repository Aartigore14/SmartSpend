package com.smartspend.repository;

import com.smartspend.entity.AiInsight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiInsightRepository extends JpaRepository<AiInsight, Long> {

    List<AiInsight> findByUserId(Long userId);
}