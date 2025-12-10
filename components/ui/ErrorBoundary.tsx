"use client";

import { ErrorBoundaryProps, ErrorBoundaryState } from "@/types";
import React, { Component } from "react";

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error atrapado por ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-600 text-white p-4 rounded">
          <p>Ocurrió un error cargando este componente.</p>
          <pre className="text-xs mt-2">{this.state.error?.message}</pre>
          <button
            onClick={this.handleReset}
            className="mt-2 px-2 py-1 bg-white text-red-600 rounded"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
