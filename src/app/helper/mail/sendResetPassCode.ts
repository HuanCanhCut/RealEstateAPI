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
        subject: 'Reset Password Code',
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333">
                    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px">
                        <div style="width: 100%; display: flex; justify-content: center; align-items: center">
                            <img
                                src="https://res.cloudinary.com/dkmwrkngj/image/upload/v1759854156/dark-logo_e176mo.png"  
                                style="width: 30%; height: auto; object-fit: cover; margin: 0 auto"
                                alt=""
                            />
                        </div>

                        <h1>Mã xác minh</h1>

                        <h4 style="font-weight: 400">
                            Vui lòng điền mã xác minh sau để cập nhật lại mật khẩu, vui lòng không chia sẻ mã này cho bất kì ai. Mã có hiệu lực trong vòng ${formatDuration(Number(process.env.RESET_PASSWORD_TTL))}.
                        </h4>

                        <h1 style="text-align: center">${code}</h1>

                        <p>Email này được gửi từ hệ thống, vui lòng không trả lời lại.</p>

                        <h3 style="color: rgb(0, 76, 255); text-align: center">🐧 Huấn Cánh Cụt 🐧</h3>
                    </div>
                </body>
            </html>

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
                                    <h1 style="margin: 0 0 20px; font-size: 24px; font-weight: 700; color: #1a1a1a;">Mã xác minh</h1>
                                    
                                    <p style="margin: 0 0 30px; line-height: 1.6; color: #555; font-size: 16px;">
                                        Chào mừng bạn đến với phần mềm quản lí sinh viên" style="color: #ff2056; text-decoration: none;"><strong>Thư viện số</strong></a>. Vui lòng sử dụng mã xác minh dưới đây để cập nhật lại mật khẩu.
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
