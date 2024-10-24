<script lang="ts">
  import { Line } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  export let monthlyRewards: { month: number; reward: number; cumulative: number }[];

  $: chartData = {
    labels: monthlyRewards.map(r => `Month ${r.month}`),
    datasets: [
      // {
      //   label: 'Monthly Rewards',
      //   data: monthlyRewards.map(r => r.reward),
      //   borderColor: 'rgb(75, 192, 192)',
      //   backgroundColor: 'rgba(75, 192, 192, 0.5)',
      //   tension: 0.1
      // },
      {
        label: 'Monthly Rewards',
        data: monthlyRewards.map(r => r.cumulative),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.1
      }
    ]
  };

  $: chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} XBG`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#fff',
          callback: function(value) {
            return value.toFixed(0) + ' XBG';
          }
        },
        grid: {
          color: '#444'
        }
      },
      x: {
        ticks: {
          color: '#fff'
        },
        grid: {
          color: '#444'
        }
      }
    }
  };
</script>

<div class="bg-gray-800 p-6 rounded-lg" style="height: 400px">
  <Line data={chartData} options={chartOptions} />
</div>