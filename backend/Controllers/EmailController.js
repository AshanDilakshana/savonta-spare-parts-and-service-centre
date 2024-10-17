import nodemailer from 'nodemailer';
export const sendConfirmationEmail = async (req, res) => {
  const { email, bookingDetails } = req.body;

  // Create a transporter using SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
  let mailOptions = {
    from: '"Savonta Service" dimondswebdesign@gmail.com',
    to: email,
    subject: "Appoinment Confirmation",
    html: `
      <h1>Appoinment Confirmation</h1>
      <p>Thank you for your appoinment. Here are the details:</p>
      <ul>
        <li>Service: ${bookingDetails.service}</li>
        <li>Date: ${bookingDetails.date}</li>
        <li>Time: ${bookingDetails.time}</li>
        <li>Vehicle: ${bookingDetails.vehicle}</li>
      </ul>
      <p>Additional Note: ${bookingDetails.note}</p>
      <p>If you have any questions, please contact us.</p>
      <p>Contact: 074678936</p>
      <br/>
      <p>Best regards,</p>
      <p>The Savonta Service Team</p>
    `
  };

  try {
    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Confirmation email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending confirmation email" });
  }
};

