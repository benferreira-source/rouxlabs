#!/usr/bin/env python3
"""Simple HTTP server for Roux Labs static site."""

import http.server
import os
import sys

PORT = 4321
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        sys.stdout.write(f"[rouxlabs] {self.address_string()} - {format % args}\n")
        sys.stdout.flush()


if __name__ == "__main__":
    with http.server.HTTPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"[rouxlabs] Serving {DIRECTORY} on http://127.0.0.1:{PORT}")
        sys.stdout.flush()
        httpd.serve_forever()
