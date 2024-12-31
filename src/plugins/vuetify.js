/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light', // 设置默认主题
    themes: {
      light: {
        colors: {
          primary: '#4CAF50', // 绿色
          secondary: '#FFC107', // 黄色
          accent: '#FF4081', // 粉色
          error: '#F44336', // 红色
          info: '#2196F3', // 蓝色
          success: '#4CAF50', // 绿色
          warning: '#FF9800', // 橙色
          background: '#FFFFFF', // 背景色
          surface: '#F5F5F5', // 表面色
        },
        variables: {
          borderRadius: '12px', // 全局圆角
          shadowOpacity: '0.15', // 阴影透明度
        },
      },
      dark: {
        colors: {
          primary: '#1E1E2F', // 深色主色
          secondary: '#424242', // 深色次色
          accent: '#FF4081', // 粉色
          error: '#CF6679', // 深色错误
          info: '#64B5F6', // 浅蓝色
          success: '#81C784', // 浅绿色
          warning: '#FFB74D', // 浅橙色
          background: '#121212', // 深色背景
          surface: '#1F1F1F', // 深色表面
        },
        variables: {
          borderRadius: '8px',
          shadowOpacity: '0.3',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi', // 默认使用 Material Design Icons
  },
});
