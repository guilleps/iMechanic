package com.backend.imechanic.config.auth.JWT;

import com.backend.imechanic.config.auth.cookie.CookieService;
import com.backend.imechanic.exception.UserNotFoundException;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final CookieService cookieService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String jwt = cookieService.extractCookie(request, "access_token");

        if (jwt == null || jwt.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        final String username = jwtService.extractSubject(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            final String tokenJti = jwtService.extractJti(jwt);

            UserEntity user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

            String currentJti = user.getJwtId();
            if (currentJti == null || !currentJti.equals(tokenJti)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }


}