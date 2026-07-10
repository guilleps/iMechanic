package com.backend.imechanic.model;

import com.backend.imechanic.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
@Builder
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;
    private String password;

    @Column(name = "is_account_non_expired")
    private boolean isAccountNonExpired; // uso en cuentas temporales, membresías, alumnos por semestre

    @Column(name = "is_account_non_locked")
    private boolean isAccountNonLocked; // muchos intentos fallidos, fraude, admin bloquea

    @Column(name = "is_credentials_non_expired")
    private boolean isCredentialsNonExpired; // credenciales expiradas, en caso se desee cambiar la contraseña cada X días

    @Column(name = "is_enabled")
    private boolean isEnabled; // verificación de cuenta por email, usuario desactivado, ban

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "jwt_id")
    private String jwtId;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Profile profile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Workshop workshop;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // asignacion del nuevo campo role, RBAC

    public void setProfile(Profile profile) {
        this.profile = profile;
        if (profile != null) profile.setUser(this);
    }

    // TODO: implementar RBAC basado en roles y permisos
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name())); // llamamos al rol por su nombre (identificador)
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return isAccountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isAccountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return isCredentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }
}
