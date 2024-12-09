package org.do_an.quiz_java.respones.payment;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
public class PaymentResponse {
    private int userId;
    private int amount;

}
