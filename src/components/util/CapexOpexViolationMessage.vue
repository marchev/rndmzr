<template>
    <b-message v-if="capexOpexRatioViolation" type="is-warning" has-icon class="mt-5">
        <span class="has-text-weight-semibold">CAPEX/OPEX Ratio Violation</span><br/>
        Some of the reported hours violate the predefined CAPEX/OPEX ratio for your profile.
        For more details, see the <a href="#total"><span class="has-text-weight-semibold">Total</span></a> section.
    </b-message>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
    name: 'CapexOpexViolationMessage',
    computed: {
        ...mapFields([
            'capexOpexRatioViolations'
        ]),
        capexOpexRatioViolation: function() {
            return this.capexOpexRatioViolations.reduce((previous, current) => previous || current, false)
        }
    }
}
</script>