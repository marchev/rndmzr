<template>
  <section>
        <b-table
            :data="data"
            ref="table"
            detailed
            hoverable
            custom-detail-row
            :opened-detailed="['Nitro']"
            :default-sort="['name', 'asc']"
            detail-key="name"
            :show-detail-icon="showDetailIcon">

            <b-table-column
                field="project"
                label="Project"
                width="300"
                v-slot="props"
            >
                <template v-if="showDetailIcon">
                    {{ props.row.name }}
                </template>
                <template v-else>
                    <a @click="toggle(props.row)">
                        {{ props.row.name }}
                    </a>
                </template>
            </b-table-column>

            <b-table-column
                field="monday"
                label="Mon, Mar 15"
                centered
                v-slot="props"
            >
                {{ props.row.sold }}
            </b-table-column>

            <b-table-column
                field="tuesday"
                label="Tue, Mar 16"
                centered
                v-slot="props"
            >
                {{ props.row.sold }}
            </b-table-column>

            <b-table-column
                field="wednesday"
                label="Wed, Mar 16"
                centered
                v-slot="props"
            >
                {{ props.row.sold }}
            </b-table-column>

            <b-table-column
                field="thursday"
                label="Thu, Mar 17"
                centered
                v-slot="props"
            >
                {{ props.row.sold }}
            </b-table-column>

            <b-table-column
                field="friday"
                label="Fri, Mar 18"
                centered
                v-slot="props"
            >
                {{ props.row.sold }}
            </b-table-column>

            <b-table-column
                field="saturday"
                label="Sat, Mar 19"
                centered
                v-slot="props"
            >
                {{ props.row.sold }}
            </b-table-column>

            <b-table-column
                field="sunday"
                label="Sun, Mar 20"
                centered
                v-slot="props"
            >
                {{ props.row.sold }}
            </b-table-column>

            <b-table-column
                label="Total"
                centered
                v-slot="props"
            >
                <span :class="
                        [
                            'tag',
                            {'is-danger': props.row.sold / props.row.available <= 0.45},
                            {'is-success': props.row.sold / props.row.available > 0.45}
                        ]">
                    {{ Math.round((props.row.sold / props.row.available) * 100) }}%
                </span>
            </b-table-column>

            <template slot="detail" slot-scope="props">
                <tr v-for="item in props.row.items" :key="item.name">
                    <td></td>
                    <td>{{ item.name }}</td>
                    <td class="has-text-centered">{{ item.sold }}</td>
                    <td class="has-text-centered">{{ item.sold }}</td>
                    <td class="has-text-centered">{{ item.sold }}</td>
                    <td class="has-text-centered">{{ item.sold }}</td>
                    <td class="has-text-centered">{{ item.sold }}</td>
                    <td class="has-text-centered">{{ item.sold }}</td>
                    <td class="has-text-centered">{{ item.sold }}</td>
                    <td class="has-text-centered">
                        <span :class="
                            [
                                'tag',
                                {'is-danger': item.sold / item.available <= 0.45},
                                {'is-success': item.sold / item.available > 0.45}
                            ]">
                            {{ Math.round((item.sold / item.available) * 100) }}%
                        </span>
                    </td>
                </tr>
            </template>
        </b-table>
  </section>
</template>

<script>
export default {
  name: 'TimesheetTable',
    data() {
        return {
            data: [
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
            ],
            columnsVisible: {
                name: { title: 'Name', display: true },
                sold: { title: 'Stock Sold', display: true },
                available: { title: 'Stock Available', display: true },
                cleared: { title: 'Stock Cleared', display: true },
            },
            showDetailIcon: true
        }
    },
    methods: {
        toggle(row) {
            this.$refs.table.toggleDetails(row)
        }
    }
}
</script>
