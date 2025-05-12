// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'wood-texture': "url('/images/wood-texture.jpg')", // public/images 폴더에 이미지 필요
      },
      colors: {
        // 여기에 커스텀 색상을 추가할 수 있습니다.
        // 예: 'brand-blue': '#1e40af',
      },
      fontFamily: {
        // 기본 폰트는 layout.tsx 에서 next/font 로 설정하는 것을 권장
      },
      aspectRatio: {
        '2/3': '2 / 3', // 책 표지 비율
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        scaleUp: 'scaleUp 0.3s ease-out forwards',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // 폼 스타일링 개선을 위해 필요시 설치 후 사용
  ],
};
export default config;