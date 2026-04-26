import smtplib
import os
from email.message import EmailMessage

def send_reset_email(to_email, token):
    email_addr = os.getenv("EMAIL_ADDRESS")
    email_pass = os.getenv("EMAIL_PASSWORD") 

    msg = EmailMessage()
    msg['Subject'] = "BudgetMate - Password Reset Request"
    msg['From'] = email_addr
    msg['To'] = to_email
    msg.set_content(f"You requested a password reset. Your token is: {token}\nThis expires in 1 hour.")

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(email_addr, email_pass)
        smtp.send_message(msg)