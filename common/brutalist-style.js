// 粗野主义手绘风格通用样式工具
// 提供统一的样式计算和样式类名

export const colors = {
  primary: '#000000',     // 主色：黑色
  accent: '#FF6B6B',      // 强调色：红色
  highlight: '#FFE66D',    // 亮色：黄色
  background: '#FFFFFF'    // 背景：白色
}

export const typography = {
  title: {
    large: {
      fontSize: '48rpx',
      fontWeight: 900
    },
    medium: {
      fontSize: '40rpx',
      fontWeight: 800
    },
    small: {
      fontSize: '32rpx',
      fontWeight: 700
    }
  },
  button: {
    fontSize: '32rpx',
    fontWeight: 700
  },
  body: {
    fontSize: '30rpx',
    fontWeight: 400
  },
  caption: {
    fontSize: '24rpx',
    fontWeight: 400
  }
}

export const spacing = {
  xs: '8rpx',
  sm: '16rpx',
  md: '24rpx',
  lg: '32rpx',
  xl: '48rpx',
  xxl: '64rpx'
}

export const borders = {
  width: '4rpx',
  color: colors.primary,
  radius: '0rpx' // 粗野主义风格通常不使用圆角
}

export const shadows = {
  small: '4rpx 4rpx 0px #000000',
  medium: '6rpx 6rpx 0px #000000',
  large: '8rpx 8rpx 0px #000000'
}

export const transforms = {
  slight: 'rotate(-0.5deg)',
  normal: 'rotate(-1deg)',
  heavy: 'rotate(-1.5deg)'
}

// 生成粗野主义手绘风格的样式对象
export function createBrutalistStyle(options = {}) {
  const {
    backgroundColor = colors.background,
    borderColor = colors.primary,
    borderWidth = borders.width,
    shadow = shadows.medium,
    transform = transforms.normal,
    padding = spacing.md,
    margin = spacing.sm
  } = options

  return {
    backgroundColor,
    border: `${borderWidth} solid ${borderColor}`,
    boxShadow: shadow,
    transform,
    padding,
    margin
  }
}

// 生成带按压效果的样式对象
export function createButtonStyle(type = 'primary') {
  const baseStyle = createBrutalistStyle()
  
  switch(type) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: colors.accent
      }
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: colors.highlight
      }
    case 'danger':
      return {
        ...baseStyle,
        borderColor: colors.accent
      }
    default:
      return baseStyle
  }
}

// 字体样式工具函数
export function getTypographyStyle(type = 'body', size = 'medium') {
  if (type === 'title' && typography.title[size]) {
    return typography.title[size]
  }
  return typography[type] || typography.body
}