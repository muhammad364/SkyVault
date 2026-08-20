import { Component, type ReactNode } from 'react'
import { SceneFallback } from '@/components/three/SceneFallback'

interface SceneErrorBoundaryProps {
  label: string
  children: ReactNode
}

interface SceneErrorBoundaryState {
  hasError: boolean
}

export class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return <SceneFallback label={this.props.label} />
    return this.props.children
  }
}
