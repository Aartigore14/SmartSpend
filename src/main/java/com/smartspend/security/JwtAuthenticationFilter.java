
package com.smartspend.security;

import com.smartspend.entity.User;
import com.smartspend.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("❌ No Bearer token found");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            System.out.println("❌ JWT TOKEN INVALID");
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("✅ JWT TOKEN VALID");

        String email = jwtService.extractEmail(token);

        System.out.println("📧 JWT EMAIL: " + email);

        userService.findByEmail(email).ifPresentOrElse(user -> {

            System.out.println("✅ USER FOUND: " + user.getEmail());

            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                String role = user.getRole() != null
                        ? user.getRole()
                        : "USER";

                System.out.println("👤 ROLE: " + role);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

                System.out.println("🔐 AUTHENTICATION SET");
            }

        }, () -> {
            System.out.println("❌ USER NOT FOUND FOR EMAIL: " + email);
        });

        filterChain.doFilter(request, response);
    }
}