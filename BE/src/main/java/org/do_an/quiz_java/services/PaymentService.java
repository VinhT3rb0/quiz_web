package org.do_an.quiz_java.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PaymentService {

    @Value("${momo.endpoint}")
    private String endPoint;

    @Value("${momo.partnerCode}")
    private String partnerCode;

    @Value("${momo.accessKey}")
    private String accessKey;

    @Value("${momo.secretKey}")
    private String secretKey;

    public String payWithMoMo(Integer userId, long amount, String redirectUrl, String ipnUrl) {
        String orderInfo = "Payment";
        String extraData = "";
        String requestId = String.valueOf(System.currentTimeMillis() + new Random().nextInt(999 - 111 + 1) + 111);
        String requestType = "captureWallet";
        String rawHash = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&userId=" + userId +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;
        String signature = hmacSHA256(rawHash, secretKey);

        Map<String, Object> data = new HashMap<>();
        data.put("partnerCode", partnerCode);
        data.put("partnerName", "Test");
        data.put("storeId", "MomoTestStore");
        data.put("requestId", requestId);
        data.put("amount", amount);
        data.put("userId", userId);
        data.put("redirectUrl", redirectUrl);
        data.put("ipnUrl", ipnUrl);
        data.put("lang", "vi");
        data.put("extraData", extraData);
        data.put("requestType", requestType);
        data.put("signature", signature);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(data, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(endPoint, entity, Map.class);

        Map<String, String> responseBody = response.getBody();
        System.out.println(responseBody);
        return responseBody.get("payUrl");
    }

    private String hmacSHA256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes());

            StringBuilder sb = new StringBuilder();
            for (byte b : rawHmac) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC SHA-256", e);
        }
    }
}
