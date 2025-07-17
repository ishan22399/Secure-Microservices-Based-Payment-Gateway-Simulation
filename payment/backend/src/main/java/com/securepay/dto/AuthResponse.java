package com.securepay.dto;

import com.securepay.entity.Permission;
import com.securepay.entity.User;
import com.securepay.entity.UserRole;

import java.util.List;
import java.util.stream.Collectors;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new UserDto(user);
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public static class UserDto {
        private Long id;
        private String email;
        private String name;
        private UserRole role;
        private String avatar;
        private List<String> permissions;
        private String merchantId;
        private String bankId;

        public UserDto(User user) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.name = user.getName();
            this.role = user.getRole();
            this.avatar = user.getAvatar();
            this.permissions = user.getPermissions().stream().map(Permission::name).collect(Collectors.toList());
            this.merchantId = user.getMerchantId();
            this.bankId = user.getBankId();
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public UserRole getRole() {
            return role;
        }

        public void setRole(UserRole role) {
            this.role = role;
        }

        public String getAvatar() {
            return avatar;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public List<String> getPermissions() {
            return permissions;
        }

        public void setPermissions(List<String> permissions) {
            this.permissions = permissions;
        }

        public String getMerchantId() {
            return merchantId;
        }

        public void setMerchantId(String merchantId) {
            this.merchantId = merchantId;
        }

        public String getBankId() {
            return bankId;
        }

        public void setBankId(String bankId) {
            this.bankId = bankId;
        }
    }
}
