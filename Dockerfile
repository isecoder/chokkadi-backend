# Use Debian 12 as the base image
FROM debian:12

# Install system dependencies and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    graphicsmagick \
    imagemagick \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Temporarily install all dependencies (including dev dependencies)
RUN pnpm install

# Copy the application source code
COPY . .

# Build the TypeScript code
RUN pnpm build

# Remove dev dependencies to keep the image lightweight
RUN pnpm prune --prod

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "dist/main"]
