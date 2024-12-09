package org.do_an.quiz_java.controllers;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.do_an.quiz_java.exceptions.DataNotFoundException;
import org.do_an.quiz_java.model.User;
import org.do_an.quiz_java.respones.Response;
import org.do_an.quiz_java.respones.payment.PaymentResponse;
import org.do_an.quiz_java.services.PaymentService;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping("${api.v1.prefix}/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @Value("${redirectUrl}")
    private String redirectUrl;

    @Value("${ipUrl}")
    private String ipUrl;


//    @GetMapping("/momo")
//    public String payWithMoMo(
//    ) {
//
//        String orderId = RandomStringUtils.randomAlphanumeric(10);
//        long amount = 1000;
//        String redirectUrl = "https://api.thinhtran.online/home/pay-success";
//        String ipnUrl = "https://api.thinhtran.online/";
//
//        return paymentService.payWithMoMo(orderId, amount, redirectUrl, ipnUrl);
//    }

    @PostMapping("")
    public ResponseEntity<?> pay(@AuthenticationPrincipal User user,
            @RequestParam int amount
//            ,
//            @RequestParam(defaultValue = "false", required = false)
//            boolean isMoMo
    ) throws DataNotFoundException {
        if(amount <= 0) {
            return ResponseEntity.badRequest().body(new Response("error", "Amount must be greater than 0", null));
        }
        String sb = ipUrl +
                String.format("/%s", user.getId());
        return ResponseEntity.ok().body(new Response("success", "", paymentService.payWithMoMo(user.getId(), amount, redirectUrl, sb)));
    }

//    @Hidden
//    @PostMapping("/momo/{tableId}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    private String payWithMoMo(@PathVariable int tableId) throws DataNotFoundException {
//        return orderService.paymentOrder(tableId).toString();
//    }

}
