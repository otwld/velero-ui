---
sidebar_position: 3
title: 🛠️ Development Guide
---

# 🌍 Local Development Setup

✨ This workspace is powered by [Nx, Smart Monorepos · Fast CI.](https://nx.dev/) ✨

## 🛠️ Stack

- **Backend**: NodeJs, NestJs
- **Frontend**: VueJs, TailwindCSS with Flowbite

## 📋 Requirements

To ensure a smooth development experience, please ensure you have the following installed:

- **Node.js**: Version 22.22.2+ (22.x), 24.15.0+ (24.x), or 26+
- **TypeScript**: Version 5.0.0 or higher
- **NPM**: Ensure you have NPM installed
- **Nx Workspace**: Version 19.0.0 or higher

## ⚙️ Installation

Follow these steps to set up your local environment:

1. **Clone the Repository**

   Start by cloning the repository to your local machine:
    ```bash
    git clone git@github.com:otwld/velero-ui.git
    ```

2. **Install Nx**

   Install Nx globally using one of the following commands:

    ```bash
    npm add --global nx@latest
    ```

    or

    ```bash
    npm install -g nx@latest
    ```

3. Install dependencies with npm

    Install project dependencies by running:
    
    ```bash
    npm install
    ```

4. Edit the .env.development, you can find references [HERE]( /getting-started/environment-variables)

### 🚀 Serve

- Serve the API

```bash
nx serve velero-ui-api
```

- Serve the APP

```bash
nx serve velero-ui
```

### 🏗️ Build

- Build the API

```bash
nx build velero-ui-api
```

- Build the APP

```bash
nx build velero-ui
```

### 📦 Build Docker Image

Please make sure you have Docker installed on your machine.

At the root of the project, run the following command:

1. Build Velero UI
```bash
nx build velero-ui
```

2. Build Docker Image
```bash 
docker build -t velero-ui .
```
