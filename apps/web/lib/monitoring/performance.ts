/**
 * Performance Monitoring
 * Track API response times, database queries, and page load metrics
 */

export interface PerformanceMetric {
  name: string
  startTime: number
  endTime?: number
  duration?: number
  metadata?: Record<string, any>
}

export interface PerformanceReport {
  metrics: PerformanceMetric[]
  averageDuration: number
  slowestOperation: PerformanceMetric | null
  fastestOperation: PerformanceMetric | null
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map()
  private completedMetrics: PerformanceMetric[] = []

  /**
   * Start tracking a performance metric
   */
  start(name: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    }
    this.metrics.set(name, metric)
  }

  /**
   * End tracking and record duration
   */
  end(name: string): number | null {
    const metric = this.metrics.get(name)
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`)
      return null
    }

    metric.endTime = performance.now()
    metric.duration = metric.endTime - metric.startTime

    this.completedMetrics.push(metric)
    this.metrics.delete(name)

    return metric.duration
  }

  /**
   * Measure async operation
   */
  async measure<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(name, metadata)
    try {
      const result = await operation()
      this.end(name)
      return result
    } catch (error) {
      this.end(name)
      throw error
    }
  }

  /**
   * Get performance report
   */
  getReport(): PerformanceReport {
    if (this.completedMetrics.length === 0) {
      return {
        metrics: [],
        averageDuration: 0,
        slowestOperation: null,
        fastestOperation: null
      }
    }

    const durations = this.completedMetrics
      .filter(m => m.duration !== undefined)
      .map(m => m.duration!)

    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length

    const sorted = [...this.completedMetrics].sort((a, b) => 
      (b.duration || 0) - (a.duration || 0)
    )

    return {
      metrics: this.completedMetrics,
      averageDuration,
      slowestOperation: sorted[0] || null,
      fastestOperation: sorted[sorted.length - 1] || null
    }
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear()
    this.completedMetrics = []
  }

  /**
   * Get metrics by name pattern
   */
  getMetricsByPattern(pattern: string): PerformanceMetric[] {
    const regex = new RegExp(pattern)
    return this.completedMetrics.filter(m => regex.test(m.name))
  }
}

export const performanceMonitor = new PerformanceMonitor()

/**
 * Decorator for measuring method execution time
 */
export function Measure(metricName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const name = metricName || `${target.constructor.name}.${propertyKey}`
      performanceMonitor.start(name)
      
      try {
        const result = await originalMethod.apply(this, args)
        performanceMonitor.end(name)
        return result
      } catch (error) {
        performanceMonitor.end(name)
        throw error
      }
    }

    return descriptor
  }
}
