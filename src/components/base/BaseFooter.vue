<template>
  <footer class="footer-grid footer">
    <section class="footer-grid-section-a">
      <div class="footer-left">
        <div class="footer-logos">
          <RiCaim class="ricaim sponsor-logo" />
          <URI class="uri sponsor-logo" />
          <Brown class="brown sponsor-logo" />
        </div>
      </div>
    </section>
    <section class="footer-grid-section-b">
      <div class="footer-right">
        <!-- <p class="container">{{ funding }}</p> -->
        <NSF class="nsf sponsor-logo" />
      </div>
    </section>
    <section class="footer-grid-bottom">
      <fa icon="copyright" />
      <span class="copyright-span">{{ year }}</span>
      <span class="copyright-span">RI Data Discovery Center</span>
    </section>
  </footer>
</template>

<script>
// TODO: get into usable shape, add to layouts
import NSF from "@/assets/illustrations/nsf.svg";
import RiCaim from "@/assets/illustrations/ricaim-logo-name.svg";
import URI from "@/assets/illustrations/uri-logo.svg";
import Brown from "@/assets/illustrations/brown-logo.svg";

export default {
  components: {
    NSF,
    RiCaim,
    URI,
    Brown,
  },
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
};
</script>
