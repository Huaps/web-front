<template>
  <div class="main-container">
    <div class="container">
      <el-date-picker class="element" v-model="start_month" type="month" @change="handleChange" value-format="YYYY-MM"></el-date-picker>
      <div class="element">~</div>
      <el-date-picker class="element" v-model="end_month" type="month" @change="handleChange" value-format="YYYY-MM"></el-date-picker>
      <div class="tag-location-picker ml-auto">
        <div style="width: 20px;"></div>
        <el-select v-model="current_location" placeholder="地点" class="combo-box"  @change="handleChange">
          <el-option v-for="item in cities" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
    </div>
    <div id="chart" :style="{ width: '80%', height: '400px' }" class="charts"></div>
    <v-data-table :headers="headers" :items="filteredBills" :items-per-page="10" :style="{ width: '80%' }"></v-data-table>
  </div>
</template>

<style>
.main-container {
  display: flex;
  margin-top: 50px;
  flex-direction: column;
  align-items: center;
}

.container {
  width: 70%;
  display: flex;
  flex-direction: row;
}

.month-picker {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.tag-location-picker {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 400px;
  max-width: 1000px;
}

.charts {
  margin-top: 20px;
}

.element {
  margin-right: 20px;
}
</style>

<script>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import * as echarts from 'echarts'
import * as QUERY from '@/plugins/query'
import CITIES from '@/plugins/cities'
import * as Events from "@/plugins/event";

const fetchandProcessBillData = async (currentLocation, startTime, endTime) => {
  // Fetch bill data
  var billData = await QUERY.post('/api/admin/query/statistics', {
    province: currentLocation,
    start_time: startTime,
    end_time: endTime,
  });
    console.log(billData)
    // Process bill data
    const Bills = billData.data.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    const sortedBills = Object.values(Bills).sort((a, b) => {
      return a.year < b.year || (a.year === b.year && a.month < b.month) ? -1 : 1;
    });
    return sortedBills;

};

export default {
  setup() {
    // Reactive properties
    const Router = useRouter();
    const current_location = ref('北京市');
    const start_month = ref('2024-09');
    const end_month = ref('2024-12');
    const cities = ref([]);
    const filteredBills = ref([]);
    const sortedBills = ref([]);
    const myChart = ref(null);
    const chartOption = ref({
      tooltip: {},
      legend: {
        data: ['月累计用户数'],
      },
      xAxis: {
        data: [],
      },
      yAxis: {
        axisLabel: {
          formatter: '{value} 人',
        },
      },
      series: [
        {
          name: '盈利',
          type: 'line',
          smooth: true,
          data: [],
        },
      ],
    });
    const headers = ref([
      { title: '年', value: 'year' },
      { title: '月', value: 'month' },
      { title: '宣传用户数', value: 'promote' },
      { title: '助力用户数', value: 'power' }
    ]);
    const billHeaders = [
      'year', 'month', 'promote', 'power'
    ]

    Object.keys(CITIES).forEach((province) => {
      CITIES[province].forEach((city) => {
        cities.value.push(province + '，' + city);
      });
    });

    // On mounted lifecycle hook
    onMounted(async () => {
      // Fetch tag options
      //const tagData = await QUERY.post('/api/admin/query/tags',{});

      sortedBills.value = await fetchandProcessBillData(
        current_location.value,
        start_month.value,
        end_month.value
      );

      filteredBills.value = sortedBills.value.map(item => {
        const filteredItem = {};
        billHeaders.forEach(header => {
          const field = header;
          filteredItem[field] = item[field];
        });
        return filteredItem;
      });
      console.log(filteredBills);
      // Initialize and configure echarts
      chartOption.value.xAxis.data = sortedBills.value.map(item => {
        return item.year + '-' + item.month;
      });
      chartOption.value.series[0].data = sortedBills.value.map(item => item.profit);
      myChart.value = echarts.init(document.getElementById('chart'));
      myChart.value.setOption(chartOption.value);
      watch(() => sortedBills.value, (newSortedBills) => {
        // Update the chartOption when sortedBills changes
        chartOption.value.xAxis.data = newSortedBills.map(item => {
          return item.year + '-' + item.month;
        });

        chartOption.value.series[0].data = newSortedBills.map(item => item.profit);

        // Update the ECharts chart
        myChart.value.setOption(chartOption.value);
      });
    });

    return {
      headers,
      filteredBills,
      current_location,
      start_month,
      end_month,
      cities,
      sortedBills,
      myChart,
      fetchandProcessBillData
    };
  },
  methods: {
    async handleChange() {
      this.sortedBills = await this.fetchandProcessBillData(
        this.current_location,
        this.start_month,
        this.end_month
      );
      const billHeaders = [
        'year', 'month', 'promote', 'power'
      ]
      // Update filteredBills
      this.filteredBills = this.sortedBills.map(item => {
        const filteredItem = {};
        billHeaders.forEach(header => {
          const field = header;
          filteredItem[field] = item[field];
        });
        return filteredItem;
      });
    },
  }
};
</script>
