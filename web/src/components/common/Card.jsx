import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  className = '',
  headerAction,
}) {
  return (
    <div className={`glass-card rounded-2xl border border-slate-850 p-6 shadow-xl ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/60">
          <div>
            {title && <h3 className="font-display text-base font-bold text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
