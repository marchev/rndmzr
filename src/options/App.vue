<template>
  <div class="rndmzr-settings">

      <div class="container py-4 px-4">
        <b-field label="Profile">
            <b-select placeholder="Select a profile" icon="users" expanded v-model="profileFieldValue">
                <option v-for="option in profiles" :value="option.id" :key="option.id">
                    {{ option.label }}
                </option>
            </b-select>
        </b-field>
        <b-field label="API Key">
            <b-input class="apiKey" icon="key" v-model="apiKeyValue">
            </b-input>
        </b-field>
        <b-field label="Soft Submit">
          <b-tooltip multilined label="Only creates time entries without submitting them for approval"
            position="is-right"
            size="is-large">
            <b-switch type="is-default" v-model="softSubmitValue" >
            </b-switch>
          </b-tooltip>
        </b-field>
        <b-field label="Override Mode">
          <b-tooltip multilined label="Deletes all time entries for the week at Clockify before submit"
            position="is-right"
            size="is-large">
            <b-switch type="is-default" v-model="overrideModeValue" >
            </b-switch>
          </b-tooltip>
        </b-field>
        <b-field grouped label="CAPEX/OPEX Ratio Violation">
          <b-field>
            <b-tooltip multilined label="Shows a warning when the CAPEX/OPEX ratio deviates from the given threshold"
            position="is-right"
            size="is-large">
              <b-switch v-model="capexOpexViolationModeValue" type="is-default" class="mt-1">
              </b-switch>
            </b-tooltip>
          </b-field>
          <b-field>
            <b-input
                class="capexOpexViolationThreshold"
                v-model="capexOpexViolationThresholdValue"
                :disabled="!capexOpexViolationModeValue"
                type="number"
                min="1"
                max="100"
                icon="percentage"
                size="is-small">
            </b-input>
          </b-field>
        </b-field>
        <b-field grouped label="Reminder">
          <b-field>
            <b-tooltip multilined label="Sets a reminder for submitting timesheets as per the configured frequency"
              position="is-right"
              size="is-large">
              <b-switch v-model="reminderValue" type="is-default" class="mt-1">
              </b-switch>
            </b-tooltip>
          </b-field>
          <b-field>
            <b-timepicker
                v-model="reminderTimeValue"
                icon="clock"
                size="is-small"
                :incrementMinutes="1"
                :incrementHours="1"
                :mobile-native="false"
                :disabled="!reminderValue"
                >
            </b-timepicker>
          </b-field>
        </b-field>

        <div class="daySelector">
          <b-tooltip label="Monday" position="is-top" size="is-large">
              <b-checkbox-button v-model="reminderDaysValue"
                  native-value="1"
                  size="is-small"
                  :disabled="!reminderValue">
                  <span class="semi-bold">M</span>
              </b-checkbox-button>
          </b-tooltip>

          <b-tooltip label="Tuesday" position="is-top" size="is-large" class="ml-2">
            <b-checkbox-button v-model="reminderDaysValue"
                native-value="2"
                size="is-small"
                :disabled="!reminderValue">
                <span class="semi-bold">T</span>
            </b-checkbox-button>
          </b-tooltip>

          <b-tooltip label="Wednesday" position="is-top" size="is-large" class="ml-2">
            <b-checkbox-button v-model="reminderDaysValue"
                native-value="3"
                size="is-small"
                :disabled="!reminderValue">
                <span class="semi-bold">W</span>
            </b-checkbox-button>
          </b-tooltip>

          <b-tooltip label="Thursday" position="is-top" size="is-large" class="ml-2">
            <b-checkbox-button v-model="reminderDaysValue"
                native-value="4"
                size="is-small"
                :disabled="!reminderValue">
                <span class="semi-bold">T</span>
            </b-checkbox-button>
          </b-tooltip>


          <b-tooltip label="Friday" position="is-top" size="is-large" class="ml-2">
            <b-checkbox-button v-model="reminderDaysValue"
                native-value="5"
                size="is-small"
                :disabled="!reminderValue">
                <span class="semi-bold">F</span>
            </b-checkbox-button>
          </b-tooltip>

          <b-tooltip label="Saturday" position="is-top" size="is-large" class="ml-2">
            <b-checkbox-button v-model="reminderDaysValue"
                native-value="6"
                size="is-small"
                :disabled="!reminderValue">
                <span class="semi-bold">S</span>
            </b-checkbox-button>
          </b-tooltip>

          <b-tooltip label="Sunday" position="is-top" size="is-large" class="ml-2">
            <b-checkbox-button v-model="reminderDaysValue"
                native-value="7"
                size="is-small"
                :disabled="!reminderValue">
                <span class="semi-bold">S</span>
            </b-checkbox-button>
          </b-tooltip>
        </div>

        <div class="has-text-right">
          <b-button type="is-primary" class="my-2" @click="saveSettings">Save</b-button>
        </div>
      </div>
  </div>
</template>

<style>
html {
  width: 400px
}

div.apiKey input {
  font-family: monospace
}

div.capexOpexViolationThreshold input, .semi-bold {
  font-weight: 600
}

div.timepicker {
  width: 7em
}

div.daySelector {
  padding-left: 4.75rem
}
</style>

<script>
import { mapFields } from 'vuex-map-fields'
// import dayjs from '@/helpers/dayjs'

export default {
  name: 'App',
  computed: {
    ...mapFields([
      'profile',
      'apiKey',
      'softSubmit',
      'overrideMode',
      'capexOpexViolationMode',
      'capexOpexViolationThreshold',
      'reminder',
      'reminderDays',
      'reminderTime'
    ])
  },
  data () {
    return {
      profileFieldValue: '',
      apiKeyValue: '',
      softSubmitValue: false,
      overrideModeValue: false,
      capexOpexViolationModeValue: false,
      capexOpexViolationThresholdValue: 5,
      reminderValue: false,
      reminderDaysValue: [],
      reminderTimeValue: undefined,
      'profiles': [
        { id: 'engineering-manager', label: 'Engineering Manager' },
        { id: 'agile-delivery-lead', label: 'Agile Delivery Lead' },
        { id: 'architect', label: 'Architect' },
        { id: 'product-owner', label: 'Product Owner' }
      ]
    }
  },
  async created () {
    this.profileFieldValue = this.profile
    this.apiKeyValue = this.apiKey
    this.softSubmitValue = this.softSubmit
    this.overrideModeValue = this.overrideMode
    this.capexOpexViolationModeValue = this.capexOpexViolationMode
    this.capexOpexViolationThresholdValue = this.capexOpexViolationThreshold
    this.reminderValue = this.reminder
    this.reminderDaysValue = this.reminderDays
    this.reminderTimeValue = new Date(this.reminderTime)
  },
  methods: {
    async saveSettings() {
      this.profile = this.profileFieldValue
      this.apiKey = this.apiKeyValue
      this.softSubmit = this.softSubmitValue
      this.overrideMode = this.overrideModeValue
      this.capexOpexViolationMode = this.capexOpexViolationModeValue
      this.capexOpexViolationThreshold = parseInt(this.capexOpexViolationThresholdValue)
      this.reminder = this.reminderValue
      this.reminderDays = this.reminderDaysValue
      this.reminderTime = this.reminderTimeValue.toISOString()
      this.$buefy.toast.open('Settings saved')
    }
  }
}
</script>