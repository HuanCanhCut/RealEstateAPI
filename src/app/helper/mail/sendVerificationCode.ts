import nodemailer from 'nodemailer'

import formatDuration from './formatDuration'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
    },
})

const sendResetPassCode = ({ email, code }: { email: string; code: number }) => {
    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: 'Verification Code',
        html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verification Code</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; color: #333;">
                    <div style="width: 100%; table-layout: fixed; background-color: #f4f6f8; padding: 40px 0;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 0 20px; box-sizing: border-box;">
                            <!-- Card Container -->
                            <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e1e4e8;">
                                
                                <!-- Header / Brand -->
                                <div style="background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #f0f0f0;">
                                    <img
                                        src="https://qldaotao.utehy.edu.vn/FileManager/img/WebsiteTemplateIcon.png"  
                                        style="width: 80px; height: auto; object-fit: contain;"
                                        alt="Logo"
                                    />
                                </div>

                                <!-- Content -->
                                <div style="padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0 0 20px; font-size: 24px; font-weight: 700; color: #1a1a1a;">Xác minh tài khoản</h1>
                                    
                                    <p style="margin: 0 0 30px; line-height: 1.6; color: #555; font-size: 16px;">
                                        Chào mừng bạn đến với phần mềm quản lí sinh viên" style="color: #ff2056; text-decoration: none;"><strong>Thư viện số</strong></a>. Vui lòng sử dụng mã xác minh dưới đây để hoàn tất đăng ký.
                                        <br>Mã này sẽ hết hạn trong <strong>${formatDuration(Number(process.env.VERIFY_AUTH_TTL))}</strong>.
                                    </p>

                                    <!-- Code Box -->
                                    <div style="background-color: #f0f7ff; border-radius: 8px; padding: 20px; margin: 0 auto 30px; display: inline-block; border: 1px dashed #ff2056;">
                                        <span style="font-size: 32px; font-weight: 700; color: #ff2056; letter-spacing: 8px; font-family: monospace;">${code}</span>
                                    </div>

                                    <p style="margin: 0; font-size: 14px; color: #666; font-style: italic;">
                                        Vui lòng không chia sẻ mã này cho bất kì ai.
                                    </p>
                                </div>

                                <!-- Footer -->
                                <div style="background-color: #fafbfc; padding: 20px; text-align: center; border-top: 1px solid #f0f0f0;">
                                    <p style="margin: 0 0 10px; font-size: 12px; color: #888;">
                                        Email này được gửi tự động từ hệ thống.
                                    </p>
                                </div>

                            </div>
                            
                            <!-- Footer note outside card for clutter reduction -->
                            <div style="text-align: center; padding-top: 20px;">
                                <p style="margin: 0; font-size: 12px; color: #999;">
                                    &copy; ${new Date().getFullYear()} Digital Library. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `,
    }

    return transporter.sendMail(mailOptions)
}

export default sendResetPassCode
