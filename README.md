# Doxa Components

Open source React UI components for documentation sites, built with Tailwind CSS.

[![npm version](https://img.shields.io/npm/v/@doxa/components.svg)](https://www.npmjs.com/package/@doxa/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @doxa/components
# or
pnpm add @doxa/components
# or
yarn add @doxa/components
```

## Requirements

- Node.js >= 20.0.0
- React ^18.0.0 or ^19.0.0
- Tailwind CSS v3 or v4

## Setup

### Tailwind v4

Import the styles at the **top** of your main CSS file, **before** `@import "tailwindcss"`:

```css
@import "@doxa/components/styles.css";
@import "tailwindcss";

@theme {
  --color-primary: #your-color;
}
```

### Tailwind v3

Import the styles at the **top** of your main CSS file:

```css
@import "@doxa/components/styles.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Override theme values in `tailwind.config.js`.

> **Note:** Importing styles before Tailwind ensures your custom theme values take precedence over the component defaults.

## Usage

Import components in your React files:

```tsx
import { Accordion, Callout, CodeBlock, Tabs } from '@doxa/components';
```

### Example

```tsx
import { Callout } from '@doxa/components';

const App = () => {
  return (
    <Callout type="info" title="Note">
      This is an informational callout.
    </Callout>
  );
}
```

## Components


## Documentation

- [Component Documentation](https://github.com/doxa-dev/doxa-components)
- [Storybook Examples](http://localhost:6006)

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

For local development setup, see [Development](./DEVELOPMENT.md).

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Acknowledgements

Doxa Components is derived from [mintlify/components](https://github.com/mintlify/components), an MIT-licensed open source project by Mintlify, Inc. The original copyright notice is retained in [LICENSE](./LICENSE).
