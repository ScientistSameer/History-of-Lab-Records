import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
load_dotenv()

def send_email(to_email: str, subject: str, body: str, from_email: str, password: str, smtp_server=os.getenv("SMTP_SERVER"), port=os.getenv("SMTP_PORT")):
    """
    Send an email using SMTP
    """
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls()
        server.login(from_email, password)
        server.send_message(msg)
