import '@testing-library/jest-dom';
import React from 'react';

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// lucide-react ships ESM only, which next/jest excludes from transformation, so
// stand in a proxy that resolves any icon name to a minimal inline svg.
jest.mock('lucide-react', () => {
  const cache = new Map();
  const makeIcon = (name) => {
    const Icon = ({ className, ...rest }) =>
      React.createElement('svg', {
        'data-testid': `lucide-${name}`,
        'data-icon': name,
        className,
        ...rest,
      });
    Icon.displayName = name;
    return Icon;
  };
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === '__esModule') return true;
        if (typeof prop !== 'string') return undefined;
        if (!cache.has(prop)) cache.set(prop, makeIcon(prop));
        return cache.get(prop);
      },
    }
  );
});

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'span' }) => {
    if (!field || !field.value) return null;
    return React.createElement(Tag, {}, field.value);
  },
  RichText: ({ field }) => {
    if (!field || !field.value) return null;
    return React.createElement('div', { dangerouslySetInnerHTML: { __html: field.value } });
  },
  Link: ({ field, children }) => {
    if (!field || !field.value) return React.createElement(React.Fragment, {}, children);
    const linkText = field?.value?.text || children;
    return React.createElement('a', { href: field.value.href }, linkText);
  },
  AppPlaceholder: ({ name }) =>
    React.createElement('div', { 'data-testid': 'app-placeholder', 'data-name': name }),
  withDatasourceCheck: () => (component) => component,
  useSitecore: () => ({
    page: { mode: { isEditing: false, isPreview: false, isNormal: true } },
  }),
}));
