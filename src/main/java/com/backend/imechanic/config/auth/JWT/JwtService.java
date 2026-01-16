package com.backend.imechanic.config.auth.JWT;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.backend.imechanic.controller.response.LoginResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {
    private final Algorithm algorithm;

    public JwtService(@Value("${auth.secret.key}") String secretKey) {
        this.algorithm = Algorithm.HMAC256(secretKey);
    }

    public LoginResponse generateToken(UserDetails userDetails) {

        String issuer = "imechanic-api";
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(60 * 15);
        String role = userDetails.getAuthorities().toString();

        String token = JWT.create()
                .withIssuer(issuer)
                .withSubject(userDetails.getUsername())
                .withClaim("role", role)
                .withNotBefore(Date.from(now))
                .withJWTId(UUID.randomUUID().toString())
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(expiresAt))
                .sign(algorithm);

        return new LoginResponse(token, role, Date.from(expiresAt).getTime());
    }

    public String extractUsername(String token) {
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer("auth0")
                .build();

        DecodedJWT decodedJWT = verifier.verify(token);

        return decodedJWT.getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = JWT.require(algorithm)
                .build()
                .verify(token)
                .getExpiresAt();

        return expiration.before(new Date());
    }

}
