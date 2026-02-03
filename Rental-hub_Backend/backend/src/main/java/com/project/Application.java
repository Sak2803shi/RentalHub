package com.project;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableFeignClients   // 🔥 REQUIRED for Microservices communication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	// ✅ ModelMapper Bean
	@Bean
	public ModelMapper modelMapper() {
		ModelMapper mapper = new ModelMapper();

		mapper.getConfiguration()
				.setPropertyCondition(Conditions.isNotNull())   // ignore null fields
				.setMatchingStrategy(MatchingStrategies.STRICT); // strict mapping

		return mapper;
	}
}
