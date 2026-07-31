import { transporter } from "../utils/nodemailer.js";

export const sendVerificationEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `"PreviewCraft" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `${otp} is your PreviewCraft verification code`,

        html: `
            <div style="
                max-width:560px;
                margin:0 auto;
                padding:40px;
                font-family:Arial,Helvetica,sans-serif;
                background:#0a0a0a;
                color:#ffffff;
                border-radius:12px;
            ">

                <div style="margin-bottom:32px;">
                    <h1 style="
                        margin:0;
                        font-size:24px;
                        color:#ffffff;
                    ">
                        Preview<span style="color:#ff6fae;">Craft</span>
                    </h1>
                </div>

                <h2 style="
                    margin:0 0 16px;
                    font-size:26px;
                    color:#ffffff;
                ">
                    Verify your email
                </h2>

                <p style="
                    color:#b5b5b5;
                    font-size:15px;
                    line-height:1.7;
                    margin-bottom:30px;
                ">
                    Welcome to PreviewCraft. Enter the verification code below
                    to finish setting up your account.
                </p>

                <div style="
                    background:#151515;
                    border:1px solid #292929;
                    border-radius:10px;
                    padding:28px;
                    text-align:center;
                    margin-bottom:28px;
                ">

                    <p style="
                        color:#8f8f8f;
                        font-size:12px;
                        text-transform:uppercase;
                        letter-spacing:2px;
                        margin:0 0 14px;
                    ">
                        Verification code
                    </p>

                    <div style="
                        font-size:36px;
                        font-weight:700;
                        letter-spacing:10px;
                        color:#ff6fae;
                    ">
                        ${otp}
                    </div>

                </div>

                <p style="
                    color:#b5b5b5;
                    font-size:14px;
                    line-height:1.6;
                ">
                    This code expires in
                    <strong style="color:#73e2a7;">10 minutes</strong>.
                </p>

                <p style="
                    color:#777777;
                    font-size:13px;
                    line-height:1.6;
                    margin-top:24px;
                ">
                    If you didn't create a PreviewCraft account,
                    you can safely ignore this email.
                </p>

                <div style="
                    border-top:1px solid #242424;
                    margin-top:32px;
                    padding-top:20px;
                ">
                    <p style="
                        margin:0;
                        color:#666666;
                        font-size:12px;
                    ">
                        PreviewCraft · Self-hosted preview deployments
                    </p>
                </div>

            </div>
        `,
    });
};
export const sendResetPasswordEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `"PreviewCraft" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `${otp} is your PreviewCraft password reset code`,

        html: `
            <div style="
                max-width:560px;
                margin:0 auto;
                padding:40px;
                font-family:Arial,Helvetica,sans-serif;
                background:#0a0a0a;
                color:#ffffff;
                border-radius:12px;
            ">

                <div style="margin-bottom:32px;">
                    <h1 style="
                        margin:0;
                        font-size:24px;
                        color:#ffffff;
                    ">
                        Preview<span style="color:#ff6fae;">Craft</span>
                    </h1>
                </div>

                <h2 style="
                    margin:0 0 16px;
                    font-size:26px;
                    color:#ffffff;
                ">
                    Reset your password
                </h2>

                <p style="
                    color:#b5b5b5;
                    font-size:15px;
                    line-height:1.7;
                    margin-bottom:30px;
                ">
                    We received a request to reset the password for your
                    PreviewCraft account. Enter the verification code below
                    to continue.
                </p>

                <div style="
                    background:#151515;
                    border:1px solid #292929;
                    border-radius:10px;
                    padding:28px;
                    text-align:center;
                    margin-bottom:28px;
                ">

                    <p style="
                        color:#8f8f8f;
                        font-size:12px;
                        text-transform:uppercase;
                        letter-spacing:2px;
                        margin:0 0 14px;
                    ">
                        Password reset code
                    </p>

                    <div style="
                        font-size:36px;
                        font-weight:700;
                        letter-spacing:10px;
                        color:#ff6fae;
                    ">
                        ${otp}
                    </div>

                </div>

                <p style="
                    color:#b5b5b5;
                    font-size:14px;
                    line-height:1.6;
                ">
                    This code expires in
                    <strong style="color:#73e2a7;">10 minutes</strong>.
                </p>

                <p style="
                    color:#777777;
                    font-size:13px;
                    line-height:1.6;
                    margin-top:24px;
                ">
                    For your security, never share this code with anyone.
                    PreviewCraft will never ask you for this code outside
                    the password reset process.
                </p>

                <p style="
                    color:#777777;
                    font-size:13px;
                    line-height:1.6;
                    margin-top:20px;
                ">
                    If you didn't request a password reset, you can safely
                    ignore this email. Your password will remain unchanged.
                </p>

                <div style="
                    border-top:1px solid #242424;
                    margin-top:32px;
                    padding-top:20px;
                ">
                    <p style="
                        margin:0;
                        color:#666666;
                        font-size:12px;
                    ">
                        PreviewCraft · Self-hosted preview deployments
                    </p>
                </div>

            </div>
        `,
    });
};