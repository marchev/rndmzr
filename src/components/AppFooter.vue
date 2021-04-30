<template>
  <footer class="footer">
  <div class="content has-text-centered">
    <p>
      <span class="semi-bold">rndmzr</span> by <a href="https://github.com/marchev"><span class="semi-bold">marchev</span></a>
    </p>
    <p class="footer-icons">
      <a @click="clickGithub()" href="https://github.com/marchev/rndmzr" target="_blank">
        <b-icon
            pack="fab"
            size="is-medium"
            icon="github">
        </b-icon>
      </a>
      <a @click="clickSlack()" href="slack://channel?team=TE8V4MPRQ&amp;id=C01STNCV1UM" target="_blank">
        <b-icon
            pack="fab"
            size="is-medium"
            icon="slack-hash">
        </b-icon>
      </a>
      <a @click="clickAnalytics()" href="https://app.panelbear.com/share/4A5ygjmAnVhfeOLoyvMJoU/" target="_blank">
        <b-icon
            size="is-medium"
            icon="chart-bar">
        </b-icon>
      </a>
    </p>
  </div>
</footer>
</template>

<script>
export default {
  name: 'AppFooter',
  methods: {
    clickGithub() {
      this.$panelbear.track('footer.click_github')
    },
    clickSlack() {
      this.$panelbear.track('footer.click_slack')
    },
    clickAnalytics() {
      this.$panelbear.track('footer.click_analytics')
    }
  }
}
</script>
