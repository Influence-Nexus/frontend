"""Utility helpers for sending transactional emails via Gmail SMTP."""

from __future__ import annotations

import logging
import os
import smtplib
import ssl
from email.message import EmailMessage
from typing import Optional

logger = logging.getLogger(__name__)


class EmailSendError(RuntimeError):
    """Raised when email sending fails."""


def _get_env(name: str) -> Optional[str]:
    value = os.getenv(name)
    if value:
        value = value.strip()
    return value or None


def _build_reset_link(token: str) -> str:
    template = _get_env("PASSWORD_RESET_URL_TEMPLATE")
    if template and "{token}" in template:
        return template.replace("{token}", token)

    base_url = _get_env("PASSWORD_RESET_BASE_URL")
    if base_url:
        return f"{base_url.rstrip('/')}/{token}"

    return token


def send_password_reset_email(recipient: str, token: str) -> None:
    """Send a password reset email with the provided token."""

    smtp_user = _get_env("SMTP_GMAIL_USER")
    smtp_password = _get_env("SMTP_GMAIL_PASSWORD")
    if not smtp_user or not smtp_password:
        raise EmailSendError("SMTP credentials are not configured")

    subject = _get_env("PASSWORD_RESET_SUBJECT") or "Восстановление пароля"
    support_email = _get_env("SUPPORT_EMAIL") 
    reset_link = _build_reset_link(token)

    message = EmailMessage()
    message["From"] = support_email
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(
        (
            "Здравствуйте!\n\n"
            "Похоже, вы запросили восстановление пароля на платформе Graph Game.\n"
            "Чтобы задать новый пароль, перейдите по ссылке: {link}\n"
            "Токен для восстановления: {token}\n\n"
            "Если вы не запрашивали восстановление пароля, просто игнорируйте это письмо."
        ).format(link=reset_link, token=token)
    )

    smtp_host = _get_env("SMTP_GMAIL_HOST") or "smtp.gmail.com"
    smtp_port = int(_get_env("SMTP_GMAIL_PORT") or 465)

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        logger.exception("Failed to send password reset email: %s", exc)
        raise EmailSendError("Failed to send password reset email") from exc