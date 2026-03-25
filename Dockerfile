# 1. Use an End-of-Life (EOL) base image to trigger 'Unsupported OS' alerts
FROM node:10.15.3-stretch

# 2. Set an environment variable with a fake secret to test Secret Scanning
ENV DB_PASSWORD="SuperSecretPassword123!"
ENV AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"

# 3. Create a non-root user but DON'T use it (tests for 'Running as Root' misconfig)
RUN useradd -m appuser

# 4. Install a version of a library with a famous vulnerability (Log4js / ShellJS)
# shelljs@0.7.0 is known to have Command Injection vulnerabilities
WORKDIR /app
RUN npm install shelljs@0.7.0 express@4.16.0

# 5. Copy in a "vulnerable" script
COPY app.js .

# 6. Intentionally leave the Docker socket reachable (if mounted)
# This is a major ASPM/Container security finding
LABEL maintainer="VULCONHUB-Test"
LABEL security.vulnerable="true"

# Running as root (by default) to trigger another high-severity alert
ENTRYPOINT ["node", "app.js"]
