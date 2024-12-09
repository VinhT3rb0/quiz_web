CREATE TABLE payment (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         user_id INT NOT NULL,
                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         amount INT NOT NULL,
                         status VARCHAR(50) NOT NULL,
                         payment_method VARCHAR(50) NOT NULL,
                         transaction_id VARCHAR(100),
                         CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) -- nếu có bảng `users`
);
ALTER TABLE `users`
    ADD COLUMN `point` INT DEFAULT 0,
    ADD COLUMN `point_used` INT DEFAULT 0;
