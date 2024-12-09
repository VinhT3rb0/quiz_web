package org.do_an.quiz_java.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.v1.prefix:/api/v1}/chats")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

}
