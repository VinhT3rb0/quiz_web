package org.do_an.quiz_java.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

//@Component
public class FilterAfter extends GenericFilter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // Lấy thông tin người dùng từ yêu cầu (đối với ví dụ này, ta lấy tên người dùng)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
// thông tin user đã được xác thực
        Object principal = authentication.getPrincipal();

        // Ghi log thông tin người dùng
        System.out.println("User: " + principal + " made a request to: " + httpRequest.getRequestURI());

        // Tiếp tục với filter tiếp theo trong chuỗi
        chain.doFilter(request, response);
    }
}
