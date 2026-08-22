# syntax=docker/dockerfile:1

# Debian rather than Alpine: sharp sits in `ignoredBuiltDependencies`, so
# next/image leans on the glibc prebuilts that actually ship.
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NEXT_TELEMETRY_DISABLED=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app
# Resolve pnpm once here, from the `packageManager` field. Later stages inherit
# the binary; leaving it to first use makes every stage a separate registry
# fetch, and one npmjs hiccup then fails the build.
COPY package.json ./
RUN corepack enable && corepack prepare --activate

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./
COPY prisma ./prisma
# `postinstall` runs `prisma generate`, and prisma.config.ts resolves
# DATABASE_URL eagerly. Generating never opens a connection, so a throwaway
# value is enough — the real one arrives at run time.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
# Baked into the browser bundle by `next build`, not read at run time. Miss it
# here and the app ships with no treasury address to pay.
ARG NEXT_PUBLIC_TREASURY_ADDRESS
ENV NEXT_PUBLIC_TREASURY_ADDRESS=$NEXT_PUBLIC_TREASURY_ADDRESS
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN groupadd -r nodejs && useradd -r -g nodejs nextjs
# `output: "standalone"` traces only the files the server actually loads;
# public/ and .next/static are not traced, so they come across by hand.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
# next start would need the full dependency tree; the traced server does not.
CMD ["node", "server.js"]
