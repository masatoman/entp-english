import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

interface FeedbackToastProps {
  /**
   * トーストの種類
   */
  type?: 'success' | 'error' | 'warning' | 'info'
  /**
   * トーストのタイトル
   */
  title?: string
  /**
   * トーストのメッセージ
   */
  message: string
  /**
   * トーストの表示時間（ミリ秒）
   */
  duration?: number
  /**
   * トーストの位置
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  /**
   * トーストのサイズ
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * トーストの色
   */
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  /**
   * アニメーション
   */
  animation?: 'slide' | 'fade' | 'scale' | 'bounce' | 'flip'
  /**
   * 閉じるボタンを表示するか
   */
  closable?: boolean
  /**
   * 閉じるハンドラー
   */
  onClose?: () => void
  /**
   * クリックハンドラー
   */
  onClick?: () => void
  /**
   * カスタムクラス
   */
  className?: string
  /**
   * アイコンを表示するか
   */
  showIcon?: boolean
  /**
   * カスタムアイコン
   */
  customIcon?: React.ReactNode
  /**
   * アクションボタン
   */
  action?: {
    label: string
    onClick: () => void
  }
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  position = 'top-right',
  size = 'md',
  color,
  animation = 'slide',
  closable = true,
  onClose,
  onClick,
  className,
  showIcon = true,
  customIcon,
  action,
}) => {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const getIcon = () => {
    if (customIcon) return customIcon
    
    if (!showIcon) return null
    
    const iconProps = { className: 'w-5 h-5' }
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} />
      case 'error':
        return <XCircle {...iconProps} />
      case 'warning':
        return <AlertTriangle {...iconProps} />
      case 'info':
      default:
        return <Info {...iconProps} />
    }
  }

  const getColorClasses = () => {
    if (color) {
      switch (color) {
        case 'blue':
          return 'bg-blue-50 border-blue-200 text-blue-900'
        case 'green':
          return 'bg-green-50 border-green-200 text-green-900'
        case 'yellow':
          return 'bg-yellow-50 border-yellow-200 text-yellow-900'
        case 'red':
          return 'bg-red-50 border-red-200 text-red-900'
        case 'purple':
          return 'bg-purple-50 border-purple-200 text-purple-900'
        case 'gray':
          return 'bg-gray-50 border-gray-200 text-gray-900'
        default:
          return 'bg-blue-50 border-blue-200 text-blue-900'
      }
    }
    
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-3 text-sm'
      case 'lg':
        return 'p-6 text-lg'
      default:
        return 'p-4 text-base'
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2'
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2'
      default:
        return 'top-4 right-4'
    }
  }

  const getAnimation = () => {
    switch (animation) {
      case 'slide':
        return {
          initial: { opacity: 0, x: position.includes('right') ? 300 : -300, y: 0 },
          animate: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: position.includes('right') ? 300 : -300, y: 0 }
        }
      case 'fade':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 }
        }
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        }
      case 'bounce':
        return {
          initial: { opacity: 0, y: -50, scale: 0.8 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -50, scale: 0.8 }
        }
      case 'flip':
        return {
          initial: { opacity: 0, rotateY: -90 },
          animate: { opacity: 1, rotateY: 0 },
          exit: { opacity: 0, rotateY: 90 }
        }
      default:
        return {
          initial: { opacity: 0, x: position.includes('right') ? 300 : -300, y: 0 },
          animate: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: position.includes('right') ? 300 : -300, y: 0 }
        }
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed z-50 max-w-sm w-full',
            getPositionClasses()
          )}
          initial={getAnimation().initial}
          animate={getAnimation().animate}
          exit={getAnimation().exit}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div
            className={cn(
              'relative rounded-lg border shadow-lg cursor-pointer',
              'hover:shadow-xl transition-shadow duration-200',
              getColorClasses(),
              getSizeClasses(),
              className
            )}
            onClick={onClick}
          >
            <div className="flex items-start space-x-3">
              {getIcon() && (
                <div className="flex-shrink-0">
                  {getIcon()}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                {title && (
                  <h4 className="font-semibold mb-1">
                    {title}
                  </h4>
                )}
                <p className="text-sm opacity-90">
                  {message}
                </p>
                
                {action && (
                  <button
                    className="mt-2 text-sm font-medium underline hover:no-underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      action.onClick()
                    }}
                  >
                    {action.label}
                  </button>
                )}
              </div>
              
              {closable && (
                <button
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClose()
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// トースト管理用のコンテキスト
interface ToastContextType {
  showToast: (toast: Omit<FeedbackToastProps, 'onClose'>) => void
  hideToast: (id: string) => void
  hideAllToasts: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Array<FeedbackToastProps & { id: string }>>([])

  const showToast = React.useCallback((toast: Omit<FeedbackToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id, onClose: () => hideToast(id) }])
  }, [])

  const hideToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const hideAllToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast, hideAllToasts }}>
      {children}
      {toasts.map(toast => (
        <FeedbackToast key={toast.id} {...toast} />
      ))}
    </ToastContext.Provider>
  )
}
