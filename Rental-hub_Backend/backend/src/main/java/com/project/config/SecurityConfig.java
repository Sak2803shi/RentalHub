package com.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.project.security.JwtAuthFilter;

@Configuration
@EnableMethodSecurity   // 🔥 Enables @PreAuthorize
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // Static resources
                .requestMatchers(
                        "/",
                        "/index.html",
                        "/dashboard.html",
                        "/style.css",
                        "/script.js",
                        "/css/**",
                        "/js/**"
                ).permitAll()

                // Public endpoints
                .requestMatchers(
                        "/api/auth/**",
                        "/api/agents/register",
                        "/api/owners/register",
                        "/api/customers/register",
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**"
                ).permitAll()

                // 👑 ADMIN routes
                .requestMatchers("/admin/**").hasRole("ADMIN")

                // Property APIs
                .requestMatchers(HttpMethod.GET, "/api/properties/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/properties/**").hasAnyRole("OWNER","ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/properties/**").hasAnyRole("OWNER","ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/properties/**").hasAnyRole("OWNER","ADMIN")

                // Role-specific modules
                .requestMatchers("/api/agents/**").hasRole("AGENT")
                .requestMatchers("/api/owners/**").hasRole("OWNER")
                .requestMatchers("/api/customers/**").hasAnyRole("CUSTOMER","OWNER","AGENT")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔐 Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔑 Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // 👑 ROLE HIERARCHY (Admin becomes super user)
    @Bean
    public RoleHierarchyImpl roleHierarchy() {
        RoleHierarchyImpl hierarchy = new RoleHierarchyImpl();
        hierarchy.setHierarchy("""
            ROLE_ADMIN > ROLE_OWNER
            ROLE_OWNER > ROLE_AGENT
            ROLE_AGENT > ROLE_CUSTOMER
        """);
        return hierarchy;
    }
}
