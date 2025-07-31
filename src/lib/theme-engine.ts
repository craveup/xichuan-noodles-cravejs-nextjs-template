/**
 * Theme Engine for Restaurant JSON Themes
 * Converts JSON theme definitions to CSS custom properties
 */

export interface ThemeColors {
  brand: {
    primary: string
    secondary: string
    accent: string
  }
  restaurant: {
    warmth: string
    fresh: string
    premium: string
  }
  components: {
    menuCard: {
      background: string
      border: string
      hover: string
    }
    cart: {
      background: string
      border: string
      highlight: string
    }
    status: {
      success: string
      error: string
      warning: string
      info: string
    }
  }
  darkMode?: {
    brand: {
      primary: string
      secondary: string
      accent: string
    }
    components: {
      menuCard: {
        background: string
        border: string
        hover: string
      }
      cart: {
        background: string
        border: string
      }
    }
  }
}

export interface ThemeTypography {
  fonts: {
    primary: {
      family: string
      fallback: string
      weights: number[]
    }
    accent: {
      family: string
      fallback: string
      weights: number[]
    }
    menu: {
      family: string
      fallback: string
      weights: number[]
    }
  }
  scale: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }
}

export interface RestaurantTheme {
  name: string
  version: string
  clientId: string
  description: string
  category: string
  colors: ThemeColors
  typography: ThemeTypography
  spacing: {
    borderRadius: {
      sm: string
      base: string
      lg: string
      xl: string
    }
    shadows: {
      menuCard: string
      cart: string
      modal: string
    }
  }
  components: Record<string, any>
  animations: {
    duration: {
      fast: string
      normal: string
      slow: string
    }
    easing: {
      default: string
      in: string
      out: string
    }
    effects: Record<string, any>
  }
  accessibility: {
    respectMotionPreference: boolean
    contrastMode: {
      enabled: boolean
      adjustments: Record<string, string>
    }
  }
  customProperties?: {
    specialEffects?: Record<string, string>
    branding?: Record<string, string>
  }
  responsive?: Record<string, any>
  clientSpecific?: {
    businessType: string
    atmosphere: string
    targetAudience: string
    brandPersonality: string[]
    seasonalAdjustments?: Record<string, any>
  }
}

export class ThemeEngine {
  private theme: RestaurantTheme
  private isDarkMode: boolean = false

  constructor(theme: RestaurantTheme) {
    this.theme = theme
  }

