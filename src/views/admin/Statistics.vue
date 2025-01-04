<template>
  <div class="main-container">
    <div class="container">
      <d-date-picker-pro v-model="start_month" class="mb20 wh250" type="month" @change="handleChange" value-format="YYYY-MM"/>
      <div class="element">~</div>
      <d-date-picker-pro v-model="end_month" class="mb20 wh250" type="month" @change="handleChange" value-format="YYYY-MM"/>
      <div class="tag-location-picker ml-auto">
        <div style="width: 20px;"></div>
        <d-select
          v-model="current_location"
          placeholder="地点"
          class="combo-box"
          @change="handleChange"
          :options="cities">
        </d-select>
      </div>
    </div>
    <div id="chart" :style="{ width: '80%', height: '400px' }" class="charts"></div>
    <v-data-table
      :headers="headers"
      :items="filteredBills"
      :items-per-page="10"
      :style="{ width: '80%' }">
    </v-data-table>
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

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* 确保宽度 */
}

.container {
  width: 70%; /* 确保有实际宽度 */
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
import {ref, watch, onMounted, reactive} from 'vue'
import { useRouter } from 'vue-router';
import * as echarts from 'echarts'
import * as QUERY from '@/plugins/query'
import CITIES from '@/plugins/cities'

const fetchandProcessBillData = async (currentLocation, startTime, endTime) => {
  // Fetch bill data
  const billData = await QUERY.post('/api/admin/query/statistics', {
    province: currentLocation,
    start_time: startTime,
    end_time: endTime,
  });
  console.log(billData);

  // Process bill data
  if (!billData.data || !Array.isArray(billData.data)) {
    console.error("Invalid data format: ", billData);
    return [];
  }

  // Return the data as-is since the order is preserved
  return billData.data;
};


export default {
  setup() {
    // Reactive properties
    const Router = useRouter();
    const current_location = ref('none');
    const start_month = ref('2022-01');
    const end_month = ref('2025-12');
    const cities = ref([]);
    const filteredBills = ref([]);
    const sortedBills = ref([]);
    const myChart = ref(null);
    const chartOption = ref({
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line',
					snap: true
				}
			},
			xAxis: {
				type: 'category',
				data: []
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					data: [],
					type: 'line'
				},
        {
					data: [],
					type: 'line'
				}
			]
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
      cities.value.push(province);
    });


     // Watch for data updates
    watch(sortedBills, (newSortedBills) => {
      chartOption.value.xAxis.data = sortedBills.value.map(item => {
        return item.year + '-' + item.month;
      }); // 提取每个月份
      chartOption.value.series[0].data = newSortedBills.map((item) => item.promote); // 填充宣传用户数
      chartOption.value.series[1].data = newSortedBills.map((item) => item.power);   // 填充助力用户数
    });

    // On mounted lifecycle hook
    onMounted(async () => {

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
      chartOption.value.series[0].data = sortedBills.value.map(item => item.promote);
      chartOption.value.series[1].data = sortedBills.value.map(item => item.power);
      myChart.value = echarts.init(document.getElementById('chart'));
      myChart.value.setOption(chartOption.value);
      watch(() => sortedBills.value, (newSortedBills) => {
        // Update the chartOption when sortedBills changes
        chartOption.value.xAxis.data = newSortedBills.map(item => {
          return item.year + '-' + item.month;
        });

        chartOption.value.series[0].data = newSortedBills.map(item => item.promote);
        chartOption.value.series[1].data = newSortedBills.map(item => item.power);
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
      chartOption,
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
