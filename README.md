# Maily Form

This is a self-hosted service you can use to place forms on static sites. It used nodemailer and you can host it with Docker ([DockerHub](https://hub.docker.com/r/jlelse/maily-form/)).

It is currently in development and it's not advised to use in production yet.

## Parameters

`PORT` (optional): The port to which the server should listen, default 8080  
`EMAIL_USER` (required): The SMTP user  
`EMAIL_PASS` (required): The SMTP password  
`EMAIL_HOST` (required): The SMTP host  
`EMAIL_PORT` (required): The SMTP port  
`EMAIL_SECURE` (required): If the mail should be send on a secure port  
`FROM` (required): The sender, should be like `Forms forms@example.com`  
`TO` (required): Default recipient  
`ALLOWED_TO` (optional): All allowed recipients

## Special form fields

`_to`: Recipient, if `ALLOWED_TO` is set, it must be in that list  
`_replyTo`: Email address which should be configured as replyTo  
`_redirectTo`: URL to redirect to  
`_formName`: Name of the form
`_t_email`: Add this field to your form, but hide it with CSS or JS. If it get's filled, the submission is probably spam and get's rejected.