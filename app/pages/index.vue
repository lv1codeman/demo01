<template>
  <div
    class="welcome-container"
    :class="{ 'is-exiting': isExiting }"
    @click="handleContainerClick"
  >
    <div class="welcome-content" :class="{ 'fade-out-and-rotate': isExiting }">
      <!-- 圖片 -->
      <img
        src="https://media.istockphoto.com/id/1460535745/photo/e-learning-graduate-certificate-program-concept-lightbulb-on-the-book-with-graduation-hat-and.jpg?s=2048x2048&w=is&k=20&c=k5MXyGvT8TTyHQ-eMAiajmA1rp9p9VIrimnPqr0l2q8="
        alt=""
        class="main-image"
      />

      <!-- 課務工具文字 -->
      <h1 class="font-bold welcome-text">課務輔助工具</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const isExiting = ref(false);
const router = useRouter();

const handleContainerClick = () => {
  if (!isExiting.value) {
    isExiting.value = true;
    // 等待淡出動畫完成後導航
    setTimeout(() => {
      router.push("/ClassConverter/ClassConverter114");
    }, 300); // 這裡的 500ms 應與 .fade-out-and-rotate 的 animation-duration 相同 (1s * 0.5)
  }
};
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  cursor: pointer;
}

.welcome-content {
  text-align: center;
  position: relative;
  width: 80%; /* 設定寬度以容納圖片 */
}

/* 圖片的載入動畫：順時針旋轉並淡入 */
.main-image {
  max-width: 100%;
  height: auto;
  border-radius: 1rem; /* rounded-xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: fadeInAndRotate 1s forwards ease-in-out;
  transition: transform 0.1s ease;
  transform: rotate(180deg) scale(0.8); /* 初始狀態：倒轉且縮小 */
}

/* 圖片懸停效果 */
.main-image:hover {
  transform: scale(1.05);
}

/* 文字的出現動畫：由下往上浮現並淡入 */
.welcome-text {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  opacity: 0;
  white-space: nowrap; /* 避免文字斷行 */
  animation: textEnterUp 1s forwards ease-out;

  /* 在電腦上為 70px */
  font-size: 70px;
}

/* 針對手機的媒體查詢 */
@media (max-width: 640px) {
  .welcome-text {
    /* 在手機上為 30px */
    font-size: 30px;
  }
}

/* 點擊後整體內容的退出動畫：逆時針旋轉並淡出 */
.fade-out-and-rotate {
  animation: fadeOutAndRotate 0.3s forwards ease-in-out; /* 速度加快0.5倍 */
}

@keyframes fadeInAndRotate {
  from {
    opacity: 0;
    transform: rotate(160deg) scale(0.5);
  }
  to {
    opacity: 1;
    transform: rotate(360deg) scale(1); /* 順時針旋轉半圈 */
  }
}

@keyframes textEnterUp {
  from {
    opacity: 0;
    top: 50%;
    color: #4b5563; /* 初始顏色為灰色 */
  }
  to {
    opacity: 1;
    top: 15%; /* 移動到最終位置 */
    color: #ffffff; /* 最終顏色為白色 */
  }
}

@keyframes fadeOutAndRotate {
  from {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  to {
    opacity: 0;
    transform: rotate(-180deg) scale(0.8); /* 逆時針旋轉半圈 */
  }
}
</style>
