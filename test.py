import sys
import smtplib
from email.mime.text import MIMEText
from email.header import Header

password = sys.argv[1]
#print("password",password)

message = MIMEText('Python 邮件发送测试...', 'plain', 'utf-8')
message['From'] = Header("菜鸟教程", 'utf-8')
message['To'] =  Header("测试", 'utf-8')
 
subject = 'Python SMTP 邮件测试'
message['Subject'] = Header(subject, 'utf-8')

sender = 'from@runoob.com'
receivers = ['764499983@qq.com'] 
smtp = smtplib.SMTP() 
smtp.connect('smtp.qq.com',25) 
smtp.login('411511989@qq.com',password) 
smtp.sendmail(sender, receivers, message.as_string()) 
smtp.quit()