  /**
   * Generate CSS custom properties from theme JSON
   */
  generateCSSProperties(): Record<string, string> {
    const cssProps: Record<string, string> = {}
    const colors = this.isDarkMode && this.theme.colors.darkMode 
      ? this.mergeDarkModeColors() 
      : this.theme.colors

    // Brand colors
    cssProps['--brand-primary'] = colors.brand.primary
    cssProps['--brand-secondary'] = colors.brand.secondary
    cssProps['--brand-accent'] = colors.brand.accent

    // Restaurant colors
    cssProps['--restaurant-warmth'] = colors.restaurant.warmth
    cssProps['--restaurant-fresh'] = colors.restaurant.fresh
    cssProps['--restaurant-premium'] = colors.restaurant.premium

    // Component colors
    cssProps['--menu-card-bg'] = colors.components.menuCard.background
    cssProps['--menu-card-border'] = colors.components.menuCard.border
    cssProps['--menu-card-hover'] = colors.components.menuCard.hover

    cssProps['--cart-bg'] = colors.components.cart.background
    cssProps['--cart-border'] = colors.components.cart.border
    cssProps['--cart-highlight'] = colors.components.cart.highlight

    // Status colors
    cssProps['--order-success'] = colors.components.status.success
    cssProps['--order-error'] = colors.components.status.error
    cssProps['--order-warning'] = colors.components.status.warning
    cssProps['--order-info'] = colors.components.status.info

    // Typography - with safety checks
    if (this.theme.typography?.fonts?.primary?.family) {
      cssProps['--font-family-primary'] = `'${this.theme.typography.fonts.primary.family}', ${this.theme.typography.fonts.primary.fallback}`
    }
    if (this.theme.typography?.fonts?.accent?.family) {
      cssProps['--font-family-accent'] = `'${this.theme.typography.fonts.accent.family}', ${this.theme.typography.fonts.accent.fallback}`
    }
    if (this.theme.typography?.fonts?.menu?.family) {
      cssProps['--font-family-menu'] = `'${this.theme.typography.fonts.menu.family}', ${this.theme.typography.fonts.menu.fallback}`
    }

    // Spacing - with safety checks
    if (this.theme.spacing?.borderRadius) {
      cssProps['--border-radius-sm'] = this.theme.spacing.borderRadius.sm || '0.5rem'
      cssProps['--border-radius'] = this.theme.spacing.borderRadius.base || '0.75rem'
      cssProps['--border-radius-lg'] = this.theme.spacing.borderRadius.lg || '1rem'
      cssProps['--border-radius-xl'] = this.theme.spacing.borderRadius.xl || '1.5rem'
    }

    // Shadows - with safety checks
    if (this.theme.spacing?.shadows) {
      cssProps['--shadow-menu-card'] = this.theme.spacing.shadows.menuCard || '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      cssProps['--shadow-cart'] = this.theme.spacing.shadows.cart || '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      cssProps['--shadow-modal'] = this.theme.spacing.shadows.modal || '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    }

    // Animation durations - with safety checks
    if (this.theme.animations?.duration) {
      cssProps['--duration-fast'] = this.theme.animations.duration.fast || '150ms'
      cssProps['--duration-normal'] = this.theme.animations.duration.normal || '200ms'
      cssProps['--duration-slow'] = this.theme.animations.duration.slow || '300ms'
    }

    // Animation easing - with safety checks
    if (this.theme.animations?.easing) {
      cssProps['--easing-default'] = this.theme.animations.easing.default || 'ease'
      cssProps['--easing-in'] = this.theme.animations.easing.in || 'ease-in'
      cssProps['--easing-out'] = this.theme.animations.easing.out || 'ease-out'
    }

    // Custom properties
    if (this.theme.customProperties?.specialEffects) {
      Object.entries(this.theme.customProperties.specialEffects).forEach(([key, value]) => {
        cssProps[`--effect-${key}`] = value
      })
    }

    return cssProps
  }

  /**
   * Apply theme to document
   */
  applyTheme(element?: HTMLElement): void {
    const target = element || document.documentElement
    const cssProps = this.generateCSSProperties()

    Object.entries(cssProps).forEach(([property, value]) => {
      target.style.setProperty(property, value)
    })

    // Apply theme class
    target.classList.add(`theme-${this.theme.clientId}`)
    target.setAttribute('data-theme', this.theme.clientId)
    target.setAttribute('data-theme-category', this.theme.category)
  }

  /**
   * Toggle dark mode
   */
  setDarkMode(isDark: boolean): void {
    this.isDarkMode = isDark
    this.applyTheme()
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  /**
   * Generate Tailwind configuration
   */
  generateTailwindConfig(): Record<string, any> {
    return {
      colors: {
        brand: {
          primary: `hsl(var(--brand-primary))`,
          secondary: `hsl(var(--brand-secondary))`,
          accent: `hsl(var(--brand-accent))`
        },
        restaurant: {
          warmth: `hsl(var(--restaurant-warmth))`,
          fresh: `hsl(var(--restaurant-fresh))`,
          premium: `hsl(var(--restaurant-premium))`
        },
        'menu-card': {
          DEFAULT: `hsl(var(--menu-card-bg))`,
          border: `hsl(var(--menu-card-border))`,
          hover: `hsl(var(--menu-card-hover))`
        },
        cart: {
          DEFAULT: `hsl(var(--cart-bg))`,
          border: `hsl(var(--cart-border))`,
          highlight: `hsl(var(--cart-highlight))`
        },
        order: {
          success: `hsl(var(--order-success))`,
          error: `hsl(var(--order-error))`,
          warning: `hsl(var(--order-warning))`,
          info: `hsl(var(--order-info))`
        }
      },
      fontFamily: {
        primary: `var(--font-family-primary)`,
        accent: `var(--font-family-accent)`,
        menu: `var(--font-family-menu)`
      },
      borderRadius: {
        'theme-sm': `var(--border-radius-sm)`,
        'theme-base': `var(--border-radius)`,
        'theme-lg': `var(--border-radius-lg)`,
        'theme-xl': `var(--border-radius-xl)`
      },
      boxShadow: {
        'menu-card': `var(--shadow-menu-card)`,
        'cart': `var(--shadow-cart)`,
        'modal': `var(--shadow-modal)`
      },
      transitionDuration: {
        'theme-fast': `var(--duration-fast)`,
        'theme-normal': `var(--duration-normal)`,
        'theme-slow': `var(--duration-slow)`
      },
      transitionTimingFunction: {
        'theme-default': `var(--easing-default)`,
        'theme-in': `var(--easing-in)`,
        'theme-out': `var(--easing-out)`
      }
    }
  }

  /**
   * Get theme metadata
   */
  getThemeInfo(): Partial<RestaurantTheme> {
    return {
      name: this.theme.name,
      version: this.theme.version,
      clientId: this.theme.clientId,
      description: this.theme.description,
      category: this.theme.category,
      clientSpecific: this.theme.clientSpecific
    }
  }

  /**
   * Validate theme JSON structure
   */
  static validateTheme(theme: unknown): boolean {
    if (!theme || typeof theme !== 'object') return false
    const themeObj = theme as Record<string, unknown>
    const requiredKeys = ['name', 'clientId', 'colors', 'typography', 'spacing']
    return requiredKeys.every(key => key in themeObj)
  }

  /**
   * Load theme from JSON file
   */
  static async loadTheme(themePath: string): Promise<RestaurantTheme> {
    try {
      const response = await fetch(themePath)
      const theme = await response.json()
      
      if (!this.validateTheme(theme)) {
        throw new Error('Invalid theme structure')
      }
      
      return theme as RestaurantTheme
    } catch (error) {
      throw new Error(`Failed to load theme: ${error}`)
    }
  }

  /**
   * Merge dark mode colors with base colors
   */
  private mergeDarkModeColors(): ThemeColors {
    const baseColors = this.theme.colors
    const darkColors = this.theme.colors.darkMode!

    return {
      ...baseColors,
      brand: darkColors.brand,
      components: {
        ...baseColors.components,
        menuCard: darkColors.components.menuCard,
        cart: {
          ...darkColors.components.cart,
          highlight: baseColors.components.cart.highlight
        }
      }
    }
  }

  /**
   * Apply seasonal adjustments
   */
  applySeasonalTheme(season: 'winter' | 'spring' | 'summer' | 'fall'): void {
    const seasonalAdjustments = this.theme.clientSpecific?.seasonalAdjustments?.[season]
    
    if (seasonalAdjustments?.colors) {
      Object.entries(seasonalAdjustments.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key.replace('.', '-')}`, value as string)
      })
    }
  }

  /**
   * Export theme as CSS file
   */
  exportCSS(): string {
    const cssProps = this.generateCSSProperties()
    let css = `:root {\n`
    
    Object.entries(cssProps).forEach(([property, value]) => {
      css += `  ${property}: ${value};\n`
    })
    
    css += '}\n\n'
    
    // Add accessibility rules
    if (this.theme.accessibility.respectMotionPreference) {
      css += `@media (prefers-reduced-motion: reduce) {\n`
      css += `  * { animation: none !important; transition: none !important; }\n`
      css += `}\n\n`
    }
    
    if (this.theme.accessibility.contrastMode.enabled) {
      css += `@media (prefers-contrast: high) {\n`
      css += `  :root {\n`
      Object.entries(this.theme.accessibility.contrastMode.adjustments).forEach(([key, value]) => {
        css += `    --${key.replace('.', '-')}: ${value};\n`
      })
      css += `  }\n`
      css += `}\n`
    }
    
    return css
  }
}