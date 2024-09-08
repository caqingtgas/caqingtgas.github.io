document.addEventListener("DOMContentLoaded", function () {
    const wheelContainer = document.querySelector(".wheel-container");
    const scrollThumb = document.querySelector(".scroll-thumb");

    wheelContainer.addEventListener("scroll", function () {
        // 获取当前滚动位置
        const scrollHeight = wheelContainer.scrollHeight - wheelContainer.clientHeight;
        const scrollTop = wheelContainer.scrollTop;

        // 计算滚动百分比
        const scrollPercent = scrollTop / scrollHeight;

        // 根据滚动百分比旋转滑块
        const rotationAngle = scrollPercent * 360; // 完整的一圈为360度
        scrollThumb.style.transform = `translateX(-50%) rotate(${rotationAngle}deg)`;
    });
});
