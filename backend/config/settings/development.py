"""
Bloomora Django Backend - Development Settings (SQLite)
"""
from .base import *

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Looser CORS for development
CORS_ALLOW_ALL_ORIGINS = True

# Email backend for dev (print to console)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Less strict password validation in dev
AUTH_PASSWORD_VALIDATORS = []
