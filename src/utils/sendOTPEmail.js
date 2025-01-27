require('dotenv').config();

const mailchimp = require('@mailchimp/mailchimp_marketing');
mailchimp.setConfig({
    apiKey: process.env.YOUR_API_KEY,
    server: process.env.YOUR_SERVER_PREFIX
});

async function sendCampaign(email, otp) {
  try {
    // Create a new campaign
    const campaignResponse = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: {
        list_id: 'YOUR_LIST_ID'
      },
      settings: {
        subject_line: 'Your OTP',
        title: 'OTP Campaign',
        from_name: 'Your Name',
        reply_to: 'your-email@example.com'
      }
    });

    const campaignId = campaignResponse.id;

    // Set the content of the campaign
    await mailchimp.campaigns.setContent(campaignId, {
      html: `<p>Your OTP is: ${otp}</p>`
    });

    // Send the campaign
    await mailchimp.campaigns.send(campaignId);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

// // Example usage
// const email = 'recipient-email@example.com';
// const otp = '123456';
// sendCampaign(email, otp);


module.exports = sendCampaign;