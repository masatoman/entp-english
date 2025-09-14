import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardProps } from './card'
import { cn } from '@/lib/utils'
import { motion, MotionProps } from 'framer-motion'

interface AnimatedCardProps extends CardProps {
  /**
   * アニメーションの種類
   */
  animation?: 'fade' | 'slide' | 'scale' | 'bounce' | 'flip' | 'none'
  /**
   * アニメーションの方向
   */
  direction?: 'up' | 'down' | 'left' | 'right'
  /**
   * アニメーションの遅延（秒）
   */
  delay?: number
  /**
   * アニメーションの継続時間（秒）
   */
  duration?: number
  /**
   * ホバー時のアニメーション
   */
  hoverAnimation?: 'lift' | 'glow' | 'pulse' | 'shake' | 'none'
  /**
   * クリック時のアニメーション
   */
  clickAnimation?: 'press' | 'bounce' | 'shake' | 'none'
  /**
   * アニメーションのイージング
   */
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring'
  /**
   * アニメーションの繰り返し
   */
  repeat?: boolean
  /**
   * アニメーションの遅延（ミリ秒）
   */
  stagger?: number
  /**
   * 子要素のアニメーション
   */
  childrenAnimation?: boolean
  /**
   * アニメーションの開始トリガー
   */
  trigger?: 'onMount' | 'onHover' | 'onClick' | 'onScroll' | 'onFocus'
  /**
   * カスタムアニメーションプロパティ
   */
  customAnimation?: MotionProps
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({
    children,
    className,
    animation = 'fade',
    direction = 'up',
    delay = 0,
    duration = 0.5,
    hoverAnimation = 'lift',
    clickAnimation = 'press',
    easing = 'easeOut',
    repeat = false,
    stagger = 0.1,
    childrenAnimation = false,
    trigger = 'onMount',
    customAnimation,
    ...props
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isClicked, setIsClicked] = React.useState(false)

    const getEasing = () => {
      switch (easing) {
        case 'linear': return [0, 0, 1, 1]
        case 'easeIn': return [0.4, 0, 1, 1]
        case 'easeOut': return [0, 0, 0.2, 1]
        case 'easeInOut': return [0.4, 0, 0.2, 1]
        case 'spring': return [0.68, -0.55, 0.265, 1.55]
        default: return [0, 0, 0.2, 1]
      }
    }

    const getInitialAnimation = () => {
      if (animation === 'none') return {}
      
      const baseDelay = delay
      const baseDuration = duration
      
      switch (animation) {
        case 'fade':
          return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: {
              duration: baseDuration,
              delay: baseDelay,
              ease: getEasing()
            }
          }
        
        case 'slide':
          const slideDirection = direction === 'up' ? { y: 50 } : 
                                direction === 'down' ? { y: -50 } :
                                direction === 'left' ? { x: 50 } : { x: -50 }
          return {
            initial: { ...slideDirection, opacity: 0 },
            animate: { x: 0, y: 0, opacity: 1 },
            transition: {
              duration: baseDuration,
              delay: baseDelay,
              ease: getEasing()
            }
          }
        
        case 'scale':
          return {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: {
              duration: baseDuration,
              delay: baseDelay,
              ease: getEasing()
            }
          }
        
        case 'bounce':
          return {
            initial: { scale: 0, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: {
              duration: baseDuration,
              delay: baseDelay,
              ease: [0.68, -0.55, 0.265, 1.55]
            }
          }
        
        case 'flip':
          return {
            initial: { rotateY: -90, opacity: 0 },
            animate: { rotateY: 0, opacity: 1 },
            transition: {
              duration: baseDuration,
              delay: baseDelay,
              ease: getEasing()
            }
          }
        
        default:
          return {}
      }
    }

    const getHoverAnimation = () => {
      if (hoverAnimation === 'none') return {}
      
      switch (hoverAnimation) {
        case 'lift':
          return {
            y: -8,
            scale: 1.02,
            transition: { duration: 0.2, ease: 'easeOut' }
          }
        case 'glow':
          return {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            transition: { duration: 0.2, ease: 'easeOut' }
          }
        case 'pulse':
          return {
            scale: [1, 1.05, 1],
            transition: { duration: 0.5, ease: 'easeInOut' }
          }
        case 'shake':
          return {
            x: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.5, ease: 'easeInOut' }
          }
        default:
          return {}
      }
    }

    const getClickAnimation = () => {
      if (clickAnimation === 'none') return {}
      
      switch (clickAnimation) {
        case 'press':
          return {
            scale: 0.95,
            transition: { duration: 0.1, ease: 'easeOut' }
          }
        case 'bounce':
          return {
            scale: [1, 1.1, 1],
            transition: { duration: 0.3, ease: 'easeOut' }
          }
        case 'shake':
          return {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.5, ease: 'easeInOut' }
          }
        default:
          return {}
      }
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    const handleClick = () => {
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 200)
    }

    const animationProps = {
      ...getInitialAnimation(),
      ...(trigger === 'onHover' && isHovered && getHoverAnimation()),
      ...(trigger === 'onClick' && isClicked && getClickAnimation()),
      ...customAnimation
    }

    const childrenProps = childrenAnimation ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.3,
        delay: stagger,
        ease: 'easeOut'
      }
    } : {}

    return (
      <motion.div
        ref={ref}
        className={cn(
          'transition-all duration-200',
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'focus:outline-none',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...animationProps}
      >
        <Card {...props}>
          {childrenAnimation ? (
            <motion.div {...childrenProps}>
              {children}
            </motion.div>
          ) : (
            children
          )}
        </Card>
      </motion.div>
    )
  }
)

AnimatedCard.displayName = 'AnimatedCard'

interface AnimatedCardHeaderProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade' | 'slide' | 'scale' | 'none'
  delay?: number
}

export const AnimatedCardHeader = React.forwardRef<HTMLDivElement, AnimatedCardHeaderProps>(
  ({ children, className, animation = 'fade', delay = 0, ...props }, ref) => {
    const getAnimation = () => {
      if (animation === 'none') return {}
      
      switch (animation) {
        case 'fade':
          return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5, delay }
          }
        case 'slide':
          return {
            initial: { y: -20, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { duration: 0.5, delay }
          }
        case 'scale':
          return {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { duration: 0.5, delay }
          }
        default:
          return {}
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn('space-y-1.5 p-6', className)}
        {...getAnimation()}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedCardHeader.displayName = 'AnimatedCardHeader'

interface AnimatedCardContentProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade' | 'slide' | 'scale' | 'none'
  delay?: number
  stagger?: number
}

export const AnimatedCardContent = React.forwardRef<HTMLDivElement, AnimatedCardContentProps>(
  ({ children, className, animation = 'fade', delay = 0.1, stagger = 0.1, ...props }, ref) => {
    const getAnimation = () => {
      if (animation === 'none') return {}
      
      switch (animation) {
        case 'fade':
          return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5, delay }
          }
        case 'slide':
          return {
            initial: { y: 20, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { duration: 0.5, delay }
          }
        case 'scale':
          return {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { duration: 0.5, delay }
          }
        default:
          return {}
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...getAnimation()}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedCardContent.displayName = 'AnimatedCardContent'
