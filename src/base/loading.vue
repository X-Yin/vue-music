<template>
    <div class="loading">
      <img src="/static/image/loading.gif" class="image">
    </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style scoped>
  .loading {
    width: 100%;
    height: 50px;
  }
  .image {
    width: 20px;
    height: 20px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
</style>
