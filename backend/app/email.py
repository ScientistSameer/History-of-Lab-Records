import smtplib
from email.message import EmailMessage

def send_email(to_email: str, subject: str, body: str, from_email: str, password: str, smtp_server="smtp.gmail.com", port=587):
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
