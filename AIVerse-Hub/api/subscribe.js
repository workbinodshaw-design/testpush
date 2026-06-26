import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    // Check if Email credentials are set
    const userEmail = process.env.GMAIL_EMAIL;
    const appPassword = process.env.GMAIL_APP_PASSWORD;

    if (!userEmail || !appPassword) {
      console.error("Missing Gmail credentials in environment variables.");
      return res.status(500).json({ error: "Email configuration error on server." });
    }

    // Configure Nodemailer Transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: userEmail,
        pass: appPassword,
      },
    });

    // Define Email HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #5d0d18; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Welcome to AIVerse Hub! 🚀</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #333333;">Hi there,</p>
          <p style="font-size: 16px; color: #333333; line-height: 1.6;">
            Thank you for subscribing to the AIVerse Hub Newsletter! You are now on the list to receive our weekly digest of the newest and most powerful AI tools available on the internet.
          </p>
          <p style="font-size: 16px; color: #333333; line-height: 1.6;">
            We do the heavy lifting of exploring the AI world so you can focus on building and creating. Keep an eye on your inbox for our upcoming drops!
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://testpush-mauve.vercel.app/" style="background-color: #5d0d18; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Explore Tools Now</a>
          </div>
          <p style="font-size: 16px; color: #333333;">Best regards,<br><strong>Binod Shaw</strong><br>Founder, AIVerse Hub</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888888;">
          © ${new Date().getFullYear()} AIVerse Hub. All rights reserved.<br>
          You received this email because you subscribed on our website.
        </div>
      </div>
    `;

    // Send Mail
    await transporter.sendMail({
      from: \`"AIVerse Hub" <\${userEmail}>\`,
      to: email,
      subject: "Welcome to the AIVerse Hub Newsletter! 🚀",
      html: htmlContent,
    });

    return res.status(200).json({ success: true, message: "Welcome email sent successfully." });

  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send welcome email." });
  }
}
