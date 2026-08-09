package com.pennywise.api.auth.service;

import com.pennywise.api.auth.dto.request.LoginRequest;
import com.pennywise.api.auth.dto.request.RegisterRequest;
import com.pennywise.api.auth.dto.response.LoginResult;
import com.pennywise.api.auth.dto.response.UserResponse;
import com.pennywise.api.auth.model.RefreshToken;
import com.pennywise.api.auth.model.User;
import com.pennywise.api.auth.repository.UserRepository;
import com.pennywise.api.auth.security.JWTService;
import com.pennywise.api.common.exception.BadRequestException;
import com.pennywise.api.common.exception.UnauthorizedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JWTService jwtService,
            RefreshTokenService refreshTokenService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("user with that email already exists");
        }

        User user = new User();

        user.setId(UUID.randomUUID());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getCreatedAt(),
                savedUser.getUpdatedAt()
        );
    }

    @Override
    public LoginResult login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.email());

        if (userOptional.isEmpty()) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userOptional.get();

        boolean isPasswordCorrect = passwordEncoder.matches(request.password(), user.getPasswordHash());
        if (!isPasswordCorrect) {
            throw new BadRequestException("Invalid email or password");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.create(user);

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );

        return new LoginResult(
                userResponse,
                accessToken,
                refreshToken
        );
    }

    @Override
    public String refresh(String refreshToken) {
        RefreshToken storedToken = refreshTokenService.validate(refreshToken);

        User user = userRepository
                .findById(storedToken.getUserId())
                .orElseThrow(() ->
                        new UnauthorizedException("User associated with refresh token not found")
                );

        return jwtService.generateAccessToken(user);
    }

    @Override
    public void logout(String refreshToken) {
        RefreshToken storedToken =
                refreshTokenService.validate(refreshToken);

        refreshTokenService.revoke(storedToken);
    }
}