package com.ccnb.app;

import org.springframework.boot.SpringApplication;

public class TestCcnbAppApplication {

	public static void main(String[] args) {
		SpringApplication.from(CcnbAppApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
