<template>
  <section>
        <b-table class="mt-5" :data="projects" :default-sort="['name', 'asc']" ref="table" detailed hoverable custom-detail-row detail-key="name" :show-detail-icon="true">

            <b-table-column field="project" label="Project" width="300" v-slot="props">
                {{ props.row.name }}
            </b-table-column>

            <b-table-column v-for="weekDate in weekDates" :key="weekDate.format('dddd')" :label="weekDate.format('ddd, MMM D')" centered v-slot="props">
                <span style="display:none">{{ props.row.name }}</span>
                0:15
            </b-table-column>

            <b-table-column label="Total" centered v-slot="props">
                <span style="display:none">{{ props.row.name }}</span>
                <span :class="
                        [
                            'tag',
                            {'is-danger': false },
                            {'is-success': true }
                        ]">
                    8:00
                </span>
            </b-table-column>

            <template slot="detail" slot-scope="props">
                <tr v-for="task in props.row.tasks" :key="task.id">
                    <td></td>
                    <td>{{ task.name }}</td>
                    <td class="has-text-centered">0:30</td>
                    <td class="has-text-centered">0:30</td>
                    <td class="has-text-centered">0:30</td>
                    <td class="has-text-centered">0:30</td>
                    <td class="has-text-centered">0:30</td>
                    <td class="has-text-centered">0:30</td>
                    <td class="has-text-centered">0:30</td>
                    <td class="has-text-centered">
                        <span :class="
                                [
                                    'tag',
                                    {'is-danger': false },
                                    {'is-success': true }
                                ]">
                            8:00
                        </span>
                    </td>
                </tr>
            </template>
        </b-table>
  </section>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import dayjs from 'dayjs'

export default {
    name: 'TimesheetTable',
    computed: {
        ...mapFields([
            'projects'
        ])
    },
    data () {
        return {
            /*
            timesheetData: [
            {
                name: 'Nitro',
                sold: 131,
                available: 301,
                items: [
                    {
                        name: 'Monopoly',
                        sold: 57,
                        available: 100
                    },
                    {
                        name: 'Scrabble',
                        sold: 23,
                        available: 84
                    },
                    {
                        name: 'Chess',
                        sold: 37,
                        available: 61
                    },
                    {
                        name: 'Battleships',
                        sold: 14,
                        available: 56
                    }
                ]
            },
            {
                name: 'Nyx',
                sold: 88,
                available: 167,
                items: [
                    {
                        name: 'World Map',
                        sold: 31,
                        available: 38
                    },
                    {
                        name: 'London',
                        sold: 23,
                        available: 29
                    },
                    {
                        name: 'Sharks',
                        sold: 20,
                        available: 44
                    },
                    {
                        name: 'Disney',
                        sold: 14,
                        available: 56
                    }
                ]
            },
            {
                name: 'Tzaré',
                sold: 434,
                available: 721,
                items: [
                    {
                        name: 'Hamlet',
                        sold: 101,
                        available: 187
                    },
                    {
                        name: 'The Lord Of The Rings',
                        sold: 85,
                        available: 156
                    },
                    {
                        name: 'To Kill a Mockingbird',
                        sold: 78,
                        available: 131
                    },
                    {
                        name: 'Catch-22',
                        sold: 73,
                        available: 98
                    },
                    {
                        name: 'Frankenstein',
                        sold: 51,
                        available: 81
                    },
                    {
                        name: 'Alice\'s Adventures In Wonderland',
                        sold: 46,
                        available: 68
                    }
                ]
            }
            ]
            */
        }
    },
    async created() {
        this.weekDates = this.getWeekDates()
    },
    methods: {
        toggle(row) {
            this.$refs.table.toggleDetails(row)
        },
        getWeekDates() {
            return Array.from({length: 7}, (_, i) => i + 1)
                .map(i => dayjs().day(i))
        }
    }
}
</script>
