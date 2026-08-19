package com.smartspend.controller;
import com.smartspend.entity.User;
import com.smartspend.service.UserService;
import  com.smartspend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    public AuthController(UserService userService, PasswordEncoder passwordEncoder){
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password){
        return userService.findByEmail(email).map(user -> {
            if (passwordEncoder.matches(password, user.getPassword())){
                return ResponseEntity.ok("Login successful");
            }else {
                return ResponseEntity.status(401).body("Invalid Password");
            }
        })
                .orElse(ResponseEntity.status(401).body("User not found"));
    }
}
