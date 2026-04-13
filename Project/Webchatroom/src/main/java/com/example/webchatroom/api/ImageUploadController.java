package com.example.webchatroom.api;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class ImageUploadController {

    @PostMapping("/uploadImage")
    public Object uploadImage(@RequestParam("image") MultipartFile file,
                              @RequestParam("sessionId") int sessionId,
                              HttpServletRequest req) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 获取项目根目录
            String basePath = System.getProperty("user.dir");
            String path = basePath + "/uploads/";

            File dir = new File(path);
            if (!dir.exists()) {
                dir.mkdirs();
                System.out.println("创建目录: " + path);
            }

            String originalName = file.getOriginalFilename();
            String ext = originalName.substring(originalName.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + ext;
            File dest = new File(path + fileName);
            file.transferTo(dest);

            result.put("success", true);
            result.put("imageUrl", "/uploads/" + fileName);
            System.out.println("图片上传成功: " + dest.getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }
}