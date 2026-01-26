package com.backend.imechanic.config.auth.cookie;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;


@Service
public class CookieService {

    private final boolean secureCookie;
    private final String sameSite;

    public CookieService(
            @Value("${auth.cookie.secure:true}") boolean secureCookie,
            @Value("${auth.cookie.same-site:Lax}") String sameSite
    ) {
        this.secureCookie = secureCookie;
        this.sameSite = sameSite;
    }

    public String setCookie(String name, String value) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .sameSite(sameSite)
                .maxAge(3600)
                .build()
                .toString();
    }

    public String extractCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) return cookie.getValue();
        }
        return null;
    }

    public String clearCookie(String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .sameSite(sameSite)
                .maxAge(0)
                .build()
                .toString();
    }
}
