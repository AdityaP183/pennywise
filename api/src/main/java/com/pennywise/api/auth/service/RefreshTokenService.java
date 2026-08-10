package com.pennywise.api.auth.service;

import com.pennywise.api.auth.model.RefreshToken;
import com.pennywise.api.auth.model.User;

public interface RefreshTokenService {
    String create(User user);

    RefreshToken validate(String token);

    void revoke(RefreshToken refreshToken);
}
