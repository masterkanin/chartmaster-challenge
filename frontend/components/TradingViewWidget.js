import React, { useEffect, useRef } from 'react';

// This is a wrapper component for the TradingView Widget
const TradingViewWidget = ({ 
  symbol = 'NASDAQ:AAPL', 
  interval = '1D', 
  theme = 'light',
  width = '100%',
  height = '500px',
  readOnly = false
}) => {
  const container = useRef();

  useEffect(() => {
    // Create the script element for TradingView Widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: container.current.id,
          disabled_features: readOnly ? [
            'use_localstorage_for_settings',
            'header_symbol_search',
            'symbol_search_hot_key',
            'header_chart_type',
            'header_compare',
            'header_undo_redo',
            'header_screenshot',
            'header_saveload',
            'drawing_tools_button',
            'timeframes_toolbar',
          ] : [],
          enabled_features: [],
        });
      }
    };
    
    container.current.appendChild(script);
    
    return () => {
      // Clean up
      if (container.current && script) {
        container.current.removeChild(script);
      }
    };
  }, [symbol, interval, theme, readOnly]);

  return (
    <div 
      ref={container} 
      id={`tradingview_widget_${Math.random().toString(36).substring(2, 9)}`}
      style={{ width, height }}
      className="tradingview-widget-container"
    />
  );
};

export default TradingViewWidget;
