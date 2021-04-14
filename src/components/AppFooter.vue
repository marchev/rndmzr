<template>
  <footer class="footer">
  <div class="content has-text-centered">
    <p>
      <span class="semi-bold">rndmzr</span> by <a href="https://github.com/marchev">marchev</a>
    </p>
    <p>
      <a @click="clickGithub()" href="https://github.com/marchev/rndmzr" target="_blank">
        <b-icon
            pack="fab"
            size="is-medium"
            type="is-dark"
            icon="github">
        </b-icon>
      </a>
      <a @click="clickSlack()" href="slack://channel?team=TE8V4MPRQ&amp;id=C01STNCV1UM" target="_blank">
        <b-icon
            pack="fab"
            size="is-medium"
            type="is-dark"
            icon="slack-hash">
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
    }
  }
}
</script>
