package com.example.TodoListProject;

import com.example.TodoListProject.Service.ShopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;



@Component
@RequiredArgsConstructor
@Slf4j
public class ShopDataInitializer implements ApplicationRunner {

    private final ShopService shopService;

    @Override
    public void run(ApplicationArguments args) {
        try {
            shopService.initializeShopData();
        } catch (Exception e) {
            log.error("상점 데이터 초기화 실패: ", e);
        }
    }
}