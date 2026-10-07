<template>
  <div>basic</div>
  <h1
    id="from-opacity"
    v-gsap.from="{ opacity: 0 }"
  >
    Hidden until GSAP
  </h1>
  <h2
    id="split-stagger"
    v-gsap.splitText.words.stagger.from="{ opacity: 0 }"
  >
    Split words
  </h2>
</template>

<script setup>
</script>
