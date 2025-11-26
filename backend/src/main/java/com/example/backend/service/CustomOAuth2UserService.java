package com.example.backend.service;

import com.example.backend.domain.Role;
import com.example.backend.domain.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // google
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName(); // sub

        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        if (email == null) {
            email = registrationId + "_" + attributes.get("id") + "@no-email.com";
        }

        User user = saveOrUpdate(attributes, email, registrationId);

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                attributes,
                userNameAttributeName
        );
    }

    private User saveOrUpdate(Map<String, Object> attributes, String email, String registrationId) {
        User user = userRepository.findByEmail(email)
                .orElse(User.builder()
                        .email(email)
                        .nickname((String) attributes.get("name"))
                        .role(Role.USER)
                        .provider(registrationId)
                        .providerId(String.valueOf(attributes.get("sub")))
                        .build());

        return userRepository.save(user);
    }
}