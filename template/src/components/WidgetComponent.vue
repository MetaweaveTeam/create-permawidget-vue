<script setup lang="ts"></script>

<template>
  <div class="widget shadow-xl text-white">
    <img src="/img/metaweave.png" alt="Metaweave Logo">
  </div>
</template>

<style scoped>
.widget {
  display: flex;
  border-radius: 2rem;
  padding: 1rem;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  background: rgb(188, 0, 255);
  background: -moz-linear-gradient(38deg,
      rgba(188, 0, 255, 1) 19%,
      rgba(248, 23, 181, 1) 100%);
  background: -webkit-linear-gradient(38deg,
      rgba(188, 0, 255, 1) 19%,
      rgba(248, 23, 181, 1) 100%);
  background: linear-gradient(38deg,
      rgba(188, 0, 255, 1) 19%,
      rgba(248, 23, 181, 1) 100%);
}
</style>
