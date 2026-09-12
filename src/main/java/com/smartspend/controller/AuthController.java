package com.smartspend.controller;
import com.smartspend.entity.User;
import com.smartspend.service.UserService;
import  com.smartspend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.smartspend.security.JwtService;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService){
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password){
        return userService.findByEmail(email).map(user -> {
            if (passwordEncoder.matches(password, user.getPassword())){
                String token = jwtService.generateToken(user.getId(),user.getEmail(),user.getRole());
                return ResponseEntity.ok(new LoginResponse(token, user.getId(),user.getName(),user.getEmail(),user.getRole()));
            }else {
                return ResponseEntity.status(401).body("Invalid Password");
            }
        })
                .orElse(ResponseEntity.status(401).body("User not found"));
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {
            User registeredUser = userService.registerUser(user);

            registeredUser.setPassword(null);

            return ResponseEntity.ok(registeredUser);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    public  record  LoginResponse(String token, Long userId, String name, String email, String role){}
}
