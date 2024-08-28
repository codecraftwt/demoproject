import React from 'react'
import { Button } from '@mui/material'

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  resetError = () => {
    this.setState({ hasError: false })
    if (this.props.onReset) {
      this.props.onReset() // Call the reset callback passed by the parent
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught in ErrorBoundary: ', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h3>Something unexpected happened.</h3>
          <Button onClick={this.resetError}>Reload data</Button>
        </div>
      )
    }

    return this.props.children
  }
}
