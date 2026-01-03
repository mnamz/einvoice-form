# Nginx Configuration Guide

## Where to Edit Nginx Config

1. **Find your Nginx config file:**
   - Ubuntu/Debian: `/etc/nginx/sites-available/default` or `/etc/nginx/sites-available/your-site`
   - CentOS/RHEL: `/etc/nginx/conf.d/default.conf`
   - Or check: `/etc/nginx/nginx.conf` for `include` directives

2. **Edit the file:**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   # or
   sudo nano /etc/nginx/conf.d/default.conf
   ```

3. **Test configuration:**
   ```bash
   sudo nginx -t
   ```

4. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   # or
   sudo service nginx reload
   ```

## Option 1: Add CORS Headers to API Server

If you control the API server (`einv-metajo.myrccornertrading.com`), add CORS headers there.

See: `nginx-cors-example.conf`

## Option 2: Set Up Proxy on Frontend Server (RECOMMENDED)

If you control the frontend server (`einvoice.myrccornertrading.com`), set up a proxy there.

See: `nginx-proxy-example.conf`

This is the recommended approach as it avoids CORS issues entirely.
