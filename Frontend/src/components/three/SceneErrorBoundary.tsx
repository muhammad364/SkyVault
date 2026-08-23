import { Component, type ReactNode } from 'react'
import { SceneFallback } from '@/components/three/SceneFallback'

interface SceneErrorBoundaryProps {
  label: string
  imageSrc?: string
  darkImageSrc?: string
  fallback?: ReactNode
  children: ReactNode
}

interface SceneErrorBoundaryState {
  hasError: boolean
}

export class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <SceneFallback
          label={this.props.label}
          imageSrc={this.props.imageSrc}
          darkImageSrc={this.props.darkImageSrc}
        />
      )
    }
    return this.props.children
  }
}
