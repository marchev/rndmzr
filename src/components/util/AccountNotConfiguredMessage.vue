<template>
    <b-message v-if="true" type="is-warning" has-icon class="mt-5">
        <span class="has-text-weight-semibold">Account not configured</span><br/>
        It seems that your Clockify account has not been configured.
        Please reach out to <a href="mailto:gregory.booth@paysafe.com?subject=Clockify%20account%20not%20configured&amp;body=Hi,"><span class="has-text-weight-semibold">gregory.booth@paysafe.com</span></a> to request your account to be configured.
    </b-message>
</template>

<script>
import projects from '@/components/mixins/projects-mixin'

export default {
    name: 'AccountNotConfiguredMessage',
    mixins: [ projects ]
}
</script>