<template>
  <footer class="footer-grid footer-container">
    <section class="footer-grid-section-a footer-left">
      <div class="logo-container">
        <img src="@/assets/illustrations/ricaim-logo-name.svg" />
      </div>
      <div class="logo-container">
        <img
          src="@/assets/illustrations/uri-logo.svg"
          class="uri logo-container"
        />
      </div>
      <div class="logo-container">
        <img
          src="@/assets/illustrations/brown-logo.svg"
          class="brown logo-container"
        />
      </div>
    </section>
    <section class="footer-grid-section-b footer-right">
      <p class="container content mb-0">
        This material is based upon work conducted by the Rhode Island
        Consortium for Coastal Ecology Assessment, Innovation & Modeling (RI
        C-AIM), and supported in full by the National Science Foundation EPSCoR
        Cooperative Agreement 1655221. Any opinions, findings, and conclusions
        or recommendations expressed in this material are those of the author(s)
        and do not necessarily reflect the views of the National Science
        Foundation.
      </p>
      <div class="logo-container">
        <img
          src="@/assets/illustrations/nsf.svg"
          class="brown logo-container"
        />
      </div>
    </section>
    <section class="footer-grid-bottom">
      <i class="far fa-copyright" />
      <span>{{ year }}{{ " " }}</span>
      <span>RI Data Discovery Center</span>
    </section>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.footer-grid {
  display: grid;
  grid-template-areas: "section-a" "section-b" "bottom";
  grid-gap: 2rem;
  &-section-a {
    grid-area: section-a;
  }
  &-section-b {
    grid-area: section-b;
  }
  &-bottom {
    grid-area: bottom;
    text-align: center;
  }
  @include tablet {
    grid-template-areas: "section-a section-b" "bottom bottom";
    grid-template-columns: 6fr 6fr;
    grid-template-rows: 13rem 2rem;
  }
}

.footer-container {
  font-size: 0.8rem;
  background-color: $info;
  padding: 3rem clamp(2rem, 8vw, 8rem) 3rem;
}

.footer-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.footer-right {
  display: flex;
  flex-direction: column;
  @include tablet {
    flex-direction: row;
  }
  gap: 1rem;
  align-items: center;
  justify-content: center;
  .container {
    flex-basis: 70%;
  }
}

.logo-container {
  width: clamp(4rem, 10vw, 10rem);
}
</style>
