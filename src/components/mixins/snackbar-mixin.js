export default {
    methods: {
        openSnackbar(message, type) {
            this.$buefy.snackbar.open({ message, type, position: 'is-top', actionText: 'OK', indefinite: true })
        }
    }
}