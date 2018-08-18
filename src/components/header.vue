<template>
    <div class="header">
      <div class="wrapper">
        <div class="logo">
          <img style="display: inline-block; vertical-align:middle;width: 60px;" src="/static/image/Logo.png">
          <span class="text">X-Yin music</span>
        </div>
        <div class="personCenter">
          <router-link to="/personCenter"><img style="width: 24px;" src="/static/image/person.png"></router-link>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6"></script>

<style scoped>
  .header {
    width: 100%;
    height: 80px;
    position: relative;
  }
  .wrapper {
    position: absolute;
    width: 100%;
    height: 50px;
    top: 10px;
  }
  .logo {
    position: absolute;
    width: auto;
    height: 50px;
    left: 50%;
    transform: translateX(-50%);
  }
  .text {
    display: inline-block;
    vertical-align: middle;
    color: #ffcd32;
    margin-left: 15px;
    font-size: 16px;
  }
  .personCenter {
    position: absolute;
    width: 24px;
    right: 20px;
    top: 18px;
  }
</style>
