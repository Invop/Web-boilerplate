import { Chart, ChartConfiguration } from 'chart.js';
import { FormattedUser } from "./models/FormattedUser";
import _ from 'lodash';

enum SegmentColors {
    GREEN = "#00c77d",
    BLUE = "#56ccf2",
    VIOLET = "#bc35fb",
    BLUE_VIOLET = "#8c90fc",
    ORANGE = "#f2b94a",
    RED = "#ff6384",
    YELLOW = "#ffcd56"
}

const BORDER_WIDTH = 3;

let usersList: FormattedUser[] = [];
let chartInstance: Chart | null = null;

function categorizeByAge(users: FormattedUser[]): { label: string; value: number }[] {
    const ageGroups = [
        { label: '18-24', min: 18, max: 24 },
        { label: '25-34', min: 25, max: 34 },
        { label: '35-44', min: 35, max: 44 },
        { label: '45-54', min: 45, max: 54 },
        { label: '55+', min: 55, max: Infinity }
    ];

    return ageGroups.map(group => ({
        label: group.label,
        value: _.filter(users, user => user.age >= group.min && user.age <= group.max).length
    }));
}

function updateStatisticsChart() {
    const ctx = document.getElementById('statisticsChart') as HTMLCanvasElement;
    const data = categorizeByAge(usersList);

    const chartData: ChartConfiguration['data'] = {
        labels: _.map(data, 'label'),
        datasets: [{
            data: _.map(data, 'value'),
            backgroundColor: [
                SegmentColors.GREEN,
                SegmentColors.BLUE,
                SegmentColors.VIOLET,
                SegmentColors.BLUE_VIOLET,
                SegmentColors.ORANGE,
                SegmentColors.RED,
                SegmentColors.YELLOW
            ],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: BORDER_WIDTH
        }]
    };

    const chartOptions: ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const dataset = tooltipItem.dataset;
                        const arcIndex = tooltipItem.dataIndex;
                        return `${dataset.labels[arcIndex]}: ${dataset.data[arcIndex]}`;
                    }
                }
            }
        }
    };

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: chartOptions
    });
}

// Function to set the user data and initialize/update the chart
function setUsersList(users: FormattedUser[]) {
    usersList = users;
    updateStatisticsChart();
}

export { setUsersList };
