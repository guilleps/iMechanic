package com.backend.imechanic.config.auth.JWT;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.backend.imechanic.controller.response.LoginResponse;
import com.backend.imechanic.exception.IllegalArgumentException;
import com.backend.imechanic.exception.IllegalStateException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {
    private final Algorithm algorithm;
    private static final String ISSUER = "imechanic-api";

    public JwtService(@Value("${auth.secret.key}") String secretKey) {
        this.algorithm = Algorithm.HMAC256(secretKey);
    }

    public DecodedJWT verify(String token) {
        return JWT.require(algorithm)
                .withIssuer(ISSUER)
                .build()
                .verify(token);
    }

    public DecodedJWT verifyAndAssertType(String token, String expectedType) {
        DecodedJWT jwt = verify(token);
        String type = jwt.getClaim("type").asString();
        if (!expectedType.equals(type)) {
            throw new IllegalArgumentException("Invalid Token type");
        }
        return jwt;
    }

    public String extractSubject(String token) {
        return verify(token).getSubject();
    }

    public String extractJti(String token) {
        return verify(token).getId();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractSubject(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return verify(token).getExpiresAt().before(new Date());
    }

    public LoginResponse generateToken(UserDetails userDetails) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(60 * 30);
        String role = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElseThrow(()-> new IllegalStateException("User has no role"));
        String jti = UUID.randomUUID().toString();

        String token = JWT.create()
                .withIssuer(ISSUER)
                .withSubject(userDetails.getUsername())
                .withClaim("role", role)
                .withClaim("type", "access")
                .withJWTId(jti)
                .withIssuedAt(Date.from(now))
                .withNotBefore(Date.from(now))
                .withExpiresAt(Date.from(expiresAt))
                .sign(algorithm);

        return new LoginResponse(token, role, Date.from(expiresAt).getTime(), jti);
    }

    public String generateVerifyToken(String email) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(60 * 15);

        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(email)
                .withClaim("type", "verify")
                .withJWTId(UUID.randomUUID().toString())
                .withIssuedAt(Date.from(now))
                .withNotBefore(Date.from(now))
                .withExpiresAt(Date.from(expiresAt))
                .sign(algorithm);
    }
}
