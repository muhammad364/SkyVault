import { Component, type PropsWithChildren, type ReactNode } from 'react'
import { ErrorPage } from '@/pages/errors/ErrorPage'

interface GlobalErrorBoundaryState {
  hasError: boolean
}

export class GlobalErrorBoundary extends Component<PropsWithChildren, GlobalErrorBoundaryState> {
  state: GlobalErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): GlobalErrorBoundaryState {
    return { hasError: true }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorPage status="generic" onRetry={() => this.setState({ hasError: false })} />
    }

    return this.props.children
  }
}
